package com.anas.muslim

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import androidx.core.content.ContextCompat

/** Fires at the prayer time and hands over to the foreground service that plays the adhan. */
class AdhanReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val svc = Intent(context, AdhanService::class.java)
        val extras = intent.extras
        if (extras != null) svc.putExtras(extras)
        ContextCompat.startForegroundService(context, svc)
    }
}
