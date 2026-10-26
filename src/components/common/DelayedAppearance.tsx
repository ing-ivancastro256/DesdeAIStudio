import React, { useEffect, useState } from 'react';

interface DelayedAppearanceProps {
  delayMinutes?: number;
  delaySeconds?: number;
  active: boolean; // true in preview mode and public view; false in editor mode
  resetTrigger?: any; // triggers re-render of timer when updated
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * DelayedAppearance:
 * Delays mounting / rendering of its children by (delayMinutes * 60 + delaySeconds) seconds.
 * When active is false (canvas builder mode), it renders children immediately without any delay
 * or wrapper changes so editing is always responsive and accessible.
 */
export const DelayedAppearance: React.FC<DelayedAppearanceProps> = ({
  delayMinutes = 0,
  delaySeconds = 0,
  active,
  resetTrigger,
  children,
  className = '',
  style,
}) => {
  const totalSeconds = Math.max(0, (delayMinutes || 0) * 60 + (delaySeconds || 0));
  const totalMs = totalSeconds * 1000;

  const [isVisible, setIsVisible] = useState<boolean>(!active || totalMs <= 0);

  useEffect(() => {
    if (!active || totalMs <= 0) {
      setIsVisible(true);
      return;
    }

    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, totalMs);

    return () => clearTimeout(timer);
  }, [totalMs, active, resetTrigger]);

  // In editor mode or if no delay is configured, render direct children
  if (!active || totalMs <= 0) {
    return <>{children}</>;
  }

  // If waiting for delay, remain hidden
  if (!isVisible) {
    return null;
  }

  // Once elapsed, render with smooth fade-in
  return (
    <div
      className={`animate-in fade-in duration-700 w-full shrink-0 ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};
