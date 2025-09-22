// Firebase Firestore Database Service
class FirebaseDataService {
    constructor() {
        this.user = null;
        this.initialized = false;
        
        // Đợi Firebase và Auth ready
        this.waitForFirebase().then(() => {
            this.init();
        });
    }
    
    async waitForFirebase() {
        // Đợi Firebase và Auth service
        while (!window.FirebaseUtils || !window.authService) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    
    init() {
        // Lắng nghe auth state changes
        window.authService.onAuthStateChanged((user) => {
            this.user = user;
            this.initialized = true;
        });
        
        console.log('🗄️ Firebase Data Service initialized');
    }
    
    // Kiểm tra user đã đăng nhập chưa
    requireAuth() {
        if (!this.user) {
            throw new Error('Bạn cần đăng nhập để sử dụng tính năng này!');
        }
        return this.user;
    }
    
    // Lấy user collection path
    getUserPath(collection) {
        const user = this.requireAuth();
        return `users/${user.uid}/${collection}`;
    }
    
    // TODOS Operations
    async saveTodos(todos) {
        try {
            const user = this.requireAuth();
            const docRef = window.FirebaseUtils.doc('users', user.uid);
            
            await window.FirebaseUtils.setDoc(docRef, {
                todos: todos,
                updatedAt: window.FirebaseUtils.serverTimestamp()
            }, { merge: true });
            
            console.log('✅ Todos saved to Firestore');
            return true;
        } catch (error) {
            console.error('Error saving todos:', error);
            Utils.showNotification('Không thể lưu todos!', 'error');
            return false;
        }
    }
    
    async loadTodos() {
        try {
            const user = this.requireAuth();
            const docRef = window.FirebaseUtils.doc('users', user.uid);
            const docSnap = await window.FirebaseUtils.getDoc(docRef);
            
            if (docSnap.exists()) {
                const data = docSnap.data();
                return data.todos || [];
            }
            
            return [];
        } catch (error) {
            console.error('Error loading todos:', error);
            Utils.showNotification('Không thể tải todos!', 'error');
            return [];
        }
    }
    
    // CALENDAR EVENTS Operations  
    async saveEvents(events) {
        try {
            const user = this.requireAuth();
            const docRef = window.FirebaseUtils.doc('users', user.uid);
            
            await window.FirebaseUtils.setDoc(docRef, {
                events: events,
                updatedAt: window.FirebaseUtils.serverTimestamp()
            }, { merge: true });
            
            console.log('✅ Events saved to Firestore');
            return true;
        } catch (error) {
            console.error('Error saving events:', error);
            Utils.showNotification('Không thể lưu sự kiện!', 'error');
            return false;
        }
    }
    
    async loadEvents() {
        try {
            const user = this.requireAuth();
            const docRef = window.FirebaseUtils.doc('users', user.uid);
            const docSnap = await window.FirebaseUtils.getDoc(docRef);
            
            if (docSnap.exists()) {
                const data = docSnap.data();
                return data.events || [];
            }
            
            return [];
        } catch (error) {
            console.error('Error loading events:', error);
            Utils.showNotification('Không thể tải sự kiện!', 'error');
            return [];
        }
    }
    
    // TIME BLOCKS Operations
    async saveTimeBlocks(timeBlocks, settings) {
        try {
            const user = this.requireAuth();
            const docRef = window.FirebaseUtils.doc('users', user.uid);
            
            await window.FirebaseUtils.setDoc(docRef, {
                timeBlocks: timeBlocks,
                timeBlockSettings: settings,
                updatedAt: window.FirebaseUtils.serverTimestamp()
            }, { merge: true });
            
            console.log('✅ Time blocks saved to Firestore');
            return true;
        } catch (error) {
            console.error('Error saving time blocks:', error);
            Utils.showNotification('Không thể lưu time blocks!', 'error');
            return false;
        }
    }
    
    async loadTimeBlocks() {
        try {
            const user = this.requireAuth();
            const docRef = window.FirebaseUtils.doc('users', user.uid);
            const docSnap = await window.FirebaseUtils.getDoc(docRef);
            
            if (docSnap.exists()) {
                const data = docSnap.data();
                return {
                    timeBlocks: data.timeBlocks || [],
                    settings: data.timeBlockSettings || {}
                };
            }
            
            return { timeBlocks: [], settings: {} };
        } catch (error) {
            console.error('Error loading time blocks:', error);
            Utils.showNotification('Không thể tải time blocks!', 'error');
            return { timeBlocks: [], settings: {} };
        }
    }
    
    // POMODORO Timer State Operations
    async savePomodoroState(state) {
        try {
            const user = this.requireAuth();
            const docRef = window.FirebaseUtils.doc('users', user.uid);
            
            await window.FirebaseUtils.setDoc(docRef, {
                pomodoroState: state,
                updatedAt: window.FirebaseUtils.serverTimestamp()
            }, { merge: true });
            
            console.log('✅ Pomodoro state saved to Firestore');
            return true;
        } catch (error) {
            console.error('Error saving pomodoro state:', error);
            return false;
        }
    }
    
    async loadPomodoroState() {
        try {
            const user = this.requireAuth();
            const docRef = window.FirebaseUtils.doc('users', user.uid);
            const docSnap = await window.FirebaseUtils.getDoc(docRef);
            
            if (docSnap.exists()) {
                const data = docSnap.data();
                return data.pomodoroState || null;
            }
            
            return null;
        } catch (error) {
            console.error('Error loading pomodoro state:', error);
            return null;
        }
    }
    
    // Real-time listeners
    subscribeToUserData(callback) {
        try {
            const user = this.requireAuth();
            const docRef = window.FirebaseUtils.doc('users', user.uid);
            
            return window.FirebaseUtils.onSnapshot(docRef, (doc) => {
                if (doc.exists()) {
                    callback(doc.data());
                } else {
                    callback({});
                }
            });
        } catch (error) {
            console.error('Error subscribing to user data:', error);
            return null;
        }
    }
    
    // Migration từ localStorage
    async migrateFromLocalStorage() {
        try {
            const user = this.requireAuth();
            
            // Load dữ liệu từ localStorage
            const todos = Utils.getFromLocalStorage('todos', []);
            const events = Utils.getFromLocalStorage('calendar-events', []);
            const timeBlocks = Utils.getFromLocalStorage('time-blocks', []);
            const timeBlockSettings = Utils.getFromLocalStorage('time-blocks-settings', {});
            
            if (todos.length === 0 && events.length === 0 && timeBlocks.length === 0) {
                console.log('No data to migrate from localStorage');
                return false;
            }
            
            // Kiểm tra xem đã có dữ liệu trong Firestore chưa
            const docRef = window.FirebaseUtils.doc('users', user.uid);
            const docSnap = await window.FirebaseUtils.getDoc(docRef);
            
            if (docSnap.exists()) {
                const existing = docSnap.data();
                if (existing.todos?.length > 0 || existing.events?.length > 0) {
                    console.log('Firestore already has data, skipping migration');
                    return false;
                }
            }
            
            // Migrate dữ liệu
            await window.FirebaseUtils.setDoc(docRef, {
                todos: todos,
                events: events,
                timeBlocks: timeBlocks,
                timeBlockSettings: timeBlockSettings,
                migratedAt: window.FirebaseUtils.serverTimestamp(),
                updatedAt: window.FirebaseUtils.serverTimestamp()
            });
            
            console.log('✅ Migration completed successfully');
            Utils.showNotification('Đã chuyển dữ liệu từ offline lên cloud!', 'success');
            
            return true;
        } catch (error) {
            console.error('Migration error:', error);
            Utils.showNotification('Có lỗi khi chuyển dữ liệu!', 'error');
            return false;
        }
    }
    
    // Backup dữ liệu
    async createBackup() {
        try {
            const user = this.requireAuth();
            const docRef = window.FirebaseUtils.doc('users', user.uid);
            const docSnap = await window.FirebaseUtils.getDoc(docRef);
            
            if (docSnap.exists()) {
                const data = docSnap.data();
                const backup = {
                    ...data,
                    backupDate: new Date().toISOString(),
                    version: '1.0'
                };
                
                // Tạo file backup
                const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.href = url;
                a.download = `taskmanager-backup-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                Utils.showNotification('Đã tạo file backup!', 'success');
                return true;
            }
            
            Utils.showNotification('Không có dữ liệu để backup!', 'warning');
            return false;
        } catch (error) {
            console.error('Backup error:', error);
            Utils.showNotification('Không thể tạo backup!', 'error');
            return false;
        }
    }
}

// Tạo instance global
window.dataService = new FirebaseDataService();

// Export cho ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FirebaseDataService;
}