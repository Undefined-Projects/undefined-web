import type { Metadata } from 'next';
import { getPaginas, getSitio } from '@/lib/content';
import { PageShell } from '@/components/Layout';
import { ContactForm } from '@/components/Forms';

export const metadata: Metadata = { title: 'Hablemos' };

export default async function Page() {
  const [p, s] = await Promise.all([getPaginas(), getSitio()]);
  const redes = [['Instagram', s.instagram], ['LinkedIn', s.linkedin], ['TikTok', s.tiktok]].filter(([, u]) => u) as [string, string][];
  return (
    <PageShell index={8} bajada={p.bajadaContacto} ciudad={s.ciudad}>
      <div className="grid-contact">
        <div className="stack">
          <a className="card card--glass contact-card" href={`mailto:${s.correo}`}><span className="mono muted">Correo</span><strong>{s.correo}</strong></a>
          {s.whatsapp && <div className="card card--glass contact-card"><span className="mono muted">WhatsApp</span><strong>{s.whatsapp}</strong></div>}
          <div className="card card--glass contact-card contact-card--grow">
            <span className="mono muted">Redes</span>
            <div className="pills">{redes.map(([n, u]) => <a key={n} className="btn btn--outline-light" href={u} target="_blank" rel="noreferrer">{n}</a>)}</div>
            <span className="soft">{s.ciudad}</span>
          </div>
        </div>
        <ContactForm />
      </div>
    </PageShell>
  );
}
