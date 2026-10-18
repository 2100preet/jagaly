'use client';
import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import type { Listing } from '@/data/listings';
import { formatINR } from '@/lib/format';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function MapView({ listings, activeId, onSelect, center, zoom = 11, className = '' }: {
  listings: Listing[]; activeId?: string | null; onSelect?: (id: string) => void; center?: [number, number]; zoom?: number; className?: string;
}) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const layer = useRef<any>(null);
  const markers = useRef<Record<string, any>>({});
  const L = useRef<any>(null);
  const lastIds = useRef('');

  useEffect(() => {
    let cancelled = false;
    import('leaflet').then((mod) => {
      if (cancelled || !el.current || map.current) return;
      L.current = mod.default ?? mod;
      map.current = L.current.map(el.current, { scrollWheelZoom: false, zoomControl: true }).setView(center ?? [12.97, 77.64], zoom);
      L.current.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map.current);
      layer.current = L.current.layerGroup().addTo(map.current);
      draw();
    });
    return () => { cancelled = true; map.current?.remove(); map.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const draw = () => {
    if (!map.current || !L.current) return;
    layer.current.clearLayers();
    markers.current = {};
    listings.forEach((l) => {
      const label = l.deal === 'rent' && l.price < 100000 ? `₹${Math.round(l.price / 1000)}K` : formatINR(l.price).replace(' ', '');
      const icon = L.current.divIcon({ className: `gk-pin ${activeId === l.id ? 'active' : ''}`, html: `<span>${label}</span>`, iconSize: [0, 0] });
      const m = L.current.marker(l.coord, { icon, zIndexOffset: activeId === l.id ? 1000 : 0 })
        .bindPopup(`<a href="${BASE_PATH}/property/${l.id}/" style="font-weight:600;color:#185944">${l.title}</a><br/><span style="color:#5b6578">${l.locality} · ${l.bhk} BHK · ${l.areaSqft} sqft</span>`)
        .on('click', () => onSelect?.(l.id));
      m.addTo(layer.current);
      markers.current[l.id] = m;
    });
    const ids = listings.map((l) => l.id).join(',');
    if (!center && listings.length > 1 && ids !== lastIds.current) {
      lastIds.current = ids;
      map.current.fitBounds(L.current.latLngBounds(listings.map((l) => l.coord)), { padding: [40, 40], maxZoom: 14 });
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { draw(); }, [listings.map((l) => l.id).join(','), activeId]);

  return <div ref={el} className={`h-full w-full ${className}`} />;
}
