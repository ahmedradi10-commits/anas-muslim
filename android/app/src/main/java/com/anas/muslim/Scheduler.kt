package com.anas.muslim

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import org.json.JSONObject

/**
 * Keeps the list of upcoming prayer times (sent by the web page) and registers one exact alarm per prayer.
 * These alarms belong to this app only. They do not appear in the Clock app.
 */
object Scheduler {
    private const val PREFS = "adhan"
    private const val KEY_PAYLOAD = "payload"
    private const val KEY_IDS = "ids"

    fun save(ctx: Context, json: String) {
        ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().putString(KEY_PAYLOAD, json).apply()
    }

    fun canExact(ctx: Context): Boolean {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) return true
        val am = ctx.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        return am.canScheduleExactAlarms()
    }

    fun scheduleAll(ctx: Context) {
        val prefs = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        val am = ctx.getSystemService(Context.ALARM_SERVICE) as AlarmManager

        // 1) cancel what was scheduled last time
        val old = prefs.getString(KEY_IDS, "") ?: ""
        for (part in old.split(",")) {
            val id = part.toIntOrNull() ?: continue
            for (cls in listOf(AdhanReceiver::class.java, ReminderReceiver::class.java)) {
                val existing = PendingIntent.getBroadcast(
                    ctx, id, Intent(ctx, cls),
                    PendingIntent.FLAG_NO_CREATE or PendingIntent.FLAG_IMMUTABLE
                )
                if (existing != null) {
                    am.cancel(existing)
                    existing.cancel()
                }
            }
        }

        // 2) schedule the new list
        val payload = prefs.getString(KEY_PAYLOAD, null)
        if (payload == null) {
            prefs.edit().putString(KEY_IDS, "").apply()
            return
        }
        val root = JSONObject(payload)
        val voice = root.optString("voice", "makkah")
        val fajrVoice = root.optString("fajrVoice", voice)
        val items = root.optJSONArray("items")
        val now = System.currentTimeMillis()
        val exact = canExact(ctx)
        val ids = StringBuilder()

        if (items != null) {
            for (i in 0 until items.length()) {
                val o = items.getJSONObject(i)
                val at = o.getLong("t")
                if (at <= now + 1000) continue
                val id = o.getInt("id")
                val key = o.getString("k")

                val intent = Intent(ctx, if (key == "rem") ReminderReceiver::class.java else AdhanReceiver::class.java)
                intent.putExtra("k", key)
                intent.putExtra("n", o.optString("n"))
                intent.putExtra("c", o.optString("c"))
                intent.putExtra("tm", o.optString("tm"))
                intent.putExtra("iq", o.optInt("iq", 0))
                intent.putExtra("file", if (key == "fajr") fajrVoice else voice)

                val pi = PendingIntent.getBroadcast(
                    ctx, id, intent, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                )
                try {
                    if (exact) {
                        am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, pi)
                    } else {
                        am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, pi)
                    }
                } catch (e: SecurityException) {
                    try {
                        am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, pi)
                    } catch (e2: Exception) {
                        continue
                    }
                } catch (e: Exception) {
                    // too many alarms: keep what is already scheduled
                    continue
                }
                ids.append(id).append(',')
            }
        }
        prefs.edit().putString(KEY_IDS, ids.toString()).apply()
    }
}
