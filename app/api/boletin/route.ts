import { NextResponse } from 'next/server';
import { clean, isEmail, sendMail } from '@/lib/mail';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || clean(body.website)) return NextResponse.json({ ok: true });
  if (!isEmail(body.correo)) return NextResponse.json({ error: 'Correo inválido.' }, { status: 400 });
  try {
    await sendMail({ subject: '[Web] Nueva suscripción al boletín', text: `Correo: ${body.correo}` });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'No se pudo suscribir.' }, { status: 502 });
  }
}
