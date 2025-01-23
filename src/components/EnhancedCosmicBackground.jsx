import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { ShaderMaterial } from "three";

const EnhancedCosmicBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Post-processing setup
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5, // Bloom strength
      0.4, // Bloom radius
      0.85 // Bloom threshold
    );
    composer.addPass(bloomPass);

    // Custom shader for galaxy particles
    const galaxyMaterial = new ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0x8844aa) },
      },
      vertexShader: `
        uniform float time;
        varying vec3 vColor;
        
        void main() {
          vec3 pos = position;
          float angle = time * 0.2;
          float radius = length(pos.xz);
          
          // Spiral motion
          float x = pos.x * cos(angle + radius * 0.2) - pos.z * sin(angle + radius * 0.2);
          float z = pos.x * sin(angle + radius * 0.2) + pos.z * cos(angle + radius * 0.2);
          
          // Vertical wave motion
          float y = pos.y + sin(time * 0.5 + radius * 0.3) * 2.0;
          
          vec4 mvPosition = modelViewMatrix * vec4(x, y, z, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          // Point size variation
          gl_PointSize = (50.0 / -mvPosition.z) * (sin(time + radius) * 0.5 + 1.5);
          
          // Color variation
          vColor = mix(
            vec3(0.5, 0.2, 1.0),  // Purple
            vec3(1.0, 0.4, 0.8),  // Pink
            sin(time * 0.5 + radius) * 0.5 + 0.5
          );
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          float alpha = 1.0 - (dist * 2.0);
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    // Create galaxy particles
    const galaxyGeometry = new THREE.BufferGeometry();
    const galaxyPositions = [];
    const galaxyParticleCount = 15000;

    for (let i = 0; i < galaxyParticleCount; i++) {
      // Spiral distribution
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 50;
      const spiralOffset = (Math.random() - 0.5) * 5;

      const x = Math.cos(angle) * radius;
      const y = (Math.random() - 0.5) * 20 + spiralOffset;
      const z = Math.sin(angle) * radius;

      galaxyPositions.push(x, y, z);
    }

    galaxyGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(galaxyPositions, 3)
    );

    const galaxyPoints = new THREE.Points(galaxyGeometry, galaxyMaterial);
    scene.add(galaxyPoints);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x444444);
    scene.add(ambientLight);

    // Add point lights
    const createPointLight = (color, intensity, distance, position) => {
      const light = new THREE.PointLight(color, intensity, distance);
      light.position.set(...position);
      return light;
    };

    const lights = [
      createPointLight(0xff8c19, 2, 450, [200, 300, 100]), // Orange
      createPointLight(0x9942f5, 2, 450, [-200, -300, -100]), // Purple
      createPointLight(0xff1960, 2, 450, [100, -200, 200]), // Pink
    ];

    lights.forEach((light) => scene.add(light));

    // Interactive light following cursor
    const cursorLight = new THREE.PointLight(0xffffff, 2, 200);
    scene.add(cursorLight);

    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX - windowHalfX) * 0.05;
      mouseY = (event.clientY - windowHalfY) * 0.05;

      // Update cursor light position
      const vector = new THREE.Vector3(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
        0.5
      );
      vector.unproject(camera);
      cursorLight.position.set(vector.x * 20, vector.y * 20, 50);
    };

    document.addEventListener("mousemove", handleMouseMove);

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.005;

      // Update galaxy shader time uniform
      galaxyMaterial.uniforms.time.value = time;

      // Camera movement
      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      // Animate lights
      lights.forEach((light, i) => {
        light.position.x = Math.sin(time + (i * Math.PI) / 2) * 300;
        light.position.y = Math.cos(time + (i * Math.PI) / 2) * 300;
      });

      // Render with post-processing
      composer.render();
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      mountRef.current?.removeChild(renderer.domElement);
      document.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{
        background:
          "radial-gradient(circle at center, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)",
      }}
    />
  );
};

export default EnhancedCosmicBackground;
