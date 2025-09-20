"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { Loader2, Eye, EyeOff, User, Mail, Lock, CheckCircle } from 'lucide-react';

const SignUpForm = () => {
    const { signUpWithEmail, signInWithGoogle, loading } = useAuthContext();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        displayName: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    const validatePassword = (password: string) => {
        const minLength = password.length >= 6;
        const hasNumber = /\d/.test(password);
        const hasLetter = /[a-zA-Z]/.test(password);
        
        return {
            minLength,
            hasNumber,
            hasLetter,
            isValid: minLength && hasNumber && hasLetter
        };
    };

    const passwordValidation = validatePassword(formData.password);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.displayName.trim()) {
            setError('Please enter your full name');
            return;
        }

        if (!formData.email) {
            setError('Please enter your email address');
            return;
        }

        if (!passwordValidation.isValid) {
            setError('Password must be at least 6 characters with letters and numbers');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            setIsLoading(true);
            setError('');
            await signUpWithEmail(formData.email, formData.password, formData.displayName);
            setMessage('Account created successfully! Please check your email for verification.');
            setTimeout(() => {
                router.push('/');
            }, 2000);
        } catch (error: any) {
            console.error('Sign up error:', error);
            setError(error?.message || 'Failed to create account. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        try {
            setIsLoading(true);
            setError('');
            await signInWithGoogle();
            setMessage('Google sign up successful!');
            router.push('/');
        } catch (error: any) {
            console.error('Google sign up error:', error);
            setError(error?.message || 'Google sign up failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const currentLoading = loading || isLoading;

    return (
        <div className="flex h-[91vh] w-full">
            {/* Left side image - hidden on mobile */}
            <div className="w-full hidden md:inline-block h-[90vh]">
                <img 
                    className="h-full pl-40 object-cover" 
                    src="https://i.pinimg.com/736x/fa/26/e0/fa26e0638127021a3b41efbbaab82332.jpg" 
                    alt="signup illustration" 
                />
            </div>

            {/* Right side form */}
            <div className="w-full flex flex-col items-center justify-center p-8 bg-white">
                <form className="md:w-96 w-80 flex flex-col items-center justify-center">
                    <div className="text-center mb-3">
                        <h2 className="text-4xl text-gray-900 font-medium">Create Account</h2>
                        <p className="text-sm text-gray-500/90 mt-3">Join MediQuery AI for personalized health assistance</p>
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

                    {/* Google Sign Up Button */}
                    <button
                        type="button"
                        onClick={handleGoogleSignUp}
                        disabled={currentLoading}
                        className="w-full  bg-gray-500/10 hover:bg-gray-500/20 flex items-center justify-center h-12 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                        {currentLoading ? 'Creating account...' : 'Continue with Google'}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-4 w-full my-6">
                        <div className="w-full h-px bg-gray-300/90"></div>
                        <p className="text-nowrap text-sm text-gray-500/90">or create with email</p>
                        <div className="w-full h-px bg-gray-300/90"></div>
                    </div>

                    {/* Full Name Input */}
                    <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-3 mb-4 focus-within:border-blue-500 transition-colors">
                        <User className="w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            name="displayName"
                            placeholder="Full Name"
                            value={formData.displayName}
                            onChange={handleInputChange}
                            className="bg-transparent text-gray-700 placeholder-gray-500/80 outline-none text-sm w-full h-full pr-6"
                            required
                        />
                    </div>

                    {/* Email Input */}
                    <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-3 mb-4 focus-within:border-blue-500 transition-colors">
                        <Mail className="w-4 h-4 text-gray-500" />
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

                    {/* Password Input */}
                    <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-3 mb-2 focus-within:border-blue-500 transition-colors">
                        <Lock className="w-4 h-4 text-gray-500" />
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

                    {/* Password Validation Indicators */}
                    {formData.password && (
                        <div className="w-full mb-4 p-3 bg-gray-50 rounded-lg text-xs">
                            <div className="space-y-1">
                                <div className={`flex items-center gap-2 ${passwordValidation.minLength ? 'text-green-600' : 'text-red-500'}`}>
                                    <CheckCircle className="w-3 h-3" />
                                    <span>At least 6 characters</span>
                                </div>
                                <div className={`flex items-center gap-2 ${passwordValidation.hasLetter ? 'text-green-600' : 'text-red-500'}`}>
                                    <CheckCircle className="w-3 h-3" />
                                    <span>Contains letters</span>
                                </div>
                                <div className={`flex items-center gap-2 ${passwordValidation.hasNumber ? 'text-green-600' : 'text-red-500'}`}>
                                    <CheckCircle className="w-3 h-3" />
                                    <span>Contains numbers</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Confirm Password Input */}
                    <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-3 mb-6 focus-within:border-blue-500 transition-colors">
                        <Lock className="w-4 h-4 text-gray-500" />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="bg-transparent text-gray-700 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="pr-6 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="w-full mb-6 text-xs text-gray-500 text-center">
                        By creating an account, you agree to our{' '}
                        <button type="button" className="text-blue-500 hover:underline">
                            Terms of Service
                        </button>{' '}
                        and{' '}
                        <button type="button" className="text-blue-500 hover:underline">
                            Privacy Policy
                        </button>
                    </div>

                    {/* Create Account Button */}
                    <button
                        type="submit"
                        onClick={handleSignUp}
                        disabled={currentLoading}
                        className="w-full h-12 rounded-full text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {currentLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                Creating Account...
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </button>

                    {/* Sign in link */}
                    <p className="text-gray-500/90 text-sm mt-3 text-center">
                        Already have an account?{' '}
                        <button
                            type="button"
                            onClick={() => router.push('/auth/login')}
                            className="text-blue-600 hover:text-blue-700 hover:underline transition-colors font-medium"
                        >
                            Sign in
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignUpForm;