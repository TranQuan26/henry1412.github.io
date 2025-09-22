// Firebase Authentication Service
class FirebaseAuthService {
    constructor() {
        this.user = null;
        this.initialized = false;
        this.authStateCallbacks = [];
        
        // Đợi Firebase config load xong
        this.waitForFirebase().then(() => {
            this.init();
        });
    }
    
    async waitForFirebase() {
        // Đợi Firebase được load
        while (!window.FirebaseUtils) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    
    init() {
        if (!window.FirebaseUtils) {
            console.error('Firebase chưa được khởi tạo!');
            return;
        }
        
        // Lắng nghe thay đổi auth state
        window.FirebaseUtils.onAuthStateChanged((user) => {
            this.user = user;
            this.initialized = true;
            
            // Gọi tất cả callbacks
            this.authStateCallbacks.forEach(callback => {
                try {
                    callback(user);
                } catch (error) {
                    console.error('Error in auth state callback:', error);
                }
            });
            
            // Cập nhật UI
            this.updateAuthUI(user);
            
            console.log('👤 Auth state changed:', user ? `Logged in as ${user.email}` : 'Logged out');
        });
    }
    
    // Đăng nhập với Google
    async signInWithGoogle() {
        try {
            const result = await window.FirebaseUtils.signInWithGoogle();
            const user = result.user;
            
            Utils.showNotification(`Chào mừng ${user.displayName}!`, 'success');
            return user;
        } catch (error) {
            console.error('Google sign in error:', error);
            Utils.showNotification('Đăng nhập Google thất bại!', 'error');
            throw error;
        }
    }
    
    // Đăng nhập với email/password
    async signInWithEmail(email, password) {
        try {
            const result = await window.FirebaseUtils.signInWithEmail(email, password);
            const user = result.user;
            
            Utils.showNotification(`Chào mừng ${user.email}!`, 'success');
            return user;
        } catch (error) {
            console.error('Email sign in error:', error);
            let message = 'Đăng nhập thất bại!';
            
            switch (error.code) {
                case 'auth/user-not-found':
                    message = 'Không tìm thấy tài khoản này!';
                    break;
                case 'auth/wrong-password':
                    message = 'Mật khẩu không đúng!';
                    break;
                case 'auth/invalid-email':
                    message = 'Email không hợp lệ!';
                    break;
                case 'auth/user-disabled':
                    message = 'Tài khoản đã bị khóa!';
                    break;
            }
            
            Utils.showNotification(message, 'error');
            throw error;
        }
    }
    
    // Đăng ký với email/password
    async signUpWithEmail(email, password) {
        try {
            const result = await window.FirebaseUtils.signUpWithEmail(email, password);
            const user = result.user;
            
            Utils.showNotification(`Đăng ký thành công! Chào mừng ${user.email}!`, 'success');
            return user;
        } catch (error) {
            console.error('Email sign up error:', error);
            let message = 'Đăng ký thất bại!';
            
            switch (error.code) {
                case 'auth/email-already-in-use':
                    message = 'Email này đã được sử dụng!';
                    break;
                case 'auth/invalid-email':
                    message = 'Email không hợp lệ!';
                    break;
                case 'auth/weak-password':
                    message = 'Mật khẩu quá yếu!';
                    break;
            }
            
            Utils.showNotification(message, 'error');
            throw error;
        }
    }
    
    // Đăng xuất
    async signOut() {
        try {
            await window.FirebaseUtils.signOut();
            Utils.showNotification('Đã đăng xuất!', 'success');
        } catch (error) {
            console.error('Sign out error:', error);
            Utils.showNotification('Có lỗi khi đăng xuất!', 'error');
            throw error;
        }
    }
    
    // Lắng nghe thay đổi auth state
    onAuthStateChanged(callback) {
        this.authStateCallbacks.push(callback);
        
        // Nếu đã có user, gọi callback ngay
        if (this.initialized) {
            callback(this.user);
        }
    }
    
    // Lấy user hiện tại
    getCurrentUser() {
        return this.user;
    }
    
    // Kiểm tra đã đăng nhập chưa
    isSignedIn() {
        return !!this.user;
    }
    
    // Cập nhật UI auth
    updateAuthUI(user) {
        const authContainers = document.querySelectorAll('.auth-container');
        const userInfos = document.querySelectorAll('.user-info');
        
        authContainers.forEach(container => {
            if (user) {
                container.style.display = 'none';
            } else {
                container.style.display = 'block';
            }
        });
        
        userInfos.forEach(info => {
            if (user) {
                info.style.display = 'flex';
                const avatar = info.querySelector('.user-avatar');
                const name = info.querySelector('.user-name');
                const email = info.querySelector('.user-email');
                
                if (avatar) {
                    avatar.src = user.photoURL || 'https://via.placeholder.com/32';
                    avatar.alt = user.displayName || user.email;
                }
                if (name) name.textContent = user.displayName || 'User';
                if (email) email.textContent = user.email;
            } else {
                info.style.display = 'none';
            }
        });
    }
    
    // Tạo UI đăng nhập/đăng ký
    createAuthModal() {
        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="auth-modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="auth-modal-content">
                <button class="auth-modal-close" onclick="this.closest('.auth-modal').remove()">×</button>
                
                <div class="auth-tabs">
                    <button class="auth-tab active" data-tab="signin">Đăng nhập</button>
                    <button class="auth-tab" data-tab="signup">Đăng ký</button>
                </div>
                
                <div class="auth-tab-content active" id="signin-tab">
                    <h3>🔐 Đăng nhập</h3>
                    
                    <button class="auth-btn google-btn" onclick="authService.handleGoogleSignIn()">
                        <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google">
                        Đăng nhập với Google
                    </button>
                    
                    <div class="auth-divider">hoặc</div>
                    
                    <form class="auth-form" onsubmit="authService.handleEmailSignIn(event)">
                        <input type="email" placeholder="Email" required>
                        <input type="password" placeholder="Mật khẩu" required>
                        <button type="submit" class="auth-btn primary">Đăng nhập</button>
                    </form>
                </div>
                
                <div class="auth-tab-content" id="signup-tab">
                    <h3>📝 Đăng ký</h3>
                    
                    <button class="auth-btn google-btn" onclick="authService.handleGoogleSignIn()">
                        <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google">
                        Đăng ký với Google
                    </button>
                    
                    <div class="auth-divider">hoặc</div>
                    
                    <form class="auth-form" onsubmit="authService.handleEmailSignUp(event)">
                        <input type="email" placeholder="Email" required>
                        <input type="password" placeholder="Mật khẩu (tối thiểu 6 ký tự)" required minlength="6">
                        <input type="password" placeholder="Xác nhận mật khẩu" required minlength="6">
                        <button type="submit" class="auth-btn primary">Đăng ký</button>
                    </form>
                </div>
            </div>
        `;
        
        // Xử lý tab switching
        modal.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                
                modal.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
                modal.querySelectorAll('.auth-tab-content').forEach(c => c.classList.remove('active'));
                
                tab.classList.add('active');
                modal.querySelector(`#${tabName}-tab`).classList.add('active');
            });
        });
        
        return modal;
    }
    
    // Hiển thị modal đăng nhập
    showAuthModal() {
        // Xóa modal cũ nếu có
        const existingModal = document.querySelector('.auth-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const modal = this.createAuthModal();
        document.body.appendChild(modal);
    }
    
    // Xử lý đăng nhập Google từ modal
    async handleGoogleSignIn() {
        try {
            await this.signInWithGoogle();
            document.querySelector('.auth-modal')?.remove();
        } catch (error) {
            console.error('Google sign in failed:', error);
        }
    }
    
    // Xử lý đăng nhập email từ modal
    async handleEmailSignIn(event) {
        event.preventDefault();
        const form = event.target;
        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelector('input[type="password"]').value;
        
        try {
            await this.signInWithEmail(email, password);
            document.querySelector('.auth-modal')?.remove();
        } catch (error) {
            console.error('Email sign in failed:', error);
        }
    }
    
    // Xử lý đăng ký email từ modal  
    async handleEmailSignUp(event) {
        event.preventDefault();
        const form = event.target;
        const inputs = form.querySelectorAll('input[type="password"]');
        const email = form.querySelector('input[type="email"]').value;
        const password = inputs[0].value;
        const confirmPassword = inputs[1].value;
        
        if (password !== confirmPassword) {
            Utils.showNotification('Mật khẩu xác nhận không khớp!', 'error');
            return;
        }
        
        try {
            await this.signUpWithEmail(email, password);
            document.querySelector('.auth-modal')?.remove();
        } catch (error) {
            console.error('Email sign up failed:', error);
        }
    }
}

// Tạo instance global
window.authService = new FirebaseAuthService();

// Export cho ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FirebaseAuthService;
}