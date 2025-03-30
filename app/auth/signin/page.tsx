"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a2e]">
      <div className="bg-white/10 p-8 rounded-lg shadow-xl backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Sign In</h1>
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="flex items-center gap-3 bg-white text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors w-full"
        >
          <Image
            src="/google.svg"
            alt="Google"
            width={20}
            height={20}
          />
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
} 