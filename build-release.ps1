# ========================================
# 🚀 BUILD RELEASE APK (PowerShell)
# ========================================

Write-Host "`n=== 🔨 BUILDING RELEASE APK ===" -ForegroundColor Cyan

# Step 1: Navigate and build
Write-Host "`n[1/4] Building release APK..." -ForegroundColor Yellow
Set-Location android
.\gradlew assembleRelease
Set-Location ..

# Step 2: Check if build successful
$apkPath = "android\app\build\outputs\apk\release\app-release.apk"
if (Test-Path $apkPath) {
    Write-Host "`n✅ Build successful!" -ForegroundColor Green
    
    # Get file size
    $size = (Get-Item $apkPath).Length / 1MB
    Write-Host "📦 APK size: $([math]::Round($size, 2)) MB" -ForegroundColor Gray
    
    # Step 3: Uninstall old version (optional)
    Write-Host "`n[2/4] Uninstalling old version..." -ForegroundColor Yellow
    adb uninstall com.phamdai.tiktok 2>$null
    
    # Step 4: Install new APK
    Write-Host "`n[3/4] Installing release APK..." -ForegroundColor Yellow
    adb install -r $apkPath
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Installation complete!" -ForegroundColor Green
        
        # Step 5: Launch app
        Write-Host "`n[4/4] Launching app..." -ForegroundColor Yellow
        adb shell am start -n com.phamdai.tiktok/.MainActivity
        
        Write-Host "`n=== 🎯 TESTING INSTRUCTIONS ===" -ForegroundColor Cyan
        Write-Host "1. App is now running in RELEASE mode" -ForegroundColor White
        Write-Host "2. Check FPS Display (top right)" -ForegroundColor White
        Write-Host "3. Scroll videos and observe:" -ForegroundColor White
        Write-Host "   - Expected FPS: 58-60 🚀" -ForegroundColor Green
        Write-Host "   - Should be GREEN color" -ForegroundColor Green
        Write-Host "   - Much smoother than debug!" -ForegroundColor Green
        
        Write-Host "`n=== 📊 PERFORMANCE COMPARISON ===" -ForegroundColor Cyan
        Write-Host "Debug build:   ~51 fps" -ForegroundColor Yellow
        Write-Host "Release build: ~58-60 fps (expected)" -ForegroundColor Green
        Write-Host "Improvement:   +15-20% 🎉" -ForegroundColor Green
    } else {
        Write-Host "`n❌ Installation failed" -ForegroundColor Red
    }
} else {
    Write-Host "`n❌ Build failed - APK not found at: $apkPath" -ForegroundColor Red
    Write-Host "Check build logs above for errors" -ForegroundColor Yellow
}

Write-Host "`nDone at $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Gray
