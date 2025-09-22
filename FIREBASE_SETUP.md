# 🔥 Hướng dẫn tích hợp Firebase với GitHub Pages

## ✅ Firebase Project đã cấu hình
**Project:** app-manager-task  
**Project ID:** app-manager-task  
**Status:** Config đã được tích hợp

## 📋 Các bước cần thực hiện trong Firebase Console

### 1. Truy cập Firebase Console
- Vào https://console.firebase.google.com/
- Chọn project **"app-manager-task"**

### 2. Cấu hình Authentication

#### 2.1. Kích hoạt Authentication
- Vào **Authentication** → **Get started**
- Tab **"Sign-in method"**

#### 2.2. Kích hoạt Google Provider
- Nhấn **Google** → **Enable**
- **Project support email**: Chọn email của bạn
- **Save**

#### 2.3. Kích hoạt Email/Password Provider  
- Nhấn **Email/Password** → **Enable**
- Chỉ bật **Email/Password** (không cần Passwordless)
- **Save**

#### 2.4. Cấu hình Authorized domains
- Tab **"Settings"** → **Authorized domains**
- Thêm domain: **`tranquan26.github.io`**
- Thêm localhost: **`localhost`** (cho test local)

### 3. Cấu hình Firestore Database

#### 3.1. Tạo Firestore Database
- Vào **Firestore Database** → **Create database**

#### 3.2. Chọn Security rules mode
**Cho Development (dễ test):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2024, 12, 31);
    }
  }
}
```

**Cho Production (an toàn):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Chỉ cho phép user truy cập data của chính họ
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

#### 3.3. Chọn Location
- **asia-southeast1** (Singapore - gần VN nhất)
- **Done**

### 5.1. Commit và Push
```bash
git add .
git commit -m "Add Firebase integration"
git push origin main
```

### 5.2. Đợi GitHub Pages deploy (~2-5 phút)

### 5.3. Test trên live site
- Vào `https://tranquan26.github.io`
- Mở Developer Console (F12)
- Kiểm tra messages:
  ```
  🔥 Firebase initialized successfully!
  📱 App: [DEFAULT]
  🔐 Auth ready: true
  🗄️ Firestore ready: true
  ```

## 🎯 Bước 6: Sử dụng tính năng

### 6.1. Test Authentication
- Nhấn **"🔐 Đăng nhập"** trên navbar
- Thử đăng nhập với Google hoặc Email
- Kiểm tra user info hiển thị

### 6.2. Test Data Sync
- Tạo một số todos, events, time blocks
- Đăng xuất → đăng nhập lại
- Data vẫn còn (đã sync với Firestore)

### 6.3. Test Migration
- Có data trong localStorage (chưa đăng nhập)
- Đăng nhập → tự động migrate data lên cloud
- Thông báo: "Đã chuyển dữ liệu từ offline lên cloud!"

## 🛠️ Troubleshooting

### Lỗi "Firebase chưa được cấu hình"
- Kiểm tra `firebase-config.js` đã cập nhật đúng config chưa
- Đảm bảo không còn placeholder `"your-api-key-here"`

### Lỗi Authentication
- Kiểm tra Authorized domains trong Firebase Console
- Đảm bảo có `tranquan26.github.io` và `localhost`

### Lỗi Firestore Permission
- Kiểm tra Firestore Rules
- Đảm bảo rules cho phép authenticated users

### Lỗi CORS
- Firebase SDK qua CDN thường không có vấn đề CORS
- Nếu gặp lỗi, thử clear cache browser

## 🔐 Bảo mật

### Production Rules (khuyến nghị)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Environment Variables
- GitHub Pages không hỗ trợ environment variables
- Firebase config có thể public (đã có built-in security)
- Tuy nhiên vẫn nên restrict domain trong Firebase Console

## 💡 Tips

### 1. Monitoring
- Firebase Console → **Analytics** → xem usage
- **Authentication** → **Users** → xem user list
- **Firestore** → **Data** → xem database content

### 2. Backup
- Sử dụng button **"💾 Tạo Backup"** trên homepage
- Data sẽ download dưới dạng JSON file

### 3. Migration
- Data cũ trong localStorage sẽ tự động migrate khi đăng nhập lần đầu
- Hoặc dùng button **"☁️ Chuyển dữ liệu lên Cloud"**

### 4. Offline Support
- App vẫn hoạt động khi offline (localStorage fallback)
- Khi online lại sẽ tự động sync

## 🚀 Nâng cao (tùy chọn)

### Firebase Hosting
- Có thể deploy trên Firebase Hosting thay vì GitHub Pages
- Hỗ trợ custom domain, SSL tự động
- Functions, Storage, Realtime Database

### Cloud Functions
- Tạo API backend serverless
- Scheduled functions (cron jobs)
- Triggers (database changes)

### Analytics
- Theo dõi user behavior
- Performance monitoring
- Custom events

---

**🎉 Chúc mừng! Bạn đã tích hợp thành công Firebase với TaskManager!**

Giờ bạn có thể:
- ✅ Đăng nhập/đăng ký user
- ✅ Lưu data trên cloud  
- ✅ Sync giữa các thiết bị
- ✅ Backup/restore dữ liệu
- ✅ Hoạt động cả online/offline