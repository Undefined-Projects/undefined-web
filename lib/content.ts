import 'server-only';
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '@/keystatic.config';

export const reader = createReader(process.cwd(), keystaticConfig);

const today = () => new Date().toISOString().slice(0, 10);

export async function getSitio() {
  const s = await reader.singletons.sitio.read();
  return {
    tagline: s?.tagline ?? '', manifiesto: s?.manifiesto ?? '', manifiestoApoyo: s?.manifiestoApoyo ?? '',
    correo: s?.correo ?? '', whatsapp: s?.whatsapp ?? '', ciudad: s?.ciudad ?? '',
    instagram: s?.instagram ?? null, linkedin: s?.linkedin ?? null, tiktok: s?.tiktok ?? null,
  };
}
export const getNosotros = async () => (await reader.singletons.nosotros.read())!;
export const getMision = async () => (await reader.singletons.mision.read())!;
export const getPaginas = async () => (await reader.singletons.paginas.read())!;

export async function getNoticias() {
  const all = await reader.collections.noticias.all();
  return all
    .map(({ slug, entry }) => ({ slug, ...entry }))
    .sort((a, b) => (b.fecha ?? '').localeCompare(a.fecha ?? ''));
}

export async function getEventos() {
  const all = (await reader.collections.eventos.all()).map(({ slug, entry }) => ({ slug, ...entry }));
  const t = today();
  const proximos = all.filter((e) => (e.fecha ?? '') >= t).sort((a, b) => (a.fecha ?? '').localeCompare(b.fecha ?? ''));
  const pasados = all.filter((e) => (e.fecha ?? '') < t).sort((a, b) => (b.fecha ?? '').localeCompare(a.fecha ?? ''));
  return { proximos, pasados };
}

export async function getProyectos() {
  const all = await reader.collections.proyectos.all();
  return all
    .map(({ slug, entry }) => ({ slug, ...entry }))
    .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0) || (b.anio ?? 0) - (a.anio ?? 0));
}

export async function getEquipo() {
  const all = await reader.collections.equipo.all();
  return all.map(({ slug, entry }) => ({ slug, ...entry })).sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
}

export async function getAliados() {
  const all = await reader.collections.aliados.all();
  return all.map(({ slug, entry }) => ({ slug, ...entry })).sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
}

export async function getComunicados() {
  const all = await reader.collections.comunicados.all();
  return all.map(({ slug, entry }) => ({ slug, ...entry })).sort((a, b) => (b.fecha ?? '').localeCompare(a.fecha ?? ''));
}
