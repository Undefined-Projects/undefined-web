const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function parts(iso?: string | null) {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return null;
  return { y, m, d };
}
/** "15" */
export const dia = (iso?: string | null) => (parts(iso) ? String(parts(iso)!.d).padStart(2, '0') : '--');
/** "OCT" */
export const mes = (iso?: string | null) => (parts(iso) ? MESES[parts(iso)!.m - 1].toUpperCase() : '---');
/** "15 oct 2026" */
export const fechaLarga = (iso?: string | null) => {
  const p = parts(iso);
  return p ? `${String(p.d).padStart(2, '0')} ${MESES[p.m - 1]} ${p.y}` : '';
};
/** "oct 2026" */
export const mesAnio = (iso?: string | null) => {
  const p = parts(iso);
  return p ? `${MESES[p.m - 1]} ${p.y}` : '';
};
