package com.anas.muslim

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.graphics.drawable.Icon
import android.media.AudioAttributes
import android.media.AudioFocusRequest
import android.media.AudioManager
import android.media.MediaPlayer
import android.os.Build
import android.os.IBinder
import android.os.PowerManager

/** Plays the adhan with the alarm volume, even when the app is closed, and shows a notification with a stop button. */
class AdhanService : Service() {

    companion object {
        const val ACTION_STOP = "com.anas.muslim.STOP"
        private const val CHANNEL = "adhan_now"
        private const val NOTIF_ID = 4101

        /** Set by the activity while it is open so the page can reset its preview button. */
        @Volatile
        var onEnded: (() -> Unit)? = null

        /** Set by the full-screen mosque page so it can show the closing line when the adhan ends. */
        @Volatile
        var sceneEnded: (() -> Unit)? = null

        /** Current playback position in milliseconds, used by the mosque page to show the adhan words in time. */
        @Volatile
        var currentPos: (() -> Int)? = null
    }

    private var player: MediaPlayer? = null
    private var wake: PowerManager.WakeLock? = null
    private var focusRequest: AudioFocusRequest? = null
    private var savedAlarmVol = -1

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (intent?.action == ACTION_STOP) {
            stopAll()
            return START_NOT_STICKY
        }

        val key = intent?.getStringExtra("k") ?: "isha"
        val name = intent?.getStringExtra("n") ?: ""
        val city = intent?.getStringExtra("c") ?: ""
        val time = intent?.getStringExtra("tm") ?: ""
        val file = intent?.getStringExtra("file") ?: "makkah"
        val preview = intent?.getBooleanExtra("preview", false) ?: false
        val iq = intent?.getIntExtra("iq", 0) ?: 0

        createChannel()
        val sceneIntent = Intent(this, AdhanActivity::class.java)
        sceneIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP)
        sceneIntent.putExtra("k", key)
        sceneIntent.putExtra("n", name)
        sceneIntent.putExtra("c", city)
        sceneIntent.putExtra("tm", time)
        sceneIntent.putExtra("p", preview)
        sceneIntent.putExtra("f", if (file.isEmpty()) "makkah" else file)
        sceneIntent.putExtra("iq", iq)
        val notification = buildNotification(name, city, time, preview, sceneIntent)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            startForeground(NOTIF_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK)
        } else {
            startForeground(NOTIF_ID, notification)
        }
        play(file)
        // Open the mosque page straight away. Android may refuse this while the app is in the background;
        // in that case the full-screen notification below does it (on the lock screen) or the user taps it.
        try {
            startActivity(sceneIntent)
        } catch (e: Exception) {
            // ignore
        }
        return START_NOT_STICKY
    }

    private fun createChannel() {
        val nm = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val channel = NotificationChannel(CHANNEL, "الأذان", NotificationManager.IMPORTANCE_HIGH)
        channel.setSound(null, null)
        channel.enableVibration(false)
        try { channel.setBypassDnd(true) } catch (e: Exception) { }
        channel.setShowBadge(false)
        nm.createNotificationChannel(channel)
    }

    private fun buildNotification(name: String, city: String, time: String, preview: Boolean, sceneIntent: Intent): Notification {
        val open = PendingIntent.getActivity(
            this, 0, sceneIntent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )
        val fullScreen = PendingIntent.getActivity(
            this, 2, sceneIntent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )
        val stopIntent = Intent(this, AdhanService::class.java)
        stopIntent.action = ACTION_STOP
        val stop = PendingIntent.getService(
            this, 1, stopIntent, PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )
        val title = if (preview) "تجربة صوت المؤذن" else "حان موعد صلاة $name"
        val text = if (preview) "اضغط إيقاف لإنهاء التجربة" else listOf(city, time).filter { it.isNotEmpty() }.joinToString(" · ")
        val action = Notification.Action.Builder(
            Icon.createWithResource(this, R.drawable.ic_stat_adhan), "إيقاف الأذان", stop
        ).build()

        return Notification.Builder(this, CHANNEL)
            .setSmallIcon(R.drawable.ic_stat_adhan)
            .setLargeIcon(android.graphics.BitmapFactory.decodeResource(resources, R.drawable.ic_logo_large))
            .setColor(0xFF0A5C4A.toInt())
            .setContentTitle(title)
            .setContentText(text)
            .setContentIntent(open)
            .setFullScreenIntent(fullScreen, true)
            .setOngoing(true)
            .setCategory(Notification.CATEGORY_ALARM)
            .addAction(action)
            .build()
    }

    private fun play(file: String) {
        try {
            player?.release()
            player = null

            val attrs = AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_ALARM)
                .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                .build()

            val pm = getSystemService(Context.POWER_SERVICE) as PowerManager
            wake?.let { if (it.isHeld) it.release() }
            wake = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "AnasMuslim:adhan")
            wake?.acquire(6 * 60 * 1000L)

            val am = getSystemService(Context.AUDIO_SERVICE) as AudioManager
            // Phone muted or alarm volume at zero: raise the alarm volume for the adhan only, and put it back afterwards.
            try {
                val max = am.getStreamMaxVolume(AudioManager.STREAM_ALARM)
                val cur = am.getStreamVolume(AudioManager.STREAM_ALARM)
                val minVol = Math.max(1, Math.round(max * 0.6f))
                if (cur < minVol) {
                    if (savedAlarmVol < 0) savedAlarmVol = cur
                    am.setStreamVolume(AudioManager.STREAM_ALARM, minVol, 0)
                }
                if (Build.VERSION.SDK_INT >= 23 && am.isStreamMute(AudioManager.STREAM_ALARM)) {
                    am.adjustStreamVolume(AudioManager.STREAM_ALARM, AudioManager.ADJUST_UNMUTE, 0)
                }
            } catch (e: Exception) {
                // some phones refuse in Do Not Disturb; the adhan still plays at the current level
            }
            val req = AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT)
                .setAudioAttributes(attrs)
                .build()
            focusRequest = req
            am.requestAudioFocus(req)

            val afd = assets.openFd("www/audio/$file.mp3")
            val mp = MediaPlayer()
            mp.setAudioAttributes(attrs)
            mp.setDataSource(afd.fileDescriptor, afd.startOffset, afd.length)
            afd.close()
            mp.setOnCompletionListener { stopAll() }
            mp.setOnErrorListener { _, _, _ -> stopAll(); true }
            mp.prepare()
            mp.start()
            player = mp
            currentPos = { try { mp.currentPosition } catch (e: Exception) { -1 } }
        } catch (e: Exception) {
            stopAll()
        }
    }

    private fun stopAll() {
        currentPos = null
        try {
            player?.stop()
        } catch (e: Exception) {
            // already stopped
        }
        player?.release()
        player = null
        try {
            val am = getSystemService(Context.AUDIO_SERVICE) as AudioManager
            focusRequest?.let { am.abandonAudioFocusRequest(it) }
        } catch (e: Exception) {
            // ignore
        }
        focusRequest = null
        try {
            if (savedAlarmVol >= 0) {
                val am2 = getSystemService(Context.AUDIO_SERVICE) as AudioManager
                am2.setStreamVolume(AudioManager.STREAM_ALARM, savedAlarmVol, 0)
            }
        } catch (e: Exception) {
            // ignore
        }
        savedAlarmVol = -1
        wake?.let { if (it.isHeld) it.release() }
        wake = null
        stopForeground(STOP_FOREGROUND_REMOVE)
        stopSelf()
        onEnded?.invoke()
        sceneEnded?.invoke()
    }

    override fun onDestroy() {
        player?.release()
        player = null
        wake?.let { if (it.isHeld) it.release() }
        super.onDestroy()
    }
}
