import React, { useEffect, useRef } from 'react';

const ParticleBackground = ({ density = 'medium', enableShapes = true, enableGrid = true }) => {
  const particleContainerRef = useRef(null);
  const shapesContainerRef = useRef(null);

  useEffect(() => {
    const createParticles = () => {
      const container = particleContainerRef.current;
      if (!container) return;

      // Clear existing particles
      container.innerHTML = '';

      const particleCount = {
        light: 20,
        medium: 35,
        heavy: 50
      }[density] || 35;

      const colors = ['primary', 'secondary', 'accent'];
      const sizes = ['small', 'medium', 'large'];

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = `particle particle-${colors[Math.floor(Math.random() * colors.length)]} particle-${sizes[Math.floor(Math.random() * sizes.length)]}`;
        
        // Random positioning and animation timing
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.setProperty('--random-x', (Math.random() - 0.5) * 200 + 'px');
        
        container.appendChild(particle);
      }
    };

    const createFloatingShapes = () => {
      const container = shapesContainerRef.current;
      if (!container || !enableShapes) return;

      // Clear existing shapes
      container.innerHTML = '';

      const shapeCount = 15;
      const shapes = ['triangle', 'square', 'circle', 'diamond'];

      for (let i = 0; i < shapeCount; i++) {
        const shape = document.createElement('div');
        const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
        shape.className = `floating-shape shape-${shapeType}`;
        
        // Random positioning and animation
        shape.style.left = Math.random() * 100 + '%';
        shape.style.animationDuration = (Math.random() * 15 + 20) + 's';
        shape.style.animationDelay = Math.random() * 10 + 's';
        shape.style.setProperty('--drift-x', (Math.random() - 0.5) * 300 + 'px');
        shape.style.setProperty('--rotate-end', Math.random() * 720 + 'deg');
        
        container.appendChild(shape);
      }
    };

    createParticles();
    createFloatingShapes();

    // Recreate particles periodically to keep the effect fresh
    const interval = setInterval(() => {
      createParticles();
      createFloatingShapes();
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [density, enableShapes]);

  return (
    <>
      {/* Cyber grid overlay */}
      {enableGrid && <div className="cyber-grid-overlay" />}
      
      {/* Particle background */}
      <div className="particle-background">
        <div ref={particleContainerRef} className={`particles-${density}`} />
      </div>
      
      {/* Floating shapes */}
      {enableShapes && (
        <div className="floating-shapes">
          <div ref={shapesContainerRef} />
        </div>
      )}
    </>
  );
};

export default ParticleBackground;