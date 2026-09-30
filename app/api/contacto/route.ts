import { NextResponse } from 'next/server';
import { clean, isEmail, sendMail } from '@/lib/mail';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || clean(body.website)) return NextResponse.json({ ok: true }); // bot
  const nombre = clean(body.nombre, 120);
  const asunto = clean(body.asunto, 200);
  const mensaje = clean(body.mensaje, 5000);
  if (!nombre || !mensaje || !isEmail(body.correo)) {
    return NextResponse.json({ error: 'Revisa tu nombre, correo y mensaje.' }, { status: 400 });
  }
  try {
    await sendMail({ subject: `[Web] ${asunto || 'Nuevo mensaje'} — ${nombre}`, text: `De: ${nombre} <${body.correo}>\n\n${mensaje}`, replyTo: body.correo });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'No se pudo enviar. Intenta más tarde.' }, { status: 502 });
  }
}
