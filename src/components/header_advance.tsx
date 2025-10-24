"use client";
import { MenuToggleIcon } from "@/components/menu-toggle-icon";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import React from "react";
import { createPortal } from "react-dom";

import Logo from "@/assets/icons/Logo";
import { AnimatedThemeToggler } from "@/providers/theme-provider";
import {
  authApi, // RTK Query-এর বেস API অবজেক্ট। এটি ক্যাশে রিসেট করার জন্য অপরিহার্য।
  useGetMeOrGetUserInfoQuery, // ব্যবহারকারীর লগইন স্থিতি (Auth Status) চেক করার জন্য RTK Query hook.
  useLogoutMutation, // ব্যবহারকারীকে লগআউট করার জন্য RTK Query mutation hook.
} from "@/redux/features/auth/auth.api";
import { useAppDispatch } from "@/redux/hooks"; // Redux store-এ অ্যাকশন ডিসপ্যাচ করার জন্য কাস্টম hook.
import {
  BadgeInfo,
  BarChart,
  CodeIcon,
  FileText,
  GlobeIcon,
  Handshake,
  HelpCircle,
  HomeIcon,
  LayersIcon,
  Leaf,
  LogIn,
  LogOut,
  PlugIcon,
  RotateCcw,
  Shield,
  Star,
  UserPlusIcon,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

type LinkItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

// =================================================================================================
// Header Component
// =================================================================================================

export function Header() {
  // মেনু টগল স্টেট: মোবাইল মেনুটি খোলা (true) না বন্ধ (false) তা নিয়ন্ত্রণ করে।
  const [open, setOpen] = React.useState(false);
  // URL পরিবর্তন করে নেভিগেট করার জন্য hook. লগআউটের পর ইউজারকে /login পেজে পাঠাতে ব্যবহৃত।
  const navigate = useNavigate();
  // স্ক্রল থ্রেশহোল্ড (10px) পার হলে হেডার স্টাইল পরিবর্তন করার জন্য কাস্টম হুক।
  const scrolled = useScroll(10);

  // RTK Query: ব্যবহারকারীর তথ্য ফেচ করার জন্য। এটি ব্যবহারকারী লগইন করা আছে কিনা, তার প্রধান নির্দেশক।
  const { data, isLoading, isError, isSuccess } =
    useGetMeOrGetUserInfoQuery(undefined);

  // RTK Query: লগআউট মিউটেশন ফাংশন। এটি সার্ভারে লগআউট রিকোয়েস্ট পাঠায়।
  const [logout] = useLogoutMutation();
  // Redux ডিসপ্যাচ ফাংশন: বিশেষত RTK Query ক্যাশে রিসেট করার জন্য ব্যবহৃত হবে।
  const dispatch = useAppDispatch();

  // useEffect: API রিকোয়েস্টের অবস্থা (Loading, Success, Error) কনসোলে লগ করার জন্য।
  React.useEffect(() => {
    if (isSuccess && data) {
      console.log("User Data:", data);
    } else if (isError) {
      console.log("Error fetching user");
    } else if (isLoading) {
      console.log("Loading user...");
    }
  }, [data, isLoading, isError, isSuccess]);

  // -------------------------------------------------------------------------------------------------
  // handleLogout: লগআউট লজিক (Why, What, How)
  // -------------------------------------------------------------------------------------------------
  const handleLogout = async () => {
    try {
      // 1. সার্ভারে লগআউট রিকোয়েস্ট পাঠানো (Mutation Execute)
      // .unwrap() ব্যবহার করা হয়েছে কারণ এটি সফল প্রতিক্রিয়া (resolve) অথবা এরর (reject)
      // সরাসরি প্রদান করে, যা async/await ব্লকে ত্রুটি পরিচালনা (error handling) সহজ করে।
      const result = await logout(undefined).unwrap();
      // 2. সফল লগআউট হলে প্রতিক্রিয়া এবং UI আপডেট
      if (result.success) {
        console.log(result.message);
        // ব্যবহারকারীকে একটি সুন্দর নোটিফিকেশন দেখানো।
        toast.success(result.message || "user logout successfully");
        // 3. 🚨 সবচেয়ে গুরুত্বপূর্ণ ধাপ: RTK Query ক্যাশে রিসেট 🚨
        // কেন প্রয়োজন?
        // - `useGetMeOrGetUserInfoQuery` ডেটা ক্যাশ করে রাখে।
        // - লগআউটের পর, এই ক্যাশ করা ডেটা পুরাতন (Stale) হয়ে যায় এবং এটি ক্যাশ থেকে মুছে ফেলা/অকার্যকর (Invalidate) করা উচিত।
        // - সাধারণত `invalidatesTags` ব্যবহার করা হয়, কিন্তু কিছু ক্ষেত্রে, যেমন অথেনটিকেশন পরিবর্তনের সময়,
        //   API state সম্পূর্ণরূপে রিসেট করা সবচেয়ে নিরাপদ পদ্ধতি।
        // - এটি নিশ্চিত করে যে:
        //   ক) সমস্ত ক্যাশ করা ডেটা মুছে গেছে।
        //   খ) সমস্ত চলমান বা স্থগিত (pending) রিকোয়েস্ট বাতিল হয়েছে।
        //   গ) `useGetMeOrGetUserInfoQuery` স্বয়ংক্রিয়ভাবে পুনরায় রান হবে (Re-fetch),
        //      এবং সার্ভার থেকে কোনো ইউজার ডেটা না পাওয়ায় `isSuccess` থেকে `isError` বা `data` হিসেবে `null` সেট হবে।
        //      ফলে তাৎক্ষণিকভাবে লগআউট বোতামটি লগইন বোতামে পরিবর্তিত হবে।
        dispatch(authApi.util.resetApiState());
        dispatch(authApi.util.resetApiState());
      }
      navigate("/login");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error.data?.message || "something went wrong");
    }
  };
  // ------login-logout button -------

  // Desktop Auth Button
  const DesktopAuthButton = () => {
    // 1. লোডিং স্টেট: যখন ব্যবহারকারীর ডেটা ফেচ হচ্ছে, তখন একটি অক্ষম (disabled) লোডিং বোতাম দেখানো।
    if (isLoading) return <Button disabled>Loading...</Button>;

    // 2. লগড-ইন স্টেট: যদি সফলভাবে ডেটা পাওয়া যায় এবং ব্যবহারকারীর ইমেল থাকে (যা লগইন নিশ্চিত করে),
    //    তাহলে লগআউট বোতাম দেখানো হবে।
    if (isSuccess && data?.data.email) {
      return (
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      );
    }
    // 3. লগড-আউট স্টেট: অন্যথায় (লগইন করা না থাকলে), লগইন বোতাম দেখানো হবে।
    return (
      <Button>
        <Link to="/login" className="flex items-center justify-center">
          <LogIn className="mr-1 h-4 w-4" />
          Login
        </Link>
      </Button>
    );
  };

  // Mobile Auth Button
  const MobileAuthButton = () => {
    if (isLoading)
      return (
        <Button disabled className="w-full">
          Loading...
        </Button>
      );
    if (isSuccess && data?.data.email) {
      return (
        <div className="flex flex-col gap-2">
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
          <Button className="w-full">Get Started</Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        <Button className="w-full">
          <Link to="/login" className="flex items-center justify-center">
          <LogIn className="mr-1 h-4 w-4" />
          Login
        </Link>
        </Button>
        <Button className="w-full">Get Started</Button>
      </div>
    );
  };

  // -------------------------------------------------------------------------------------------------

  // useEffect: মোবাইল মেনু খোলার সময় বডির স্ক্রল ব্লক করা।
  // কেন? যাতে মেনু খোলা থাকা অবস্থায় পিছনের কন্টেন্ট স্ক্রল না করে, যা একটি ভালো UX (User Experience)।
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"; // স্ক্রল অক্ষম করা।
    } else {
      document.body.style.overflow = ""; // স্ক্রল পুনরায় সক্রিয় করা।
    }
    // ক্লিনআপ ফাংশন: কম্পোনেন্ট আনমাউন্ট হলে বা 'open' স্টেট পরিবর্তিত হলে স্ক্রল পুনর্বহাল করা।
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // -----------start----my navigation menu link-----------
  // ডেক্সটপ মেনুর জন্য সাধারণ লিঙ্কগুলি।
  const myLinks = (
    <>
      <NavigationMenuLink className="px-4" asChild>
        <Link to={"/"} className="hover:bg-accent rounded-md p-2">
          Home
        </Link>
      </NavigationMenuLink>
      <NavigationMenuLink className="px-4" asChild>
        <Link to={"/about"} className="hover:bg-accent rounded-md p-2">
          About
        </Link>
      </NavigationMenuLink>
    </>
  );
  // -----------end----my navigation menu link-----------

  return (
    <header
      className={cn("sticky top-0 z-50 w-full border-b border-transparent", {
        // যখন স্ক্রল হয়, তখন হেডারকে একটি স্বচ্ছ ব্যাকগ্রাউন্ড (backdrop-blur) এবং বর্ডার দেওয়া।
        // এটি হেডারকে কন্টেন্টের উপরে ভাসমান এবং দৃষ্টিনন্দন করে তোলে।
        "bg-background/60 supports-[backdrop-filter]:bg-background/50 border-border backdrop-blur-lg":
          scrolled,
      })}
    >
      <nav className="mx-auto flex h-14 w-full max-w-7xl border-2 items-center justify-between px-4">
        <div className="flex items-center gap-5">
          <Link to="/" className="hover:bg-accent rounded-md p-2">
            {/* <WordmarkIcon className="h-4" /> */}
            <Logo />
          </Link>
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">
                  Product
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-background p-1 pr-1.5">
                  <ul className="bg-popover grid w-lg grid-cols-2 gap-2 rounded-md border p-2 shadow">
                    {productLinks.map((item, i) => (
                      <li key={i}>
                        <ListItem {...item} />
                      </li>
                    ))}
                  </ul>
                  {/* কন্টেন্ট এলাকার নিচে একটি অতিরিক্ত CTA (Call to Action) */}
                  <div className="p-2">
                    <p className="text-muted-foreground text-sm">
                      Interested?
                      <Link
                        to="#"
                        className="text-foreground font-medium hover:underline"
                      >
                        Schedule a demo
                      </Link>
                    </p>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">
                  Company
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-background p-1 pr-1.5 pb-1.5">
                  {/* মেনুর ভেতরের কন্টেন্টকে দুটি কলামে ভাগ করা */}
                  <div className="grid w-lg grid-cols-2 gap-2">
                    {/* কলাম ১: বিস্তারিত ListItem সহ */}
                    <ul className="bg-popover space-y-2 rounded-md border p-2 shadow">
                      {companyLinks.map((item, i) => (
                        <li key={i}>
                          <ListItem {...item} />
                        </li>
                      ))}
                    </ul>
                    {/* কলাম ২: আইকন সহ সাধারণ লিঙ্ক (কম্প্যাক্ট ভিউ) */}
                    <ul className="space-y-2 p-3">
                      {companyLinks2.map((item, i) => (
                        <li key={i}>
                          <NavigationMenuLink
                            href={item.href}
                            className="flex p-2 hover:bg-accent flex-row rounded-md items-center gap-x-2"
                          >
                            <item.icon className="text-foreground size-4" />
                            <span className="font-medium">{item.title}</span>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {myLinks}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        {/* Desktop Auth Buttons এবং Theme Toggler (Hidden MD) */}
        <div className="hidden items-center gap-2 md:flex">
          <DesktopAuthButton />
          {/* 💡 লগইন/লগআউট বোতামের কন্ডিশনাল রেন্ডারিং */}
          <AnimatedThemeToggler />
        </div>

        {/* Mobile Menu Toggler এবং Theme Toggler (MD-এর চেয়ে ছোট স্ক্রিনের জন্য) */}
        <div className="  md:hidden space-x-1.5  flex justify-center items-center">
          <AnimatedThemeToggler />
          <Button
            size="icon"
            variant="outline"
            onClick={() => setOpen(!open)}
            className="md:hidden"
            // অ্যাক্সেসিবিলিটির জন্য ARIA অ্যাট্রিবিউট ব্যবহার করা হয়েছে:
            aria-expanded={open} // স্ক্রিন রিডারকে জানায় মেনুটি খোলা আছে কিনা।
            aria-controls="mobile-menu" // স্ক্রিন রিডারকে জানায় কোন এলিমেন্টটিকে নিয়ন্ত্রণ করছে।
            aria-label="Toggle menu"
          >
            <MenuToggleIcon open={open} className="size-5" duration={300} />
          </Button>
        </div>
      </nav>
      {/* Mobile Menu Component */}
      <MobileMenu
        open={open}
        className="flex flex-col justify-between gap-2 overflow-y-auto"
      >
        <NavigationMenu className="max-w-full">
          <div className="flex w-full flex-col gap-y-2">
            {/* ----start-my custom route----- */}
            {/* মোবাইল মেনুতে কুইক লিঙ্ক, প্রোডাক্ট এবং কোম্পানির লিঙ্কগুলি দেখানো */}

            <span className="text-sm ">Quick Links</span>
            {QuickLinks.map((link) => (
              <ListItem key={link.title} {...link} />
            ))}
            {/* -----end---my custom route----- */}
            <span className="text-sm ">Product</span>
            {productLinks.map((link) => (
              <ListItem key={link.title} {...link} />
            ))}
            <span className="text-sm">Company</span>
            {companyLinks.map((link) => (
              <ListItem key={link.title} {...link} />
            ))}
            {companyLinks2.map((link) => (
              <ListItem key={link.title} {...link} />
            ))}
          </div>
        </NavigationMenu>
        {/* Mobile Auth Buttons */}
        <div>
          <MobileAuthButton /> {/* 💡 মোবাইল মেনুর জন্য কন্ডিশনাল রেন্ডারিং */}
        </div>
      </MobileMenu>
    </header>
  );
}

// =================================================================================================
// MobileMenu Component: মোবাইল মেনুকে পোর্টালে রেন্ডার করা
// =================================================================================================
type MobileMenuProps = React.ComponentProps<"div"> & {
  open: boolean;
};
function MobileMenu({ open, children, className, ...props }: MobileMenuProps) {
  // শর্তসাপেক্ষে রেন্ডারিং: যদি মেনু বন্ধ থাকে অথবা সার্ভার-সাইড রেন্ডারিং (SSR) হয়, তবে কিছুই রেন্ডার হবে না।
  if (!open || typeof window === "undefined") return null;
  // Why createPortal?
  // - পোর্টালে রেন্ডার করলে কম্পোনেন্টটি DOM-এর `document.body`-এর রুট লেভেলে চলে যায়।
  // - এটি নিশ্চিত করে যে মেনুটি হেডার বা অন্যান্য স্টাইলিং কন্টেইনারের দ্বারা প্রভাবিত হবে না।
  // - `fixed` পজিশনিং এবং উচ্চ `z-index` (z-40) সঠিকভাবে কাজ করার জন্য এটি সেরা অভ্যাস।
  return createPortal(
    <div
      id="mobile-menu"
      className={cn(
        // ব্যাকড্রপ ইফেক্ট: মেনুর পিছনের কন্টেন্টকে সামান্য অস্পষ্ট করে (blur) একটি আধুনিক লুক দেয়।
        "bg-background/95  supports-[backdrop-filter]:bg-background/50 backdrop-blur-lg",
        // মেনুর পজিশনিং এবং লেআউট
        "fixed top-14 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-y md:hidden  "
      )}
    >
      <div
        data-slot={open ? "open" : "closed"}
        // Tailwind/Radix Animation: মেনু খোলার সময় একটি সুন্দর জুম-ইন অ্যানিমেশন যোগ করা হয়েছে।
        className={cn(
          "data-[slot=open]:animate-in  data-[slot=open]:zoom-in-97 ease-out",
          "size-full p-4",
          className
        )}
        {...props}
      >
        <div className="">
          {/* {myLinks} */}
          {children} {/* মেনুর ভিতরের কন্টেন্ট */}
        </div>
      </div>
    </div>,
    document.body // DOM-এর বডিতে রেন্ডার করা হচ্ছে।
  );
}
// =================================================================================================
// ListItem Component: ড্রপডাউন এবং মোবাইল মেনুর আইটেম
// =================================================================================================

function ListItem({
  title,
  description,
  icon: Icon,
  className,
  href,
  ...props
}: React.ComponentProps<typeof NavigationMenuLink> & LinkItem) {
  return (
    // `asChild` prop: `NavigationMenuLink`-কে তার চাইল্ড কম্পোনেন্ট (`Link`) হিসেবে
    // সমস্ত props এবং ref পাস করার অনুমতি দেয়, যা স্টাইলিং এবং কার্যকারিতা বজায় রাখে।
    <NavigationMenuLink
      className={cn(
        // Hover এবং Focus স্টাইল: মাউস নিয়ে গেলে বা ফোকাস করলে UI প্রতিক্রিয়াশীল হয়।
        "w-full flex flex-row gap-x-2 data-[active=true]:focus:bg-accent data-[active=true]:hover:bg-accent data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground rounded-sm p-2",
        className
      )}
      {...props}
      asChild
    >
      <Link to={href}>
        {/* আইকন কন্টেইনার: সুসংগঠিত চেহারা এবং ফোকাস/হভার থেকে আইকনকে আলাদা রাখতে ব্যবহৃত। */}
        <div className="bg-background/40 flex aspect-square size-12 items-center justify-center rounded-md border shadow-sm">
          <Icon className="text-foreground size-5" />
        </div>
        <div className="flex flex-col items-start justify-center">
          <span className="font-medium">{title}</span>
          <span className="text-muted-foreground text-xs">{description}</span>
        </div>
      </Link>
    </NavigationMenuLink>
  );
}
// =================================================================================================
// Static Link Data
// =================================================================================================
// ---------my custom --------------
const QuickLinks: LinkItem[] = [
  // ... (Data remains the same)
  {
    title: "Home",
    href: "/",
    // description: "Create responsive websites with ease",
    icon: HomeIcon,
  },
  {
    title: "About",
    href: "/about",
    // description: "Create responsive websites with ease",
    icon: BadgeInfo,
  },
];
// ---------my custom --------------

const productLinks: LinkItem[] = [
  {
    title: "Website Builder",
    href: "#",
    description: "Create responsive websites with ease",
    icon: GlobeIcon,
  },
  {
    title: "Cloud Platform",
    href: "#",
    description: "Deploy and scale apps in the cloud",
    icon: LayersIcon,
  },
  {
    title: "Team Collaboration",
    href: "#",
    description: "Tools to help your teams work better together",
    icon: UserPlusIcon,
  },
  {
    title: "Analytics",
    href: "#",
    description: "Track and analyze your website traffic",
    icon: BarChart,
  },
  {
    title: "Integrations",
    href: "#",
    description: "Connect your apps and services",
    icon: PlugIcon,
  },
  {
    title: "API",
    href: "#",
    description: "Build custom integrations with our API",
    icon: CodeIcon,
  },
  // ... other product links
];

const companyLinks: LinkItem[] = [
  {
    title: "About Us",
    href: "#",
    description: "Learn more about our story and team",
    icon: Users,
  },
  {
    title: "Customer Stories",
    href: "#",
    description: "See how we’ve helped our clients succeed",
    icon: Star,
  },
  {
    title: "Partnerships",
    href: "#",
    icon: Handshake,
    description: "Collaborate with us for mutual growth",
  },
];

const companyLinks2: LinkItem[] = [
  {
    title: "Terms of Service",
    href: "#",
    icon: FileText,
  },
  {
    title: "Privacy Policy",
    href: "#",
    icon: Shield,
  },
  {
    title: "Refund Policy",
    href: "#",
    icon: RotateCcw,
  },
  {
    title: "Blog",
    href: "#",
    icon: Leaf,
  },
  {
    title: "Help Center",
    href: "#",
    icon: HelpCircle,
  },
];
// =================================================================================================
// useScroll Hook: স্ক্রল ট্র্যাকিং
// =================================================================================================
function useScroll(threshold: number) {
  // State: স্ক্রল থ্রেশহোল্ড অতিক্রম করেছে কিনা তা ট্র্যাক করে।
  const [scrolled, setScrolled] = React.useState(false);
  // useCallback: স্ক্রল ইভেন্ট হ্যান্ডলার ফাংশন। এটি মেমোয়াইজড (Memoized),
  // তাই অপ্রয়োজনীয় রেন্ডারিং এড়ানো যায়।
  const onScroll = React.useCallback(() => {
    setScrolled(window.scrollY > threshold);
  }, [threshold]);

  // useEffect (ইভেন্ট লিসেনার): কম্পোনেন্ট মাউন্ট হওয়ার সময় `scroll` ইভেন্ট লিসেনার যোগ করা।
  React.useEffect(() => {
    window.addEventListener("scroll", onScroll);
    // ক্লিনআপ ফাংশন: কম্পোনেন্ট আনমাউন্ট হওয়ার সময় ইভেন্ট লিসেনার সরিয়ে ফেলা।
    // কেন? এটি মেমরি লিক (Memory Leak) প্রতিরোধ করে।
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  // also check on first load
  // useEffect (ইনিশিয়াল চেক): প্রথম লোডের সময় একবার চেক করা, যাতে যদি পেজটি লোড হওয়ার
  // সাথে সাথেই স্ক্রল করা থাকে তবে হেডারটি তাৎক্ষণিকভাবে সঠিক স্টাইল পায়।
  React.useEffect(() => {
    onScroll();
  }, [onScroll]);

  return scrolled; // স্ক্রলের অবস্থা ফেরত দেয়, যা হেডারকে শর্তসাপেক্ষে স্টাইল করতে ব্যবহৃত হয়।
}

// const WordmarkIcon = (props: React.ComponentProps<"svg">) => (
//   <svg viewBox="0 0 84 24" fill="currentColor" {...props}>
//     <path d="M45.035 23.984c-1.34-.062-2.566-.441-3.777-1.16-1.938-1.152-3.465-3.187-4.02-5.36-.199-.784-.238-1.128-.234-2.058 0-.691.008-.87.062-1.207.23-1.5.852-2.883 1.852-4.144.297-.371 1.023-1.09 1.41-1.387 1.399-1.082 2.84-1.68 4.406-1.816.536-.047 1.528-.02 2.047.054 1.227.184 2.227.543 3.106 1.121 1.277.84 2.5 2.184 3.367 3.7.098.168.172.308.172.312-.004 0-1.047.723-2.32 1.598l-2.711 1.867c-.61.422-2.91 2.008-2.993 2.062l-.074.047-1-1.574c-.55-.867-1.008-1.594-1.012-1.61-.007-.019.922-.648 2.188-1.476 1.215-.793 2.2-1.453 2.191-1.46-.02-.032-.508-.27-.691-.34a5 5 0 0 0-.465-.13c-.371-.09-1.105-.125-1.426-.07-1.285.219-2.336 1.3-2.777 2.852-.215.761-.242 1.636-.074 2.355.129.527.383 1.102.691 1.543.234.332.727.82 1.047 1.031.664.434 1.195.586 1.969.555.613-.023 1.027-.129 1.64-.426 1.184-.574 2.16-1.554 2.828-2.843.122-.235.208-.372.227-.368.082.032 3.77 1.938 3.79 1.961.034.032-.407.93-.696 1.414a12 12 0 0 1-1.051 1.477c-.36.422-1.102 1.14-1.492 1.445a9.9 9.9 0 0 1-3.23 1.684 9.2 9.2 0 0 1-2.95.351M74.441 23.996c-1.488-.043-2.8-.363-4.066-.992-1.687-.848-2.992-2.14-3.793-3.774-.605-1.234-.863-2.402-.863-3.894.004-1.149.176-2.156.527-3.11.14-.378.531-1.171.75-1.515 1.078-1.703 2.758-2.934 4.805-3.524.847-.242 1.465-.332 2.433-.351 1.032-.024 1.743.055 2.48.277l.31.09.007 2.48c.004 1.364 0 2.481-.008 2.481a1 1 0 0 1-.12-.055c-.688-.347-2.09-.488-2.962-.296-.754.167-1.296.453-1.785.945a3.7 3.7 0 0 0-1.043 2.11c-.047.382-.02 1.109.055 1.437a3.4 3.4 0 0 0 .941 1.738c.75.75 1.715 1.102 2.875 1.05.645-.03 1.118-.14 1.563-.366q1.721-.864 2.02-3.145c.035-.293.042-1.266.042-7.957V0H84l-.012 8.434c-.008 7.851-.011 8.457-.054 8.757-.196 1.274-.586 2.25-1.301 3.243-1.293 1.808-3.555 3.07-6.145 3.437-.664.098-1.43.14-2.047.125M9.848 23.574a14 14 0 0 1-1.137-.152c-2.352-.426-4.555-1.781-6.117-3.774-.27-.335-.75-1.05-.95-1.406-1.156-2.047-1.695-4.27-1.64-6.77.047-1.995.43-3.66 1.23-5.316.524-1.086 1.04-1.87 1.793-2.715C4.567 1.72 6.652.535 8.793.171 9.68.02 10.093 0 12.297 0h1.789v5.441l-.961.016c-2.36.04-3.441.215-4.441.719-.836.414-1.278.879-1.895 1.976-.219.399-.535 1.02-.535 1.063 0 .02 1.285.027 3.918.027h3.914v5.113h-3.914c-2.54 0-3.918.008-3.918.028 0 .05.254.597.441.953.344.656.649 1.086 1.051 1.48.668.657 1.356.985 2.445 1.16.645.106 1.274.145 2.61.16l1.285.016v5.442l-2.055-.004a120 120 0 0 1-2.183-.016M16.469 14.715c0-5.504.011-9.04.031-9.29a5.54 5.54 0 0 1 1.527-3.48c.778-.82 1.922-1.457 3.118-1.734C21.915.035 22.422 0 24.39 0h1.652v4.914h-1.426c-1.324 0-1.445.004-1.644.055-.739.191-1.059.699-1.106 1.754l-.015.355h4.191v4.914h-4.184v11.602h-5.39ZM27.023 14.727c0-5.223.012-9.04.028-9.278.129-1.98 1.234-3.68 3.012-4.62.87-.462 1.777-.716 2.851-.802A61 61 0 0 1 34.945 0h1.649v4.914h-1.426c-1.32 0-1.441.004-1.64.055-.739.191-1.063.699-1.106 1.754l-.02.355h4.192v4.914H32.41v11.602h-5.387ZM55.48 15.406V7.22h4.66v1.363c0 1.3.005 1.363.051 1.363.04 0 .075-.054.133-.203.38-.98.969-1.68 1.711-2.031.563-.266 1.422-.43 2.492-.48l.414-.02v4.914l-.414.035c-.738.063-1.597.195-2.058.313-.297.082-.688.28-.875.449-.324.289-.532.703-.625 1.254-.094.547-.098.879-.098 5.144v4.274h-5.39Zm0 0" />
//   </svg>
// );
