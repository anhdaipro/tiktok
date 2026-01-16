# Quick Debug Commands

# 1. Check if app is running
adb shell "ps | grep -i tiktok"

# 2. Get crash logs
adb logcat -d | findstr /i "crash fatal error"

# 3. Clear app data and restart
adb shell pm clear com.yourpackage
adb shell am start -n com.yourpackage/.MainActivity

# 4. Restart Metro bundler
# Ctrl+C in metro terminal, then:
npx expo start --clear

# 5. Rebuild app (nếu có thay đổi native code)
npx expo run:android

# 6. Check Metro connection
curl http://localhost:8081/status

# 7. Forward port (nếu device không connect được metro)
adb reverse tcp:8081 tcp:8081

# 8. Reload JS bundle
adb shell input text "rr"
