import { useState, useCallback } from 'react';
import { createLink } from '../api/links.js';
import { isValidUrl } from '../utils/validators.js';
import useLinksStore from '../store/linksStore.js';
import useAuthStore from '../store/authStore.js';

export function useShortener() {
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const addLink = useLinksStore((s) => s.addLink);
  const setGuestUsed = useLinksStore((s) => s.setGuestUsed);
  const decrementUsage = useAuthStore((s) => s.decrementUsage);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const shorten = useCallback(async ({ url, alias, expiresAt }) => {
    if (!isValidUrl(url)) {
      setError({ field: 'url', message: "That doesn't look like a URL" });
      return;
    }
    setStatus('loading');
    setError(null);
    setResult(null);

    try {
      const data = await createLink({ url, alias: alias || undefined, expiresAt });
      setResult(data);
      setStatus('success');
      addLink(data);
      if (!isLoggedIn) setGuestUsed(true);
      else decrementUsage();
    } catch (err) {
      setStatus('error');
      if (err?.status === 429) setError({ field: 'global', message: "You're out of shots for today. Come back tomorrow." });
      else if (err?.status === 409) setError({ field: 'alias', message: 'That alias is already taken' });
      else setError({ field: 'global', message: 'Something broke. Try again.' });
    }
  }, [addLink, setGuestUsed, decrementUsage, isLoggedIn]);

  const reset = useCallback(() => { setStatus('idle'); setResult(null); setError(null); }, []);

  return { status, result, error, shorten, reset };
}
