package com.tiktokapp

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class SystemInfoPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(
            SystemInfoModule(reactContext),
            QrImageScannerModule(reactContext),
            VideoCompressorModule(reactContext),
            StorageModule(reactContext),
            ImageProcessorModule(reactContext)
        ) // Đăng ký module ở đây
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}