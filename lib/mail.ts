import 'server-only';

/** Envía un correo con Resend si está configurado; si no, solo lo registra en el servidor. */
export async function sendMail({ subject, text, replyTo }: { subject: string; text: string; replyTo?: string }) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  if (!key || !to) {
    console.info('[formulario] (sin RESEND_API_KEY, no se envió correo)\n', subject, '\n', text);
    return;
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: process.env.CONTACT_FROM ?? 'Undefined <onboarding@resend.dev>', to: [to], subject, text, reply_to: replyTo }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}`);
}

export const isEmail = (v: unknown): v is string => typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length < 200;
export const clean = (v: unknown, max = 2000) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
