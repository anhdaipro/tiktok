#!/usr/bin/env bash
# ========================================
# 🚀 BUILD RELEASE APK
# ========================================

echo "🔨 Building Release APK..."

# Step 1: Build release APK
cd android
./gradlew assembleRelease

# Step 2: Find APK
APK_PATH="app/build/outputs/apk/release/app-release.apk"

if [ -f "$APK_PATH" ]; then
    echo "✅ Build successful!"
    echo "📦 APK location: $APK_PATH"
    
    # Step 3: Install
    echo "📱 Installing..."
    cd ..
    adb install -r android/$APK_PATH
    
    echo "✅ Installation complete!"
    echo ""
    echo "🎯 Next steps:"
    echo "1. Open app on device"
    echo "2. Test scroll performance"
    echo "3. Check FPS display"
    echo "Expected: 58-60 fps 🚀"
else
    echo "❌ Build failed - APK not found"
fi
