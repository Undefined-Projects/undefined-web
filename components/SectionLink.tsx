'use client';
import type { AnchorHTMLAttributes, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useStage } from './Stage';

/** Enlace interno que dispara la transición 3D entre secciones. */
export function SectionLink({ href, onClick, onMouseEnter, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const { navigate } = useStage();
  const router = useRouter();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(href);
  };
  return (
    <a
      href={href}
      onClick={handle}
      onMouseEnter={(e) => { onMouseEnter?.(e); router.prefetch(href); }}
      {...rest}
    />
  );
}
