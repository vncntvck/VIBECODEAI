# Build APK Fintjam

## Prerequisites
- Node.js 18+
- Java JDK 17+ (download: https://adoptium.net/temurin/releases/?version=17)
- Android Studio (sudah terinstall)
- Android SDK (sudah ada di AppData/Local/Android/Sdk)

## Langkah Build

### 1. Install dependencies
```bash
cd app
npm install
```

### 2. Copy frontend files ke www
```bash
node prepare.js
```

### 3. Add Android platform (hanya pertama kali)
```bash
npx cap add android
```

### 4. Sync files ke Android project
```bash
npx cap sync android
```

### 5. Buka di Android Studio
```bash
npx cap open android
```

### 6. Di Android Studio
- Tunggu Gradle sync selesai
- Menu: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
- APK ada di: `android/app/build/outputs/apk/debug/app-debug.apk`
- Transfer ke HP → install (aktifkan "Install from unknown sources")

## Update setelah ada perubahan frontend
```bash
node prepare.js
npx cap sync android
```
Lalu build APK lagi di Android Studio.
