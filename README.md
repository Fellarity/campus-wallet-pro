# 💸 Campus Wallet Pro

Welcome to **Campus Wallet Pro**, the ultimate digital payment ecosystem for your college campus. Say goodbye to loose change and lost ID cards—Campus Wallet Pro puts your entire campus economy right in your pocket.

Created for an **Internal College Hackathon**, this project demonstrates a robust, secure, and user-friendly way to handle student-to-vendor and student-to-student transactions.

---

## ✨ Features

- **🔐 Bank-Grade Security**: Powered by **Django REST Framework** and **JWT (JSON Web Tokens)**. Your money stays yours.
- **⚡ Atomic Payments**: Our "No-Fail" transaction system ensures that money is only moved if both sides of the deal are 100% successful.
- **📸 Scan & Pay**: Integrated QR code scanning for lightning-fast payments at the cafeteria, bookstore, or even between friends.
- **🎁 Loyalty Program**: Earn points every time you spend. Redeem them for campus perks!
- **📱 Native Experience**: A smooth, responsive mobile app built with **React Native**.

---

## 🛠️ Tech Stack

### **Backend (The Brains)**
- **Framework**: [Django](https://www.djangoproject.com/) & [Django REST Framework](https://www.django-rest-framework.org/)
- **Authentication**: [SimpleJWT](https://django-rest-framework-simplejwt.readthedocs.io/)
- **Database**: SQLite (Perfect for quick, portable campus setups)

### **Frontend (The Beauty)**
- **Framework**: [React Native](https://reactnative.dev/)
- **Navigation**: [React Navigation](https://reactnavigation.org/)
- **Data Handling**: [Axios](https://axios-http.com/)

---

## 🚀 Quick Start

### **1. Backend (Django API)**
```bash
cd backend
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate # Linux/macOS
# venv\Scripts\activate # Windows

# Install dependencies
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers

# Run migrations and start server
python manage.py migrate
python manage.py runserver
```

### **2. Frontend (React Native App)**
```bash
cd frontend
# Install dependencies
npm install

# Start the Expo/React Native bundler
npx expo start
```

---

## 📂 Project Structure

- `backend/`: The Django project.
  - `api/`: Core logic, models (User, Wallet, Transaction), and API views.
  - `core/`: Project settings and URL routing.
- `frontend/`: The React Native mobile application.
  - `screens/`: All UI screens (Dashboard, Scan, Login, etc.).
  - `App.js`: Main navigation and entry point.

---

## 📜 How it Works: The Atomic Transaction

When you pay a vendor, the backend performs an **Atomic Transaction**:
1. It verifies you have enough balance.
2. It subtracts the amount from your wallet.
3. It adds the amount to the vendor's wallet.
4. It logs a transaction history for both parties.

If *any* of these steps fail (e.g., a network glitch), the entire process is rolled back as if nothing happened. **Safety first!**

---

## 🤝 Contributing

This was a hackathon project, so bugs might be lurking! Feel free to fork, fix, and improve.

**Built with ❤️ for the Campus Community.**
