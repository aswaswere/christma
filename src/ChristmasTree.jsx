import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ChristmasTree() {
  // Detect mobile device
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;

  const [isLoading, setIsLoading] = useState(true);

  // Old Toons community members - showing 20 names
  const [names] = useState([
    'LFChowning',
    'e4tango',
    'Cretaceous27738',
    'FangSif1994',
    'JumboShark19',
    'SalFerrara32341',
    'GinTsuKitsune',
    'Mateus20066892',
    'jackbrady1010',
    'Murphyin10EC',
    'miss_neishalynn',
    'cmorrissey59',
    'harvey8112',
    'PerezFr34896489',
    'malvind033',
    'nategordon',
    'keichiminamoto',
    'rootedwlovee',
    'Natesangel4800',
    'charmcas1er',
  ]);
  const [searchName, setSearchName] = useState('');
  const [foundName, setFoundName] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
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

    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile }); // Disable antialiasing on mobile
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = !isMobile; // Disable shadows on mobile for better performance
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Ambient light for overall scene illumination - brighter
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // Main spotlight from above (like room light) - brighter
    const spotLight = new THREE.SpotLight(0xffffff, 1.8);
    spotLight.position.set(0, 10, 5);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.5;
    spotLight.decay = 2;
    spotLight.distance = 20;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    scene.add(spotLight);

    // Warm point light from the side (like fireplace glow) - brighter
    const pointLight1 = new THREE.PointLight(0xffaa66, 1.2, 15);
    pointLight1.position.set(-5, 3, -5);
    scene.add(pointLight1);

    // Cool point light from other side for depth - brighter
    const pointLight2 = new THREE.PointLight(0x6699ff, 1.0, 15);
    pointLight2.position.set(5, 4, -3);
    scene.add(pointLight2);

    // Soft fill light from front - brighter
    const fillLight = new THREE.PointLight(0xffffff, 0.9, 20);
    fillLight.position.set(0, 2, 10);
    scene.add(fillLight);

    // Create realistic organic Christmas Tree
    const createRealisticTree = () => {
      // Reduce quality on mobile
      const treeLevels = isMobile ? 12 : 18; // Fewer layers on mobile
      const totalHeight = 6;
      const baseRadius = 1.9;
      const topRadius = 0.1;

      // Central stem/trunk extending through the tree (stops before the star)
      const stemHeight = totalHeight - 0.5; // Shorter to not reach the star
      const stemSegments = isMobile ? 6 : 12; // Simpler geometry on mobile
      const stemGeometry = new THREE.CylinderGeometry(0.08, 0.12, stemHeight, stemSegments);
      const stemMaterial = new THREE.MeshPhongMaterial({
        color: 0x2d1f0f,
        shininess: 3
      });
      const stem = new THREE.Mesh(stemGeometry, stemMaterial);
      stem.position.y = 2.25; // Lower position so it doesn't reach the top
      stem.castShadow = true;
      stem.receiveShadow = true;
      treeGroup.add(stem);
      treeObjectsRef.current.push(stem);

      for (let level = 0; level < treeLevels; level++) {
        const progress = level / treeLevels;
        const yPos = progress * totalHeight - 0.5;
        const radius = baseRadius - (baseRadius - topRadius) * Math.pow(progress, 1.5);

        const coneHeight = 0.5;
        const segments = isMobile ? 16 : 32; // Fewer segments on mobile for better performance

        const geometry = new THREE.ConeGeometry(radius, coneHeight, segments);

        // Gradient color blending: much brighter, more vibrant greens
        const baseGreen = new THREE.Color(0x4a9d5f); // Brighter forest green
        const topGreen = new THREE.Color(0x5cbd73);  // Even brighter green
        const blendedColor = baseGreen.clone().lerp(topGreen, progress);

        // Add tiny random variation to break banding
        const variation = (Math.random() - 0.5) * 0.02;
        blendedColor.offsetHSL(0, 0, variation);

        // Light falloff for realism
        const lightFalloff = 0.8 + (progress * 0.2);

        const material = new THREE.MeshPhongMaterial({
          color: blendedColor,
          shininess: 20,
          flatShading: false,
          emissive: blendedColor,
          emissiveIntensity: 0.15 * lightFalloff // Much brighter emissive
        });

        const cone = new THREE.Mesh(geometry, material);
        cone.position.y = yPos;
        cone.castShadow = true;
        cone.receiveShadow = true;
        treeGroup.add(cone);
        treeObjectsRef.current.push(cone);

        // Add needle details with gradient colors too (skip on mobile for performance)
        const needleCount = isMobile ? 0 : Math.floor(16 + level * 1.5); // No needles on mobile
        for (let i = 0; i < needleCount; i++) {
          const angle = (i / needleCount) * Math.PI * 2;
          const needleRadius = radius * 0.9;
          const x = Math.cos(angle) * needleRadius;
          const z = Math.sin(angle) * needleRadius;

          const needleGeometry = new THREE.ConeGeometry(0.08, 0.25, 4);
          const needleColor = blendedColor.clone().offsetHSL(0, 0.05, -0.1);
          const needleMaterial = new THREE.MeshPhongMaterial({
            color: needleColor,
            shininess: 8,
            flatShading: false
          });
          const needle = new THREE.Mesh(needleGeometry, needleMaterial);
          needle.position.set(x, yPos + (Math.random() * 0.15 - 0.075), z);
          needle.rotation.x = Math.PI / 2 + (Math.PI / 8);
          needle.rotation.z = angle;
          needle.castShadow = true;
          treeGroup.add(needle);
          treeObjectsRef.current.push(needle);
        }
      }

      // Realistic tree trunk
      const trunkSegments = isMobile ? 8 : 16; // Simpler on mobile
      const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.35, 1.0, trunkSegments);
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

      // Gift boxes - stable group (not rotating with tree)
      const giftGroup = new THREE.Group();
      scene.add(giftGroup); // Add to scene, not treeGroup, so they don't rotate

      // Bright, festive colors
      const giftColors = [
        { box: 0xff3333, ribbon: 0xffd700 }, // Bright red with gold
        { box: 0x33cc33, ribbon: 0xff1a1a }, // Bright green with red
        { box: 0xffcc00, ribbon: 0xff6600 }, // Bright yellow with orange
        { box: 0xff66cc, ribbon: 0xffffff }, // Pink with white
        { box: 0x3399ff, ribbon: 0xffff33 }, // Blue with yellow
        { box: 0xff6600, ribbon: 0x00ff00 }, // Orange with green
      ];

      // Position gifts on left and right sides - doubled count
      const giftPositions = [
        // Left side - front to back
        { x: -2.5, z: 0.8 },
        { x: -2.3, z: 0.3 },
        { x: -2.7, z: -0.2 },
        { x: -2.4, z: -0.7 },
        { x: -2.6, z: 1.2 },
        { x: -2.2, z: -1.0 },
        // Right side - front to back
        { x: 2.5, z: 0.7 },
        { x: 2.3, z: 0.2 },
        { x: 2.7, z: -0.3 },
        { x: 2.4, z: -0.8 },
        { x: 2.6, z: 1.1 },
        { x: 2.2, z: -1.1 },
      ];

      giftPositions.forEach((pos, i) => {
        const giftSize = 0.3 + Math.random() * 0.15;
        const giftHeight = giftSize * (0.9 + Math.random() * 0.3);

        // Gift box - sitting on ground
        const boxGeometry = new THREE.BoxGeometry(giftSize, giftHeight, giftSize);
        const colorSet = giftColors[i % giftColors.length];
        const boxMaterial = new THREE.MeshPhongMaterial({
          color: colorSet.box,
          shininess: 25
        });
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.position.set(pos.x, -1.1 + giftHeight / 2, pos.z);
        box.rotation.y = Math.random() * 0.5 - 0.25; // Small random rotation
        box.castShadow = true;
        box.receiveShadow = true;
        giftGroup.add(box);

        // Ribbon (horizontal)
        const ribbonGeometry = new THREE.BoxGeometry(giftSize + 0.02, 0.04, 0.05);
        const ribbonMaterial = new THREE.MeshPhongMaterial({
          color: colorSet.ribbon,
          shininess: 50
        });
        const ribbon1 = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
        ribbon1.position.set(pos.x, -1.1 + giftHeight / 2, pos.z);
        ribbon1.rotation.y = box.rotation.y;
        giftGroup.add(ribbon1);

        // Ribbon (vertical)
        const ribbon2Geometry = new THREE.BoxGeometry(0.05, giftHeight + 0.02, 0.04);
        const ribbon2 = new THREE.Mesh(ribbon2Geometry, ribbonMaterial);
        ribbon2.position.set(pos.x, -1.1 + giftHeight / 2, pos.z);
        ribbon2.rotation.y = box.rotation.y;
        giftGroup.add(ribbon2);

        // Bow on top (made of two spheres)
        const bowGeometry = new THREE.SphereGeometry(0.06, 8, 8);
        const bow1 = new THREE.Mesh(bowGeometry, ribbonMaterial);
        bow1.position.set(pos.x - 0.04, -1.1 + giftHeight + 0.04, pos.z);
        bow1.scale.set(1.2, 0.6, 0.8);
        giftGroup.add(bow1);

        const bow2 = new THREE.Mesh(bowGeometry, ribbonMaterial);
        bow2.position.set(pos.x + 0.04, -1.1 + giftHeight + 0.04, pos.z);
        bow2.scale.set(1.2, 0.6, 0.8);
        giftGroup.add(bow2);
      });
    };

    createRealisticTree();

    // Subtle twinkling lights - positioned on the outside of the tree
    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;
      const heightProgress = Math.random();
      const height = heightProgress * 5.5;
      const baseRadius = 1.9;
      const topRadius = 0.1;
      // Position lights on the surface, not inside the tree
      const radius = (baseRadius - (baseRadius - topRadius) * Math.pow(heightProgress, 1.5)) * 0.95;

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

    // Snow crystals - using sprite textures for snowflake shapes
    const snowflakeGroup = new THREE.Group();
    const snowCount = isMobile ? 300 : 1200; // Reduce snowflakes on mobile for performance

    // Create snowflake texture (6-pointed star/crystal)
    const createSnowflakeTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');

      const cx = 32, cy = 32;
      ctx.fillStyle = 'white';

      // Draw 6-pointed star
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);

        // Main branch
        ctx.fillRect(-1, -20, 2, 20);

        // Side branches
        ctx.save();
        ctx.translate(0, -12);
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-1, 0, 2, 6);
        ctx.restore();

        ctx.save();
        ctx.translate(0, -12);
        ctx.rotate(-Math.PI / 4);
        ctx.fillRect(-1, 0, 2, 6);
        ctx.restore();

        ctx.restore();
      }

      return new THREE.CanvasTexture(canvas);
    };

    const snowflakeTexture = createSnowflakeTexture();

    for (let i = 0; i < snowCount; i++) {
      const spriteMaterial = new THREE.SpriteMaterial({
        map: snowflakeTexture,
        transparent: true,
        opacity: 0.7 + Math.random() * 0.3,
        color: 0xffffff
      });

      const sprite = new THREE.Sprite(spriteMaterial);
      const size = 0.1 + Math.random() * 0.15;
      sprite.scale.set(size, size, 1);

      sprite.position.set(
        (Math.random() - 0.5) * 40,
        Math.random() * 15,
        (Math.random() - 0.5) * 40
      );

      // Store fall speed for animation
      sprite.userData.fallSpeed = 0.008 + Math.random() * 0.008;
      sprite.userData.rotationSpeed = (Math.random() - 0.5) * 0.02;

      snowflakeGroup.add(sprite);
    }

    scene.add(snowflakeGroup);

    // Animation
    let time = 0;
    // Throttle heavy calculations for mobile performance
    let frameCount = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;
      frameCount++;

      // Disable rotation on mobile for better performance
      if (!isMobile) {
        treeGroup.rotation.y += 0.002;
      }

      // Update lights every frame (lightweight)
      lightsRef.current.forEach((light, index) => {
        const twinkle = Math.sin(time * 2.5 + index) * 0.3 + 0.8;
        light.mesh.material.emissiveIntensity = light.baseIntensity * twinkle;
      });

      // Update name scales less frequently (every 3 frames) for better mobile performance
      if (frameCount % 3 === 0) {
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
      }

      // Animate snowflakes - falling and rotating
      snowflakeGroup.children.forEach(snowflake => {
        snowflake.position.y -= snowflake.userData.fallSpeed;
        snowflake.material.rotation += snowflake.userData.rotationSpeed;

        // Reset to top when it falls below
        if (snowflake.position.y < -5) {
          snowflake.position.y = 15;
          snowflake.position.x = (Math.random() - 0.5) * 40;
          snowflake.position.z = (Math.random() - 0.5) * 40;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Set loading to false after a short delay to let the scene render
    setTimeout(() => {
      setIsLoading(false);
    }, 500);

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
      if (ornament.cap) treeGroupRef.current.remove(ornament.cap);
    });
    ornamentsRef.current = [];

    names.forEach((name, index) => {
      const angle = (index / names.length) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
      const heightProgress = 0.15 + (index % 8) * 0.1 + Math.random() * 0.08;
      const height = heightProgress * 5.5;

      const baseRadius = 1.9;
      const topRadius = 0.1;
      // Position ornaments OUTSIDE the tree by using a larger multiplier
      const radius = (baseRadius - (baseRadius - topRadius) * Math.pow(heightProgress, 1.5)) * 1.05; // Was 0.65, now 1.05 to be outside

      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      // Find attachment point on tree (branch point)
      const branchAngle = angle + (Math.random() - 0.5) * 0.1;
      const branchRadius = radius * 0.85;
      const branchX = Math.cos(branchAngle) * branchRadius;
      const branchZ = Math.sin(branchAngle) * branchRadius;
      const branchY = height + 0.3;

      // Tiny hook at branch attachment point
      const hookGeometry = new THREE.SphereGeometry(0.02, 8, 8);
      const hookMaterial = new THREE.MeshPhongMaterial({
        color: 0xd4af37, // Gold color
        shininess: 60,
        metalness: 0.7
      });
      const hook = new THREE.Mesh(hookGeometry, hookMaterial);
      hook.position.set(branchX, branchY, branchZ);
      treeGroupRef.current.add(hook);

      // Curved hanging string with gravity sag
      const stringCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(branchX, branchY, branchZ), // Start at branch
        new THREE.Vector3(
          (branchX + x) / 2,
          height + 0.15, // Sag in the middle
          (branchZ + z) / 2
        ),
        new THREE.Vector3(x, height + 0.18, z) // End at ornament cap
      );

      const stringPoints = stringCurve.getPoints(20);
      const stringGeometry = new THREE.BufferGeometry().setFromPoints(stringPoints);
      const stringMaterial = new THREE.LineBasicMaterial({
        color: 0xd4af37, // Gold string
        linewidth: 2
      });
      const string = new THREE.Line(stringGeometry, stringMaterial);
      treeGroupRef.current.add(string);

      // Ornament cap/stem (the metal top part)
      const capGeometry = new THREE.CylinderGeometry(0.035, 0.045, 0.06, 12);
      const capMaterial = new THREE.MeshPhongMaterial({
        color: 0xd4af37, // Gold to match string
        shininess: 80,
        metalness: 0.8
      });
      const cap = new THREE.Mesh(capGeometry, capMaterial);
      cap.position.set(x, height + 0.18, z);
      treeGroupRef.current.add(cap);

      // Small refined ornament with better material
      const ornamentGeometry = new THREE.SphereGeometry(0.15, 32, 32);
      const hue = index / names.length;
      const color = new THREE.Color().setHSL(hue, 0.7, 0.5);
      const ornamentMaterial = new THREE.MeshPhongMaterial({
        color: color,
        shininess: 120,
        emissive: color,
        emissiveIntensity: 0.1,
        specular: 0xffffff,
        transparent: true,
        opacity: 0.95,
        reflectivity: 0.8
      });
      const ornament = new THREE.Mesh(ornamentGeometry, ornamentMaterial);
      ornament.position.set(x, height, z);
      ornament.castShadow = true;
      ornament.receiveShadow = true;
      treeGroupRef.current.add(ornament);

      // Name text - high resolution for mobile clarity
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      // Much higher resolution for crisp text on all devices
      canvas.width = 2048;
      canvas.height = 512;

      context.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate optimal font size based on name length
      let fontSize = 130; // Doubled for high-res canvas
      context.font = `Bold ${fontSize}px Georgia, serif`;
      let textWidth = context.measureText(name).width;

      // Reduce font size if text is too wide (with padding for borders)
      const maxWidth = canvas.width - 160; // Leave padding for borders and glow
      while (textWidth > maxWidth && fontSize > 50) {
        fontSize -= 4;
        context.font = `Bold ${fontSize}px Georgia, serif`;
        textWidth = context.measureText(name).width;
      }

      context.textAlign = 'center';
      context.textBaseline = 'middle';

      // Subtle glow (scaled for high-res)
      context.shadowColor = 'rgba(255, 255, 255, 0.9)';
      context.shadowBlur = 24;
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;

      // Thin white outline (scaled for high-res)
      context.strokeStyle = '#ffffff';
      context.lineWidth = 12;
      context.strokeText(name, canvas.width / 2, canvas.height / 2);

      // Very thin dark outline for definition (scaled for high-res)
      context.strokeStyle = '#000000';
      context.lineWidth = 4;
      context.strokeText(name, canvas.width / 2, canvas.height / 2);

      // Gold fill
      context.fillStyle = '#E8C468';
      context.shadowBlur = 20;
      context.shadowColor = 'rgba(232, 196, 104, 0.6)';
      context.fillText(name, canvas.width / 2, canvas.height / 2);

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter; // Better downsampling
      texture.magFilter = THREE.LinearFilter; // Smoother magnification
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
        cap,
        angle,
        position: new THREE.Vector3(x, height, z),
        material: ornamentMaterial,
        originalTexture: texture // Store original texture for reset
      });
    });
  }, [names]);

  const resetView = () => {
    const camera = cameraRef.current;
    const startPos = camera.position.clone();
    const defaultPos = new THREE.Vector3(0, 3, 8);

    // Reset all materials
    treeObjectsRef.current.forEach(obj => {
      if (obj.material) {
        obj.material.opacity = 1;
      }
    });

    ornamentsRef.current.forEach(ornament => {
      ornament.material.emissive.setHex(0x000000);
      ornament.material.opacity = 1;
      ornament.material.depthTest = true;
      ornament.material.depthWrite = true;
      // Reset name sprite opacity, texture, and rendering order to default
      if (ornament.sprite && ornament.sprite.material) {
        ornament.sprite.material.opacity = 0.2; // Back to default subtle visibility
        ornament.sprite.renderOrder = 999; // Back to default render order
        ornament.sprite.material.depthTest = false; // Back to default
        ornament.sprite.material.depthWrite = false;
        if (ornament.originalTexture) {
          ornament.sprite.material.map = ornament.originalTexture;
          ornament.sprite.material.needsUpdate = true;
        }
      }
    });

    // Animate back to default view using requestAnimationFrame for smoother performance
    let progress = 0;
    const animateReset = () => {
      progress += 0.02; // Slightly faster for quicker return

      if (progress >= 1) {
        progress = 1;
        setIsZoomed(false);
        setFoundName(null);
      }

      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      camera.position.lerpVectors(startPos, defaultPos, easeProgress);
      camera.lookAt(0, 2, 0);

      // Continue animation if not finished
      if (progress < 1) {
        requestAnimationFrame(animateReset);
      }
    };
    requestAnimationFrame(animateReset);
  };

  const handleSearch = () => {
    // Check if name exists in the list
    const nameExists = names.find(name => name.toLowerCase() === searchName.toLowerCase());

    if (nameExists) {
      setFoundName(nameExists);
      setIsZoomed(true);

      // Generate random position on the tree
      const randomAngle = Math.random() * Math.PI * 2;
      const randomHeightProgress = 0.2 + Math.random() * 0.6; // Between 20% and 80% height
      const randomHeight = randomHeightProgress * 5.5;

      const baseRadius = 1.9;
      const topRadius = 0.1;
      const radius = (baseRadius - (baseRadius - topRadius) * Math.pow(randomHeightProgress, 1.5)) * 1.05;

      const x = Math.cos(randomAngle) * radius;
      const z = Math.sin(randomAngle) * radius;

      // Create or update the ornament at this random position
      let found = ornamentsRef.current.find(orn => orn.name === nameExists);

      if (found) {
        // Update position of existing ornament
        found.mesh.position.set(x, randomHeight, z);
        found.sprite.position.set(x, randomHeight - 0.32, z);
        if (found.string) treeGroupRef.current.remove(found.string);
        if (found.hook) treeGroupRef.current.remove(found.hook);
        if (found.cap) treeGroupRef.current.remove(found.cap);
        found.angle = randomAngle;
        found.position = new THREE.Vector3(x, randomHeight, z);

        // Recreate hanging elements at new position
        const branchRadius = radius * 0.85;
        const branchX = Math.cos(randomAngle) * branchRadius;
        const branchZ = Math.sin(randomAngle) * branchRadius;
        const branchY = randomHeight + 0.3;

        const hookGeometry = new THREE.SphereGeometry(0.02, 8, 8);
        const hookMaterial = new THREE.MeshPhongMaterial({
          color: 0xd4af37,
          shininess: 60,
          metalness: 0.7
        });
        const hook = new THREE.Mesh(hookGeometry, hookMaterial);
        hook.position.set(branchX, branchY, branchZ);
        treeGroupRef.current.add(hook);
        found.hook = hook;

        const stringCurve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(branchX, branchY, branchZ),
          new THREE.Vector3((branchX + x) / 2, randomHeight + 0.15, (branchZ + z) / 2),
          new THREE.Vector3(x, randomHeight + 0.18, z)
        );
        const stringPoints = stringCurve.getPoints(20);
        const stringGeometry = new THREE.BufferGeometry().setFromPoints(stringPoints);
        const stringMaterial = new THREE.LineBasicMaterial({ color: 0xd4af37, linewidth: 2 });
        const string = new THREE.Line(stringGeometry, stringMaterial);
        treeGroupRef.current.add(string);
        found.string = string;

        const capGeometry = new THREE.CylinderGeometry(0.035, 0.045, 0.06, 12);
        const capMaterial = new THREE.MeshPhongMaterial({ color: 0xd4af37, shininess: 80, metalness: 0.8 });
        const cap = new THREE.Mesh(capGeometry, capMaterial);
        cap.position.set(x, randomHeight + 0.18, z);
        treeGroupRef.current.add(cap);
        found.cap = cap;
      }

      // Dim down tree and other ornaments significantly
      treeObjectsRef.current.forEach(obj => {
        if (obj.material) {
          obj.material.transparent = true;
          obj.material.opacity = 0.3;
        }
      });

      // Dim down all ornaments and make other names nearly invisible
      ornamentsRef.current.forEach(ornament => {
        ornament.material.emissive.setHex(0x000000);
        ornament.material.transparent = true;
        ornament.material.opacity = 0.3;
        ornament.material.depthTest = true;
        ornament.material.depthWrite = true;
        if (ornament.sprite && ornament.sprite.material) {
          ornament.sprite.material.opacity = 0.02;
          ornament.sprite.renderOrder = -5;
          ornament.sprite.material.depthTest = true;
          ornament.sprite.material.depthWrite = false;
        }
      });

      // Highlight the found ornament brightly
      found.material.emissive.setHex(0xffdd00);
      found.material.emissiveIntensity = 1.2;
      found.material.opacity = 1;
      found.material.depthTest = false;
      found.material.depthWrite = false;

      // Create highlighted name with white box - high resolution
      if (found.sprite) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        // High resolution for crystal clear text
        canvas.width = 2048;
        canvas.height = 512;

        context.clearRect(0, 0, canvas.width, canvas.height);

        let fontSize = 140; // Scaled for high-res
        context.font = `Bold ${fontSize}px Georgia, serif`;
        let textWidth = context.measureText(found.name).width;

        const maxWidth = canvas.width - 400; // More padding for white box
        while (textWidth > maxWidth && fontSize > 60) {
          fontSize -= 4;
          context.font = `Bold ${fontSize}px Georgia, serif`;
          textWidth = context.measureText(found.name).width;
        }

        context.textAlign = 'center';
        context.textBaseline = 'middle';

        // Draw white background box (scaled for high-res)
        const padding = 80;
        const boxWidth = textWidth + padding * 2;
        const boxHeight = fontSize + padding;
        const boxX = (canvas.width - boxWidth) / 2;
        const boxY = (canvas.height - boxHeight) / 2;

        context.shadowColor = 'rgba(0, 0, 0, 0.5)';
        context.shadowBlur = 30;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 10;
        context.fillStyle = '#FFFFFF';
        context.fillRect(boxX, boxY, boxWidth, boxHeight);

        context.shadowColor = 'rgba(0, 0, 0, 0)';
        context.shadowBlur = 0;

        // Very thick black outline (scaled for high-res)
        context.strokeStyle = '#000000';
        context.lineWidth = 48;
        context.strokeText(found.name, canvas.width / 2, canvas.height / 2);

        // White outline (scaled for high-res)
        context.strokeStyle = '#ffffff';
        context.lineWidth = 12;
        context.strokeText(found.name, canvas.width / 2, canvas.height / 2);

        // Bright gold fill
        context.fillStyle = '#FFD700';
        context.fillText(found.name, canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter; // Better quality
        texture.magFilter = THREE.LinearFilter;
        found.sprite.material.map = texture;
        found.sprite.material.opacity = 1.0;
        found.sprite.material.depthTest = false;
        found.sprite.material.depthWrite = false;
        found.sprite.renderOrder = 1000;
        found.sprite.material.needsUpdate = true;

        // Make the sprite MUCH larger when searched - scale up significantly for visibility
        found.sprite.scale.set(3.5, 1.75, 1); // Much larger scale for clear readability
      }

      // Spin the tree to face the camera
      const camera = cameraRef.current;
      const startPos = camera.position.clone();
      const startRotation = treeGroupRef.current.rotation.y;

      // Target rotation: rotate tree so ornament faces front (camera is at z=8)
      let targetRotation = -randomAngle;
      let rotationDiff = targetRotation - startRotation;

      // Normalize to shortest path
      while (rotationDiff > Math.PI) rotationDiff -= Math.PI * 2;
      while (rotationDiff < -Math.PI) rotationDiff += Math.PI * 2;

      // Camera zooms to front of tree at ornament height - closer for better view
      const endPos = new THREE.Vector3(0, randomHeight, 3);

      let progress = 0;
      const animateZoom = () => {
        progress += 0.015;

        if (progress >= 1) {
          progress = 1;
        }

        const easeProgress = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        camera.position.lerpVectors(startPos, endPos, easeProgress);
        camera.lookAt(0, randomHeight, 0);

        // Spin tree to bring ornament to front
        treeGroupRef.current.rotation.y = startRotation + (rotationDiff * easeProgress);

        if (progress < 1) {
          requestAnimationFrame(animateZoom);
        }
      };
      requestAnimationFrame(animateZoom);
    } else {
      alert('Name not found in the list!');
    }
    setSearchName('');
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Loading Screen */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-green-900 flex flex-col items-center justify-center z-50">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">🎄</div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Loading Christmas Tree...
            </h2>
            <div className="flex gap-2 justify-center">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}

      <div ref={mountRef} className="w-full h-full" />
      
      <div className="absolute top-0 left-0 right-0 p-2 sm:p-6 text-center">
        <h1 className="text-sm sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight px-1" style={{ textShadow: '0 0 20px rgba(255,215,0,0.8), 0 0 40px rgba(255,215,0,0.5)' }}>
          🎄 Old Toons Wishes You A Very Merry Christmas 🎄
        </h1>
      </div>

      <div className="absolute top-12 sm:top-24 md:top-32 left-2 right-2 sm:left-auto sm:right-6 sm:w-72">
        <div className="flex gap-1 sm:gap-2">
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search..."
            className="flex-1 px-2 sm:px-4 py-1.5 sm:py-3 rounded text-xs sm:text-lg bg-white/90 backdrop-blur-sm border-2 border-yellow-400 focus:outline-none focus:border-yellow-500"
          />
          <button
            onClick={handleSearch}
            className="px-3 sm:px-6 py-1.5 sm:py-3 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition-colors text-xs sm:text-base"
          >
            🔍
          </button>
        </div>
      </div>

      {foundName && (
        <div className="absolute top-20 sm:top-40 md:top-48 left-2 right-2 sm:left-auto sm:right-6 sm:max-w-md bg-green-600 text-white px-3 sm:px-8 py-2 sm:py-4 rounded text-sm sm:text-xl font-bold animate-pulse text-center">
          🎉 Found: {foundName} 🎉
        </div>
      )}

      {isZoomed && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <button
            onClick={resetView}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-lg text-sm sm:text-base flex items-center gap-2"
          >
            <span>←</span>
            <span>Back to Tree</span>
          </button>
        </div>
      )}
    </div>
  );
}
