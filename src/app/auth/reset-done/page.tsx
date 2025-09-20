"use client";

import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="max-w-md w-full bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-8 text-center">
        {/* Success Icon */}
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Password Reset Email Sent
        </h1>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          We’ve sent you an email with instructions to reset your password.
          Please check your inbox (and spam folder).
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <Link href="/auth/signin" passHref>
            <Button className="w-full">Back to Sign In</Button>
          </Link>
          <Link href="/" passHref>
            <Button variant="outline" className="w-full">
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
export default page