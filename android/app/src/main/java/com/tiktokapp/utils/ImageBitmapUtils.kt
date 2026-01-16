package com.tiktokapp.utils

import android.content.ContentResolver
import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri

object ImageBitmapUtils {

    fun decodeAndResizeBitmap(
        context: Context,
        path: String,
        maxSize: Int
    ): Bitmap? {
        val resolver: ContentResolver = context.contentResolver

        val uri = when {
            path.startsWith("content://") -> Uri.parse(path)
            path.startsWith("file://") -> Uri.parse(path)
            else -> Uri.fromFile(java.io.File(path))
        }

        // 1. Decode bounds
        val options = BitmapFactory.Options().apply {
            inJustDecodeBounds = true
        }

        resolver.openInputStream(uri)?.use {
            BitmapFactory.decodeStream(it, null, options)
        }

        // 2. Calculate inSampleSize
        options.inSampleSize = calculateInSampleSize(
            options.outWidth,
            options.outHeight,
            maxSize
        )

        options.inJustDecodeBounds = false
        options.inPreferredConfig = Bitmap.Config.RGB_565

        // 3. Decode bitmap
        return resolver.openInputStream(uri)?.use {
            BitmapFactory.decodeStream(it, null, options)
        }
    }

    private fun calculateInSampleSize(
        width: Int,
        height: Int,
        maxSize: Int
    ): Int {
        var inSampleSize = 1
        var w = width
        var h = height

        while (w > maxSize || h > maxSize) {
            w /= 2
            h /= 2
            inSampleSize *= 2
        }
        return inSampleSize
    }
}
