"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedStatProps {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  duration?: number; // Animation duration in ms
  className?: string;
  decimals?: number;
}

/**
 * Animated counter untuk stats
 * Usage: <AnimatedStat value={1247} label="Total NFTs" duration={2000} />
 */
export const AnimatedStat: React.FC<AnimatedStatProps> = ({
  value,
  label,
  prefix = "",
  suffix = "",
  duration = 2000,
  className = "",
  decimals = 0,
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    const currentRef = ref.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    let animationFrameId: number;
    const startValue = count; // Start from current count to avoid jumps
    const endValue = value;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function (easeOutExpo)
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      const currentValue = startValue + (endValue - startValue) * easedProgress;
      setCount(currentValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    // Cleanup function to cancel animation frame
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isVisible, value, duration]);

  return (
    <div ref={ref} className={`stat ${className}`}>
      <div className="stat-value text-primary">
        {prefix}
        {count.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        {suffix}
      </div>
      <div className="stat-title">{label}</div>
    </div>
  );
};

interface StatsGridProps {
  stats: Array<{
    value: number;
    label: string;
    prefix?: string;
    suffix?: string;
    icon?: React.ReactNode;
    color?: string;
  }>;
}

/**
 * Grid of animated stats
 */
export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
    <div className="stats stats-vertical lg:stats-horizontal shadow-xl w-full">
      {stats.map((stat, index) => (
        <div key={index} className={`stat ${stat.color || ""}`}>
          {stat.icon && <div className="stat-figure text-primary">{stat.icon}</div>}
          <AnimatedStat
            value={stat.value}
            label={stat.label}
            prefix={stat.prefix}
            suffix={stat.suffix}
            duration={2000 + index * 200}
          />
        </div>
      ))}
    </div>
  );
};
