'use client';
import { useState, type FormEvent } from 'react';

type Status = 'idle' | 'sending' | 'ok' | 'error';

async function post(url: string, data: Record<string, FormDataEntryValue>) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error ?? 'Error');
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus('sending');
    try {
      await post('/api/contacto', Object.fromEntries(new FormData(form)));
      setStatus('ok');
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo enviar');
      setStatus('error');
    }
  };
  return (
    <form className="card card--light form" onSubmit={onSubmit}>
      <h2 className="form-title">Escríbenos</h2>
      <div className="form-row">
        <label className="field"><span>Nombre</span><input name="nombre" required autoComplete="name" placeholder="Tu nombre" /></label>
        <label className="field"><span>Correo</span><input name="correo" type="email" required autoComplete="email" placeholder="tu@correo.com" /></label>
      </div>
      <label className="field"><span>Asunto</span><input name="asunto" placeholder="¿De qué quieres hablar?" /></label>
      <label className="field field--grow"><span>Mensaje</span><textarea name="mensaje" required placeholder="Cuéntanos…" /></label>
      {/* Campo trampa anti-spam: los humanos no lo ven */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      <div className="form-actions">
        <button className="btn btn--dark" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Enviando…' : 'Enviar mensaje'}</button>
        <p className="form-status" role="status">
          {status === 'ok' && '¡Gracias! Te responderemos pronto.'}
          {status === 'error' && error}
        </p>
      </div>
    </form>
  );
}

export function NewsletterForm() {
  const [status, setStatus] = useState<Status>('idle');
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus('sending');
    try {
      await post('/api/boletin', Object.fromEntries(new FormData(form)));
      setStatus('ok');
      form.reset();
    } catch {
      setStatus('error');
    }
  };
  return (
    <form className="newsletter-form" onSubmit={onSubmit}>
      <label className="field field--dark"><span>Correo</span><input name="correo" type="email" required placeholder="tu@correo.com" autoComplete="email" /></label>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      <button className="btn btn--accent" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Enviando…' : 'Suscribirme'}</button>
      <p className="form-status" role="status">
        {status === 'ok' && '¡Listo! Ya estás suscrito.'}
        {status === 'error' && 'No se pudo suscribir. Intenta de nuevo.'}
      </p>
    </form>
  );
}
