import React, { useEffect, useRef, useState } from 'react';
import { useGlobalStats } from '../../hooks/useGlobalStats.js';
import { formatNumber } from '../../utils/formatters.js';
import './GlobalStatsTicker.css';

function useCountUp(target, duration = 1500) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!target) return;
    const startTime = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
      else setValue(target);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}

export default function GlobalStatsTicker() {
  const { stats, loading, error } = useGlobalStats();
  const links = useCountUp(stats?.totalLinks || 0);
  const clicks = useCountUp(stats?.totalClicks || 0);

  if (error) return null;

  return (
    <div className="hero__ticker" aria-label="Global statistics">
      <span className="hero__ticker-dash">——</span>
      <span>{loading ? '———' : formatNumber(links)} links created</span>
      <span className="hero__ticker-dash">·</span>
      <span>{loading ? '———' : formatNumber(clicks)} clicks tracked</span>
      <span className="hero__ticker-dash">——</span>
    </div>
  );
}
