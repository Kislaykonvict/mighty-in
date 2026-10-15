'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import createGlobe, { Arc, Marker } from 'cobe';
import { MIGHTY_OFFICES, OfficeLocation } from '@/data/offices';
import { Play, Pause, Compass, RotateCcw, MapPin, Sparkles, Navigation } from 'lucide-react';

interface InteractiveGlobeProps {
  selectedOffice: OfficeLocation | null;
  onSelectOffice: (office: OfficeLocation) => void;
  className?: string;
}

export function InteractiveGlobe({
  selectedOffice,
  onSelectOffice,
  className = '',
}: InteractiveGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null);
  
  // Globe rotation state
  const phiRef = useRef(0.5);
  const thetaRef = useRef(0.25);
  const targetPhiRef = useRef<number | null>(null);
  const targetThetaRef = useRef<number | null>(null);
  const [isAutoSpinning, setIsAutoSpinning] = useState(true);

  // Convert lat/lng to target phi/theta in Cobe coordinate space
  const getCoordinatesAngles = useCallback((lat: number, lng: number) => {
    // In Cobe, phi is longitude in radians, theta is latitude in radians
    const targetPhi = -(lng * Math.PI) / 180 - Math.PI / 2;
    const targetTheta = (lat * Math.PI) / 180;
    return { targetPhi, targetTheta };
  }, []);

  // When selectedOffice changes, animate globe to focus on that location
  useEffect(() => {
    if (selectedOffice) {
      const { targetPhi, targetTheta } = getCoordinatesAngles(
        selectedOffice.coordinates.lat,
        selectedOffice.coordinates.lng
      );
      
      // Normalize targetPhi relative to current phiRef to take shortest rotation path
      let diff = (targetPhi - phiRef.current) % (Math.PI * 2);
      if (diff > Math.PI) diff -= Math.PI * 2;
      if (diff < -Math.PI) diff += Math.PI * 2;
      
      targetPhiRef.current = phiRef.current + diff;
      targetThetaRef.current = targetTheta;
      setIsAutoSpinning(false);
    }
  }, [selectedOffice, getCoordinatesAngles]);

  useEffect(() => {
    let width = 0;
    const currentCanvas = canvasRef.current;
    if (!currentCanvas) return;

    const onResize = () => {
      if (currentCanvas) {
        width = currentCanvas.offsetWidth;
      }
    };
    window.addEventListener('resize', onResize);
    onResize();

    // Map Mighty Warner offices to Cobe markers with custom colors
    const markers: Marker[] = MIGHTY_OFFICES.map((office) => {
      const isSelected = selectedOffice?.id === office.id;
      return {
        location: office.cobeLocation,
        size: isSelected ? 0.12 : 0.08,
        color: isSelected ? [0.95, 0.2, 0.3] : [0.77, 0.13, 0.2], // Bright Crimson vs Brand Crimson
        id: office.id,
      };
    });

    // Interconnecting delivery network arcs between global offices
    const arcs: Arc[] = [
      {
        from: [28.6280, 77.3649], // Noida, India
        to: [25.1872, 55.2744],   // Dubai, UAE
        color: [0.9, 0.2, 0.3],
      },
      {
        from: [25.1872, 55.2744],  // Dubai, UAE
        to: [42.6526, -73.7562],  // Albany, USA
        color: [0.2, 0.6, 0.95],
      },
      {
        from: [42.6526, -73.7562], // Albany, USA
        to: [43.5930, -79.6416],  // Mississauga, Canada
        color: [0.2, 0.8, 0.6],
      },
      {
        from: [43.5930, -79.6416], // Mississauga, Canada
        to: [28.6280, 77.3649],   // Noida, India
        color: [0.8, 0.4, 0.9],
      },
    ];

    let globe: ReturnType<typeof createGlobe> | null = null;
    let animationFrameId: number | null = null;

    try {
      globe = createGlobe(currentCanvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 2, 2),
        width: width * 2 || 1000,
        height: width * 2 || 1000,
        phi: phiRef.current,
        theta: thetaRef.current,
        dark: 1,
        diffuse: 1.4,
        mapSamples: 18000,
        mapBrightness: 5.5,
        baseColor: [0.10, 0.16, 0.26], // Deep tech navy (#1A2942)
        markerColor: [0.85, 0.18, 0.25], // Mighty Crimson Red (#C52233)
        glowColor: [0.12, 0.22, 0.38], // Ambient royal glow
        markers: markers,
        arcs: arcs,
        arcColor: [0.85, 0.2, 0.3],
        arcWidth: 1.2,
        arcHeight: 0.35,
        markerElevation: 0.05,
      });

      const animate = () => {
        // If user is not dragging
        if (!pointerInteracting.current) {
          if (targetPhiRef.current !== null && targetThetaRef.current !== null) {
            // Smooth lerp to target office
            const phiDiff = targetPhiRef.current - phiRef.current;
            const thetaDiff = targetThetaRef.current - thetaRef.current;

            phiRef.current += phiDiff * 0.07;
            thetaRef.current += thetaDiff * 0.07;

            // Snap when close enough
            if (Math.abs(phiDiff) < 0.001 && Math.abs(thetaDiff) < 0.001) {
              phiRef.current = targetPhiRef.current;
              thetaRef.current = targetThetaRef.current;
              targetPhiRef.current = null;
              targetThetaRef.current = null;
            }
          } else if (isAutoSpinning) {
            // Smooth idle auto-rotation
            phiRef.current += 0.0035;
          }
        }

        if (globe && currentCanvas) {
          globe.update({
            phi: phiRef.current,
            theta: thetaRef.current,
            width: width * 2 || 1000,
            height: width * 2 || 1000,
            markers: markers,
          });
        }

        animationFrameId = requestAnimationFrame(animate);
      };

      animationFrameId = requestAnimationFrame(animate);
    } catch (err) {
      console.warn('WebGL / Cobe initialization fallback:', err);
    }

    // Fade in canvas smoothly
    setTimeout(() => {
      if (currentCanvas) {
        currentCanvas.style.opacity = '1';
      }
    }, 100);

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      if (globe) {
        globe.destroy();
      }
      window.removeEventListener('resize', onResize);
    };
  }, [selectedOffice, isAutoSpinning]);

  // Pointer event handlers for interactive 3D drag
  const handlePointerDown = (e: React.PointerEvent) => {
    pointerInteracting.current = {
      x: e.clientX,
      y: e.clientY,
    };
    targetPhiRef.current = null;
    targetThetaRef.current = null;
    setIsAutoSpinning(false);
  };

  const handlePointerUp = () => {
    pointerInteracting.current = null;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (pointerInteracting.current !== null) {
      const deltaX = e.clientX - pointerInteracting.current.x;
      const deltaY = e.clientY - pointerInteracting.current.y;
      
      phiRef.current += deltaX * 0.005;
      // Clamp theta between -0.8 and 0.8 to avoid flipping
      thetaRef.current = Math.max(-0.8, Math.min(0.8, thetaRef.current - deltaY * 0.005));
      
      pointerInteracting.current = {
        x: e.clientX,
        y: e.clientY,
      };
    }
  };

  const resetView = () => {
    targetPhiRef.current = 0.5;
    targetThetaRef.current = 0.25;
    setIsAutoSpinning(true);
  };

  return (
    <div className={`relative w-full max-w-[620px] aspect-square mx-auto flex items-center justify-center select-none ${className}`}>
      {/* Ambient background glow behind globe */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-crimson/15 via-blue-600/15 to-brand-navy/30 blur-[70px] pointer-events-none" />
      
      {/* Holographic orbital ring overlay */}
      <div className="absolute inset-[-10px] rounded-full border border-dashed border-white/10 animate-spin-slow pointer-events-none opacity-40" />
      <div className="absolute inset-[30px] rounded-full border border-white/5 pointer-events-none" />
      
      {/* Canvas Element */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerOut={handlePointerUp}
        onPointerMove={handlePointerMove}
        className="w-full h-full cursor-grab active:cursor-grabbing transition-opacity duration-700 opacity-0 relative z-10 touch-none"
      />

      {/* Floating Interactive Controls Pill */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/15 shadow-xl text-xs text-slate-300">
        <button
          type="button"
          onClick={() => setIsAutoSpinning(!isAutoSpinning)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition-all ${
            isAutoSpinning
              ? 'bg-brand-crimson/20 text-brand-crimson border border-brand-crimson/30'
              : 'hover:bg-white/10 text-slate-300'
          }`}
          title={isAutoSpinning ? 'Pause Auto-Rotation' : 'Resume Auto-Rotation'}
          aria-label="Toggle Auto-Rotation"
        >
          {isAutoSpinning ? (
            <>
              <Pause className="w-3 h-3 text-brand-crimson fill-brand-crimson" />
              <span>Spinning</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3" />
              <span>Paused</span>
            </>
          )}
        </button>

        <div className="w-px h-3.5 bg-white/15 mx-0.5" />

        <button
          type="button"
          onClick={resetView}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full hover:bg-white/10 transition-colors text-slate-300 hover:text-white"
          title="Reset Globe View"
          aria-label="Reset Globe"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>

        <div className="w-px h-3.5 bg-white/15 mx-0.5" />

        <span className="flex items-center gap-1 text-[11px] text-slate-400 pl-1 pr-1 hidden sm:flex">
          <Compass className="w-3 h-3 text-brand-royal" />
          <span>Drag to rotate</span>
        </span>
      </div>

      {/* Quick Office Jump Hotspots */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 p-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/12 shadow-lg">
        {MIGHTY_OFFICES.map((office) => {
          const isSelected = selectedOffice?.id === office.id;
          return (
            <button
              key={office.id}
              type="button"
              onClick={() => onSelectOffice(office)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                isSelected
                  ? 'bg-gradient-to-r from-brand-crimson to-rose-600 text-white shadow-md shadow-brand-crimson/25 scale-105'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="text-sm">{office.flag}</span>
              <span>{office.city.split(',')[0]}</span>
              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
            </button>
          );
        })}
      </div>

      {/* Floating Beacon Tag for currently selected office */}
      {selectedOffice && (
        <div className="absolute top-14 right-4 z-20 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-brand-crimson/30 shadow-lg text-xs text-white animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-brand-crimson animate-pulse" />
          <span className="font-semibold">{selectedOffice.city} Hub</span>
          <span className="text-slate-400 text-[11px] font-mono">({selectedOffice.utcOffset})</span>
        </div>
      )}
    </div>
  );
}
