package com.tiktokapp

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactMethod
import android.graphics.BitmapFactory
import android.graphics.Bitmap
import android.graphics.Matrix
import android.net.Uri
import java.io.FileInputStream
import java.io.InputStream
import java.io.IOException
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.google.mlkit.vision.barcode.BarcodeScanning
import com.google.mlkit.vision.barcode.BarcodeScannerOptions
import com.google.mlkit.vision.barcode.common.Barcode
import com.google.mlkit.vision.common.InputImage
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableNativeArray
import com.tiktokapp.utils.ImageBitmapUtils
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class QrImageScannerModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    private val scope = CoroutineScope(Dispatchers.Main)

    override fun getName() = "QrImageScanner"

    @ReactMethod
    fun scanFromPath(path: String, promise: Promise) {
        // Chạy toàn bộ logic nặng (decode + scan) trong luồng nền (IO Dispatcher)
        scope.launch(Dispatchers.IO) {
            try {
                // 1. Giải mã ảnh mượt mà (không lag UI)
                val bitmap = ImageBitmapUtils.decodeAndResizeBitmap(reactApplicationContext, path, 1600) 
                    ?: return@launch promise.reject("DECODE_ERROR", "Không đọc được ảnh")
                val image = InputImage.fromBitmap(bitmap, 0)
                
                // 2. Cấu hình ML Kit tốt nhất cho QR
                val options = BarcodeScannerOptions.Builder()
                    .setBarcodeFormats(Barcode.FORMAT_QR_CODE)
                    .build()
                val scanner = BarcodeScanning.getClient(options)
                // 3. Tiến hành quét
                scanner.process(image)
                    .addOnSuccessListener { barcodes ->
                        val results = WritableNativeArray()
                        barcodes.forEach { barcode ->
                            barcode.rawValue?.let { results.pushString(it) }
                        }
                        promise.resolve(results)
                    }
                    .addOnFailureListener { e ->
                        promise.reject("ML_ERROR", e.message)
                    }
                    .addOnCompleteListener {
                        bitmap.recycle() // Luôn giải phóng RAM ngay sau khi xong
                    }
            } catch (e: Exception) {
                promise.reject("ERROR", e.message)
            }
        }
    }

}