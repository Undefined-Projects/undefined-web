import type { ReactNode } from 'react';
import '../globals.css';
import { Stage } from '@/components/Stage';
import { Grain, PencilDefs } from '@/components/Brand';
import { BackToTop } from '@/components/BackToTop';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="site">
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <PencilDefs />
      <Stage>
        <div id="contenido">{children}</div>
        <BackToTop />
      </Stage>
      <Grain />
    </div>
  );
}
