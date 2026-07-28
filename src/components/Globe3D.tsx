import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Letter } from '../types';
import { soundEngine } from '../services/soundEngine';
import { Sparkles, Compass, MapPin, Eye, ArrowRight } from 'lucide-react';

interface Globe3DProps {
  letters: Letter[];
  onSelectLetter: (letter: Letter) => void;
  selectedCategory?: string;
}

export const Globe3D: React.FC<Globe3DProps> = ({ letters, onSelectLetter, selectedCategory }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [hoveredLetter, setHoveredLetter] = useState<Letter | null>(null);
  const [selectedLocationGroup, setSelectedLocationGroup] = useState<{
    location: string;
    letters: Letter[];
  } | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 250;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group holding Earth and Markers
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Earth Sphere
    const radius = 80;
    const sphereGeo = new THREE.SphereGeometry(radius, 64, 64);

    // Dark Cosmic Ocean Material
    const sphereMat = new THREE.MeshPhongMaterial({
      color: new THREE.Color('#0B122E'),
      emissive: new THREE.Color('#060A1D'),
      specular: new THREE.Color('#1A2858'),
      shininess: 15,
      wireframe: false,
    });
    const earth = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(earth);

    // Outer Atmosphere Glow Ring
    const atmosphereGeo = new THREE.SphereGeometry(radius * 1.15, 64, 64);
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#44C8B5'),
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    globeGroup.add(atmosphere);

    // Procedural Landmass Dots Grid
    const landDotsGeo = new THREE.BufferGeometry();
    const dotsCount = 1800;
    const dotPositions: number[] = [];
    const dotColors: number[] = [];

    // Simple geographical dot density simulation
    for (let i = 0; i < dotsCount; i++) {
      const lat = (Math.random() - 0.5) * Math.PI;
      const lng = (Math.random() - 0.5) * Math.PI * 2;
      const r = radius + 0.5;

      const x = r * Math.cos(lat) * Math.sin(lng);
      const y = r * Math.sin(lat);
      const z = r * Math.cos(lat) * Math.cos(lng);

      dotPositions.push(x, y, z);

      // Color palette for land particles
      const isGold = Math.random() > 0.8;
      const color = isGold ? new THREE.Color('#F3C978') : new THREE.Color('#2A3C74');
      dotColors.push(color.r, color.g, color.b);
    }

    landDotsGeo.setAttribute('position', new THREE.Float32BufferAttribute(dotPositions, 3));
    landDotsGeo.setAttribute('color', new THREE.Float32BufferAttribute(dotColors, 3));

    const dotsMat = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });
    const landDots = new THREE.Points(landDotsGeo, dotsMat);
    globeGroup.add(landDots);

    // Orbital Celestial Ring (Representing Chapter 24)
    const ringGeo = new THREE.RingGeometry(radius * 1.35, radius * 1.38, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#F3C978'),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.8;
    globeGroup.add(ring);

    // Convert Lat/Lng to 3D Coordinates
    const latLngToVector = (lat: number, lng: number, r: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      const x = -(r * Math.sin(phi) * Math.cos(theta));
      const z = r * Math.sin(phi) * Math.sin(theta);
      const y = r * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    // Filter letters if category is selected
    const activeLetters = selectedCategory
      ? letters.filter(l => l.category === selectedCategory)
      : letters;

    // Create 3D Pin Markers for Letters
    const markerGroup = new THREE.Group();
    const markerObjects: { mesh: THREE.Mesh; letter: Letter; basePos: THREE.Vector3 }[] = [];

    activeLetters.forEach(letter => {
      const lat = letter.lat ?? (Math.random() * 120 - 60);
      const lng = letter.lng ?? (Math.random() * 360 - 180);

      const pos = latLngToVector(lat, lng, radius + 1.2);

      // Glowing marker geometry
      const markerGeo = new THREE.SphereGeometry(2.2, 16, 16);
      const isGolden = letter.rarity === 'golden' || letter.rarity === 'founders';
      const markerMat = new THREE.MeshBasicMaterial({
        color: isGolden ? new THREE.Color('#F3C978') : new THREE.Color('#C7A4FF'),
      });

      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.copy(pos);

      // Light beam extending out
      const beamGeo = new THREE.CylinderGeometry(0.2, 0.8, 12, 8);
      const beamMat = new THREE.MeshBasicMaterial({
        color: isGolden ? new THREE.Color('#F3C978') : new THREE.Color('#7AE0ED'),
        transparent: true,
        opacity: 0.5,
      });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.copy(pos.clone().multiplyScalar(1.05));
      beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());

      markerGroup.add(marker);
      markerGroup.add(beam);

      markerObjects.push({ mesh: marker, letter, basePos: pos });
    });

    globeGroup.add(markerGroup);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404070, 2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xfff1d0, 2.5);
    dirLight1.position.set(150, 100, 150);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x88aaff, 1.5);
    dirLight2.position.set(-150, -100, -150);
    scene.add(dirLight2);

    // Drag / Rotation Controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) {
        // Raycasting for hover state
        const rect = renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(markerObjects.map(m => m.mesh));
        if (intersects.length > 0) {
          const hit = markerObjects.find(m => m.mesh === intersects[0].object);
          if (hit && hit.letter !== hoveredLetter) {
            setHoveredLetter(hit.letter);
            soundEngine.playChime(987.77, 0.4);
          }
        } else {
          setHoveredLetter(null);
        }
        return;
      }

      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      globeGroup.rotation.y += deltaX * 0.005;
      globeGroup.rotation.x += deltaY * 0.005;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Click handler on marker
    const onClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(markerObjects.map(m => m.mesh));
      if (intersects.length > 0) {
        const hit = markerObjects.find(m => m.mesh === intersects[0].object);
        if (hit) {
          soundEngine.playChime(1318.51, 0.6);
          const locationLetters = activeLetters.filter(l => l.location === hit.letter.location);
          setSelectedLocationGroup({
            location: hit.letter.location,
            letters: locationLetters,
          });
        }
      }
    };
    domElem.addEventListener('click', onClick);

    // Animation Loop
    let frameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slow idle rotation if not dragging
      if (!isDragging) {
        globeGroup.rotation.y += 0.0015;
      }

      // Animate orbital ring & atmosphere
      ring.rotation.z = elapsedTime * 0.05;

      // Pulse markers
      markerObjects.forEach((m, idx) => {
        const s = 1 + Math.sin(elapsedTime * 3 + idx) * 0.2;
        m.mesh.scale.set(s, s, s);
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      domElem.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElem.removeEventListener('click', onClick);
      cancelAnimationFrame(frameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [letters, selectedCategory]);

  return (
    <div className="relative w-full h-[600px] md:h-[700px] rounded-3xl overflow-hidden glass-panel border border-amber-400/20 shadow-2xl flex flex-col justify-between">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing z-0" />

      {/* Floating Instructions Header */}
      <div className="relative z-10 p-6 flex flex-col md:flex-row items-start md:items-center justify-between pointer-events-none gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-200 text-xs font-cinzel">
            <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
            <span>Interactive Celestial World</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif-display text-gradient-gold mt-1">
            Global Constellations of Stories
          </h2>
          <p className="text-sm text-indigo-200/80 max-w-md">
            Click and drag to rotate the globe. Every glowing light beam marks a letter sent from across the Earth for Chapter 24.
          </p>
        </div>

        {/* Hovered Letter Tooltip */}
        {hoveredLetter && (
          <div className="pointer-events-auto glass-panel-gold p-4 rounded-2xl max-w-xs animate-fade-in shadow-xl">
            <div className="flex items-center gap-2 text-xs text-amber-300 font-cinzel">
              <MapPin className="w-3.5 h-3.5" />
              <span>{hoveredLetter.location}</span>
            </div>
            <p className="text-sm text-slate-100 font-serif-display italic mt-1 line-clamp-2">
              "{hoveredLetter.content}"
            </p>
            <div className="flex items-center justify-between text-xs text-indigo-200/70 mt-2">
              <span>By {hoveredLetter.name}</span>
              <span className="text-amber-400 font-mono">Archive #{hoveredLetter.archiveNumber}</span>
            </div>
          </div>
        )}
      </div>

      {/* Location Group Modal Drawer when a pin is clicked */}
      {selectedLocationGroup && (
        <div className="relative z-20 m-6 p-6 glass-panel-gold rounded-2xl border border-amber-400/40 animate-slide-up shadow-2xl backdrop-blur-2xl max-w-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-xl font-serif-display text-amber-200">
                Letters from {selectedLocationGroup.location}
              </h3>
            </div>
            <button
              onClick={() => setSelectedLocationGroup(null)}
              className="text-amber-300/70 hover:text-amber-200 text-sm px-2 py-1 rounded-lg bg-amber-900/30"
            >
              ✕ Close
            </button>
          </div>

          <p className="text-xs text-amber-200/80 mb-3">
            {selectedLocationGroup.letters.length} preserved story envelopes floating in this region.
          </p>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {selectedLocationGroup.letters.map(letter => (
              <div
                key={letter.id}
                onClick={() => {
                  soundEngine.playUnfoldShimmer();
                  onSelectLetter(letter);
                  setSelectedLocationGroup(null);
                }}
                className="p-3 rounded-xl bg-slate-900/60 border border-amber-400/20 hover:border-amber-400/60 transition cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-100 group-hover:text-amber-300 transition flex items-center gap-2">
                    <span>{letter.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900/50 text-purple-200 border border-purple-400/30">
                      {letter.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 italic line-clamp-1 mt-0.5">
                    "{letter.content}"
                  </p>
                </div>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-mono pl-2">
                  <span>Open</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Instructions */}
      <div className="relative z-10 p-4 text-center text-xs text-indigo-300/60 pointer-events-none">
        ✦ Rotate to discover letters from 52+ countries floating in the starlight ✦
      </div>
    </div>
  );
};
