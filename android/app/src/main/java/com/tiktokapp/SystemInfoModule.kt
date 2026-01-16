package com.tiktokapp // <--- Sửa dòng này theo đúng package name của bạn (xem dòng đầu file MainActivity.kt)

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.Arguments
import android.os.Environment
import android.os.StatFs
import java.io.File

class SystemInfoModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "SystemInfo" // Tên này sẽ dùng trong JS
    }

    @ReactMethod
    fun getDiskInfo(promise: Promise) {
        try {
            val stat = StatFs(Environment.getDataDirectory().path)
            val blockSize = stat.blockSizeLong
            val totalBlocks = stat.blockCountLong
            val availableBlocks = stat.availableBlocksLong

            val totalBytes = totalBlocks * blockSize
            val freeBytes = availableBlocks * blockSize

            // Convert
            val totalGB = totalBytes.toDouble() / (1024.0 * 1024.0 * 1024.0)
            val freeMB = freeBytes.toDouble() / (1024.0 * 1024.0)

            val result = Arguments.createMap()
            result.putDouble("totalGB", totalGB)
            result.putDouble("freeMB", freeMB)

            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("E_DISK_INFO_ERROR", e)
        }
    }
}