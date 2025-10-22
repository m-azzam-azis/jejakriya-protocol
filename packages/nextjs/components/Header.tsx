"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { hardhat } from "viem/chains";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick, useTargetNetwork } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href?: string;
  children?: HeaderMenuLink[];
};

export const menuLinks: HeaderMenuLink[] = [
  { label: "Home", href: "/" },
  {
    label: "Agen",
    href: "/agen",
    children: [
      { label: "Beranda", href: "/agen" },
      { label: "Daftar Pengrajin", href: "/agen/pengrajin" },
      { label: "Ajukan Produk Baru", href: "/agen/produk-baru" },
    ],
  },
  {
    label: "Kurator",
    href: "/kurator",
    children: [
      { label: "Beranda", href: "/kurator" },
      { label: "Review Produk", href: "/kurator/review" },
    ],
  },
  {
    label: "Pengrajin",
    href: "/pengrajin",
    children: [
      { label: "Onboarding", href: "/pengrajin/onboarding" },
      { label: "Beranda", href: "/pengrajin/" },
      { label: "Katalog", href: "/pengrajin/katalog" },
      { label: "Aset Saya", href: "/pengrajin/aset-saya" },
    ],
  },
  { label: "Pemilik", href: "/pemilik" },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const parts = pathname ? pathname.split('/').filter(Boolean) : [];
  const isPengrajinDetail = parts[0] === 'pengrajin' && parts.length >= 2 && !['beranda', 'katalog', 'aset-saya', 'onboarding'].includes(parts[1]);

  return (
    <>
      {menuLinks.map((link) => {
        // Check if current path starts with the link's base path
        const isActive = link.href && pathname.startsWith(link.href);

        // If we're on a pengrajin detail page, render single link
        if (link.label === 'Pengrajin' && isPengrajinDetail) {
          return (
            <li key={link.label}>
              <Link
                href="/pengrajin/beranda"
                className={`text-white hover:bg-white/10 py-2.5 px-5 text-sm rounded-full transition-colors duration-200 font-normal`}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <span>{link.label}</span>
              </Link>
            </li>
          );
        }

        // If there are children, render a dropdown
        if (link.children && link.children.length > 0) {
          const isOpen = openDropdown === link.label;
          
          return (
            <li key={link.label} className="relative">
              <button
                className={`${isActive ? "bg-white/20 text-white" : "text-white"} hover:bg-white/10 focus:!bg-white/20 active:!text-white py-2.5 px-5 text-sm rounded-full transition-colors duration-200 font-normal flex items-center gap-2`}
                style={{ fontFamily: "'Poppins', sans-serif" }}
                onClick={() => setOpenDropdown(isOpen ? null : link.label)}
              >
                {link.label}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isOpen && (
                <ul className="absolute top-full left-0 mt-2 p-2 bg-[#3D2C88] rounded-box shadow-lg min-w-[200px] z-50">
                  {link.children.map((c) => (
                    <li key={c.href}>
                      <Link
                        href={c.href || "#"}
                        className={`text-white block py-2 px-4 rounded hover:bg-white/10 text-sm whitespace-nowrap`}
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                        onClick={() => setOpenDropdown(null)}
                      >
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        }

        return (
          <li key={link.href || link.label}>
            <Link
              href={link.href || "#"}
              className={`${isActive ? "bg-white/20 text-white" : "text-white"} hover:bg-white/10 focus:!bg-white/20 active:!text-white py-2.5 px-5 text-sm rounded-full transition-colors duration-200 font-normal`}
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <span>{link.label}</span>
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
      {/* Left side - Logo */}
      <div className="navbar-start w-auto lg:w-1/4 flex items-center gap-4">
        <details className="dropdown" ref={burgerMenuRef}>
          <summary className="btn btn-ghost lg:hidden hover:bg-white/10 border-none p-2">
            <Bars3Icon className="h-6 w-6 text-white" />
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

        <div 
          className="cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Image
            src="/logo.png"
            alt="JejakKriya logo"
            width={64}
            height={64}
            className="w-16 h-16 object-contain"
            priority
          />
        </div>
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