import { useState } from "react";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";

interface LoanCalculatorProps {
  nftValue: number; // in ETH
  maxLTV?: number; // default 30%
  onBorrow?: (amount: number) => void;
}

export const LoanCalculator = ({ nftValue, maxLTV = 30, onBorrow }: LoanCalculatorProps) => {
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const maxLoan = (nftValue * maxLTV) / 100;

  const calculateLTV = () => {
    if (nftValue === 0) return 0;
    return ((loanAmount / nftValue) * 100).toFixed(2);
  };

  const calculateInterest = () => {
    // Example: 5% annual interest
    const annualRate = 0.05;
    return (loanAmount * annualRate).toFixed(4);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoanAmount(parseFloat(e.target.value));
  };

  const handleBorrow = () => {
    if (onBorrow && loanAmount > 0) {
      onBorrow(loanAmount);
    }
  };

  return (
    <div className="card bg-base-100/10 shadow-xl">
      <div className="card-body">
        <h3 className="card-title flex items-center gap-2">
          <CurrencyDollarIcon className="h-6 w-6" />
          Kalkulator Pinjaman
        </h3>

        <div className="space-y-6 mt-4">
          {/* NFT Value */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-base-content/70">Nilai NFT</span>
            <span className="font-bold text-lg">{nftValue} ETH</span>
          </div>

          {/* Max Loan */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-base-content/70">Pinjaman Maksimal ({maxLTV}% LTV)</span>
            <span className="font-bold text-primary">{maxLoan.toFixed(4)} ETH</span>
          </div>

          <div className="divider"></div>

          {/* Loan Amount Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold">Jumlah Pinjaman</label>
              <span className="text-lg font-bold text-secondary">{loanAmount.toFixed(4)} ETH</span>
            </div>

            <input
              type="range"
              min="0"
              max={maxLoan}
              step="0.01"
              value={loanAmount}
              onChange={handleSliderChange}
              className="range range-secondary"
            />

            <div className="flex justify-between text-xs text-base-content/60 mt-1">
              <span>0 ETH</span>
              <span>{maxLoan.toFixed(2)} ETH</span>
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-2">
            <button className="btn btn-sm btn-outline" onClick={() => setLoanAmount(maxLoan * 0.25)}>
              25%
            </button>
            <button className="btn btn-sm btn-outline" onClick={() => setLoanAmount(maxLoan * 0.5)}>
              50%
            </button>
            <button className="btn btn-sm btn-outline" onClick={() => setLoanAmount(maxLoan * 0.75)}>
              75%
            </button>
            <button className="btn btn-sm btn-outline" onClick={() => setLoanAmount(maxLoan)}>
              Max
            </button>
          </div>

          <div className="divider"></div>

          {/* Loan Stats */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-base-content/70">LTV Ratio</span>
              <div className="flex items-center gap-2">
                <progress className="progress progress-primary w-20" value={calculateLTV()} max="100"></progress>
                <span className="font-semibold">{calculateLTV()}%</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-base-content/70">Bunga (5% APY)</span>
              <span className="font-semibold">{calculateInterest()} ETH/tahun</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-base-content/70">Total Bayar (1 tahun)</span>
              <span className="font-bold text-lg">{(loanAmount + parseFloat(calculateInterest())).toFixed(4)} ETH</span>
            </div>
          </div>

          {/* Info Alert */}
          <div className="alert alert-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <div className="text-xs">
              <p className="font-semibold">NFT Anda akan dikunci sebagai jaminan</p>
              <p>Lunasi pinjaman untuk membuka kembali NFT</p>
            </div>
          </div>

          {/* Action Button */}
          <button className="btn btn-primary btn-block gap-2" disabled={loanAmount === 0} onClick={handleBorrow}>
            <CurrencyDollarIcon className="h-5 w-5" />
            Ajukan Pinjaman {loanAmount.toFixed(4)} ETH
          </button>

          <p className="text-xs text-center text-base-content/60">
            Transaksi akan memerlukan approval dari wallet Anda
          </p>
        </div>
      </div>
    </div>
  );
};
