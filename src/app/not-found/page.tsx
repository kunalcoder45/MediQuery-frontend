// src/app/not-found/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search, AlertCircle } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* 404 Icon */}
        <div className="relative">
          <div className="text-8xl font-bold text-gray-200 select-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <AlertCircle className="h-16 w-16 text-red-400" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Page Not Found
          </h1>
          <p className="text-gray-600 text-lg">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/">
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Maybe you're looking for:
          </p>
          <div className="space-y-2">
            <Link 
              href="/" 
              className="block text-blue-600 hover:text-blue-800 hover:underline"
            >
              🏠 Home Page
            </Link>
            <Link 
              href="/auth/login" 
              className="block text-blue-600 hover:text-blue-800 hover:underline"
            >
              🔐 Sign In
            </Link>
            <Link 
              href="/about" 
              className="block text-blue-600 hover:text-blue-800 hover:underline"
            >
              ℹ️ About Us
            </Link>
          </div>
        </div>

        {/* Medical Theme Footer */}
        <div className="pt-6 text-xs text-gray-400">
          <p>MediQuery AI - Your Health Assistant</p>
        </div>
      </div>
    </div>
  );
}