'use client';
import { useEffect, useState } from 'react';
import { useStage } from './Stage';

export function BackToTop() {
  const [show, setShow] = useState(false);
  const { busy } = useStage();
  useEffect(() => {
    const on = () => setShow(window.scrollY > 500);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  const visible = show && !busy;
  return (
    <button
      type="button"
      className={`to-top${visible ? ' is-visible' : ''}`}
      aria-label="Subir al inicio de la página"
      tabIndex={visible ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
