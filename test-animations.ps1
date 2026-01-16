# ========================================
# 🎬 QUICK UI ANIMATION TEST
# ========================================

Write-Host "`n=== 🎬 UI ANIMATION TESTING ===" -ForegroundColor Cyan

# Test 1: Tab Switch Animation
Write-Host "`n[Test 1] Tab Switch Animation" -ForegroundColor Yellow
Write-Host "Switch between tabs now (5 times)..." -ForegroundColor White
Write-Host "Watch for:" -ForegroundColor Gray
Write-Host "  - Smooth indicator movement" -ForegroundColor Gray
Write-Host "  - FPS stays 55-60" -ForegroundColor Gray
Write-Host "  - No white flash" -ForegroundColor Gray
Start-Sleep -Seconds 10

# Test 2: Scroll Animation
Write-Host "`n[Test 2] Video Scroll Animation" -ForegroundColor Yellow
Write-Host "Scroll through 10 videos now..." -ForegroundColor White
Write-Host "Watch for:" -ForegroundColor Gray
Write-Host "  - Smooth snap to each video" -ForegroundColor Gray
Write-Host "  - FPS > 55 during scroll" -ForegroundColor Gray
Write-Host "  - No jank or stuttering" -ForegroundColor Gray
Start-Sleep -Seconds 15

# Test 3: Check Frame Drops
Write-Host "`n[Test 3] Checking for frame drops..." -ForegroundColor Yellow
$frameDrops = adb logcat -d -s Choreographer:I | Select-String "skipped"
if ($frameDrops) {
    Write-Host "❌ Frame drops detected:" -ForegroundColor Red
    $frameDrops | Select-Object -First 5
} else {
    Write-Host "✅ No frame drops!" -ForegroundColor Green
}

# Test 4: Animation Slow Down (for inspection)
Write-Host "`n[Test 4] Animation Inspector Mode" -ForegroundColor Yellow
Write-Host "Slowing animations to 0.5x for inspection..." -ForegroundColor White
adb shell settings put global animator_duration_scale 0.5

Write-Host "`nAnimations are now 2x slower." -ForegroundColor Cyan
Write-Host "Test animations again to see details..." -ForegroundColor White
Write-Host "`nPress Enter to restore normal speed..." -ForegroundColor Yellow
Read-Host

# Restore normal speed
adb shell settings put global animator_duration_scale 1.0
Write-Host "✅ Animations restored to normal speed" -ForegroundColor Green

# Summary
Write-Host "`n=== 📊 TEST SUMMARY ===" -ForegroundColor Cyan
Write-Host "Please report:" -ForegroundColor White
Write-Host "  1. FPS during tab switch: ___" -ForegroundColor Gray
Write-Host "  2. FPS during scroll: ___" -ForegroundColor Gray
Write-Host "  3. Animations smooth? (Yes/No): ___" -ForegroundColor Gray
Write-Host "  4. Any jank or lag? (Yes/No): ___" -ForegroundColor Gray
