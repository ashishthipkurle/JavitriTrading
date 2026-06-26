"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroChart() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const chartGroup = new THREE.Group();
    group.add(chartGroup);

    const barCount = 12;
    const bars: { mesh: THREE.Mesh; wick: THREE.Mesh; initialHeight: number; wickAbove: number; wickBelow: number; baseY: number; isUp: boolean; color: number }[] = [];

    // Generate a trending baseline so bars float at different levels (like real candlesticks)
    const basePrices: number[] = [];
    let price = 0;
    for (let i = 0; i < barCount; i++) {
      price += (Math.random() - 0.4) * 2; // trending slightly upward
      basePrices.push(price);
    }
    // Normalize basePrices to a reasonable range
    const minPrice = Math.min(...basePrices);
    const maxPrice = Math.max(...basePrices);
    const priceRange = maxPrice - minPrice || 1;

    for (let i = 0; i < barCount; i++) {
      const heightValue = 1.5 + Math.random() * 4;
      const geometry = new THREE.BoxGeometry(0.8, heightValue, 0.8);
      
      const isUp = Math.random() > 0.4;
      const color = isUp ? 0x00ff55 : 0xff1111;
      
      const material = new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.6,
        shininess: 200,
        specular: 0xffffff
      });

      const bar = new THREE.Mesh(geometry, material);
      bar.position.x = (i - barCount / 2) * 1.2;
      
      // Each bar floats at a different Y based on "price" - like real candlesticks
      const baseY = ((basePrices[i] - minPrice) / priceRange) * 4 - 4;
      bar.position.y = baseY + heightValue / 2;
      chartGroup.add(bar);
      
      // Thin wick lines above and below the bar body (like real candlesticks)
      const wickAbove = 0.5 + Math.random() * 1.5; // how far wick extends above bar
      const wickBelow = 0.3 + Math.random() * 1.0; // how far wick extends below bar
      const totalWickHeight = heightValue + wickAbove + wickBelow;
      
      const wickGeo = new THREE.CylinderGeometry(0.04, 0.04, totalWickHeight, 6);
      const wickMat = new THREE.MeshBasicMaterial({ color: color });
      const wick = new THREE.Mesh(wickGeo, wickMat);
      wick.position.x = bar.position.x;
      // Center the wick: it should span from (baseY - wickBelow) to (baseY + heightValue + wickAbove)
      wick.position.y = baseY + (heightValue + wickAbove - wickBelow) / 2;
      chartGroup.add(wick);
      
      bars.push({ mesh: bar, wick: wick, initialHeight: heightValue, wickAbove, wickBelow, baseY: baseY, isUp: isUp, color: color });
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.5, 20);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.set(0, 1.5, 18.5);
    camera.lookAt(0, 0, 0);

    group.rotation.y = 0; 
    group.rotation.x = 0;
    
    group.position.x = 1.5;
    group.position.y = -1.0; // Balanced between top and bottom

    let animationFrameId: number;

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      bars.forEach((b, i) => {
        const scaleY = 1 + Math.sin(time * 0.8 + i * 0.7) * 0.25;
        b.mesh.scale.y = scaleY;
        const currentHeight = b.initialHeight * scaleY;
        b.mesh.position.y = b.baseY + currentHeight / 2;
        
        // Update wick to follow the bar
        const totalWickHeight = currentHeight + b.wickAbove + b.wickBelow;
        b.wick.scale.y = totalWickHeight / (b.initialHeight + b.wickAbove + b.wickBelow);
        b.wick.position.y = b.baseY + (currentHeight + b.wickAbove - b.wickBelow) / 2;
      });

      renderer.render(scene, camera);
    }

    animate();

    function handleResize() {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full absolute inset-0 z-10" />;
}
