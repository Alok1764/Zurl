import { useState, useEffect, useRef, useCallback } from 'react';
import { checkAlias } from '../api/links.js';
import { getAliasError } from '../utils/validators.js';
import { ALIAS_DEBOUNCE_MS } from '../config/api.config.js';

export function useAliasCheck() {
  const [alias, setAlias] = useState('');
  const [status, setStatus] = useState('idle');
  const [suggestion, setSuggestion] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const timerRef = useRef(null);

  const onAliasChange = useCallback((value) => {
    setAlias(value);
    if (!value) { setStatus('idle'); setValidationError(null); setSuggestion(null); return; }
    const err = getAliasError(value);
    if (err) { setStatus('invalid'); setValidationError(err); return; }
    setValidationError(null);
    setStatus('checking');
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try {
        const data = await checkAlias(value);
        if (data.available) { setStatus('available'); setSuggestion(null); }
        else { setStatus('taken'); setSuggestion(data.suggestion || null); }
      } catch { setStatus('idle'); }
    }, ALIAS_DEBOUNCE_MS);
  }, []);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return { alias, status, suggestion, validationError, onAliasChange };
}
