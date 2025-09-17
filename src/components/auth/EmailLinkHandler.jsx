"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation'; // <-- Correct import
import { isSignInWithEmailLink } from 'firebase/auth';
import { auth } from '../../firebase/config';

const EmailLinkHandler = () => {
    const { signInWithEmailLinkComplete, error } = useAuth();
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [needsEmail, setNeedsEmail] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleEmailLink = async () => {
            if (isSignInWithEmailLink(auth, window.location.href)) {
                let userEmail = localStorage.getItem('emailForSignIn');

                if (!userEmail) {
                    setNeedsEmail(true);
                    setLoading(false);
                    return;
                }

                try {
                    await signInWithEmailLinkComplete(userEmail, window.location.href);
                    setMessage('Successfully signed in!');
                    setTimeout(() => {
                        router.push('/dashboard');
                    }, 2000);
                } catch (error) {
                    console.error('Email link sign in error:', error);
                    setMessage('Error signing in. Please try again.');
                }
            } else {
                setMessage('Invalid email link.');
            }
            setLoading(false);
        };

        handleEmailLink();
    }, [signInWithEmailLinkComplete, router]);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        try {
            setLoading(true);
            await signInWithEmailLinkComplete(email, window.location.href);
            setMessage('Successfully signed in!');
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        } catch (error) {
            console.error('Email link sign in error:', error);
            setMessage('Error signing in. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4">Processing email link...</p>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">Complete Sign In</h2>

            {message && (
                <div className={`mb-4 p-3 border rounded ${error
                        ? 'bg-red-100 border-red-400 text-red-700'
                        : 'bg-green-100 border-green-400 text-green-700'
                    }`}>
                    {message}
                </div>
            )}

            {needsEmail && (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Please enter the email address you used to request the sign-in link:
                    </p>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
                    >
                        Complete Sign In
                    </button>
                </form>
            )}
        </div>
    );
};

export default EmailLinkHandler;