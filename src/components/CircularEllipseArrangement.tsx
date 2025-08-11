import React from 'react';
import './CircularEllipseArrangement.css';

const CircularEllipseArrangement: React.FC = () => {
  const outerEllipses = 7;
  const radius = 150; // Distance from center to outer ellipses
  const ellipseSize = { width: 60, height: 30 }; // Size of each ellipse
  
  const generateEllipsePositions = () => {
    const positions = [];
    const angleStep = (2 * Math.PI) / outerEllipses;
    
    for (let i = 0; i < outerEllipses; i++) {
      const angle = i * angleStep;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      // Calculate rotation to face center (opposite of position angle)
      const rotation = (angle * 180 / Math.PI) + 90;
      
      positions.push({
        x,
        y,
        rotation,
        index: i
      });
    }
    
    return positions;
  };

  const ellipsePositions = generateEllipsePositions();

  return (
    <div className="circular-arrangement">
      <div className="center-ellipse" />
      
      {ellipsePositions.map(({ x, y, rotation, index }) => (
        <div
          key={index}
          className="outer-ellipse"
          style={{
            transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
};

export default CircularEllipseArrangement; 