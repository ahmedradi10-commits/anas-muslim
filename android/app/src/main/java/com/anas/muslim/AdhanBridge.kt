package com.anas.muslim

import android.Manifest
import android.app.Activity
import android.app.NotificationManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.PowerManager
import android.provider.Settings
import android.webkit.JavascriptInterface
import androidx.core.app.ActivityCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat
import org.json.JSONObject

/** The object the web page sees as `window.AndroidAdhan`. */
class AdhanBridge(private val activity: Activity) {

    private val ctx: Context = activity.applicationContext

    @JavascriptInterface
    fun schedule(json: String) {
        try {
            Scheduler.save(ctx, json)
            Scheduler.scheduleAll(ctx)
        } catch (e: Exception) {
            // the page sends the list again the next time it opens
        }
    }

    @JavascriptInterface
    fun status(): String {
        val notif = NotificationManagerCompat.from(ctx).areNotificationsEnabled()
        val exact = Scheduler.canExact(ctx)
        val pm = ctx.getSystemService(Context.POWER_SERVICE) as PowerManager
        val battery = pm.isIgnoringBatteryOptimizations(ctx.packageName)
        val nm = ctx.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val full = if (Build.VERSION.SDK_INT >= 34) nm.canUseFullScreenIntent() else true
        return JSONObject().put("notif", notif).put("exact", exact).put("battery", battery).put("full", full).toString()
    }

    @JavascriptInterface
    fun requestNotifications() {
        activity.runOnUiThread {
            val prefs = ctx.getSharedPreferences("adhan", Context.MODE_PRIVATE)
            val asked = prefs.getBoolean("askedNotif", false)
            val granted = Build.VERSION.SDK_INT < 33 ||
                ContextCompat.checkSelfPermission(ctx, Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED
            if (Build.VERSION.SDK_INT >= 33 && !granted && !asked) {
                prefs.edit().putBoolean("askedNotif", true).apply()
                ActivityCompat.requestPermissions(activity, arrayOf(Manifest.permission.POST_NOTIFICATIONS), 11)
            } else {
                val i = Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS)
                i.putExtra(Settings.EXTRA_APP_PACKAGE, ctx.packageName)
                activity.startActivity(i)
            }
        }
    }

    @JavascriptInterface
    fun requestExact() {
        activity.runOnUiThread {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                try {
                    val i = Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM)
                    i.data = Uri.parse("package:" + ctx.packageName)
                    activity.startActivity(i)
                } catch (e: Exception) {
                    // some devices do not have this screen
                }
            }
        }
    }

    @JavascriptInterface
    fun requestBattery() {
        activity.runOnUiThread {
            try {
                // a small system dialog with "Allow" / "Deny" (no trip to the settings screens)
                val d = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS)
                d.data = Uri.parse("package:" + ctx.packageName)
                activity.startActivity(d)
            } catch (e0: Exception) {
              try {
                activity.startActivity(Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS))
              } catch (e: Exception) {
                try {
                    val i = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
                    i.data = Uri.parse("package:" + ctx.packageName)
                    activity.startActivity(i)
                } catch (e2: Exception) {
                    // ignore
                }
              }
            }
        }
    }

    @JavascriptInterface
    fun requestFullScreen() {
        activity.runOnUiThread {
            if (Build.VERSION.SDK_INT >= 34) {
                try {
                    val i = Intent(Settings.ACTION_MANAGE_APP_USE_FULL_SCREEN_INTENT)
                    i.data = Uri.parse("package:" + ctx.packageName)
                    activity.startActivity(i)
                } catch (e: Exception) {
                    // ignore
                }
            }
        }
    }

    /** Playback position of the adhan in milliseconds, or -1 when it is not playing. */
    @JavascriptInterface
    fun position(): Int = AdhanService.currentPos?.invoke() ?: -1

    /** Short sound and vibration when it is time for the iqama. */
    @JavascriptInterface
    fun alert() {
        try {
            val r = android.media.RingtoneManager.getRingtone(
                ctx, android.media.RingtoneManager.getDefaultUri(android.media.RingtoneManager.TYPE_NOTIFICATION)
            )
            r.play()
            val v = ctx.getSystemService(Context.VIBRATOR_SERVICE) as android.os.Vibrator
            @Suppress("DEPRECATION")
            v.vibrate(longArrayOf(0, 300, 150, 300), -1)
        } catch (e: Exception) {
            // ignore
        }
    }

    @JavascriptInterface
    fun closeScene() {
        activity.runOnUiThread {
            if (activity is AdhanActivity) {
                activity.finish()
            }
        }
    }

    @JavascriptInterface
    fun preview(voice: String) {
        activity.runOnUiThread {
            val i = Intent(activity, AdhanService::class.java)
            i.putExtra("file", voice)
            i.putExtra("preview", true)
            i.putExtra("k", "isha")
            ContextCompat.startForegroundService(activity, i)
        }
    }

    @JavascriptInterface
    fun stopAdhan() {
        activity.runOnUiThread {
            val i = Intent(activity, AdhanService::class.java)
            i.action = AdhanService.ACTION_STOP
            activity.startService(i)
        }
    }
}
