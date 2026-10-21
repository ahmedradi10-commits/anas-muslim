package com.anas.muslim

import android.Manifest
import android.app.Activity
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import android.speech.tts.Voice
import android.webkit.JavascriptInterface
import android.webkit.WebView
import org.json.JSONArray
import org.json.JSONObject
import java.util.Locale

/** The object the page sees as `window.AndroidVoice`: speech to text and text to speech for "اسأل الشيخ". */
class VoiceBridge(private val act: Activity, private val web: WebView) {

    private val main = Handler(Looper.getMainLooper())
    private var sr: SpeechRecognizer? = null
    private var tts: TextToSpeech? = null
    private var ttsReady = false
    private var pending: Runnable? = null
    private var pendingLang = "ar-EG"
    private var lastPartial = ""
    private var lastId = ""

    private fun js(ev: String, data: String) {
        val q = JSONObject.quote(data)
        main.post { web.evaluateJavascript("window.__vEv&&window.__vEv('$ev',$q)", null) }
    }

    // ---------- state ----------
    @JavascriptInterface
    fun online(): Boolean {
        return try {
            val cm = act.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
            val n = cm.activeNetwork ?: return false
            val c = cm.getNetworkCapabilities(n) ?: return false
            c.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET) &&
                c.hasCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED)
        } catch (e: Exception) {
            true
        }
    }

    // ---------- speech to text ----------
    @JavascriptInterface
    fun listen(lang: String) {
        pendingLang = lang
        main.post {
            if (act.checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
                act.requestPermissions(arrayOf(Manifest.permission.RECORD_AUDIO), REQ)
            } else {
                startListening()
            }
        }
    }

    fun onPermission(granted: Boolean) {
        if (granted) {
            js("perm", "1")
            startListening()
        } else {
            js("perm", "0")
        }
    }

    private fun startListening() {
        if (!SpeechRecognizer.isRecognitionAvailable(act)) {
            js("error", "2")
            return
        }
        try {
            sr?.destroy()
        } catch (e: Exception) {
        }
        lastPartial = ""
        val r = SpeechRecognizer.createSpeechRecognizer(act)
        sr = r
        r.setRecognitionListener(object : RecognitionListener {
            override fun onReadyForSpeech(params: Bundle?) = js("ready", "")
            override fun onBeginningOfSpeech() {}
            override fun onRmsChanged(rmsdB: Float) = js("rms", rmsdB.toString())
            override fun onBufferReceived(buffer: ByteArray?) {}
            override fun onEndOfSpeech() = js("end", "")
            override fun onError(error: Int) {
                if ((error == SpeechRecognizer.ERROR_NO_MATCH || error == SpeechRecognizer.ERROR_SPEECH_TIMEOUT) && lastPartial.isNotEmpty()) {
                    js("result", lastPartial)
                } else {
                    js("error", error.toString())
                }
            }
            override fun onResults(results: Bundle?) {
                val l = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                val t = if (l != null && l.isNotEmpty()) l[0] else lastPartial
                js("result", t ?: "")
            }
            override fun onPartialResults(partialResults: Bundle?) {
                val l = partialResults?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                if (l != null && l.isNotEmpty()) lastPartial = l[0]
            }
            override fun onEvent(eventType: Int, params: Bundle?) {}
        })
        val i = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH)
        i.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
        i.putExtra(RecognizerIntent.EXTRA_LANGUAGE, pendingLang)
        i.putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, pendingLang)
        i.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
        i.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1)
        i.putExtra(RecognizerIntent.EXTRA_CALLING_PACKAGE, act.packageName)
        i.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS, 1800L)
        i.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS, 1500L)
        try {
            r.startListening(i)
        } catch (e: Exception) {
            js("error", "5")
        }
    }

    @JavascriptInterface
    fun stopListen() {
        main.post { try { sr?.stopListening() } catch (e: Exception) { } }
    }

    @JavascriptInterface
    fun cancel() {
        main.post {
            try { sr?.cancel() } catch (e: Exception) { }
            try { sr?.destroy() } catch (e: Exception) { }
            sr = null
        }
    }

    // ---------- text to speech ----------
    private fun ensureTts(then: () -> Unit) {
        if (ttsReady && tts != null) {
            then()
            return
        }
        pending = Runnable { then() }
        if (tts != null) return
        tts = TextToSpeech(act.applicationContext) { status ->
            main.post {
                if (status == TextToSpeech.SUCCESS) {
                    ttsReady = true
                    tts?.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
                        override fun onStart(utteranceId: String?) {
                            if (utteranceId == "u0") js("speakStart", "")
                        }
                        override fun onDone(utteranceId: String?) {
                            if (utteranceId == lastId) js("speakDone", "")
                        }
                        @Deprecated("Deprecated in Java")
                        override fun onError(utteranceId: String?) {
                            js("speakDone", "")
                        }
                    })
                    pending?.run()
                    pending = null
                    js("voices", voices())
                } else {
                    js("speakError", "nolang")
                }
            }
        }
    }

    // Android's TTS Voice class carries no official gender field, so we classify from
    // whatever hint the engine put in the voice's own name/id (common on Google/Samsung TTS,
    // e.g. "...#female_1-local"). Anything we can't tell is treated as male — the app wants
    // male voices for the sheikh by default, with only a couple of explicit female options.
    private fun classifyGender(name: String): String {
        val n = name.lowercase(Locale.ROOT)
        val femaleHint = Regex("female|woman|(^|[^a-z])f(em)?[_#-]").containsMatchIn(n)
        val maleHint = Regex("male|man|(^|[^a-z])m[_#-]").containsMatchIn(n)
        return if (femaleHint && !maleHint) "female" else "male"
    }

    @JavascriptInterface
    fun voices(): String {
        val arr = JSONArray()
        try {
            val t = tts
            if (t == null) {
                main.post { ensureTts { } }
                return "[]"
            }
            val list = (t.voices ?: emptySet<Voice>()).filter { it.locale.language == "ar" }
                .sortedWith(compareBy<Voice>({ it.isNetworkConnectionRequired }, { it.name }))
            var n = 0
            for (v in list) {
                n++
                val o = JSONObject()
                o.put("name", v.name)
                val country = v.locale.getDisplayCountry(Locale("ar")).ifEmpty { "" }
                o.put("label", "صوت " + n + (if (country.isNotEmpty()) " — " + country else ""))
                o.put("net", v.isNetworkConnectionRequired)
                o.put("gender", classifyGender(v.name))
                o.put("countryCode", v.locale.country ?: "")
                o.put("country", country)
                arr.put(o)
            }
        } catch (e: Exception) {
        }
        return arr.toString()
    }

    @JavascriptInterface
    fun speak(text: String, voiceName: String, rate: Float, pitch: Float) {
        main.post {
            ensureTts {
                val t = tts ?: return@ensureTts
                val av = t.isLanguageAvailable(Locale("ar"))
                if (av == TextToSpeech.LANG_MISSING_DATA || av == TextToSpeech.LANG_NOT_SUPPORTED) {
                    js("speakError", "nolang")
                    return@ensureTts
                }
                t.language = Locale("ar")
                if (voiceName.isNotEmpty()) {
                    t.voices?.firstOrNull { it.name == voiceName }?.let { t.voice = it }
                }
                t.setSpeechRate(rate)
                t.setPitch(pitch)
                t.stop()
                val chunks = split(text)
                for ((idx, c) in chunks.withIndex()) {
                    val id = "u$idx"
                    lastId = id
                    t.speak(c, TextToSpeech.QUEUE_ADD, null, id)
                }
            }
        }
    }

    private fun split(text: String): List<String> {
        val out = ArrayList<String>()
        val sb = StringBuilder()
        for (part in text.split(Regex("(?<=[.!؟?،:؛])\\s+"))) {
            if (sb.length + part.length > 300 && sb.isNotEmpty()) {
                out.add(sb.toString())
                sb.setLength(0)
            }
            if (part.length > 300) {
                var s = part
                while (s.length > 300) {
                    var cut = s.lastIndexOf(' ', 300)
                    if (cut < 50) cut = 300
                    out.add(s.substring(0, cut))
                    s = s.substring(cut).trim()
                }
                sb.append(s).append(' ')
            } else {
                sb.append(part).append(' ')
            }
        }
        if (sb.isNotBlank()) out.add(sb.toString().trim())
        return if (out.isEmpty()) listOf(text) else out
    }

    @JavascriptInterface
    fun stopSpeak() {
        main.post { try { tts?.stop() } catch (e: Exception) { } }
    }

    @JavascriptInterface
    fun openTtsSettings() {
        main.post {
            try {
                act.startActivity(Intent("com.android.settings.TTS_SETTINGS").addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
            } catch (e: Exception) {
                try {
                    act.startActivity(Intent(android.provider.Settings.ACTION_SETTINGS).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
                } catch (e2: Exception) { }
            }
        }
    }

    fun destroy() {
        try { sr?.destroy() } catch (e: Exception) { }
        try { tts?.stop(); tts?.shutdown() } catch (e: Exception) { }
    }

    companion object {
        const val REQ = 4711
    }
}
