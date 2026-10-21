package com.anas.muslim

import android.app.Activity
import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.os.Bundle
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class MainActivity : Activity() {

    private lateinit var web: WebView
    private var voice: VoiceBridge? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        web = WebView(this)
        web.setBackgroundColor(Color.parseColor("#F1F7F4"))

        // Android 15+ draws apps edge to edge: keep the page clear of the status and navigation bars.
        val root = FrameLayout(this)
        root.clipToPadding = false
        root.clipChildren = false
        root.setBackgroundColor(Color.parseColor("#F1F7F4"))
        val bar = View(this)
        bar.setBackgroundColor(Color.parseColor("#0A5C4A"))
        root.addView(web, FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT))
        root.addView(bar, FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0))
        ViewCompat.setOnApplyWindowInsetsListener(root) { v, insets ->
            val b = insets.getInsets(WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout())
            val ime = insets.getInsets(WindowInsetsCompat.Type.ime())
            v.setPadding(b.left, b.top, b.right, maxOf(b.bottom, ime.bottom))
            val lp = bar.layoutParams as FrameLayout.LayoutParams
            lp.height = b.top
            lp.topMargin = -b.top
            bar.layoutParams = lp
            WindowInsetsCompat.CONSUMED
        }
        setContentView(root)

        val s = web.settings
        s.javaScriptEnabled = true
        s.domStorageEnabled = true
        s.allowFileAccess = true
        s.mediaPlaybackRequiresUserGesture = false
        s.textZoom = 100

        web.addJavascriptInterface(AdhanBridge(this), "AndroidAdhan")
        voice = VoiceBridge(this, web)
        web.addJavascriptInterface(voice!!, "AndroidVoice")
        web.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                val url = request.url
                if (url.scheme == "http" || url.scheme == "https") {
                    startActivity(Intent(Intent.ACTION_VIEW, url))
                    return true
                }
                return false
            }
        }

        AdhanService.onEnded = {
            runOnUiThread {
                web.evaluateJavascript("window.nativeAdhanEnded&&window.nativeAdhanEnded()", null)
            }
        }

        web.loadUrl("file:///android_asset/www/index.html")
    }

    override fun onResume() {
        super.onResume()
        web.onResume()
        web.evaluateJavascript("window.__resume&&window.__resume()", null)
    }

    override fun onPause() {
        web.onPause()
        super.onPause()
    }

    @Suppress("OVERRIDE_DEPRECATION")
    override fun onBackPressed() {
        web.evaluateJavascript("window.__back?window.__back():false") { result ->
            if (result != "true") {
                finish()
            }
        }
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == VoiceBridge.REQ) {
            voice?.onPermission(grantResults.isNotEmpty() && grantResults[0] == android.content.pm.PackageManager.PERMISSION_GRANTED)
        }
    }

    override fun onDestroy() {
        voice?.destroy()
        AdhanService.onEnded = null
        super.onDestroy()
    }
}
