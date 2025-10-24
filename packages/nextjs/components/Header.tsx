"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { hardhat } from "viem/chains";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick, useTargetNetwork } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Lending",
    href: "/lending",
  },
  {
    label: "Ekraf",
    href: "/ekraf",
  },
  {
    label: "Agen",
    href: "/agen",
  },
  {
    label: "Kurator",
    href: "/kurator",
  },
  {
    label: "Pengrajin",
    href: "/pengrajin",
  },
  {
    label: "Admin",
    href: "/admin",
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();
  return (
    <>
      {menuLinks.map(({ label, href }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive ? "text-black font-medium" : "text-white"
              } hover:bg-white/10 focus:!bg-white/20 active:!text-white py-2 px-4 text-sm rounded-full transition-colors duration-200 font-normal`}
              style={{
                fontFamily: "'Poppins', sans-serif",
                ...(isActive && {
                  background: "linear-gradient(90deg, #C48A04 0%, #E9A507 25%, #F2C14D 50%, #E9A507 75%, #C48A04 100%)",
                }),
              }}
            >
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;
  const burgerMenuRef = useRef<HTMLDetailsElement>(null);
  const router = useRouter();

  // State untuk mengontrol show/hide header
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useOutsideClick(burgerMenuRef, () => {
    burgerMenuRef?.current?.removeAttribute("open");
  });

  // Effect untuk handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 100) {
        // Di atas halaman, selalu tampilkan header
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scroll ke bawah - sembunyikan header
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scroll ke atas - tampilkan header
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    // Throttle scroll event untuk performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttledScroll);
    };
  }, [lastScrollY]);

  return (
    <div
      className={`fixed top-0 left-0 right-0 navbar min-h-[96px] shrink-0 z-50 shadow-lg px-4 sm:px-6 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: "#3D2C88",
      }}
    >
      {/* Left side - Logo only */}
      <div className="navbar-start">
        <details className="dropdown" ref={burgerMenuRef}>
          <summary className="ml-1 btn btn-ghost lg:hidden hover:bg-white/10 border-none py-4">
            <Bars3Icon className="h-8 w-8 text-white" />
          </summary>
          <ul
            className="menu menu-compact dropdown-content mt-3 p-2 shadow-lg rounded-box w-52"
            style={{ backgroundColor: "#3D2C88" }}
            onClick={() => {
              burgerMenuRef?.current?.removeAttribute("open");
            }}
          >
            <HeaderMenuLinks />
          </ul>
        </details>

        {/* Logo directly without container */}
        <Image
          src="/logo.png"
          alt="JejakKriya logo"
          width={64}
          height={64}
          className="w-16 h-16 cursor-pointer"
          priority
          role="button"
          tabIndex={0}
          onClick={() => router.push("/")}
          onKeyDown={e => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              router.push("/");
            }
          }}
        />
      </div>

      {/* Center - Navigation menu */}
      <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2">
        <ul className="menu menu-horizontal px-1 gap-2">
          <HeaderMenuLinks />
        </ul>
      </div>

      {/* Right side - Wallet info */}
      <div className="navbar-end flex gap-2 ml-auto">
        <RainbowKitCustomConnectButton />
        {isLocalNetwork && <FaucetButton />}
      </div>
    </div>
  );
};