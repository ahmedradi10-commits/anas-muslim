package com.anas.muslim

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

/** Shows the "did you pray the previous prayer?" reminder a little before the next adhan. */
class ReminderReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val title = intent.getStringExtra("n") ?: return
        val text = intent.getStringExtra("c") ?: ""
        val nm = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val channel = NotificationChannel("reminders", "تنبيهات الصلاة", NotificationManager.IMPORTANCE_HIGH)
        nm.createNotificationChannel(channel)
        val open = PendingIntent.getActivity(
            context, 7, Intent(context, MainActivity::class.java),
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )
        val n = Notification.Builder(context, "reminders")
            .setSmallIcon(R.drawable.ic_stat_adhan)
            .setLargeIcon(android.graphics.BitmapFactory.decodeResource(context.resources, R.drawable.ic_logo_large))
            .setColor(0xFF0A5C4A.toInt())
            .setContentTitle(title)
            .setContentText(text)
            .setStyle(Notification.BigTextStyle().bigText(text))
            .setContentIntent(open)
            .setAutoCancel(true)
            .build()
        nm.notify(5000 + (System.currentTimeMillis() % 1000).toInt(), n)
    }
}
