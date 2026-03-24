"use client";

import React, { useEffect, useRef } from 'react';

/**
 * AnimatedNeuralBackground component
 * Renderiza una red neuronal dinámica usando HTML5 Canvas.
 */
const AnimatedNeuralBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    // Ajustar el tamaño del canvas al viewport
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(); // Reiniciar partículas para adaptar la densidad
    };

    // Clase para cada nodo (neurona)
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        // Velocidad de movimiento lenta y fluida
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        // Tamaño del nodo
        this.radius = Math.random() * 1.5 + 0.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Rebote suave en los bordes
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // Color azul base para los nodos
        ctx.fillStyle = 'rgba(0, 82, 255, 0.6)';
        ctx.fill();
      }
    }

    // Inicializar nodos basándose en el área de la pantalla
    const initParticles = () => {
      particles = [];
      // Ajusta este divisor para más o menos densidad de nodos
      const density = 12000;
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / density);

      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
      }
    };

    // Bucle de animación principal
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Actualizar y dibujar nodos
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Dibujar conexiones (sinapsis)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Rango máximo para que se conecten dos nodos
          const maxDistance = 120;

          if (distance < maxDistance) {
            ctx.beginPath();
            // La opacidad disminuye a medida que los nodos se separan
            const opacity = 1 - (distance / maxDistance);
            // Gradiente simulado usando el color predominante de tu diseño original
            ctx.strokeStyle = `rgba(138, 43, 226, ${opacity * 0.4})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    animate();

    // Cleanup al desmontar el componente
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="neural-canvas-background"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        backgroundColor: '#f8fafc' // Fondo claro según tu original
      }}
      aria-hidden="true"
    />
  );
};

export default AnimatedNeuralBackground;