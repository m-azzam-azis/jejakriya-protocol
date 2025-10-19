"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

interface QRCodeGeneratorProps {
  value: string; // URL atau data untuk QR code
  size?: number;
  className?: string;
  downloadable?: boolean;
}

/**
 * Component untuk generate QR Code
 * Usage: <QRCodeGenerator value="https://jejakriya.id/nft/123" />
 */
export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  value,
  size = 256,
  className = "",
  downloadable = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerated, setIsGenerated] = useState(false);

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(
        canvasRef.current,
        value,
        {
          width: size,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        },
        error => {
          if (error) {
            console.error("QR Code generation error:", error);
          } else {
            setIsGenerated(true);
          }
        },
      );
    }
  }, [value, size]);

  const handleDownload = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = `qrcode-${Date.now()}.png`;
      link.click();
    }
  };

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <canvas ref={canvasRef} className="rounded-lg shadow-lg border-4 border-base-200" />
      {isGenerated && downloadable && (
        <button onClick={handleDownload} className="btn btn-sm btn-outline gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download QR Code
        </button>
      )}
    </div>
  );
};
