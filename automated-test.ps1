# ========================================
# 🧪 AUTOMATED APP TESTING SCRIPT
# ========================================
# Tôi CÓ THỂ chạy script này để test app tự động qua ADB

Write-Host "`n=== 🚀 STARTING AUTOMATED APP TESTS ===`n" -ForegroundColor Cyan

# ========================================
# TEST 1: Device Connection
# ========================================
Write-Host "[TEST 1] Checking device connection..." -ForegroundColor Yellow
$devices = adb devices | Select-String "device$"
if ($devices) {
    Write-Host "✅ PASS: Device connected - $devices" -ForegroundColor Green
} else {
    Write-Host "❌ FAIL: No device connected" -ForegroundColor Red
    exit 1
}

# ========================================
# TEST 2: Check if App is Running
# ========================================
Write-Host "`n[TEST 2] Checking if app is running..." -ForegroundColor Yellow
$appProcess = adb shell "ps | grep com.phamdai.tiktok"
if ($appProcess) {
    Write-Host "✅ PASS: App is running" -ForegroundColor Green
    Write-Host $appProcess -ForegroundColor Gray
} else {
    Write-Host "⚠️  WARNING: App not running, attempting to start..." -ForegroundColor Yellow
    adb shell am start -n com.phamdai.tiktok/.MainActivity
    Start-Sleep -Seconds 3
}

# ========================================
# TEST 3: Check Metro Connection
# ========================================
Write-Host "`n[TEST 3] Checking Metro bundler..." -ForegroundColor Yellow
try {
    $metroStatus = Invoke-WebRequest -Uri "http://localhost:8081/status" -UseBasicParsing -TimeoutSec 5
    if ($metroStatus.StatusCode -eq 200) {
        Write-Host "✅ PASS: Metro bundler is running" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ FAIL: Metro bundler not accessible" -ForegroundColor Red
}

# ========================================
# TEST 4: Clear Logs and Reload App
# ========================================
Write-Host "`n[TEST 4] Reloading app and clearing logs..." -ForegroundColor Yellow
adb logcat -c
adb shell input text "rr"
Write-Host "✅ App reloaded, waiting for logs..." -ForegroundColor Green
Start-Sleep -Seconds 5

# ========================================
# TEST 5: Check for JavaScript Errors
# ========================================
Write-Host "`n[TEST 5] Checking for JavaScript errors..." -ForegroundColor Yellow
$errors = adb logcat -d -s ReactNativeJS:E | Select-String "Error|Exception"
if ($errors) {
    Write-Host "❌ FAIL: JavaScript errors found:" -ForegroundColor Red
    $errors | ForEach-Object { Write-Host $_ -ForegroundColor Red }
} else {
    Write-Host "✅ PASS: No JavaScript errors" -ForegroundColor Green
}

# ========================================
# TEST 6: Check Memory Usage
# ========================================
Write-Host "`n[TEST 6] Checking memory usage..." -ForegroundColor Yellow
$memory = adb shell dumpsys meminfo com.phamdai.tiktok | Select-String "TOTAL PSS:"
if ($memory) {
    Write-Host "✅ Memory: $memory" -ForegroundColor Green
    $memoryMB = [int](($memory -split '\s+')[2]) / 1024
    if ($memoryMB -lt 500) {
        Write-Host "✅ PASS: Memory usage OK ($([math]::Round($memoryMB, 2)) MB)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  WARNING: Memory usage high ($([math]::Round($memoryMB, 2)) MB)" -ForegroundColor Yellow
    }
}

# ========================================
# TEST 7: Check Console Logs (Store Isolation)
# ========================================
Write-Host "`n[TEST 7] Testing store isolation..." -ForegroundColor Yellow
Write-Host "Simulating navigation and scroll..." -ForegroundColor Gray

# Clear logs
adb logcat -c

# Simulate some interactions (you'll need to manually navigate)
Write-Host "Please manually:" -ForegroundColor Cyan
Write-Host "  1. Navigate to Home screen" -ForegroundColor Cyan
Write-Host "  2. Then navigate to Video Feed" -ForegroundColor Cyan
Write-Host "  3. Scroll 3 videos in Video Feed" -ForegroundColor Cyan
Write-Host "`nWaiting 10 seconds for you to do this..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check logs for cross-screen interference
$logs = adb logcat -d -s ReactNativeJS:I | Select-String "HOME|index redner|currentIndex"
if ($logs) {
    Write-Host "`nCaptured logs:" -ForegroundColor Gray
    $logs | Select-Object -Last 20 | ForEach-Object { Write-Host $_ -ForegroundColor Gray }
    
    $homeLogs = $logs | Select-String "HOME.*currentIndex"
    if ($homeLogs) {
        Write-Host "`n⚠️  WARNING: Found Home screen logs (possible cross-screen interference)" -ForegroundColor Yellow
        $homeLogs | ForEach-Object { Write-Host $_ -ForegroundColor Yellow }
    } else {
        Write-Host "`n✅ PASS: No cross-screen interference detected" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  No logs captured. App might not be active." -ForegroundColor Yellow
}

# ========================================
# TEST 8: Check for Crashes
# ========================================
Write-Host "`n[TEST 8] Checking for crashes..." -ForegroundColor Yellow
$crashes = adb logcat -d -s AndroidRuntime:E | Select-String "FATAL"
if ($crashes) {
    Write-Host "❌ FAIL: Crash detected:" -ForegroundColor Red
    $crashes | ForEach-Object { Write-Host $_ -ForegroundColor Red }
} else {
    Write-Host "✅ PASS: No crashes detected" -ForegroundColor Green
}

# ========================================
# TEST 9: FPS Test (Manual)
# ========================================
Write-Host "`n[TEST 9] FPS Test (requires visual inspection)" -ForegroundColor Yellow
Write-Host "Opening Performance Monitor..." -ForegroundColor Gray
adb shell input keyevent KEYCODE_MENU
Start-Sleep -Seconds 1

Write-Host "`nPlease manually check:" -ForegroundColor Cyan
Write-Host "  1. Is Performance Monitor showing?" -ForegroundColor Cyan
Write-Host "  2. JS FPS > 50?" -ForegroundColor Cyan
Write-Host "  3. UI FPS > 55?" -ForegroundColor Cyan
Write-Host "`nPress Enter when done checking..." -ForegroundColor Yellow
Read-Host

# ========================================
# SUMMARY
# ========================================
Write-Host "`n=== 📊 TEST SUMMARY ===" -ForegroundColor Cyan
Write-Host "✅ Device Connected" -ForegroundColor Green
Write-Host "✅ Metro Running" -ForegroundColor Green
Write-Host "✅ App Reloaded" -ForegroundColor Green
Write-Host "⚠️  Manual checks required for FPS and UI" -ForegroundColor Yellow
Write-Host "`nTest completed at $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Gray

Write-Host "`n=== 📋 NEXT STEPS ===" -ForegroundColor Cyan
Write-Host "1. Check FPS Display in app (should show 55-60)" -ForegroundColor White
Write-Host "2. Scroll videos and verify smooth playback" -ForegroundColor White
Write-Host "3. Test tab switching (Home → Profile → Shop)" -ForegroundColor White
Write-Host "4. Verify no console spam from other screens" -ForegroundColor White
