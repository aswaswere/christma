import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ChristmasTree() {
  const [names, setNames] = useState(['Santa', 'Rudolph', 'Frosty', 'Jingle', 'Joy']);
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [searchName, setSearchName] = useState('');
  const [foundName, setFoundName] = useState(null);
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const treeGroupRef = useRef(null);
  const ornamentsRef = useRef([]);
  const lightsRef = useRef([]);
  const treeObjectsRef = useRef([]);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1128);
    sceneRef.current = scene;

    const treeGroup = new THREE.Group();
    scene.add(treeGroup);
    treeGroupRef.current = treeGroup;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 3, 8);
    camera.lookAt(0, 2, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffd700, 1.5, 100);
    pointLight.position.set(0, 10, 5);
    pointLight.castShadow = true;
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xffffff, 0.9, 100);
    pointLight2.position.set(-5, 5, -5);
    scene.add(pointLight2);

    // Create realistic organic Christmas Tree
    const createRealisticTree = () => {
      const treeLevels = 18; // Many more layers for smoother appearance
      const totalHeight = 6;
      
      for (let level = 0; level < treeLevels; level++) {
        const progress = level / treeLevels;
        const yPos = progress * totalHeight - 0.5;
        
        // Strong taper - much narrower at top
        const baseRadius = 1.9;
        const topRadius = 0.1;
        const radius = baseRadius - (baseRadius - topRadius) * Math.pow(progress, 1.5);
        
        // Thinner slices for more organic look
        const coneHeight = 0.5;
        const segments = 24; // Smoother circular shape
        
        const geometry = new THREE.ConeGeometry(radius, coneHeight, segments);
        
        // Vary green tones slightly for depth
        const greenShade = 0x1a4d2e + Math.floor(Math.random() * 0x050505);
        const material = new THREE.MeshPhongMaterial({ 
          color: greenShade,
          shininess: 15,
          flatShading: false
        });
        
        const cone = new THREE.Mesh(geometry, material);
        cone.position.y = yPos;
        cone.castShadow = true;
        cone.receiveShadow = true;
        treeGroup.add(cone);
        treeObjectsRef.current.push(cone);
        
        // Add fine needle details around each layer
        const needleCount = Math.floor(16 + level * 1.5);
        for (let i = 0; i < needleCount; i++) {
          const angle = (i / needleCount) * Math.PI * 2;
          const needleRadius = radius * 0.9;
          const x = Math.cos(angle) * needleRadius;
          const z = Math.sin(angle) * needleRadius;
          
          // Small needle clusters
          const needleGeometry = new THREE.ConeGeometry(0.08, 0.25, 4);
          const needleMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x0d5e1a,
            shininess: 8
          });
          const needle = new THREE.Mesh(needleGeometry, needleMaterial);
          needle.position.set(x, yPos + (Math.random() * 0.15 - 0.075), z);
          
          // Consistent downward angle
          needle.rotation.x = Math.PI / 2 + (Math.PI / 8);
          needle.rotation.z = angle;
          needle.castShadow = true;
          treeGroup.add(needle);
          treeObjectsRef.current.push(needle);
        }
      }

      // Realistic tree trunk
      const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.35, 1.0, 16);
      const trunkMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x3d2517,
        shininess: 5
      });
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.y = -0.5;
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      treeGroup.add(trunk);
      treeObjectsRef.current.push(trunk);

      // Elegant tree stand - matte metal
      const standBaseGeometry = new THREE.CylinderGeometry(0.6, 0.65, 0.15, 32);
      const standBaseMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x2a2a2a,
        shininess: 10,
        metalness: 0.3
      });
      const standBase = new THREE.Mesh(standBaseGeometry, standBaseMaterial);
      standBase.position.y = -1.05;
      standBase.receiveShadow = true;
      treeGroup.add(standBase);

      const standHolderGeometry = new THREE.CylinderGeometry(0.35, 0.4, 0.3, 16);
      const standHolder = new THREE.Mesh(standHolderGeometry, standBaseMaterial);
      standHolder.position.y = -0.85;
      standHolder.receiveShadow = true;
      treeGroup.add(standHolder);

      // Soft contact shadow (ground plane)
      const shadowGeometry = new THREE.CircleGeometry(1.2, 32);
      const shadowMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x000000,
        transparent: true,
        opacity: 0.3
      });
      const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = -1.12;
      treeGroup.add(shadow);

      // Refined star on top
      const starShape = new THREE.Shape();
      const starPoints = 5;
      const outerRadius = 0.35;
      const innerRadius = 0.15;
      
      for (let i = 0; i < starPoints * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / starPoints;
        const x = Math.cos(angle - Math.PI / 2) * radius;
        const y = Math.sin(angle - Math.PI / 2) * radius;
        if (i === 0) starShape.moveTo(x, y);
        else starShape.lineTo(x, y);
      }
      starShape.closePath();
      
      const starGeometry = new THREE.ExtrudeGeometry(starShape, {
        depth: 0.08,
        bevelEnabled: true,
        bevelThickness: 0.04,
        bevelSize: 0.04,
        bevelSegments: 2
      });
      
      const starMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffd700,
        emissive: 0xffaa00,
        emissiveIntensity: 0.7,
        shininess: 100
      });
      const star = new THREE.Mesh(starGeometry, starMaterial);
      star.position.y = 5.6;
      star.rotation.z = Math.PI;
      treeGroup.add(star);
      treeObjectsRef.current.push(star);
    };

    createRealisticTree();

    // Subtle twinkling lights
    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;
      const heightProgress = Math.random();
      const height = heightProgress * 5.5;
      const baseRadius = 1.9;
      const topRadius = 0.1;
      const radius = (baseRadius - (baseRadius - topRadius) * Math.pow(heightProgress, 1.5)) * 0.7;
      
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      const lightGeometry = new THREE.SphereGeometry(0.08, 8, 8);
      const colors = [0xff3333, 0xffff33, 0x3333ff, 0xff33ff, 0x33ffff, 0xff6633];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const lightMaterial = new THREE.MeshPhongMaterial({ 
        color: color,
        emissive: color,
        emissiveIntensity: 0.9
      });
      const light = new THREE.Mesh(lightGeometry, lightMaterial);
      light.position.set(x, height, z);
      treeGroup.add(light);
      lightsRef.current.push({ mesh: light, baseIntensity: 0.9 });
      treeObjectsRef.current.push(light);
    }

    // Snow particles
    const snowGeometry = new THREE.BufferGeometry();
    const snowCount = 1200;
    const snowPositions = new Float32Array(snowCount * 3);

    for (let i = 0; i < snowCount * 3; i += 3) {
      snowPositions[i] = (Math.random() - 0.5) * 40;
      snowPositions[i + 1] = Math.random() * 15;
      snowPositions[i + 2] = (Math.random() - 0.5) * 40;
    }

    snowGeometry.setAttribute('position', new THREE.BufferAttribute(snowPositions, 3));
    const snowMaterial = new THREE.PointsMaterial({ 
      color: 0xffffff, 
      size: 0.08,
      transparent: true,
      opacity: 0.7
    });
    const snow = new THREE.Points(snowGeometry, snowMaterial);
    scene.add(snow);

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      treeGroup.rotation.y += 0.002;

      lightsRef.current.forEach((light, index) => {
        const twinkle = Math.sin(time * 2.5 + index) * 0.3 + 0.8;
        light.mesh.material.emissiveIntensity = light.baseIntensity * twinkle;
      });

      // Update name scales based on camera distance
      ornamentsRef.current.forEach(ornament => {
        const worldPos = new THREE.Vector3();
        ornament.mesh.getWorldPosition(worldPos);
        const distance = cameraRef.current.position.distanceTo(worldPos);
        
        // Scale inversely with distance - very small at default zoom
        const baseScale = 0.15; // Much smaller at default distance
        const scale = Math.min(baseScale * (10 / distance), 2.5);
        ornament.sprite.scale.set(scale * 1.8, scale * 0.9, 1);
        
        // Opacity and glow increase as camera gets closer
        const opacity = Math.min((10 / distance) * 0.2, 1);
        ornament.sprite.material.opacity = opacity;
      });

      const positions = snow.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= 0.012;
        if (positions[i] < -5) {
          positions[i] = 15;
        }
      }
      snow.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
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
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!treeGroupRef.current) return;

    ornamentsRef.current.forEach(ornament => {
      treeGroupRef.current.remove(ornament.mesh);
      if (ornament.sprite) treeGroupRef.current.remove(ornament.sprite);
      if (ornament.string) treeGroupRef.current.remove(ornament.string);
      if (ornament.hook) treeGroupRef.current.remove(ornament.hook);
    });
    ornamentsRef.current = [];

    names.forEach((name, index) => {
      const angle = (index / names.length) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
      const heightProgress = 0.15 + (index % 8) * 0.1 + Math.random() * 0.08;
      const height = heightProgress * 5.5;
      
      const baseRadius = 1.9;
      const topRadius = 0.1;
      const radius = (baseRadius - (baseRadius - topRadius) * Math.pow(heightProgress, 1.5)) * 0.65;
      
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      // Tiny hook
      const hookGeometry = new THREE.SphereGeometry(0.025, 6, 6);
      const hookMaterial = new THREE.MeshPhongMaterial({ color: 0x555555 });
      const hook = new THREE.Mesh(hookGeometry, hookMaterial);
      hook.position.set(x, height + 0.28, z);
      treeGroupRef.current.add(hook);

      // Very thin hanging string (1-2px equivalent)
      const stringGeometry = new THREE.CylinderGeometry(0.004, 0.004, 0.25, 4);
      const stringMaterial = new THREE.MeshBasicMaterial({ color: 0x444444 });
      const string = new THREE.Mesh(stringGeometry, stringMaterial);
      string.position.set(x, height + 0.155, z);
      treeGroupRef.current.add(string);

      // Small refined ornament
      const ornamentGeometry = new THREE.SphereGeometry(0.15, 16, 16);
      const hue = index / names.length;
      const color = new THREE.Color().setHSL(hue, 0.65, 0.45);
      const ornamentMaterial = new THREE.MeshPhongMaterial({ 
        color: color,
        shininess: 110,
        emissive: 0x000000,
        specular: 0xffffff,
        transparent: true,
        opacity: 1
      });
      const ornament = new THREE.Mesh(ornamentGeometry, ornamentMaterial);
      ornament.position.set(x, height, z);
      ornament.castShadow = true;
      treeGroupRef.current.add(ornament);

      // Name text - no background, clean and archival
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 512;
      canvas.height = 256;
      
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      context.font = 'Bold 65px Georgia, serif'; // More elegant serif font
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      
      // Subtle glow
      context.shadowColor = 'rgba(255, 255, 255, 0.9)';
      context.shadowBlur = 12;
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
      
      // Thin white outline
      context.strokeStyle = '#ffffff';
      context.lineWidth = 6;
      context.strokeText(name, 256, 128);
      
      // Very thin dark outline for definition
      context.strokeStyle = '#000000';
      context.lineWidth = 2;
      context.strokeText(name, 256, 128);
      
      // Gold fill
      context.fillStyle = '#E8C468';
      context.shadowBlur = 10;
      context.shadowColor = 'rgba(232, 196, 104, 0.6)';
      context.fillText(name, 256, 128);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        opacity: 0.2 // Start very subtle
      });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.set(x, height - 0.32, z);
      sprite.scale.set(0.3, 0.15, 1); // Start very small
      sprite.renderOrder = 999;
      treeGroupRef.current.add(sprite);

      ornamentsRef.current.push({ 
        name, 
        mesh: ornament, 
        sprite,
        string,
        hook,
        angle,
        position: new THREE.Vector3(x, height, z),
        material: ornamentMaterial
      });
    });
  }, [names]);

  const handleAdminLogin = () => {
    if (password === 'admin123') {
      setIsAdmin(true);
      setPassword('');
    } else {
      alert('Incorrect password!');
      setPassword('');
    }
  };

  const handleAddName = () => {
    if (newName.trim()) {
      setNames([...names, newName.trim()]);
      setNewName('');
    }
  };

  const handleSearch = () => {
    const found = ornamentsRef.current.find(
      ornament => ornament.name.toLowerCase() === searchName.toLowerCase()
    );

    if (found) {
      setFoundName(found.name);
      
      treeObjectsRef.current.forEach(obj => {
        if (obj.material) {
          obj.material.transparent = true;
          obj.material.opacity = 0.25;
        }
      });
      
      ornamentsRef.current.forEach(ornament => {
        ornament.material.emissive.setHex(0x000000);
        ornament.material.transparent = true;
        ornament.material.opacity = 0.3;
      });
      
      found.material.emissive.setHex(0xffaa00);
      found.material.emissiveIntensity = 0.9;
      found.material.opacity = 1;

      const worldPos = new THREE.Vector3();
      found.mesh.getWorldPosition(worldPos);

      const camera = cameraRef.current;
      const startPos = camera.position.clone();
      
      const targetAngle = -found.angle + Math.PI;
      const startRotation = treeGroupRef.current.rotation.y;
      
      const distance = 2.2;
      const direction = worldPos.clone().sub(startPos).normalize();
      const endPos = worldPos.clone().sub(direction.multiplyScalar(distance));

      let progress = 0;
      const zoomAnimation = setInterval(() => {
        progress += 0.015;
        if (progress >= 1) {
          clearInterval(zoomAnimation);
          progress = 1;
        }
        
        found.mesh.getWorldPosition(worldPos);
        camera.position.lerpVectors(startPos, endPos, progress);
        camera.lookAt(worldPos);
        treeGroupRef.current.rotation.y = startRotation + (targetAngle - startRotation) * progress;
      }, 16);

      setTimeout(() => {
        setFoundName(null);
        treeObjectsRef.current.forEach(obj => {
          if (obj.material) {
            obj.material.opacity = 1;
          }
        });
        ornamentsRef.current.forEach(ornament => {
          ornament.material.opacity = 1;
        });
      }, 4000);
    } else {
      alert('Name not found on the tree!');
    }
    setSearchName('');
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div ref={mountRef} className="w-full h-full" />
      
      <div className="absolute top-0 left-0 right-0 p-6 text-center">
        <h1 className="text-5xl font-bold text-white mb-2" style={{ textShadow: '0 0 20px rgba(255,215,0,0.8), 0 0 40px rgba(255,215,0,0.5)' }}>
          🎄 Old Toons Wishes You A Very Merry Christmas 🎄
        </h1>
      </div>

      <div className="absolute top-32 right-6 w-96">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search for a name..."
            className="flex-1 px-4 py-3 rounded-lg text-lg bg-white/90 backdrop-blur-sm border-2 border-yellow-400 focus:outline-none focus:border-yellow-500"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
          >
            🔍
          </button>
        </div>
      </div>

      {foundName && (
        <div className="absolute top-48 right-6 bg-green-600 text-white px-8 py-4 rounded-lg text-xl font-bold animate-pulse">
          🎉 Found: {foundName} 🎉
        </div>
      )}

      <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-2xl border-2 border-red-500 w-80">
        {!isAdmin ? (
          <div>
            <h3 className="text-xl font-bold mb-4 text-red-600">🎅 Admin Login</h3>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
              placeholder="Enter password"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg mb-3 focus:outline-none focus:border-red-500"
            />
            <button
              onClick={handleAdminLogin}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition-colors"
            >
              Login
            </button>
            <p className="text-xs text-gray-500 mt-2">Hint: admin123</p>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-green-600">✨ Admin Mode</h3>
              <button
                onClick={() => setIsAdmin(false)}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddName()}
              placeholder="Enter new name"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg mb-3 focus:outline-none focus:border-green-500"
            />
            <button
              onClick={handleAddName}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition-colors"
            >
              Add Name to Tree
            </button>
            <div className="mt-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Current names ({names.length}):</p>
              <div className="max-h-32 overflow-y-auto text-sm text-gray-600">
                {names.map((name, idx) => (
                  <div key={idx} className="py-1 border-b border-gray-200">
                    {name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-xs">
        <h4 className="font-bold text-red-600 mb-2">🎁 How to use:</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Search for names in the search bar</li>
          <li>• Names become readable as you zoom closer</li>
          <li>• Admins can add new names</li>
        </ul>
      </div>
    </div>
  );
}
