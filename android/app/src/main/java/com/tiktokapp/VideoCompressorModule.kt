package com.tiktokapp
import android.graphics.Bitmap
import android.media.*
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.io.File
import java.io.FileOutputStream
import java.nio.ByteBuffer
class VideoCompressorModule(reactContext: ReactApplicationContext) : 
    ReactContextBaseJavaModule(reactContext) {
    
    private val scope = CoroutineScope(Dispatchers.Main)
    private var currentCompressor: VideoCompressor? = null
    override fun getName(): String = "VideoCompressor"
    @ReactMethod
    fun mergeAudioVideo(videoPath: String, audioPath: String, promise: Promise) {
        Log.d("VideoCompressor", "=== START mergeAudioVideo ===")
        Log.d("VideoCompressor", "Video path: $videoPath")
        Log.d("VideoCompressor", "Audio path: $audioPath")
        
        val context = reactApplicationContext
        val outputDir = context.cacheDir
        val outputFile = File(outputDir, "merged_${System.currentTimeMillis()}.mp4")
        
        scope.launch(Dispatchers.IO) {
            val videoExtractor = MediaExtractor()
            val audioExtractor = MediaExtractor()
            var muxer: MediaMuxer? = null
            try {
                val cleanVideoPath = videoPath.replace("file://", "")
                var finalAudioPath = audioPath.replace("file://", "")
                
                Log.d("VideoCompressor", "Setting video data source: $cleanVideoPath")
                videoExtractor.setDataSource(cleanVideoPath)
                Log.d("VideoCompressor", "Video data source set successfully")
                
                // AUTOMATIC AAC TRANSCODING FIX
                Log.d("VideoCompressor", "Checking if audio needs transcoding...")
                if (AudioTranscoder.needsTranscoding(finalAudioPath)) {
                    Log.d("VideoCompressor", "Audio needs transcoding to AAC")
                    val tempAac = File(outputDir, "temp_aac_${System.currentTimeMillis()}.m4a")
                    Log.d("VideoCompressor", "Starting transcoding to: ${tempAac.absolutePath}")
                    if (AudioTranscoder.transcodeToAac(finalAudioPath, tempAac.absolutePath)) {
                        finalAudioPath = tempAac.absolutePath
                        Log.d("VideoCompressor", "Transcoding completed successfully")
                    } else {
                        Log.e("VideoCompressor", "Transcoding failed")
                        promise.reject("TRANSCODE_FAILED", "Failed to transcode audio to AAC")
                        return@launch
                    }
                } else {
                    Log.d("VideoCompressor", "Audio is already in AAC format, no transcoding needed")
                }
                
                Log.d("VideoCompressor", "Setting audio data source: $finalAudioPath")
                audioExtractor.setDataSource(finalAudioPath)
                Log.d("VideoCompressor", "Audio data source set successfully")
                
                Log.d("VideoCompressor", "Creating muxer: ${outputFile.absolutePath}")
                muxer = MediaMuxer(outputFile.absolutePath, MediaMuxer.OutputFormat.MUXER_OUTPUT_MPEG_4)
                
                var videoTrackIndex = -1
                var audioTrackIndex = -1
                var videoDuration: Long = 0
                
                Log.d("VideoCompressor", "Searching for video track (${videoExtractor.trackCount} tracks)")
                for (i in 0 until videoExtractor.trackCount) {
                    val format = videoExtractor.getTrackFormat(i)
                    val mime = format.getString(MediaFormat.KEY_MIME)
                    Log.d("VideoCompressor", "Track $i: $mime")
                    if (mime?.startsWith("video/") == true) {
                        videoExtractor.selectTrack(i)
                        videoTrackIndex = muxer.addTrack(format)
                        videoDuration = format.getLong(MediaFormat.KEY_DURATION)
                        Log.d("VideoCompressor", "Video track found: index=$videoTrackIndex, duration=$videoDuration")
                        break
                    }
                }
                
                Log.d("VideoCompressor", "Searching for audio track (${audioExtractor.trackCount} tracks)")
                for (i in 0 until audioExtractor.trackCount) {
                    val format = audioExtractor.getTrackFormat(i)
                    val mime = format.getString(MediaFormat.KEY_MIME)
                    Log.d("VideoCompressor", "Track $i: $mime")
                    if (mime?.startsWith("audio/") == true) {
                        audioExtractor.selectTrack(i)
                        audioTrackIndex = muxer.addTrack(format)
                        Log.d("VideoCompressor", "Audio track found: index=$audioTrackIndex")
                        break
                    }
                }
                
                if (videoTrackIndex == -1) {
                    Log.e("VideoCompressor", "No video track found!")
                    promise.reject("MERGE_ERROR", "No video track found")
                    return@launch
                }
                
                Log.d("VideoCompressor", "Starting muxer...")
                muxer.start()
                Log.d("VideoCompressor", "Muxer started successfully")
                
                val buffer = ByteBuffer.allocateDirect(2 * 1024 * 1024)
                val bufferInfo = MediaCodec.BufferInfo()
                
                Log.d("VideoCompressor", "Writing video samples...")
                var videoSampleCount = 0
                while (true) {
                    val sampleSize = videoExtractor.readSampleData(buffer, 0)
                    if (sampleSize < 0) break
                    bufferInfo.set(0, sampleSize, videoExtractor.sampleTime, videoExtractor.sampleFlags)
                    muxer.writeSampleData(videoTrackIndex, buffer, bufferInfo)
                    videoExtractor.advance()
                    videoSampleCount++
                }
                Log.d("VideoCompressor", "Video samples written: $videoSampleCount")
                
                if (audioTrackIndex != -1) {
                    Log.d("VideoCompressor", "Writing audio samples...")
                    var audioSampleCount = 0
                    while (true) {
                        val sampleSize = audioExtractor.readSampleData(buffer, 0)
                        if (sampleSize < 0) break
                        if (videoDuration > 0 && audioExtractor.sampleTime >= videoDuration) break
                        
                        bufferInfo.set(0, sampleSize, audioExtractor.sampleTime, audioExtractor.sampleFlags)
                        muxer.writeSampleData(audioTrackIndex, buffer, bufferInfo)
                        audioExtractor.advance()
                        audioSampleCount++
                    }
                    Log.d("VideoCompressor", "Audio samples written: $audioSampleCount")
                } else {
                    Log.d("VideoCompressor", "No audio track to merge")
                }
                
                Log.d("VideoCompressor", "Merge completed successfully: file://${outputFile.absolutePath}")
                promise.resolve("file://${outputFile.absolutePath}")
            } catch (e: Exception) {
                Log.e("VideoCompressor", "Merge failed: ${e.message}", e)
                promise.reject("MERGE_FAILED", e.message)
            } finally {
                Log.d("VideoCompressor", "Releasing resources...")
                try { 
                    muxer?.stop() 
                } catch (e: Exception) {
                    Log.e("VideoCompressor", "Error stopping muxer: ${e.message}")
                }
                try {
                    muxer?.release()
                } catch (e: Exception) {
                    Log.e("VideoCompressor", "Error releasing muxer: ${e.message}")
                }
                try {
                    videoExtractor.release()
                } catch(e: Exception) {}
                try {
                    audioExtractor.release()
                } catch(e: Exception) {}
                Log.d("VideoCompressor", "Resources released")
            }
            Log.d("VideoCompressor", "=== END mergeAudioVideo ===")
        }
    }
    @ReactMethod
    fun compressVideo(videoPath: String, quality: String, promise: Promise) {
        scope.launch(Dispatchers.IO) {
            try {
                val outputFile = File(reactApplicationContext.cacheDir, "compressed_${System.currentTimeMillis()}.mp4")
                val qualityEnum = when (quality.lowercase()) {
                    "low" -> VideoCompressor.Quality.LOW
                    "high" -> VideoCompressor.Quality.HIGH
                    else -> VideoCompressor.Quality.MEDIUM
                }
                currentCompressor = VideoCompressor(videoPath.replace("file://", ""), outputFile.absolutePath, qualityEnum) { 
                    reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java).emit("VideoCompressionProgress", it)
                }
                val result = currentCompressor!!.compress()
                promise.resolve(WritableNativeMap().apply {
                    putString("uri", result.uri); putDouble("size", result.size.toDouble())
                    putInt("width", result.width); putInt("height", result.height)
                    putDouble("duration", result.duration.toDouble()); putDouble("compressionRatio", result.compressionRatio.toDouble())
                })
            } catch (e: Exception) { promise.reject("COMPRESS_FAILED", e.message) }
            finally { currentCompressor = null }
        }
    }
    @ReactMethod fun cancelCompression(promise: Promise) { 
        currentCompressor?.cancel(); promise.resolve(true) 
    }
    @ReactMethod
    fun generateThumbnail(videoPath: String, timeMs: Int, promise: Promise) {
        scope.launch(Dispatchers.IO) {
            val retriever = MediaMetadataRetriever()
            try {
                retriever.setDataSource(videoPath.replace("file://", ""))
                val bitmap = retriever.getFrameAtTime(timeMs * 1000L, MediaMetadataRetriever.OPTION_CLOSEST_SYNC)
                if (bitmap == null) { promise.reject("THUMBNAIL_ERROR", "Failed to extract frame"); return@launch }
                val outputFile = File(reactApplicationContext.cacheDir, "thumb_${System.currentTimeMillis()}.jpg")
                FileOutputStream(outputFile).use { bitmap.compress(Bitmap.CompressFormat.JPEG, 90, it) }
                bitmap.recycle(); promise.resolve("file://${outputFile.absolutePath}")
            } catch (e: Exception) { promise.reject("THUMBNAIL_FAILED", e.message) }
            finally { try { retriever.release() } catch (e: Exception) {} }
        }
    }
    @ReactMethod
    fun getVideoInfo(videoPath: String, promise: Promise) {
        scope.launch(Dispatchers.IO) {
            val retriever = MediaMetadataRetriever()
            try {
                retriever.setDataSource(videoPath.replace("file://", ""))
                val width = retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_VIDEO_WIDTH)?.toInt() ?: 0
                val height = retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_VIDEO_HEIGHT)?.toInt() ?: 0
                val duration = retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_DURATION)?.toLong() ?: 0L
                val rotation = retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_VIDEO_ROTATION)?.toInt() ?: 0
                val size = File(videoPath.replace("file://", "")).length()
                promise.resolve(WritableNativeMap().apply {
                    putInt("width", width); putInt("height", height)
                    putDouble("duration", duration.toDouble()); putInt("rotation", rotation)
                    putDouble("size", size.toDouble())
                })
            } catch (e: Exception) { promise.reject("VIDEO_INFO_FAILED", e.message) }
            finally { try { retriever.release() } catch (e: Exception) {} }
        }
    }
}