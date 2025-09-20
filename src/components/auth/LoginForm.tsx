"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { sendSignInLinkToEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Adjust import path as needed

const LoginForm = () => {
    const { signInWithEmail, signInWithGoogle, resetPassword, loading } = useAuthContext();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordless, setShowPasswordless] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear previous errors when user starts typing
        if (error) setError('');
        if (message) setMessage('');
    };

    const handleEmailPasswordLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setIsLoading(true);
            setError('');
            await signInWithEmail(formData.email, formData.password);
            setMessage('Login successful!');
            router.push('/');
        } catch (error: any) {
            console.error('Login error:', error);
            setError(error?.message || 'Failed to sign in. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setIsLoading(true);
            setError('');
            await signInWithGoogle();
            setMessage('Google login successful!');
            router.push('/');
        } catch (error: any) {
            console.error('Google login error:', error);
            setError(error?.message || 'Google sign in failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordlessLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email) {
            setError('Please enter your email address');
            return;
        }

        try {
            setIsLoading(true);
            setError('');

            const actionCodeSettings = {
                url: `${window.location.origin}/auth/verify`, // Create this page
                handleCodeInApp: true,
            };

            await sendSignInLinkToEmail(auth, formData.email, actionCodeSettings);

            // Save email to localStorage to complete sign in later
            localStorage.setItem('emailForSignIn', formData.email);

            setMessage('Email link sent! Check your inbox and click the link to sign in.');
        } catch (error: any) {
            console.error('Passwordless login error:', error);
            setError(error?.message || 'Failed to send email link. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordReset = async () => {
        if (!formData.email) {
            setError("Please enter your email address first")
            return
        }

        try {
            setIsLoading(true)
            setError("")
            // await resetPassword(formData.email)

            // 🚀 Redirect after success
            router.push("/auth/forgetpass")
        } catch (error: any) {
            console.error("Password reset error:", error)
            setError(error?.message)
        } finally {
            setIsLoading(false)
        }
    }

    const currentLoading = loading || isLoading;

    return (
        <div className="flex h-[91vh] w-full">
            {/* Left side image - hidden on mobile */}
            <div className="w-full hidden md:inline-block h-[90vh]">
                <img className="h-full pl-40" src="https://i.pinimg.com/736x/fa/26/e0/fa26e0638127021a3b41efbbaab82332.jpg" alt="leftSideImage" />
            </div>

            {/* Right side form */}
            <div className="w-full flex flex-col items-center justify-center p-8 bg-white">
                <form className="md:w-96 w-80 flex flex-col items-center justify-center">
                    <div className="text-center mb-8">
                        <h2 className="text-4xl text-gray-900 font-medium">Sign in</h2>
                        <p className="text-sm text-gray-500/90 mt-3">Welcome back! Please sign in to continue</p>
                    </div>

                    {/* Messages */}
                    {message && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm w-full">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm w-full">
                            {error}
                        </div>
                    )}

                    {/* Google Sign In Button */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={currentLoading}
                        className="w-full mt-4 bg-gray-500/10 hover:bg-gray-500/20 flex items-center justify-center h-12 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {currentLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        ) : (
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        )}
                        {currentLoading ? 'Signing in...' : 'Continue with Google'}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-4 w-full my-6">
                        <div className="w-full h-px bg-gray-300/90"></div>
                        <p className="text-nowrap text-sm text-gray-500/90">or sign in with email</p>
                        <div className="w-full h-px bg-gray-300/90"></div>
                    </div>

                    {/* Toggle between Email/Password and Passwordless */}
                    <div className="flex w-full bg-gray-100 rounded-full p-1 mb-6">
                        <button
                            type="button"
                            onClick={() => setShowPasswordless(false)}
                            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${!showPasswordless
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Email & Password
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowPasswordless(true)}
                            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${showPasswordless
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Passwordless
                        </button>
                    </div>

                    {/* Email Input */}
                    <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-3 mb-4 focus-within:border-blue-500 transition-colors">
                        <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z" fill="#6B7280" />
                        </svg>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="bg-transparent text-gray-700 placeholder-gray-500/80 outline-none text-sm w-full h-full pr-6"
                            required
                        />
                    </div>

                    {!showPasswordless ? (
                        // Email & Password Form
                        <>
                            {/* Password Input */}
                            <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-3 mb-6 focus-within:border-blue-500 transition-colors">
                                <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z" fill="#6B7280" />
                                </svg>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="bg-transparent text-gray-700 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="pr-6 text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>

                            {/* Remember me and Forgot password */}
                            <div className="w-full flex items-center justify-between mb-6 text-gray-500/80">
                                <div className="flex items-center gap-2">
                                    <input
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        type="checkbox"
                                        id="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <label className="text-sm" htmlFor="checkbox">Remember me</label>
                                </div>
                                <button
                                    type="button"
                                    onClick={handlePasswordReset}
                                    className="text-sm text-blue-500 hover:text-blue-600 hover:underline transition-colors"
                                    disabled={currentLoading}
                                >
                                    Forgot password?
                                </button>
                            </div>

                            {/* Sign In Button */}
                            <button
                                type="submit"
                                onClick={handleEmailPasswordLogin}
                                disabled={currentLoading}
                                className="w-full h-12 rounded-full text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {currentLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </>
                    ) : (
                        // Passwordless Form
                        <button
                            type="submit"
                            onClick={handlePasswordlessLogin}
                            disabled={currentLoading}
                            className="w-full h-12 rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {currentLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Sending...
                                </>
                            ) : (
                                'Send Login Link to Email'
                            )}
                        </button>
                    )}

                    {/* Sign up link */}
                    <p className="text-gray-500/90 text-sm mt-6 text-center">
                        Don't have an account?{' '}
                        <button
                            type="button"
                            onClick={() => router.push('/auth/register')}
                            className="text-blue-600 hover:text-blue-700 hover:underline transition-colors font-medium"
                        >
                            Sign up
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;