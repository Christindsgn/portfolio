import React, { useEffect, useMemo, useRef } from 'react';
import './DynamicShadowEffect.css';

const DynamicShadowEffect: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const centerRef = useRef<HTMLDivElement | null>(null);
  const lightCursorRef = useRef<HTMLDivElement | null>(null);
  const orbitRefs = useMemo(() => Array.from({ length: 7 }, () => React.createRef<HTMLDivElement>()), []);

  useEffect(() => {
    const container = containerRef.current;
    const centerEllipse = centerRef.current;
    const lightCursor = lightCursorRef.current;
    if (!container || !centerEllipse || !lightCursor) return;

    // Position orbit ellipses in a circle around the center
    const radius = 150;
    const centerX = 200; // Half of container width
    const centerY = 200; // Half of container height

    orbitRefs.forEach((ref, index) => {
      const ellipse = ref.current;
      if (!ellipse) return;
      const angle = (index * 360 / orbitRefs.length) * (Math.PI / 180);
      const x = centerX + radius * Math.cos(angle) - 25; // -25 to center the ellipse (width/2)
      const y = centerY + radius * Math.sin(angle) - 12.5; // -12.5 to center the ellipse (height/2)
      ellipse.style.left = `${x}px`;
      ellipse.style.top = `${y}px`;
    });

    function calculateShadow(elementRect: DOMRect, mouseX: number, mouseY: number) {
      const elementCenterX = elementRect.left + elementRect.width / 2;
      const elementCenterY = elementRect.top + elementRect.height / 2;

      // Vector from light source (mouse) to element center
      const deltaX = elementCenterX - mouseX;
      const deltaY = elementCenterY - mouseY;

      // Distance for intensity
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY) || 1;

      // Normalize and scale for shadow offset
      const maxShadowDistance = 15;
      const shadowX = (deltaX / distance) * maxShadowDistance;
      const shadowY = (deltaY / distance) * maxShadowDistance;

      // Blur and opacity based on distance
      const maxDistance = Math.sqrt(window.innerWidth * window.innerWidth + window.innerHeight * window.innerHeight) || 1;
      const normalizedDistance = Math.min(distance / maxDistance, 1);

      const blur = 2 + normalizedDistance * 8; // 2 -> 10
      const opacity = Math.max(0.1, 0.4 - normalizedDistance * 0.3); // 0.4 -> 0.1

      return {
        x: isNaN(shadowX) ? 0 : shadowX,
        y: isNaN(shadowY) ? 0 : shadowY,
        blur,
        opacity,
      };
    }

    function updateShadows(mouseX: number, mouseY: number) {
      // Center ellipse
      const centerRect = centerEllipse.getBoundingClientRect();
      const centerShadow = calculateShadow(centerRect, mouseX, mouseY);
      centerEllipse.style.boxShadow = `${centerShadow.x}px ${centerShadow.y}px ${centerShadow.blur}px rgba(0, 0, 0, ${centerShadow.opacity})`;

      // Orbit ellipses
      orbitRefs.forEach((ref) => {
        const ellipse = ref.current;
        if (!ellipse) return;
        const rect = ellipse.getBoundingClientRect();
        const shadow = calculateShadow(rect, mouseX, mouseY);
        ellipse.style.boxShadow = `${shadow.x}px ${shadow.y}px ${shadow.blur}px rgba(0, 0, 0, ${shadow.opacity})`;
      });
    }

    const onMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      // Light cursor position
      lightCursor.style.left = `${mouseX}px`;
      lightCursor.style.top = `${mouseY}px`;
      // Update shadows
      updateShadows(mouseX, mouseY);
    };

    document.addEventListener('mousemove', onMouseMove);

    // Initialize with default light position (center of screen)
    const initialX = window.innerWidth / 2;
    const initialY = window.innerHeight / 2;
    lightCursor.style.left = `${initialX}px`;
    lightCursor.style.top = `${initialY}px`;
    updateShadows(initialX, initialY);

    const onResize = () => {
      const currentMouseX = parseInt(lightCursor.style.left, 10) || initialX;
      const currentMouseY = parseInt(lightCursor.style.top, 10) || initialY;
      updateShadows(currentMouseX, currentMouseY);
    };

    window.addEventListener('resize', onResize);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
    };
  }, [orbitRefs]);

  return (
    <div className="ds-root">
      <div className="instructions">Move your mouse to act as a light source</div>
      <div className="light-cursor" ref={lightCursorRef} />

      <div className="container" ref={containerRef}>
        <div className="center-ellipse" ref={centerRef} />
        {orbitRefs.map((ref, i) => (
          <div key={i} className="orbit-ellipse" ref={ref} />
        ))}
      </div>
    </div>
  );
};

export default DynamicShadowEffect;