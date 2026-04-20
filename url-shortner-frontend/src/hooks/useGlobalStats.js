import { useState, useEffect, useRef } from 'react';
import { getGlobalStats } from '../api/analytics.js';
import { STATS_POLL_INTERVAL_MS } from '../config/api.config.js';

export function useGlobalStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchStats = async () => {
    try {
      const data = await getGlobalStats();
      setStats(data);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, STATS_POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return { stats, loading, error };
}
