import React from "react";
import Link from "next/link";
import { hardhat } from "viem/chains";
import { CurrencyDollarIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/24/outline";
import { SwitchTheme } from "~~/components/SwitchTheme";
import { BuidlGuidlLogo } from "~~/components/assets/BuidlGuidlLogo";
import { Faucet } from "~~/components/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { useGlobalState } from "~~/services/store/store";

const platformLinks = [
  { label: "Home", href: "/" },
  { label: "Lending", href: "/lending" },
  { label: "Ekraf", href: "/ekraf" },
  { label: "Agen", href: "/agen" },
];

const companyLinks = [
  { label: "Kurator", href: "/kurator" },
  { label: "Pengrajin", href: "/pengrajin" },
  { label: "Admin", href: "/admin" },
];

const legalLinks = [
  { label: "Profile", href: "/profile" },
  { label: "Privacy Policy", href: "/" },
  { label: "Terms of Service", href: "/" },
];

const footerLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Lending",
    href: "/lending",
  },
  {
    label: "Profile",
    href: "/profile",
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

export const Footer = () => {
  const nativeCurrencyPrice = useGlobalState(state => state.nativeCurrency.price);
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;

  const goldGradientText = {
    background: "linear-gradient(90deg, #C48A04 0%, #E9A507 25%, #F2C14D 50%, #E9A507 75%, #C48A04 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  return (
    <div className="min-h-0">
      <footer
        className="w-full text-white border-t"
        style={{
          background: "linear-gradient(180deg, #3D2C88 0%, #0D0D0D 100%)",
          borderColor: "rgba(233, 165, 7, 0.3)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand Section */}
            <div>
              <h1
                className="text-3xl font-bold mb-4"
                style={{
                  fontFamily: "'Mileast', sans-serif",
                  whiteSpace: "pre-line",
                  lineHeight: "1.2",
                }}
              >
                Jejak{"\n"}Kriya
              </h1>
              <p className="text-white/70 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Memberdayakan pengrajin Indonesia melalui teknologi blockchain. Verifikasi keaslian karya seni dan
                kerajinan tradisional dengan NFT.
              </p>
            </div>

            {/* Platform Section */}
            <div>
              <h3
                className="font-bold text-lg mb-4"
                style={{ ...goldGradientText, fontFamily: "'Mileast', sans-serif" }}
              >
                Navigate
              </h3>
              <ul className="space-y-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {platformLinks.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-white/70 hover:text-white transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Section */}
            <div>
              <h3
                className="font-bold text-lg mb-4"
                style={{ ...goldGradientText, fontFamily: "'Mileast', sans-serif" }}
              >
                About
              </h3>
              <ul className="space-y-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {companyLinks.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-white/70 hover:text-white transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Section */}
            <div>
              <h3
                className="font-bold text-lg mb-4"
                style={{ ...goldGradientText, fontFamily: "'Mileast', sans-serif" }}
              >
                Follow Us
              </h3>
              <ul className="space-y-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {legalLinks.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-white/70 hover:text-white transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div
            className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
            style={{ borderColor: "rgba(233, 165, 7, 0.2)" }}
          >
            <p className="text-white/50 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
              © 2025 JejaKriya. All rights reserved.
            </p>

            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
