'use client';

import React, { useEffect, useRef } from 'react';

export const NetworkBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particles system
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      hue: number;

      constructor() {
        this.reset();
        this.life = Math.random();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.life = 1;
        this.maxLife = 1;
        this.hue = Math.random() * 60 + 180; // Blue-cyan range
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 0.005;

        // Gravity towards center
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const dx = centerX - this.x;
        const dy = centerY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
          this.vx += (dx / distance) * 0.0001;
          this.vy += (dy / distance) * 0.0001;
        }

        // Boundary check
        if (this.x < 0 || this.x > canvas.width || 
            this.y < 0 || this.y > canvas.height || 
            this.life <= 0) {
          this.reset();
        }
      }

      draw() {
        const alpha = this.life;
        const size = 2 + Math.sin(Date.now() * 0.001 + this.x * 0.01) * 1;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = `hsl(${this.hue}, 100%, 60%)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = `hsl(${this.hue}, 100%, 60%)`;
        ctx.fill();
        ctx.restore();
      }
    }

    // Connection lines
    class Connection {
      p1: Particle;
      p2: Particle;
      strength: number;

      constructor(p1: Particle, p2: Particle) {
        this.p1 = p1;
        this.p2 = p2;
        this.strength = Math.random();
      }

      draw() {
        const dx = this.p2.x - this.p1.x;
        const dy = this.p2.y - this.p1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const alpha = (1 - distance / 150) * 0.3 * this.p1.life * this.p2.life;
          
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = '#00d4ff';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(this.p1.x, this.p1.y);
          ctx.lineTo(this.p2.x, this.p2.y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    // Data flow lines
    class DataFlow {
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      progress: number;
      speed: number;
      hue: number;

      constructor() {
        this.reset();
      }

      reset() {
        this.startX = Math.random() * canvas.width;
        this.startY = Math.random() * canvas.height;
        this.endX = Math.random() * canvas.width;
        this.endY = Math.random() * canvas.height;
        this.progress = 0;
        this.speed = 0.005 + Math.random() * 0.01;
        this.hue = Math.random() * 60 + 180;
      }

      update() {
        this.progress += this.speed;
        if (this.progress >= 1) {
          this.reset();
        }
      }

      draw() {
        const currentX = this.startX + (this.endX - this.startX) * this.progress;
        const currentY = this.startY + (this.endY - this.startY) * this.progress;
        
        // Draw trail
        for (let i = 0; i < 10; i++) {
          const trailProgress = Math.max(0, this.progress - i * 0.05);
          const trailX = this.startX + (this.endX - this.startX) * trailProgress;
          const trailY = this.startY + (this.endY - this.startY) * trailProgress;
          const alpha = (1 - i / 10) * 0.8;
          
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = `hsl(${this.hue}, 100%, 70%)`;
          ctx.beginPath();
          ctx.arc(trailX, trailY, 2 - i * 0.1, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
    }

    // Initialize particles and flows
    const particles: Particle[] = [];
    const dataFlows: DataFlow[] = [];
    
    for (let i = 0; i < 100; i++) {
      particles.push(new Particle());
    }
    
    for (let i = 0; i < 20; i++) {
      dataFlows.push(new DataFlow());
    }

    // Animation loop
    function animate() {
      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw data flows
      dataFlows.forEach(flow => {
        flow.update();
        flow.draw();
      });

      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Draw connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const connection = new Connection(particles[i], particles[j]);
          connection.draw();
        }
      }

      // Draw central pulse
      const time = Date.now() * 0.002;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const pulseRadius = 50 + Math.sin(time) * 30;
      
      ctx.save();
      ctx.globalAlpha = 0.3 + Math.sin(time) * 0.2;
      ctx.strokeStyle = '#00d4ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Inner pulse
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius * 0.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      requestAnimationFrame(animate);
    }

    animate();

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Add particles near mouse
      if (Math.random() < 0.3) {
        const particle = new Particle();
        particle.x = mouseX + (Math.random() - 0.5) * 50;
        particle.y = mouseY + (Math.random() - 0.5) * 50;
        particles.push(particle);
        
        // Remove excess particles
        if (particles.length > 150) {
          particles.splice(0, 10);
        }
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0a 100%)'
      }}
    />
  );
}; 