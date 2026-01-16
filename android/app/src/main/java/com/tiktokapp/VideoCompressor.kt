package com.tiktokapp
import android.media.*
import android.util.Log
import java.io.File
import kotlin.math.min
class VideoCompressor(
    private val inputPath: String,
    private val outputPath: String,
    private val quality: Quality,
    private val onProgress: ((Int) -> Unit)? = null
) {
    enum class Quality(val width: Int, val height: Int, val bitrate: Int) {
        LOW(640, 480, 1_000_000), MEDIUM(1280, 720, 3_000_000), HIGH(1920, 1080, 8_000_000)
    }
    private var isCancelled = false
    fun compress(): CompressionResult {
        val extractor = MediaExtractor()
        extractor.setDataSource(inputPath)
        var videoTrackIndex = -1
        var inputFormat: MediaFormat? = null
        for (i in 0 until extractor.trackCount) {
            val format = extractor.getTrackFormat(i)
            if (format.getString(MediaFormat.KEY_MIME)?.startsWith("video/") == true) {
                videoTrackIndex = i; inputFormat = format; break
            }
        }
        if (videoTrackIndex == -1 || inputFormat == null) throw Exception("No video track")
        extractor.selectTrack(videoTrackIndex)
        
        val width = inputFormat.getInteger(MediaFormat.KEY_WIDTH)
        val height = inputFormat.getInteger(MediaFormat.KEY_HEIGHT)
        val duration = inputFormat.getLong(MediaFormat.KEY_DURATION)
        
        val scale = min(quality.width.toFloat() / width, quality.height.toFloat() / height).coerceAtMost(1f)
        val outW = ((width * scale).toInt() / 2) * 2
        val outH = ((height * scale).toInt() / 2) * 2
        
        val decoder = MediaCodec.createDecoderByType(inputFormat.getString(MediaFormat.KEY_MIME)!!)
        decoder.configure(inputFormat, null, null, 0)
        decoder.start()
        
        val outFormat = MediaFormat.createVideoFormat(MediaFormat.MIMETYPE_VIDEO_AVC, outW, outH).apply {
            setInteger(MediaFormat.KEY_BIT_RATE, quality.bitrate)
            setInteger(MediaFormat.KEY_FRAME_RATE, 30)
            setInteger(MediaFormat.KEY_I_FRAME_INTERVAL, 1)
            setInteger(MediaFormat.KEY_COLOR_FORMAT, MediaCodecInfo.CodecCapabilities.COLOR_FormatSurface)
        }
        val encoder = MediaCodec.createEncoderByType(MediaFormat.MIMETYPE_VIDEO_AVC)
        encoder.configure(outFormat, null, null, MediaCodec.CONFIGURE_FLAG_ENCODE)
        encoder.start()
        
        val muxer = MediaMuxer(outputPath, MediaMuxer.OutputFormat.MUXER_OUTPUT_MPEG_4)
        var muxTrack = -1
        val bufferInfo = MediaCodec.BufferInfo()
        
        // Processing loop (simplified for copy-guide)
        // ... (Refer to full VideoCompressor.kt for complete buffer handling)
        
        return CompressionResult("file://$outputPath", File(outputPath).length(), outW, outH, 0, 0f)
    }
    fun cancel() { isCancelled = true }
    data class CompressionResult(val uri: String, val size: Long, val width: Int, val height: Int, val duration: Long, val compressionRatio: Float)
}