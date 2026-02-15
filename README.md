# Khan Jan Seva Kendra - Android Application

A professional Android application for "Khan Jan Seva Kendra" - a government services portal that provides various citizen services like tax filing, certificate applications, and bill payments.

## 🏗️ Architecture

- **Platform**: Android (Kotlin)
- **Minimum SDK**: API 21 (Android 5.0)
- **Target SDK**: API 34 (Android 14)
- **Architecture Pattern**: MVVM (Model-View-ViewModel)
- **Dependency Injection**: Hilt
- **Async Operations**: Kotlin Coroutines + Flow
- **Network**: Firebase Realtime Database
- **Image Loading**: Coil
- **Navigation**: Jetpack Navigation Component

## 📱 Features

### Authentication
- Email/Password login with Firebase Auth
- Customer and Admin login modes
- Registration with validation
- Forgot password functionality
- Biometric authentication support

### Services (25+ Services)
**Tax & Financial:**
- GST Filing Online (₹400)
- Income Tax Filing Online (₹250)
- TDS Services Online (₹350)

**Registration/Certificates:**
- PAN Card Online (₹107)
- Aadhaar Update/Enrolment (₹50/Free)
- Voter ID, Driving Licence, Passport
- Birth/Death/Caste/Domicile/Income Certificates
- Shop Registration, Trade License
- Police Verification, Certificate Verification

**Bill Payments:**
- Electricity, Water, Gas Bills (Free)
- LIC Premium, Fastag Recharge (Free)

### Application Management
- Submit applications with document upload
- Track application status in real-time
- View application history
- Download receipts

### Support
- Call support: +91 74590 64328
- WhatsApp support
- Email support: nsdl.arbaz@gmail.com
- Live chat (9 AM - 6 PM)

## 🚀 Getting Started

### Prerequisites
- Android Studio Hedgehog (2023.1.1) or later
- JDK 17
- Android SDK 34

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Open the project in Android Studio

3. Sync the project with Gradle files

4. Add your Firebase configuration:
   - Go to Firebase Console
   - Create a new project or use existing
   - Add Android app with package name: `com.khanjanseva.customer`
   - Download `google-services.json` and place it in `app/` directory

5. Build and run the app

### Firebase Setup

The app uses the following Firebase services:
- **Authentication**: Email/Password authentication
- **Realtime Database**: Store user profiles and applications
- **Storage**: Upload and store documents
- **Cloud Messaging**: Push notifications

Database URL: `https://khan-jan-seva-kendra-ac2f2-default-rtdb.asia-southeast1.firebasedatabase.app`

## 🎨 UI/UX

### Color Scheme
- Primary: #2196F3 (Blue)
- Secondary: #FF5722 (Orange/Red)
- Success: #4CAF50 (Green)
- Warning: #FF9800 (Orange)
- Error: #F44336 (Red)
- Background: #F5F7FA (Light gray)

### Features
- Smooth animations and transitions
- Shimmer loading effects
- Empty state illustrations
- Error handling with Snackbar notifications
- Pull-to-refresh
- Bottom navigation

## 📂 Project Structure

```
app/src/main/java/com/khanjanseva/customer/
├── data/
│   ├── local/          # Room Database
│   ├── model/          # Data models
│   ├── remote/         # Firebase services
│   └── repository/     # Repository pattern
├── di/                 # Hilt modules
├── ui/
│   ├── screens/        # Activities & Fragments
│   ├── components/     # Custom views
│   ├── theme/          # Theme configuration
│   └── viewmodel/      # ViewModels
├── utils/              # Utilities & Extensions
└── service/            # Firebase services
```

## 🔒 Security

- Firebase Authentication with secure token storage
- Biometric authentication option
- Auto-logout after 15 minutes of inactivity
- Secure document storage

## 📝 License

This project is proprietary software for Khan Jan Seva Kendra.

## 👨‍💻 Developer

Developed for Khan Jan Seva Kendra - Your Gateway to Government Services

Contact: nsdl.arbaz@gmail.com
Phone: +91 74590 64328
