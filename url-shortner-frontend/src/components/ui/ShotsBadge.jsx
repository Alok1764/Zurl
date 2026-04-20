import React from 'react';
import useAuthStore from '../../store/authStore.js';
import './ShotsBadge.css';

export default function ShotsBadge() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const shotsLeft = useAuthStore((s) => s.shotsLeft);
  const user = useAuthStore((s) => s.user);

  if (!isLoggedIn) return null;

  const shots = shotsLeft();
  if (shots === null) return null;

  return (
    <div className="shots-badge-container">
      <div 
        className="shots-badge" 
        title={`${shots} of ${user?.dailyLimit || 50} links available today`}
      >
        ⭐ <span className="shots-badge__count">{shots}</span> shots remaining
      </div>
    </div>
  );
}
