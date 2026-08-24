import React, { memo } from 'react';
import { ComposableMap, Geographies, Geography, Marker, Line } from 'react-simple-maps';

// Reliable CDN for 110m simplified world topology (TopoJSON)
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const WorldMap = memo(function WorldMap({
  lat,
  lng,
  locationLabel,
  deathLat,
  deathLng,
  deathLocationLabel,
  isEmigrant
}) {
  if (lat == null || lng == null) return null;

  const hasEmigrated = Boolean(isEmigrant && deathLat != null && deathLng != null && (Math.abs(deathLat - lat) > 0.5 || Math.abs(deathLng - lng) > 0.5));

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-slate-700/50 shadow-inner"
      style={{ background: 'radial-gradient(ellipse at center, #0b1628 0%, #060d1a 100%)' }}
    >
      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{ scale: 155, center: [0, 0] }}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#1a2540"
                stroke="#2d3f5e"
                strokeWidth={0.4}
                style={{
                  default: { outline: 'none' },
                  hover: { outline: 'none', fill: '#1e2d4a' },
                  pressed: { outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>

        {/* Emigration Trajectory Line */}
        {hasEmigrated && (
          <Line
            from={[lng, lat]}
            to={[deathLng, deathLat]}
            stroke="#f59e0b"
            strokeWidth={1.8}
            strokeDasharray="4 3"
            strokeLinecap="round"
          />
        )}

        {/* Birthplace Marker (Rose) */}
        <Marker coordinates={[lng, lat]}>
          <circle r={14} fill="#f43f5e" fillOpacity={0.25} className="animate-ping" />
          <circle r={8} fill="#f43f5e" fillOpacity={0.45} />
          <circle r={4.5} fill="#fb7185" stroke="#ffffff" strokeWidth={1.5} />
          <circle r={2} fill="#ffffff" />
        </Marker>

        {/* Death / Final Settlement Marker (Emerald) */}
        {hasEmigrated && (
          <Marker coordinates={[deathLng, deathLat]}>
            <circle r={14} fill="#10b981" fillOpacity={0.25} className="animate-ping" />
            <circle r={8} fill="#10b981" fillOpacity={0.45} />
            <circle r={4.5} fill="#34d399" stroke="#ffffff" strokeWidth={1.5} />
            <circle r={2} fill="#ffffff" />
          </Marker>
        )}
      </ComposableMap>

      {/* Location label badge */}
      <div className="absolute bottom-2.5 left-3 flex flex-wrap items-center gap-1.5 z-10 max-w-[95%]">
        {hasEmigrated ? (
          <div
            className="flex items-center gap-1.5 text-[11px] font-mono text-indigo-200/90 px-3 py-1 rounded-full border border-indigo-800/50 shadow-lg"
            style={{ background: 'rgba(6,13,26,0.90)', backdropFilter: 'blur(8px)' }}
          >
            <span className="text-rose-400 font-bold">📍 Born:</span>
            <span className="text-slate-300 truncate max-w-[130px] md:max-w-[200px]">{locationLabel}</span>
            <span className="text-amber-400 font-bold">➔</span>
            <span className="text-emerald-400 font-bold">🏁 Died:</span>
            <span className="text-slate-300 truncate max-w-[130px] md:max-w-[200px]">{deathLocationLabel || 'Abroad'}</span>
          </div>
        ) : locationLabel ? (
          <span
            className="text-[11px] font-mono text-indigo-200/90 px-2.5 py-0.5 rounded-full border border-indigo-800/50"
            style={{ background: 'rgba(6,13,26,0.85)', backdropFilter: 'blur(8px)' }}
          >
            📍 {locationLabel}
          </span>
        ) : null}
      </div>
    </div>
  );
});

export default WorldMap;
