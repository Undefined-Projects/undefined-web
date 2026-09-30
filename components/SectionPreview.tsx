import { SECTIONS } from '@/lib/sections';
import { Glyph, LogoMark } from './Brand';

/** "Imagen" de cada sección que se ve en el carrusel 3D mientras gira. */
export function SectionPreview({ index }: { index: number }) {
  const s = SECTIONS[index];
  return (
    <div className="preview" style={{ background: s.bg }}>
      <span className="preview-num">{s.num}</span>
      <div className="preview-body">
        <div className="preview-title">
          {s.lines[0]}
          {s.lines[1] ? <><br />{s.lines[1]}</> : null}
        </div>
        {s.glyph ? <Glyph name={s.glyph} size={260} color="#FFFFFF" className="preview-glyph" /> : <LogoMark size={260} className="preview-glyph" />}
      </div>
    </div>
  );
}
