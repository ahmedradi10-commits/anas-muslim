package com.anas.muslim

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

/** Alarms are wiped on reboot, app update and clock changes, so they are registered again from the saved list. */
class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        try {
            Scheduler.scheduleAll(context)
        } catch (e: Exception) {
            // nothing to do: the list is registered again the next time the app opens
        }
    }
}
