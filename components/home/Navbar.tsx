"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { ModeToggle } from "../themes/darktheme";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { UserNav } from "../user/UserNav";
import { cn } from "@/lib/utils";
import { toast } from "sonner";



const Navbar: React.FC = () => {
  const { data: session } = useSession();
  // console.log("sesion", session);
  const [active, setActive] = useState<string | any>("");

  const handleAuthRequired = (e: React.MouseEvent) => {
    if (!session) {
      e.preventDefault();
      toast.error("Please login to access this feature");
      return;
    }
  };

  return (
    <nav className="flex justify-between items-center w-full">
      <motion.div
        className="font-bold text-white text-xl"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        PIXELFORGE.
      </motion.div>

      <div className="flex gap-2 bg-[#2a2a42] rounded-full px-2 py-2 mb-2">
        <Link href={"/"}>
          <motion.button
            // className="bg-white text-[#2a2a42] rounded-full px-4 py-1 cursor-pointer "
            className={cn(
              "text-white px-4 py-1 hover:bg-[#3a3a52] cursor-pointer rounded-full transition-colors",
              active === "home" && "bg-white text-gray-800"
            )}
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            onClick={() => setActive("home")}
          >
            Home
          </motion.button>
        </Link>

        <Link href={session ? "/generate" : "#"} onClick={handleAuthRequired}>
          <motion.button
            className={cn(
              "text-white px-4 py-1 hover:bg-[#3a3a52] cursor-pointer rounded-full transition-colors",
              active === "generate" && "bg-white text-gray-800"
            )}
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            onClick={() => setActive("generate")}
          >
            Generate
          </motion.button>
        </Link>

        <Link href={session ? "/removebg" : "#"} onClick={handleAuthRequired}>
          <motion.button
            className={cn(
              "text-white px-4 py-1 hover:bg-[#3a3a52] cursor-pointer rounded-full transition-colors",
              active === "removebg" && "bg-white text-gray-800"
            )}
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            onClick={() => setActive("removebg")}
          >
            Remove BG
          </motion.button>
        </Link>

        <Link href={session ? "/face-swap" : "#"} onClick={handleAuthRequired}>
          <motion.button
            className={cn(
              "text-white px-4 py-1 hover:bg-[#3a3a52] cursor-pointer rounded-full transition-colors",
              active === "face-swap" && "bg-white text-gray-800"
            )}
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            onClick={() => setActive("face-swap")}
          >
            Face Swap
          </motion.button>
        </Link>
      </div>

      <div className="hidden md:flex md:items-center md:gap-4">
        {session ? (
          <UserNav user={session.user} />
        ) : (
          <Button
            variant="default"
            size="sm"
            className="cursor-pointer bg-white text-black rounded-xl px-5 py-2 shadow-md hover:shadow-lg"
            onClick={() => signIn("google")}
          >
            Sign In
          </Button>
        )}
        <ModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
