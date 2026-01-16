package com.tiktokapp
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Matrix
import android.net.Uri
import android.util.Log
import com.facebook.react.bridge.*
import com.tiktokapp.utils.ImageBitmapUtils
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream
import java.io.IOException
import java.io.InputStream

/**
 * Module xử lý hình ảnh: Nén, Resize ảnh sử dụng API Android Native
 * Đã tối ưu hóa để tái sử dụng logic từ QrScanner (hỗ trợ cả content:// và file path)
 */
class ImageProcessorModule(reactContext: ReactApplicationContext) : 
    ReactContextBaseJavaModule(reactContext) {
    private val scope = CoroutineScope(Dispatchers.Main)
    
    override fun getName(): String = "ImageProcessor"

    /**
     * Nén ảnh: Chuyển đổi định dạng hoặc giảm dung lượng ảnh
     */
    @ReactMethod
    fun compressImage(imagePath: String, quality: Int, format: String, promise: Promise) {
        scope.launch(Dispatchers.IO) {
            try {
                // Tái sử dụng logic decode mạnh mẽ (hỗ trợ content:// và resizing cơ bản để tránh OOM)
                val bitmap = ImageBitmapUtils.decodeAndResizeBitmap(reactApplicationContext, imagePath, 4096) 
                    ?: throw Exception("Không thể đọc file ảnh")
                
                val outputFormat = when (format.lowercase()) {
                    "webp" -> Bitmap.CompressFormat.WEBP
                    "png" -> Bitmap.CompressFormat.PNG
                    else -> Bitmap.CompressFormat.JPEG
                }
                val ext = if (format == "webp") "webp" else if (format == "png") "png" else "jpg"
                val out = File(reactApplicationContext.cacheDir, "img_${System.currentTimeMillis()}.$ext")
                
                FileOutputStream(out).use { fos -> 
                    bitmap.compress(outputFormat, quality, fos) 
                }
                
                promise.resolve(WritableNativeMap().apply {
                    putString("uri", "file://${out.absolutePath}")
                    putInt("width", bitmap.width)
                    putInt("height", bitmap.height)
                    putDouble("size", out.length().toDouble())
                })
                
                bitmap.recycle()
            } catch (e: Exception) { 
                promise.reject("COMPRESS_ERROR", e.message) 
            }
        }
    }

    /**
     * Thay đổi kích thước ảnh (Resize) - Nâng cấp từ QrScanner logic
     */
    @ReactMethod
    fun resizeImage(imagePath: String, maxWidth: Int, maxHeight: Int, quality: Int, promise: Promise) {
        scope.launch(Dispatchers.IO) {
            try {
                // Sử dụng hàm decode dùng chung cho độ ổn định cao
                val bitmap = ImageBitmapUtils.decodeAndResizeBitmap(reactApplicationContext, imagePath, Math.max(maxWidth, maxHeight))
                    ?: throw Exception("Không thể xử lý ảnh")
                
                val out = File(reactApplicationContext.cacheDir, "res_${System.currentTimeMillis()}.jpg")
                FileOutputStream(out).use { fos -> 
                    bitmap.compress(Bitmap.CompressFormat.JPEG, quality, fos) 
                }
                
                promise.resolve(WritableNativeMap().apply {
                    putString("uri", "file://${out.absolutePath}")
                    putInt("width", bitmap.width)
                    putInt("height", bitmap.height)
                    putDouble("size", out.length().toDouble())
                })
                
                bitmap.recycle()
            } catch (e: Exception) { 
                promise.reject("RESIZE_ERROR", e.message) 
            }
        }
    }
}
