package com.tiktokapp
import android.app.usage.StorageStatsManager
import android.content.Context
import android.os.Process
import android.os.storage.StorageManager as AndroidStorageManager
import android.os.StatFs
import android.os.Environment
import com.facebook.react.bridge.*
import java.io.File
import java.util.*
/**
 * Module quản lý bộ nhớ: Tính toán dung lượng và xóa cache
 */
class StorageModule(reactContext: ReactApplicationContext) : 
    ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String = "StorageManager"
    /**
     * Lấy chi tiết dung lượng bộ nhớ (App hiện tại & Hệ thống)
     */
    @ReactMethod
    fun getStorageStats(promise: Promise) {
        try {
            val stats = WritableNativeMap()
            
            // 1. Dung lượng App hiện tại (Sử dụng StorageStatsManager cho độ chính xác cao)
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                val storageStatsManager = reactApplicationContext.getSystemService(Context.STORAGE_STATS_SERVICE) as StorageStatsManager
                val storageManager = reactApplicationContext.getSystemService(Context.STORAGE_SERVICE) as AndroidStorageManager
                val uuid = storageManager.getUuidForPath(reactApplicationContext.filesDir)
                
                val appStats = storageStatsManager.queryStatsForPackage(uuid, reactApplicationContext.packageName, Process.myUserHandle())
                
                // Calculate cache manually for real-time accuracy after clearing
                var manualCacheSize = getDirSize(reactApplicationContext.cacheDir)
                reactApplicationContext.externalCacheDir?.let { 
                    manualCacheSize += getDirSize(it) 
                }

                stats.putDouble("appCode", appStats.appBytes.toDouble()) 
                stats.putDouble("appData", appStats.dataBytes.toDouble()) 
                stats.putDouble("appCache", manualCacheSize.toDouble()) 
                stats.putDouble("appTotal", (appStats.appBytes + appStats.dataBytes + manualCacheSize).toDouble())
            } else {
                // Fallback cho bản Android cũ
                val cacheSize = getDirSize(reactApplicationContext.cacheDir)
                val dataSize = getDirSize(reactApplicationContext.filesDir)
                stats.putDouble("appCache", cacheSize.toDouble())
                stats.putDouble("appData", dataSize.toDouble())
                stats.putDouble("appTotal", (cacheSize + dataSize).toDouble())
            }

            // Calculate Downloads size (filesDir)
            val downloadsSize = getDirSize(reactApplicationContext.filesDir)
            stats.putDouble("appDownloads", downloadsSize.toDouble())
            // 2. Dung lượng Hệ thống (Tổng & Còn trống)
            val path = Environment.getDataDirectory()
            val stat = StatFs(path.path)
            val blockSize = stat.blockSizeLong
            val totalBlocks = stat.blockCountLong
            val availableBlocks = stat.availableBlocksLong
            val totalSpace = totalBlocks * blockSize
            val freeSpace = availableBlocks * blockSize
            val usedSpace = totalSpace - freeSpace
            stats.putDouble("systemTotal", totalSpace.toDouble())
            stats.putDouble("systemFree", freeSpace.toDouble())
            // "Ứng dụng khác" = Tổng đã dùng - Dung lượng app này
            val otherApps = usedSpace - (stats.getDouble("appTotal"))
            stats.putDouble("systemOtherApps", if (otherApps > 0) otherApps else 0.0)
            promise.resolve(stats)
        } catch (e: Exception) {
            promise.reject("STATS_ERROR", e.message)
        }
    }

    
    /**
     * Helper to clear directory content but keep the directory itself if needed (optional)
     * Here we just delete recursively.
     */
    private fun deleteDirContent(dir: File) {
        if (dir.exists() && dir.isDirectory) {
             dir.listFiles()?.forEach { deleteDir(it) }
        }
    }

    /**
     * Xóa toàn bộ file trong thư mục Cache để giải phóng bộ nhớ
     */
    @ReactMethod
    fun clearCache(promise: Promise) {
        try {
            // Delete content and recreate immediately to be safe
            if (reactApplicationContext.cacheDir.exists()) {
                deleteDirContent(reactApplicationContext.cacheDir)
            }
             reactApplicationContext.externalCacheDir?.let { 
                 if (it.exists()) deleteDirContent(it)
             }
            promise.resolve(true)
        } catch (e: Exception) { 
            promise.reject("CLEAR_ERROR", e.message) 
        }
    }

    /**
     * Xóa toàn bộ file trong thư mục Downloads (Files)
     */
    @ReactMethod
    fun clearDownloads(promise: Promise) {
        try {
            // filesDir corresponds to RNFS.DocumentDirectoryPath
            deleteDir(reactApplicationContext.filesDir)
            // Re-create the directory to ensure app doesn't crash on next write
            if (!reactApplicationContext.filesDir.exists()) {
                reactApplicationContext.filesDir.mkdirs()
            }
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("CLEAR_ERROR", e.message)
        }
    }
    private fun getDirSize(dir: File): Long {
        var size: Long = 0
        dir.listFiles()?.forEach { file ->
            size += if (file.isDirectory) getDirSize(file) else file.length()
        }
        return size
    }
    private fun deleteDir(dir: File): Boolean {
        if (!dir.exists()) return true
        return if (dir.isDirectory) {
            dir.listFiles()?.forEach { deleteDir(it) }
            dir.delete()
        } else dir.delete()
    }
}