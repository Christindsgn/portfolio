import React, { useEffect, useMemo, useRef } from 'react';
import './OrbitEllipseLight.css';

export type OrbitEllipseLightProps = {
  width?: number; // container width in px
  height?: number; // container height in px
  radius?: number; // orbit radius in px (auto-computed if not provided)
  numOrbits?: number; // number of orbiting ellipses
  centerSize?: { width: number; height: number };
  orbitSize?: { width: number; height: number };
  showLightCursor?: boolean;
  className?: string;
  sunShadowDirection?: { x: number; y: number }; // Sun-based shadow direction
};

const OrbitEllipseLight: React.FC<OrbitEllipseLightProps> = ({
  width = 400,
  height = 400,
  radius,
  numOrbits = 7,
  centerSize = { width: 60, height: 30 },
  orbitSize = { width: 60, height: 30 },
  showLightCursor = true,
  className = '',
  sunShadowDirection = { x: 0, y: 1 }, // Default shadow pointing down
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const centerRef = useRef<HTMLDivElement | null>(null);
  const lightCursorRef = useRef<HTMLDivElement | null>(null);
  const orbitRefs = useMemo(() => Array.from({ length: numOrbits }, () => React.createRef<HTMLDivElement>()), [numOrbits]);

  useEffect(() => {
    const container = containerRef.current;
    const centerEllipse = centerRef.current;
    const lightCursor = lightCursorRef.current;
    if (!container || !centerEllipse) return;

    // Auto-fit radius if not provided
    const actualRadius = typeof radius === 'number' && radius > 0
      ? radius
      : Math.min(width / 2 - orbitSize.width / 2, height / 2 - orbitSize.height / 2);

    // Position orbit ellipses in a circle around the center
    const centerX = width / 2;
    const centerY = height / 2;

    orbitRefs.forEach((ref, index) => {
      const ellipse = ref.current;
      if (!ellipse) return;
      const angle = (index * 360 / orbitRefs.length) * (Math.PI / 180);
      const x = centerX + actualRadius * Math.cos(angle) - orbitSize.width / 2;
      const y = centerY + actualRadius * Math.sin(angle) - orbitSize.height / 2;
      ellipse.style.left = `${x}px`;
      ellipse.style.top = `${y}px`;
      ellipse.style.width = `${orbitSize.width}px`;
      ellipse.style.height = `${orbitSize.height}px`;
    });

    centerEllipse.style.width = `${centerSize.width}px`;
    centerEllipse.style.height = `${centerSize.height}px`;

    function calculateShadow(elementRect: DOMRect, mouseX: number, mouseY: number) {
      const elementCenterX = elementRect.left + elementRect.width / 2;
      const elementCenterY = elementRect.top + elementRect.height / 2;
      const deltaX = elementCenterX - mouseX;
      const deltaY = elementCenterY - mouseY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY) || 1;
      
      // Make shadow length more natural - proportional to distance
      // Closer cursor = shorter shadow, farther cursor = longer shadow
      const maxShadowDistance = 25; // Maximum shadow length
      const minShadowDistance = 3;  // Minimum shadow length
      
      // Calculate shadow length based on distance (inverse relationship)
      const maxDistance = Math.sqrt(window.innerWidth * window.innerWidth + window.innerHeight * window.innerHeight) || 1;
      const normalizedDistance = Math.min(distance / maxDistance, 1);
      
      // Shadow length: closer = shorter, farther = longer
      const shadowLength = minShadowDistance + (normalizedDistance * (maxShadowDistance - minShadowDistance));
      
      const shadowX = (deltaX / distance) * shadowLength;
      const shadowY = (deltaY / distance) * shadowLength;
      
      // Blur and opacity also based on distance
      const blur = 2 + normalizedDistance * 6; // 2 -> 8
      const opacity = Math.max(0.15, 0.4 - normalizedDistance * 0.25); // 0.4 -> 0.15
      
      return {
        x: isNaN(shadowX) ? 0 : shadowX,
        y: isNaN(shadowY) ? 0 : shadowY,
        blur,
        opacity,
      };
    }

    function updateShadows(mouseX: number, mouseY: number) {
      if (centerEllipse) {
        const centerRect = centerEllipse.getBoundingClientRect();
        const centerShadow = calculateShadow(centerRect, mouseX, mouseY);
        centerEllipse.style.boxShadow = `${centerShadow.x}px ${centerShadow.y}px ${centerShadow.blur}px rgba(0, 0, 0, ${centerShadow.opacity})`;
      }

      orbitRefs.forEach((ref) => {
        const ellipse = ref.current;
        if (!ellipse) return;
        const rect = ellipse.getBoundingClientRect();
        const shadow = calculateShadow(rect, mouseX, mouseY);
        ellipse.style.boxShadow = `${shadow.x}px ${shadow.y}px ${shadow.blur}px rgba(0, 0, 0, ${shadow.opacity})`;
      });
    }

    function applySunBasedShadows() {
      // Apply sun-based shadows to all ellipses
      const shadowLength = 15; // Fixed shadow length
      const blur = 4; // Fixed blur
      const opacity = 0.25; // Fixed opacity
      
      // Center ellipse
      if (centerEllipse) {
        const centerShadowX = sunShadowDirection.x * shadowLength;
        const centerShadowY = sunShadowDirection.y * shadowLength;
        centerEllipse.style.boxShadow = `${centerShadowX}px ${centerShadowY}px ${blur}px rgba(0, 0, 0, ${opacity})`;
      }

      // Orbit ellipses
      orbitRefs.forEach((ref) => {
        const ellipse = ref.current;
        if (!ellipse) return;
        const shadowX = sunShadowDirection.x * shadowLength;
        const shadowY = sunShadowDirection.y * shadowLength;
        ellipse.style.boxShadow = `${shadowX}px ${shadowY}px ${blur}px rgba(0, 0, 0, ${opacity})`;
      });
    }

    const onMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      if (showLightCursor && lightCursor) {
        lightCursor.style.left = `${mouseX}px`;
        lightCursor.style.top = `${mouseY}px`;
      }
      updateShadows(mouseX, mouseY);
    };

    document.addEventListener('mousemove', onMouseMove);

    // Initialize with sun-based shadows
    applySunBasedShadows();

    // Initialize with default light position (center of screen)
    const initialX = window.innerWidth / 2;
    const initialY = window.innerHeight / 2;
    if (showLightCursor && lightCursor) {
      lightCursor.style.left = `${initialX}px`;
      lightCursor.style.top = `${initialY}px`;
    }

    const onResize = () => {
      const currentMouseX = showLightCursor && lightCursor ? parseInt(lightCursor.style.left, 10) || initialX : initialX;
      const currentMouseY = showLightCursor && lightCursor ? parseInt(lightCursor.style.top, 10) || initialY : initialY;
      updateShadows(currentMouseX, currentMouseY);
    };

    window.addEventListener('resize', onResize);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
    };
  }, [width, height, radius, centerSize.height, centerSize.width, orbitRefs, orbitSize.height, orbitSize.width, showLightCursor, sunShadowDirection]);

  return (
    <div className={`oel-root ${className}`} style={{ width, height }} ref={containerRef}>
      {showLightCursor && <div className="oel-light-cursor" ref={lightCursorRef} />}
      <div className="oel-center-ellipse" ref={centerRef} />
      {orbitRefs.map((ref, i) => (
        <div key={i} className={`oel-orbit-ellipse oel-orbit-${i + 1}`} ref={ref} />
      ))}
    </div>
  );
};

export default OrbitEllipseLight;