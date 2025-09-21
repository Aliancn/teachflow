"use client";
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {createNoise3D} from 'simplex-noise';

export default function BackgroundAnimation() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.z = 120;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const noise3D = createNoise3D();

    const particleCount = 120;
    const particles: THREE.Vector3[] = [];
    const basePositions: THREE.Vector3[] = [];
    const positions = new Float32Array(particleCount * 3);
    const timeOffsets: number[] = [];

    const BOUND = 140;
    const center_size = BOUND /3 ;
    for (let i = 0; i < particleCount; i++) {
      const getRandomPositionInGrid = () => {
        // Ensure the particles are spread out within the grid sections and not in the center
        const len = Math.random() * BOUND + center_size;
        const angle = Math.random() * Math.PI * 2;
        const x = Math.cos(angle) * len;
        const y = Math.sin(angle) * len;
        const z = 0;  // Random offset for z
        return new THREE.Vector3(x, y, z);
      };
       
      // Generate random particle position within the chosen grid section
      const particlePosition = getRandomPositionInGrid();
    
      // Avoid the center gap by ensuring particles are always in the outer sections
      basePositions.push(particlePosition);
      particles.push(new THREE.Vector3(particlePosition.x, particlePosition.y, particlePosition.z));
      timeOffsets.push(Math.random() * 1000);
    
      positions[i * 3] = particlePosition.x;
      positions[i * 3 + 1] = particlePosition.y;
      positions[i * 3 + 2] = particlePosition.z;
    }
    

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x6366f1,
      size: 0.5,
      opacity: 0.3,
      transparent: true,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const maxDistance = 30;
    const minDistance = 10;
    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 1,
      depthWrite: false,
    });

    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(particleCount * particleCount * 3 * 2);
    const lineColors = new Float32Array(particleCount * particleCount * 2 * 3);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();
      const posAttr = geometry.attributes.position.array as Float32Array;
    
      for (let i = 0; i < particleCount; i++) {
        const base = basePositions[i];
        const offset = timeOffsets[i];
    
        // Get noise values
        const nx = noise3D(base.x * 0.005, base.y * 0.005, t * 0.2 + offset);
        const ny = noise3D(base.y * 0.005, base.z * 0.005, t * 0.2 + offset + 100);
        const nz = noise3D(base.z * 0.005, base.x * 0.005, t * 0.2 + offset + 200);
    
        // Expand the movement range by multiplying the noise with a larger factor
        let x = base.x + nx * 25;  // Increased movement range
        let y = base.y + ny * 25;  // Increased movement range
        let z = base.z + nz * 25;  // Increased movement range
    
        // Ensure particles don't enter the center region
        const distanceFromCenter = Math.sqrt(x * x + y * y + z * z);
        const INNER_THRESHOLD = 30;  // Define a threshold to keep particles away from the center
        if (distanceFromCenter < INNER_THRESHOLD) {
          // If the particle is too close to the center, move it outwards
          const scaleFactor = INNER_THRESHOLD / distanceFromCenter;
          x *= scaleFactor;
          y *= scaleFactor;
          z *= scaleFactor;
        }
    
        // Update the particle position
        particles[i].set(x, y, z);
        posAttr[i * 3] = x;
        posAttr[i * 3 + 1] = y;
        posAttr[i * 3 + 2] = z;
      }
    
      geometry.attributes.position.needsUpdate = true;
    
      let lineIdx = 0;
      let colorIdx = 0;
      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dist = p1.distanceTo(p2);
    
          if (dist < maxDistance && dist > minDistance) {
            linePositions[lineIdx++] = p1.x;
            linePositions[lineIdx++] = p1.y;
            linePositions[lineIdx++] = p1.z;
            linePositions[lineIdx++] = p2.x;
            linePositions[lineIdx++] = p2.y;
            linePositions[lineIdx++] = p2.z;
    
            const alpha = 1 - dist / maxDistance;
            const color = new THREE.Color(0x818cf8);
            lineColors[colorIdx++] = color.r * alpha;
            lineColors[colorIdx++] = color.g * alpha;
            lineColors[colorIdx++] = color.b * alpha;
    
            lineColors[colorIdx++] = color.r * alpha;
            lineColors[colorIdx++] = color.g * alpha;
            lineColors[colorIdx++] = color.b * alpha;
          }
        }
      }
    
      // Clean up extra line buffer
      for (let i = lineIdx; i < linePositions.length; i++) linePositions[i] = 0;
      for (let i = colorIdx; i < lineColors.length; i++) lineColors[i] = 0;
    
      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.attributes.color.needsUpdate = true;
    
      // Slow rotation and scaling for a 3D effect
      scene.rotation.z = t * 0.02;
      const scale = 1 + Math.sin(t * 0.3) * 0.05;
      scene.scale.set(scale, scale, scale);
    
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      geometry.dispose();
      lineGeometry.dispose();
      material.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 z-[-1]" />;
}
