// Firebase Configuration
// Thay thế các giá trị này bằng config từ Firebase Console của bạn

// Import Firebase SDK
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { 
    getAuth, 
    signInWithPopup, 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { 
    getFirestore,
    doc,
    setDoc,
    getDoc,
    getDocs,
    collection,
    query,
    where,
    orderBy,
    addDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    onSnapshot
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
import { 
    getAnalytics 
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js';

// TODO: Thay thế bằng config từ Firebase Console của bạn
const firebaseConfig = {
    apiKey: "AIzaSyBk7HVOqPikrO4xHgp7V3yMBYJDY6x6yiU",
    authDomain: "app-manager-task.firebaseapp.com",
    projectId: "app-manager-task",
    storageBucket: "app-manager-task.firebasestorage.app",
    messagingSenderId: "500320306642",
    appId: "1:500320306642:web:eece23272caf697015f40b",
    measurementId: "G-2GG8F34H58"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo các services
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Cấu hình Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Cấu hình để force account selection
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

// Export để sử dụng trong các file khác
window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseDb = db;
window.firebaseAnalytics = analytics;
window.googleProvider = googleProvider;

// Export các functions Firebase
window.FirebaseUtils = {
    // Authentication
    signInWithGoogle: () => signInWithPopup(auth, googleProvider),
    signInWithEmail: (email, password) => signInWithEmailAndPassword(auth, email, password),
    signUpWithEmail: (email, password) => createUserWithEmailAndPassword(auth, email, password),
    signOut: () => signOut(auth),
    onAuthStateChanged: (callback) => onAuthStateChanged(auth, callback),
    
    // Firestore  
    doc: (path, id) => doc(db, path, id),
    collection: (path) => collection(db, path),
    setDoc: (docRef, data) => setDoc(docRef, data),
    getDoc: (docRef) => getDoc(docRef),
    getDocs: (query) => getDocs(query),
    addDoc: (collectionRef, data) => addDoc(collectionRef, data),
    updateDoc: (docRef, data) => updateDoc(docRef, data),
    deleteDoc: (docRef) => deleteDoc(docRef),
    query: (collectionRef, ...constraints) => query(collectionRef, ...constraints),
    where: (field, operator, value) => where(field, operator, value),
    orderBy: (field, direction) => orderBy(field, direction),
    serverTimestamp: () => serverTimestamp(),
    onSnapshot: (query, callback) => onSnapshot(query, callback)
};

// Kiểm tra Firebase đã khởi tạo thành công
console.log('🔥 Firebase initialized successfully!');
console.log('📱 App:', app.name);
console.log('🔐 Auth ready:', !!auth);
console.log('🗄️ Firestore ready:', !!db);
console.log('📊 Analytics ready:', !!analytics);
console.log('� Project ID:', app.options.projectId);