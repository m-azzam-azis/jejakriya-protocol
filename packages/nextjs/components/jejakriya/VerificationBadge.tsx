import { ShieldCheckIcon } from "@heroicons/react/24/solid";

interface VerificationBadgeProps {
  status: "verified" | "pending" | "rejected";
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export const VerificationBadge = ({ status, size = "md", showText = true }: VerificationBadgeProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const badgeClasses = {
    sm: "badge-sm",
    md: "badge-md",
    lg: "badge-lg",
  };

  const getStatusConfig = () => {
    switch (status) {
      case "verified":
        return {
          color: "badge-success",
          icon: <ShieldCheckIcon className={sizeClasses[size]} />,
          text: "Terverifikasi",
        };
      case "pending":
        return {
          color: "badge-warning",
          icon: <ShieldCheckIcon className={sizeClasses[size]} />,
          text: "Menunggu Verifikasi",
        };
      case "rejected":
        return {
          color: "badge-error",
          icon: <ShieldCheckIcon className={sizeClasses[size]} />,
          text: "Ditolak",
        };
    }
  };

  const config = getStatusConfig();

  if (!showText) {
    return <div className={`badge ${config.color} ${badgeClasses[size]} gap-1`}>{config.icon}</div>;
  }

  return (
    <div className={`badge ${config.color} ${badgeClasses[size]} gap-2`}>
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
};
