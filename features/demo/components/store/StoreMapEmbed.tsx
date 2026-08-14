"use client";

import { googleMapsEmbedUrl } from "../../constants/demoStores";

export function StoreMapEmbed({
  lat,
  lng,
  name,
  zoom = 16,
  className = "h-56 w-full",
}: {
  lat: number;
  lng: number;
  name: string;
  zoom?: number;
  className?: string;
}) {
  return (
    <iframe
      title={`Bản đồ ${name}`}
      src={googleMapsEmbedUrl(lat, lng, zoom)}
      className={`rounded-xl border border-slate-200 ${className}`}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
