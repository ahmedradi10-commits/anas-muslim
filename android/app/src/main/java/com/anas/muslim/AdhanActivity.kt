package com.anas.muslim

import android.app.Activity
import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.view.WindowManager
import android.webkit.WebView

/** Full-screen mosque picture shown while the adhan plays, on the lock screen or over the phone while it is in use. */
class AdhanActivity : Activity() {

    private lateinit var web: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        if (Build.VERSION.SDK_INT >= 27) {
            setShowWhenLocked(true)
            setTurnScreenOn(true)
        } else {
            @Suppress("DEPRECATION")
            window.addFlags(
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
            )
        }
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        window.statusBarColor = Color.TRANSPARENT
        window.navigationBarColor = Color.TRANSPARENT

        web = WebView(this)
        web.setBackgroundColor(Color.parseColor("#050B1F"))
        setContentView(web)

        val s = web.settings
        s.javaScriptEnabled = true
        s.domStorageEnabled = true
        s.allowFileAccess = true
        web.addJavascriptInterface(AdhanBridge(this), "AndroidAdhan")

        AdhanService.sceneEnded = {
            runOnUiThread {
                web.evaluateJavascript("window.sceneEnded&&window.sceneEnded()", null)
            }
        }
        load(intent)
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        load(intent)
    }

    private fun load(i: Intent) {
        val q = "k=" + Uri.encode(i.getStringExtra("k") ?: "isha") +
            "&n=" + Uri.encode(i.getStringExtra("n") ?: "") +
            "&c=" + Uri.encode(i.getStringExtra("c") ?: "") +
            "&tm=" + Uri.encode(i.getStringExtra("tm") ?: "") +
            "&p=" + (if (i.getBooleanExtra("p", false)) "1" else "0") +
            "&f=" + Uri.encode(i.getStringExtra("f") ?: "") +
            "&iq=" + i.getIntExtra("iq", 0)
        web.loadUrl("file:///android_asset/www/adhan.html?$q")
    }

    override fun onDestroy() {
        AdhanService.sceneEnded = null
        web.destroy()
        super.onDestroy()
    }
}
