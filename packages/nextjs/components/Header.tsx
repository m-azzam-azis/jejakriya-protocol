"use client";

import React, { useRef } from "react";
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
    label: "Pemilik",
    href: "/pemilik",
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
                isActive ? "bg-white/20 text-white" : "text-white"
              } hover:bg-white/10 focus:!bg-white/20 active:!text-white py-2.5 px-5 text-lg rounded-full transition-colors duration-200 font-normal`}
              style={{ fontFamily: "'Poppins', sans-serif" }}
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

  useOutsideClick(burgerMenuRef, () => {
    burgerMenuRef?.current?.removeAttribute("open");
  });

  return (
    <div
      className="sticky lg:static top-0 navbar min-h-[96px] shrink-0 z-20 shadow-lg px-4 sm:px-6"
      style={{
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: "#3D2C88",
      }}
    >
      {/* Left side - Logo placeholder */}
      <div className="navbar-start w-auto lg:w-1/4">
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

        {/* Logo as a direct interactive image (no wrapper) */}
        <Image
          src="/logo.png"
          alt="JejakKriya logo"
          width={64}
          height={64}
          className="w-16 h-16 bg-white/20 rounded-lg object-contain cursor-pointer"
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
