import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, sendSignInLinkToEmail, signInWithEmailLink, isSignInWithEmailLink } from 'firebase/auth';

// Firebase configuration variables from the canvas environment
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// A simple loading spinner component
const Loader = () => (
  <div className="flex justify-center items-center py-4">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// The main application component
const EmailLinkHandler = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [needsEmail, setNeedsEmail] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // This useEffect handles the sign-in completion when the user returns from the email link.
  useEffect(() => {
    const handleEmailLinkVerification = async () => {
      // Check if the current URL is a passwordless sign-in link.
      if (isSignInWithEmailLink(auth, window.location.href)) {
        setLoading(true);
        setError('');
        setMessage('Verifying your email link...');

        // Retrieve the email from localStorage.
        let userEmail = localStorage.getItem('emailForSignIn');

        if (!userEmail) {
          // As per the documentation, if no email is found, prompt the user to re-enter it.
          setNeedsEmail(true);
          setLoading(false);
          return;
        }

        try {
          // Complete the sign-in with the email and the current URL.
          const result = await signInWithEmailLink(auth, userEmail, window.location.href);
          localStorage.removeItem('emailForSignIn'); // Clean up localStorage.
          setMessage('Successfully signed in! You can now access the app.');
          setIsLoggedIn(true);
        } catch (err) {
          console.error('Email link sign in error:', err);
          setError(`Error signing in. The link may be expired or already used. Error: ${err.message}`);
        } finally {
          setLoading(false);
        }
      }
    };

    handleEmailLinkVerification();
  }, []);

  // Handler for when the user submits the form to send the link.
  const handleSendLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // This actionCodeSettings object is critical for the email link to work, as per the documentation.
    const actionCodeSettings = {
      url: window.location.href, 
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      // Save the email to localStorage for when the user returns from the email link.
      localStorage.setItem('emailForSignIn', email);
      setMessage('A sign-in link has been sent to your email. Please check your inbox and click the link to continue.');
    } catch (err) {
      console.error('Send link error:', err);
      setError(`Failed to send link. Please check the email address and try again. Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handler for when the user manually enters their email to complete sign-in.
  const handleCompleteSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('Completing sign-in...');

    try {
      await signInWithEmailLink(auth, email, window.location.href);
      localStorage.removeItem('emailForSignIn');
      setMessage('Successfully signed in! You can now access the app.');
      setIsLoggedIn(true);
    } catch (err) {
      console.error('Sign-in completion error:', err);
      setError(`Error completing sign-in. Please ensure the email is correct and the link is valid. Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        {isLoggedIn ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-green-600 mb-4">You're In!</h2>
              <p>You have successfully logged in using the passwordless link. Feel free to close this page.</p>
            </div>
          ) : (
          <>
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Passwordless Sign-In</h1>
            
            {message && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4">
                {message}
              </div>
            )}
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4">
                {error}
              </div>
            )}

            {loading && <Loader />}

            {needsEmail ? (
              <form onSubmit={handleCompleteSignIn} className="space-y-4">
                <p className="text-sm text-gray-600">
                  Please enter your email to complete the sign-in.
                </p>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <div className="mt-1">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-colors"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Complete Sign-In
                </button>
              </form>
            ) : (
              <form onSubmit={handleSendLink} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <div className="mt-1">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-colors"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Send Login Link
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EmailLinkHandler;