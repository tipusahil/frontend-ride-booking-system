"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

import { Laptop, Moon, Sun } from "lucide-react";
// 🔹 Laptop icon যুক্ত করা হয়েছে System Theme টগল করার জন্য।

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";

// 🔹 Theme-এর জন্য type তৈরি করা হয়েছে: light, dark এবং system
type Theme = "light" | "dark" | "system";

type AnimatedThemeTogglerProps = {
  className?: string;
};

export const AnimatedThemeToggler = ({
  className,
}: AnimatedThemeTogglerProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 🔹 [১] theme স্টেট: localStorage থেকে থিম লোড করবে, না পেলে 'system' ডিফল্ট হিসেবে সেট হবে।
  // 'darkMode' স্টেটটি অপ্রয়োজনীয় হওয়ায় এটি বাদ দেওয়া হয়েছে, কারণ 'theme' স্টেট থেকেই বর্তমান অবস্থা জানা যায়।
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "system"; // সার্ভার-সাইড রেন্ডারিং-এর জন্য
    // localStorage থেকে সেভ করা থিম লোড করা হচ্ছে। যদি সেভ করা না থাকে, তবে 'system' ডিফল্ট হবে।
    return (localStorage.getItem("theme") as Theme) || "system";
  });

  // 🔹 useEffect: theme স্টেট পরিবর্তন হলে বা system-এর প্রিফারেন্স পরিবর্তন হলে UI আপডেট করার জন্য।
  useEffect(() => {
    const updateDocumentTheme = () => {
      if (theme === "system") {
        // যদি থিম 'system' হয়, তবে ব্রাউজারের সিস্টেম প্রিফারেন্স চেক করা হবে।
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        // HTML ট্যাগ-এ 'dark' ক্লাস যোগ বা সরিয়ে দেওয়া হবে সিস্টেম প্রিফারেন্স অনুযায়ী।
        document.documentElement.classList.toggle("dark", prefersDark);
      } else {
        // যদি 'light' বা 'dark' হয়, তবে সরাসরি সেই থিম সেট করা হবে।
        const isDark = theme === "dark";
        document.documentElement.classList.toggle("dark", isDark);
      }
    };

    // প্রথম রেন্ডার বা থিম স্টেট পরিবর্তন হলে থিম আপডেট করা।
    updateDocumentTheme();

    // 🔹 System theme auto update handler:
    // সিস্টেম থিম (OS settings) পরিবর্তন হলে রিয়াক্ট করার জন্য Event Listener যোগ করা হয়েছে।
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const systemChangeHandler = () => {
      // যদি বর্তমান থিম 'system' সেট করা থাকে, তবেই এই পরিবর্তন প্রতিফলিত হবে।
      if (theme === "system") {
        updateDocumentTheme();
      }
    };

    mediaQuery.addEventListener("change", systemChangeHandler);

    // Cleanup function: Component unmount হলে Event Listener সরিয়ে দেওয়া হবে।
    return () => mediaQuery.removeEventListener("change", systemChangeHandler);
  }, [theme]);

  // 🔹 toggleTheme() ফাংশন: View Transition API ব্যবহার করে স্মুথ থিম পরিবর্তন।
  // থিম পরিবর্তনের ক্রম: light → dark → system → light
  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current) return;

    // View Transition শুরু করা হচ্ছে।
    await document.startViewTransition(async () => {
      // DOM ম্যানিপুলেশন (যেমন useState আপডেট) এর জন্য flushSync ব্যবহার করা হচ্ছে,
      // যাতে transition শুরু হওয়ার আগেই রিয়াক্ট স্টেট এবং DOM সিঙ্ক হয়।
      flushSync(() => {
        let newTheme: Theme;

        // 🔹 তিন ধাপের থিম পরিবর্তন লজিক:
        if (theme === "light") newTheme = "dark";
        else if (theme === "dark") newTheme = "system";
        else newTheme = "light";

        // নতুন থিম সেট এবং localStorage-এ সেভ করা হচ্ছে।
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);

        // DOM-এ 'dark' ক্লাস পরিবর্তন করার লজিক (useEffect এর লজিক এখানেও প্রয়োজন)।
        if (newTheme === "system") {
          const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
          ).matches;
          document.documentElement.classList.toggle("dark", prefersDark);
        } else {
          const isDark = newTheme === "dark";
          document.documentElement.classList.toggle("dark", isDark);
        }
      });
    }).ready; // .ready ব্যবহার করা হয় যখন View Transition সফলভাবে DOM-এ পরিবর্তনগুলি ক্যাপচার করে।

    // 🔹 View Transition Animation: Circular Reveal Effect যোগ করা হয়েছে।
    // বাটন থেকে শুরু করে স্ক্রিনের শেষ প্রান্ত পর্যন্ত একটি বৃত্তাকার অ্যানিমেশন।
    const { left, top, width, height } =
      buttonRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    // অ্যানিমেশনের জন্য বৃত্তের সর্বোচ্চ ব্যাসার্ধ নির্ণয় করা হচ্ছে।
    const maxDistance = Math.hypot(
      Math.max(centerX, window.innerWidth - centerX),
      Math.max(centerY, window.innerHeight - centerY)
    );

    // অ্যানিমেশনটি DOM-এর root element-এ প্রয়োগ করা হচ্ছে।
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${centerX}px ${centerY}px)`,
          `circle(${maxDistance}px at ${centerX}px ${centerY}px)`,
        ],
      },
      {
        duration: 700,
        easing: "ease-in-out",
        // '::view-transition-new(root)' - এটি নতুন থিমের রুট এলিমেন্টের জন্য অ্যানিমেশন।
        pseudoElement: "::view-transition-new(root)",
      }
    );
  }, [theme]); // dependency হিসেবে 'theme' রাখা হয়েছে।

  return (
    <Button
    variant={"outline"}
    size={"icon"}
      ref={buttonRef}
      onClick={toggleTheme}
      aria-label="Switch theme"
      className={cn(
        "flex items-center justify-center  p-1 rounded-lg outline-none focus:outline-none active:outline-none focus:ring-0 cursor-pointer transition-colors",
        className
      )}
      type="button"
    >
      <AnimatePresence mode="wait" initial={false}>
        {/* 🔹 তিনটি Icon-কে handle করা হচ্ছে এবং Framer Motion দ্বারা অ্যানিমেট করা হচ্ছে */}
        {theme === "dark" ? (
          <motion.span
            key="sun-icon"
            initial={{ opacity: 0, scale: 0.55, rotate: 360 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.33 }}
            className="text-white" // Dark থিমে আইকনের রঙ সাদা
          >
            <Sun />
          </motion.span>
        ) : theme === "light" ? (
          <motion.span
            key="moon-icon"
            initial={{ opacity: 0, scale: 0.55, rotate: -25 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.33 }}
            className="text-black" // Light থিমে আইকনের রঙ কালো
          >
            <Moon />
          </motion.span>
        ) : (
          <motion.span
            key="system-icon"
            initial={{ opacity: 0, scale: 0.55, rotate: -25 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.33 }}
            // 🔹 [২] আইকন কালার ফিক্স: Light থিমে যাতে দেখা যায় তার জন্য।
            // Light থিমে text-gray-600, Dark থিমে text-gray-300
            className="text-gray-600 dark:text-gray-300"
          >
            <Laptop />
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
};
