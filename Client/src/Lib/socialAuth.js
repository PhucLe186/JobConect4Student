import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from './firebase';

export const socialAuthService = {
    // Đăng nhập bằng Google
    signInWithGoogle: async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            
            return {
                success: true,
                userInfo: {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    emailVerified: user.emailVerified
                },
                provider: 'google'
            };
        } catch (error) {
            console.error('Google sign in error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    // Đăng nhập bằng Facebook
    signInWithFacebook: async () => {
        try {
            const result = await signInWithPopup(auth, facebookProvider);
            const user = result.user;
            
            return {
                success: true,
                userInfo: {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    emailVerified: user.emailVerified
                },
                provider: 'facebook'
            };
        } catch (error) {
            console.error('Facebook sign in error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    // Đăng xuất
    signOut: async () => {
        try {
            await auth.signOut();
            return { success: true };
        } catch (error) {
            console.error('Sign out error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
};