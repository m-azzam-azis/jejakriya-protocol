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

  return (
    <div className="min-h-0">
      <footer style={{ backgroundColor: "#3D2C88" }} className="w-full text-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Kolom 1 - Logo Jejak Kriya (1/3) */}
            <div className="w-full md:w-1/3 mb-4 md:mb-0">
              <h1
                className="text-3xl font-bold text-center md:text-left"
                style={{
                  fontFamily: "'Mileast', sans-serif",
                  whiteSpace: "pre-line",
                  lineHeight: "1.2",
                }}
              >
                Jejak{"\n"}Kriya
              </h1>
            </div>

            {/* Kolom 2 - Navigation Links (2/3) */}
            <div className="w-full md:w-2/3">
              <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6">
                {footerLinks.map((link, index) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-white/80 hover:text-white transition-colors duration-200 font-medium text-sm md:text-base"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};