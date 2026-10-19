'use client';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { MapPin, X } from 'lucide-react';
import { AREAS, searchAreas, resolveArea } from '@/data/geo';
import { LISTINGS } from '@/data/listings';
import { cn } from '@/lib/format';

const COUNTS: Record<string, number> = LISTINGS.reduce((m, l) => ({ ...m, [l.locality]: (m[l.locality] ?? 0) + 1 }), {} as Record<string, number>);
const POPULAR = ['Whitefield', 'Koramangala', 'HSR Layout', 'Sarjapur Road', 'Electronic City', 'Indiranagar', 'Hebbal', 'Yelahanka'];

/**
 * Searchable locality combobox (ARIA 1.2 pattern): type to filter, ↑/↓ to move, Enter to pick, Esc to close.
 * Matches names and aliases ("BTM" → BTM Layout, "E City" → Electronic City, "ORR" → Outer Ring Road areas).
 */
export default function LocalityTypeahead({
  value, onChange, placeholder = 'Search a locality, e.g. Koramangala', id, className, inputClassName, showIcon = true, allLabel,
}: {
  value: string; onChange: (name: string) => void; placeholder?: string; id?: string; className?: string; inputClassName?: string;
  showIcon?: boolean; allLabel?: string; // if set, empty value means "all" and is shown as this label
}) {
  const autoId = useId();
  const inputId = id ?? `loc-${autoId}`;
  const listId = `${inputId}-list`;
  const [text, setText] = useState(value);
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => { setText(value); }, [value]);

  const options = useMemo(() => {
    const q = text.trim();
    if (!q || q === value) return POPULAR.map((n) => ({ area: AREAS.find((a) => a.name === n)!, via: undefined as string | undefined, popular: true }));
    return searchAreas(q, 8).map((m) => ({ ...m, popular: false }));
  }, [text, value]);

  useEffect(() => { setHi(0); }, [text]);
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${hi}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [hi]);

  useEffect(() => {
    const onDoc = (e: MouseEvent | TouchEvent) => { if (!wrap.current?.contains(e.target as Node)) close(); };
    document.addEventListener('mousedown', onDoc); document.addEventListener('touchstart', onDoc);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('touchstart', onDoc); };
  });

  const pick = (name: string) => { onChange(name); setText(name); setOpen(false); };
  const close = () => {
    if (!open) return;
    setOpen(false);
    // commit an exact name / alias typed without picking, otherwise revert
    const r = resolveArea(text);
    if (r) { if (r.name !== value) onChange(r.name); setText(r.name); }
    else if (!text.trim() && allLabel) { if (value) onChange(''); setText(''); }
    else setText(value);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (!open) setOpen(true); else setHi((h) => Math.min(options.length - 1, h + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHi((h) => Math.max(0, h - 1)); }
    else if (e.key === 'Enter') {
      if (open && options[hi]) { e.preventDefault(); pick(options[hi].area.name); }
      else { const r = resolveArea(text); if (r && r.name !== value) { onChange(r.name); setText(r.name); } }
    } else if (e.key === 'Escape') { if (open) { e.preventDefault(); setOpen(false); setText(value); } }
    else if (e.key === 'Tab') close();
  };

  return (
    <div ref={wrap} className={cn('relative', className)}>
      <div className="flex items-center gap-2">
        {showIcon && <MapPin className="h-4 w-4 shrink-0 text-brand-600" aria-hidden />}
        <input
          id={inputId} type="text" role="combobox" aria-expanded={open} aria-controls={listId} aria-autocomplete="list"
          aria-activedescendant={open && options[hi] ? `${listId}-${hi}` : undefined} autoComplete="off" autoCorrect="off" spellCheck={false}
          enterKeyHint="search" value={text} placeholder={allLabel && !value ? allLabel : placeholder}
          onChange={(e) => { setText(e.target.value); setOpen(true); }}
          onFocus={(e) => { setOpen(true); e.currentTarget.select(); }}
          onKeyDown={onKey}
          className={cn('w-full min-w-0 bg-transparent text-base outline-none placeholder:text-ink-400 sm:text-sm', inputClassName)}
        />
        {text && (
          <button type="button" aria-label="Clear locality" onMouseDown={(e) => e.preventDefault()}
            onClick={() => { setText(''); if (allLabel) onChange(''); setOpen(true); }}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink-400 hover:bg-ink-100 hover:text-ink-700"><X className="h-4 w-4" /></button>
        )}
      </div>
      {open && (
        <ul ref={listRef} id={listId} role="listbox" aria-label="Localities"
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[min(60vh,340px)] min-w-[260px] overflow-y-auto rounded-2xl border border-ink-200 bg-white p-1.5 text-left text-ink-900 shadow-lift">
          {options.length === 0 ? (
            <li className="px-3 py-3 text-sm text-ink-500">No Bengaluru locality matches “{text}”. Try a nearby area or a short form like “BTM”, “E City”, “ORR”.</li>
          ) : (
            <>
              {options[0]?.popular && <li className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-ink-400" role="presentation">Popular localities</li>}
              {options.map((o, i) => {
                const n = COUNTS[o.area.name] ?? 0;
                return (
                  <li key={o.area.name} id={`${listId}-${i}`} data-idx={i} role="option" aria-selected={i === hi}
                    onMouseDown={(e) => e.preventDefault()} onClick={() => pick(o.area.name)} onMouseEnter={() => setHi(i)}
                    className={cn('flex min-h-[44px] cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm', i === hi ? 'bg-brand-50 text-brand-800' : 'hover:bg-ink-50')}>
                    <span className="min-w-0">
                      <span className="font-semibold">{o.area.name}</span>
                      <span className="block truncate text-xs text-ink-500">{o.via ? `matches “${o.via}” · ` : ''}{o.area.zone} Bengaluru</span>
                    </span>
                    <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold', n ? 'bg-brand-100 text-brand-700' : 'bg-ink-100 text-ink-500')}>{n ? `${n} sample` : 'no listings yet'}</span>
                  </li>
                );
              })}
            </>
          )}
          <li role="presentation" className="px-3 pb-1 pt-2 text-[10px] text-ink-400">{AREAS.length} localities · locations approximate</li>
        </ul>
      )}
    </div>
  );
}
