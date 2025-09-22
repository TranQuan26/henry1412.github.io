// Firebase Configuration with proper initialization
console.log('🔄 Loading Firebase configuration...');

// Global Firebase variables
let firebaseApp, firebaseAuth, firebaseDb, firebaseAnalytics, googleProvider;

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBk7HVOqPikrO4xHgp7V3yMBYJDY6x6yiU",
    authDomain: "app-manager-task.firebaseapp.com",
    projectId: "app-manager-task",
    storageBucket: "app-manager-task.firebasestorage.app",
    messagingSenderId: "500320306642",
    appId: "1:500320306642:web:eece23272caf697015f40b",
    measurementId: "G-2GG8F34H58"
};

// Initialize Firebase function
async function initializeFirebase() {
    try {
        console.log('🔥 Initializing Firebase...');
        
        // Dynamic imports to avoid timing issues
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js');
        const { 
            getAuth, 
            signInWithPopup, 
            signInWithEmailAndPassword,
            createUserWithEmailAndPassword,
            signOut,
            GoogleAuthProvider,
            onAuthStateChanged 
        } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js');
        const { 
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
        } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js');

        let analytics = null;
        try {
            const { getAnalytics } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js');
            analytics = getAnalytics(initializeApp(firebaseConfig));
        } catch (analyticsError) {
            console.warn('⚠️ Analytics not available:', analyticsError.message);
        }

        // Initialize Firebase
        firebaseApp = initializeApp(firebaseConfig);
        firebaseAuth = getAuth(firebaseApp);
        firebaseDb = getFirestore(firebaseApp);
        firebaseAnalytics = analytics;

        // Configure Google Auth Provider
        googleProvider = new GoogleAuthProvider();
        googleProvider.addScope('email');
        googleProvider.addScope('profile');
        googleProvider.setCustomParameters({
            prompt: 'select_account'
        });

        // Export to global scope
        window.firebaseApp = firebaseApp;
        window.firebaseAuth = firebaseAuth;
        window.firebaseDb = firebaseDb;
        window.firebaseAnalytics = firebaseAnalytics;
        window.googleProvider = googleProvider;

        // Create utility functions
        window.FirebaseUtils = {
            // Authentication
            signInWithGoogle: () => {
                console.log('🔑 Attempting Google sign in...');
                return signInWithPopup(firebaseAuth, googleProvider);
            },
            signInWithEmail: (email, password) => signInWithEmailAndPassword(firebaseAuth, email, password),
            signUpWithEmail: (email, password) => createUserWithEmailAndPassword(firebaseAuth, email, password),
            signOut: () => signOut(firebaseAuth),
            onAuthStateChanged: (callback) => onAuthStateChanged(firebaseAuth, callback),
            
            // Firestore
            doc: (path, id) => doc(firebaseDb, path, id),
            collection: (path) => collection(firebaseDb, path),
            setDoc: (docRef, data, options) => setDoc(docRef, data, options),
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

        console.log('✅ Firebase initialized successfully!');
        console.log('📱 App:', firebaseApp.name);
        console.log('🔐 Auth ready:', !!firebaseAuth);
        console.log('🗄️ Firestore ready:', !!firebaseDb);
        console.log('📊 Analytics ready:', !!firebaseAnalytics);
        console.log('🚀 Project ID:', firebaseApp.options.projectId);
        console.log('🌐 Auth Domain:', firebaseApp.options.authDomain);

        // Dispatch ready event
        window.dispatchEvent(new CustomEvent('firebaseReady', {
            detail: {
                app: firebaseApp,
                auth: firebaseAuth,
                db: firebaseDb,
                analytics: firebaseAnalytics
            }
        }));

        return true;

    } catch (error) {
        console.error('❌ Firebase initialization failed:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        
        // Dispatch error event
        window.dispatchEvent(new CustomEvent('firebaseError', { 
            detail: error 
        }));
        
        return false;
    }
}

// Test function to verify Firebase setup
window.testFirebaseSetup = async function() {
    console.group('🧪 Firebase Setup Test');
    
    try {
        if (!window.FirebaseUtils) {
            throw new Error('FirebaseUtils not available');
        }

        console.log('✅ FirebaseUtils available');
        console.log('🔑 Google Provider:', !!window.googleProvider);
        console.log('🔐 Auth:', !!window.firebaseAuth);
        console.log('🗄️ Database:', !!window.firebaseDb);
        
        // Test network connectivity
        const response = await fetch('https://www.googleapis.com/auth/userinfo.email', { mode: 'no-cors' });
        console.log('🌐 Google APIs accessible');
        
        console.log('🎉 All checks passed!');
        return true;
        
    } catch (error) {
        console.error('❌ Setup test failed:', error);
        return false;
    } finally {
        console.groupEnd();
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFirebase);
} else {
    // DOM already loaded, initialize immediately
    initializeFirebase();
}

console.log('📦 Firebase config script loaded');