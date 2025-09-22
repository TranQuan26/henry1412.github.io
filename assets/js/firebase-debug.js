// Firebase Debug Utility
class FirebaseDebug {
    static checkSetup() {
        console.group('🔍 Firebase Setup Diagnostic');
        
        // 1. Check Firebase Config
        console.log('1. Firebase Config:');
        if (window.firebaseApp) {
            console.log('✅ Firebase App:', window.firebaseApp.name);
            console.log('📱 Project ID:', window.firebaseApp.options.projectId);
            console.log('🔑 Auth Domain:', window.firebaseApp.options.authDomain);
        } else {
            console.error('❌ Firebase App not initialized');
        }
        
        // 2. Check Auth
        console.log('\n2. Firebase Auth:');
        if (window.firebaseAuth) {
            console.log('✅ Firebase Auth initialized');
            console.log('👤 Current user:', window.firebaseAuth.currentUser?.email || 'None');
        } else {
            console.error('❌ Firebase Auth not initialized');
        }
        
        // 3. Check Google Provider
        console.log('\n3. Google Provider:');
        if (window.googleProvider) {
            console.log('✅ Google Provider configured');
            console.log('🔧 Custom parameters:', window.googleProvider.customParameters);
            console.log('📝 Scopes:', window.googleProvider.scopes);
        } else {
            console.error('❌ Google Provider not configured');
        }
        
        // 4. Check Firestore
        console.log('\n4. Firestore:');
        if (window.firebaseDb) {
            console.log('✅ Firestore initialized');
            console.log('🗄️ App:', window.firebaseDb.app.name);
        } else {
            console.error('❌ Firestore not initialized');
        }
        
        // 5. Check Services
        console.log('\n5. Services:');
        console.log('🔐 Auth Service:', window.authService ? '✅ Ready' : '❌ Not ready');
        console.log('📊 Data Service:', window.dataService ? '✅ Ready' : '❌ Not ready');
        console.log('🛠️ Utils:', window.Utils ? '✅ Ready' : '❌ Not ready');
        
        // 6. Check Domain
        console.log('\n6. Domain Check:');
        console.log('🌐 Current domain:', window.location.hostname);
        console.log('🔗 Current URL:', window.location.href);
        
        const isLocalhost = window.location.hostname === 'localhost';
        const isGitHubPages = window.location.hostname.includes('github.io');
        
        if (isLocalhost || isGitHubPages) {
            console.log('✅ Domain should be authorized');
        } else {
            console.warn('⚠️ Domain might not be authorized in Firebase Console');
        }
        
        // 7. Test Network
        console.log('\n7. Network Test:');
        fetch('https://www.googleapis.com/auth/userinfo.email')
            .then(response => {
                console.log('✅ Google APIs accessible');
            })
            .catch(error => {
                console.error('❌ Google APIs not accessible:', error);
            });
        
        console.groupEnd();
    }
    
    static async testGoogleSignIn() {
        console.group('🧪 Testing Google Sign In');
        
        try {
            if (!window.authService) {
                throw new Error('Auth service not available');
            }
            
            console.log('1. Checking Firebase readiness...');
            await window.authService.waitForFirebaseReady(3000);
            console.log('✅ Firebase is ready');
            
            console.log('2. Attempting Google sign in...');
            const user = await window.authService.signInWithGoogle();
            console.log('✅ Sign in successful:', user.email);
            
        } catch (error) {
            console.error('❌ Test failed:', error);
            
            // Additional diagnostics
            if (error.code) {
                console.error('Error code:', error.code);
                console.error('Error message:', error.message);
                
                // Suggest solutions
                switch (error.code) {
                    case 'auth/popup-blocked':
                        console.log('💡 Solution: Allow popups for this site');
                        break;
                    case 'auth/app-not-authorized':
                        console.log('💡 Solution: Add domain to authorized domains in Firebase Console');
                        break;
                    case 'auth/invalid-api-key':
                        console.log('💡 Solution: Check Firebase config in firebase-config.js');
                        break;
                }
            }
        } finally {
            console.groupEnd();
        }
    }
    
    static showQuickFix() {
        console.group('🔧 Quick Fix Suggestions');
        
        console.log('If Google Sign In fails, try these steps:');
        console.log('');
        console.log('1. 🌐 Check Firebase Console:');
        console.log('   - Go to: https://console.firebase.google.com/project/app-manager-task');
        console.log('   - Authentication → Settings → Authorized domains');
        console.log('   - Make sure tranquan26.github.io is listed');
        console.log('');
        console.log('2. 🔐 Check Authentication Providers:');
        console.log('   - Authentication → Sign-in method');
        console.log('   - Enable Google provider');
        console.log('   - Set support email');
        console.log('');
        console.log('3. 🚫 Check Browser:');
        console.log('   - Allow popups for this site');
        console.log('   - Clear browser cache');
        console.log('   - Try in incognito mode');
        console.log('');
        console.log('4. 🌍 Check Network:');
        console.log('   - Ensure internet connection');
        console.log('   - Check if behind corporate firewall');
        console.log('');
        console.log('5. 🔄 Try Refresh:');
        console.log('   - Refresh the page');
        console.log('   - Try different browser');
        
        console.groupEnd();
    }
}

// Make available globally for debugging
window.FirebaseDebug = FirebaseDebug;

// Auto-run basic check when script loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log('🔥 Firebase Debug - Run FirebaseDebug.checkSetup() for diagnostics');
        console.log('🧪 Firebase Debug - Run FirebaseDebug.testGoogleSignIn() to test login');
        console.log('🔧 Firebase Debug - Run FirebaseDebug.showQuickFix() for solutions');
    }, 2000);
});