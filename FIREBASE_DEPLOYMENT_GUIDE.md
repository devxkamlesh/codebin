# Firebase पर CodeBin को डेवलपमेंट मोड में होस्ट करने की गाइड

## हिंदी में निर्देश

### आवश्यक चीज़ें:
1. Firebase अकाउंट
2. Node.js इंस्टॉल होना चाहिए
3. आपका CodeBin प्रोजेक्ट

### स्टेप 1: Firebase CLI इंस्टॉल करें
```bash
npm install -g firebase-tools
```

### स्टेप 2: Firebase में लॉगिन करें
```bash
firebase login
```
- यह आपके ब्राउज़र में एक पेज खोलेगा जहां आप अपने Google अकाउंट से लॉगिन कर सकते हैं

### स्टेप 3: अपने प्रोजेक्ट को इनिशियलाइज़ करें
```bash
cd C:\Users\kamle\Desktop\codebin\codebin
firebase init
```
- जब पूछा जाए, निम्न सेवाओं का चयन करें:
  - Firestore
  - Hosting
  - Storage (यदि आवश्यक हो)
- अपने मौजूदा Firebase प्रोजेक्ट का चयन करें या नया बनाएं
- पब्लिक डायरेक्टरी के लिए `dist` का उपयोग करें (Vite के लिए)
- सिंगल-पेज ऐप के रूप में कॉन्फ़िगर करें (Yes)
- GitHub Actions सेटअप का विकल्प चुनें (वैकल्पिक)

### स्टेप 4: डेवलपमेंट के लिए अपना प्रोजेक्ट बिल्ड करें
```bash
npm run build
```

### स्टेप 5: Firebase एमुलेटर्स स्टार्ट करें (डेवलपमेंट मोड के लिए)
```bash
firebase emulators:start
```
- यह आपके लोकल मशीन पर Firebase सर्विसेज चलाएगा

### स्टेप 6: अपने प्रोजेक्ट को डेवलपमेंट चैनल पर डिप्लॉय करें
```bash
firebase hosting:channel:deploy development
```
- यह एक अस्थायी URL प्रदान करेगा जिसे आप टेस्टिंग के लिए उपयोग कर सकते हैं

### स्टेप 7: प्रोडक्शन में जाने के लिए (जब आप तैयार हों)
```bash
firebase deploy
```

## Instructions in English

### Prerequisites:
1. Firebase account
2. Node.js installed
3. Your CodeBin project

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase
```bash
firebase login
```
- This will open a page in your browser where you can log in with your Google account

### Step 3: Initialize your project
```bash
cd C:\Users\kamle\Desktop\codebin\codebin
firebase init
```
- When prompted, select the following services:
  - Firestore
  - Hosting
  - Storage (if needed)
- Choose your existing Firebase project or create a new one
- Use `dist` for your public directory (for Vite)
- Configure as a single-page app (Yes)
- Choose to set up GitHub Actions (optional)

### Step 4: Build your project for development
```bash
npm run build
```

### Step 5: Start Firebase emulators (for development mode)
```bash
firebase emulators:start
```
- This will run Firebase services on your local machine

### Step 6: Deploy to a development channel
```bash
firebase hosting:channel:deploy development
```
- This will provide a temporary URL you can use for testing

### Step 7: Going to production (when you're ready)
```bash
firebase deploy
```

## अतिरिक्त टिप्स (Additional Tips)

### फायरबेस एमुलेटर्स का उपयोग (Using Firebase Emulators)
- डेवलपमेंट के दौरान, आप फायरबेस एमुलेटर्स का उपयोग कर सकते हैं ताकि आपको वास्तविक फायरबेस प्रोजेक्ट में कोई बदलाव न करना पड़े
- `firebase.json` में निम्न कॉन्फ़िगरेशन जोड़ें:

```json
"emulators": {
  "auth": {
    "port": 9099
  },
  "firestore": {
    "port": 8080
  },
  "hosting": {
    "port": 5000
  },
  "storage": {
    "port": 9199
  },
  "ui": {
    "enabled": true
  }
}
```

### एप्लिकेशन में एमुलेटर्स कनेक्ट करना (Connecting Emulators in Your App)
अपने `src/firebase.ts` फाइल में निम्न कोड जोड़ें:

```typescript
// Connect to Firebase emulators in development mode
if (process.env.NODE_ENV === 'development') {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectStorageEmulator(storage, 'localhost', 9199);
}
``` 