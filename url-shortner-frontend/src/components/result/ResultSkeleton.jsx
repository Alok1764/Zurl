import React from 'react';
import './ResultCard.css';
import '../ui/Skeleton.css';

export default function ResultSkeleton() {
  return (
    <div className="card skeleton-card" aria-busy="true" aria-label="Loading...">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
        <div className="skeleton skeleton-line" style={{ width: '55%', height: 28 }} />
        <div className="skeleton" style={{ width: 90, height: 38, borderRadius: 3 }} />
      </div>
      <div style={{ height: 1, background: 'var(--border-muted)', marginBottom: 14 }} />
      <div style={{ display: 'flex', gap: 20 }}>
        <div className="skeleton skeleton-line" style={{ width: 64 }} />
        <div className="skeleton skeleton-line" style={{ width: 80 }} />
        <div className="skeleton skeleton-line" style={{ width: 60 }} />
      </div>
    </div>
  );
}
