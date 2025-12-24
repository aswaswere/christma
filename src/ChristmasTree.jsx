import { useState, useRef } from 'react';

export default function ChristmasTree() {
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
    '_001bigboss',
    'theRoosterBurn',
    'ehmilien',
    'pStrawedsprout',
    'jBenn13JB',
    'kathyMcRae9',
    'nSportsline',
    'tddybearmojo',
    'shabs1986',
    'etbfaz',
    'gsiu_moya',
    'blitzenDon94929',
    'salvia762',
    'anitadottr',
    'monkeMonkeFunke',
    'casshernPlays',
    'ejdias',
    'suziejp51',
    'loopyStoopy',
    'mistyFi60439423',
    'areuleld',
    'theLooseMoose_',
    'martinwaller59',
    'nappydog',
    'rrobovski',
    'dustinpari',
    'elchiBola',
    'begleyTheJoker',
    'merymaywe',
    'little5mom',
    'paulDonGipps',
    'dxLaser_',
    'deepandey1110',
    'toy_boy',
    'frostedFoxShard',
    'thefriendlyghost',
    'jacksonLenno_',
    'devaishwaryaN',
    'shinsoo',
    'guiscon8',
    'cagefreeowl1',
    'kziggdy',
    'afaroe02',
    'al_hyunjin',
    'zillagodFTN',
    'cerome73',
    'helton1568030',
    'sufferingsucc1',
    'chris_anthem777',
    'aSpottedJoan',
    'galileo908',
    'cody21594',
    'latifumarali20',
    'jdogAmerican',
    'yGordijn',
    'myers3371',
    'francesca4rada',
    'd_warrior24',
    'iasraraz1',
    'snughug1',
    'jboyko44',
    'deckofFlora',
    'darwomingrosi',
    'pe_scarlette',
    'anCatDubh8',
    'luismbullet',
    'oneUglyMonkey',
    'arteDeFantasia',
    'harrisonCora1',
    'jscherretz',
    'bobpow60P',
    'nicholas209',
    'agentCH',
    'docGene70',
    'sportsnstuff13',
    'platinum9mm',
    'guuballV99869',
    'traunikFarm',
    'aj4xMambru',
    'drlopez530',
    'jimfitzwater',
    'xioniw',
    'welman92',
    'boondocks_x',
    'didericis',
    'sunflower765277',
    'rDude64Backup',
    'kylematthew82',
    'renager1',
    'artuscartoons',
    'azdude',
    'bill_stewart3',
    'wwestwi97927',
    'adzhumashev',
    'stickytwig',
    'robert23322',
    'nickLooker3',
    'sariphantom',
    'mark74227190',
    'jonRum',
    'salCarpanz28118',
    'thomasFan3751',
    'boringquendo184',
    'blackOfJuly_68',
    'dougsavageMOB',
    'joh75570John',
    'ayahAjam',
    'mast3rMan',
    'mmmoeeed',
    'jmj4USA',
    'nuts_squir10799',
    'lase_omope',
    'twixyburto',
    'raderMichael',
    'whatOKnows',
    'sassyWabbit',
    'scooterMTRB',
    'wildRelation',
    'ladyDi878',
    'ehpbphill1',
    'ikaros1428312',
    'lost_rollito',
    'leodexart',
    'joyingeneral',
    'canuck_chills33',
    'sugarlovessugar',
    'ghostofgori9125',
    'haydropro',
    'know_one111',
    'chillbang66',
    'eddie13106',
    'adrian22572617',
    'aveAnon17',
    'NitzaHernndez',
    'SkinnyFilter',
    'tshirtwoman19',
    'JustThelma_80',
    'bakasur',
    'pranshu',
    'charu',
    'utkrishta',
    'deeksha',
  ]);

  const [searchName, setSearchName] = useState('');
  const [highlightedName, setHighlightedName] = useState(null);
  const [zoomTransform, setZoomTransform] = useState({ scale: 1, x: 0, y: 0 });
  const treeRef = useRef(null);

  // Generate FIXED positions for names - ONLY within triangular green polygon areas
  const namePositions = names.map((name, index) => {
    // Define the 5 tree tiers with TRIANGLE boundaries (apex and base)
    // Each tier is a triangle: apex at top center, base at bottom
    const tiers = [
      { apexY: 18, baseY: 28, apexX: 50, baseLeft: 38, baseRight: 62 },   // Top tier
      { apexY: 24, baseY: 38, apexX: 50, baseLeft: 33, baseRight: 67 },   // Second tier
      { apexY: 34, baseY: 50, apexX: 50, baseLeft: 28, baseRight: 72 },   // Third tier
      { apexY: 46, baseY: 65, apexX: 50, baseLeft: 23, baseRight: 77 },   // Fourth tier
      { apexY: 58, baseY: 80, apexX: 50, baseLeft: 18, baseRight: 82 },   // Bottom tier
    ];

    // Distribute names across tiers
    const tierIndex = Math.floor((index / names.length) * tiers.length);
    const tier = tiers[Math.min(tierIndex, tiers.length - 1)];

    // Stable pseudo-random values
    const pseudoRandom = (Math.sin(index * 12.9898) + 1) / 2;  // For X
    const pseudoRandom2 = (Math.sin(index * 78.233) + 1) / 2;  // For Y

    // Y position within the tier (with 10% margin from top and bottom)
    const tierHeight = tier.baseY - tier.apexY;
    const yMargin = tierHeight * 0.1;
    const yPercent = tier.apexY + yMargin + pseudoRandom2 * (tierHeight - 2 * yMargin);

    // Calculate triangle width at this Y position
    // Triangle narrows linearly from base to apex
    const yRatio = (yPercent - tier.apexY) / tierHeight; // 0 at apex, 1 at base
    const widthAtY = yRatio * (tier.baseRight - tier.baseLeft);
    const leftEdgeAtY = tier.apexX - widthAtY / 2;
    const rightEdgeAtY = tier.apexX + widthAtY / 2;

    // X position within triangle width at this Y (with 10% margin from edges)
    const availableWidth = rightEdgeAtY - leftEdgeAtY;
    const xMargin = availableWidth * 0.1;
    const xPercent = leftEdgeAtY + xMargin + pseudoRandom * (availableWidth - 2 * xMargin);

    return {
      name,
      x: xPercent,
      y: yPercent,
    };
  });

  const handleSearch = () => {
    const found = namePositions.find(pos => pos.name.toLowerCase() === searchName.toLowerCase());
    if (found) {
      setHighlightedName(found.name);
      // Zoom into the name's position
      const scale = 3;
      const x = -(found.x - 50) * scale;
      const y = -(found.y - 50) * scale;
      setZoomTransform({ scale, x, y });
    } else {
      alert('Name not found in the list!');
    }
    setSearchName('');
  };

  const resetView = () => {
    setHighlightedName(null);
    setZoomTransform({ scale: 1, x: 0, y: 0 });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-blue-900 via-blue-800 to-green-900">
      {/* Title */}
      <div className="absolute top-0 left-0 right-0 p-2 sm:p-6 text-center z-30">
        <h1 className="text-sm sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight px-1" style={{ textShadow: '0 0 20px rgba(255,215,0,0.8)' }}>
          🎄 Old Toons Wishes You A Very Merry Christmas 🎄
        </h1>
      </div>

      {/* Search Bar */}
      <div className="absolute top-12 sm:top-20 md:top-24 left-2 right-2 sm:left-auto sm:right-6 sm:w-72 z-30">
        <div className="flex gap-1 sm:gap-2">
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search..."
            className="flex-1 px-2 sm:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-base bg-white/90 backdrop-blur-sm border-2 border-yellow-400 focus:outline-none focus:border-yellow-500"
          />
          <button
            onClick={handleSearch}
            className="px-3 sm:px-5 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition-colors text-xs sm:text-base"
          >
            🔍
          </button>
        </div>
      </div>

      {/* Back button - shown below search with spacing */}
      {highlightedName && (
        <div className="absolute top-20 sm:top-28 md:top-32 left-2 right-2 sm:left-auto sm:right-6 sm:w-72 z-30">
          <button
            onClick={resetView}
            className="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition-colors shadow-lg text-xs sm:text-base flex items-center justify-center gap-2"
          >
            <span>←</span>
            <span>Back</span>
          </button>
        </div>
      )}

      {/* Tree Container with Zoom */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          ref={treeRef}
          className="absolute inset-0 transition-transform duration-700 ease-in-out"
          style={{
            transform: `translate(${zoomTransform.x}%, ${zoomTransform.y}%) scale(${zoomTransform.scale})`,
          }}
        >
          {/* Tree SVG */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ pointerEvents: 'none' }}>
            {/* SVG Gradients for depth */}
            <defs>
              <radialGradient id="treeGradient" cx="50%" cy="30%">
                <stop offset="0%" stopColor="#4a7c59" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#2d5a3d" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#1a3a2a" stopOpacity="1" />
              </radialGradient>
              <linearGradient id="tierGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3d7a4e" />
                <stop offset="70%" stopColor="#2d5a3d" />
                <stop offset="100%" stopColor="#1e3d2a" />
              </linearGradient>
            </defs>

            {/* Tree layers - jagged edges with depth */}
            {/* Top tier - irregular edges */}
            <polygon points="50,18 38,27.5 39,28.5 37,28 40,29 38,28 42,29.5 40,28.5 44,29 43,28 46,29.5 48,28 50,29 52,28 54,29.5 57,28 56,29 60,29.5 58,28.5 62,29 60,28 63,28.5 61,28 62,27.5" fill="url(#tierGradient)" />
            <polygon points="50,18 36.5,27 37.5,28.5 36,28 39,29.5 37,28.5 41,30 39.5,28.5 43.5,29.5 42,28 46.5,30 48.5,28 50.5,29.5 52.5,28 55,30 58,28 57,29.5 61,30 59.5,28.5 63,29.5 61.5,28 64,28.5 63,27" fill="#1e3d2a" opacity="0.5" />
            {/* Jagged highlights on top tier */}
            <polygon points="48,20 46,22 44,21 42,23 40,22 38,24 36,23 35,29 38,27 40,28 42,27 44,28 46,27 48,28 50,27 52,28 54,27 56,28 58,27 60,28 62,27 64,28 65,29 64,23 62,24 60,22 58,23 56,21 54,22 52,20" fill="#4a7c59" opacity="0.4" />

            {/* Second tier - more jagged */}
            <polygon points="50,24 32,37.5 33,38.5 31,38 34,39 32.5,38 36,39.5 34,38.5 38,40 36,38.5 40,39.5 38,38 42,40 40,38.5 44,39.5 43,38 46,40 48,38 50,39.5 52,38 54,40 57,38 56,39.5 60,40 58,38.5 62,40 60,38 64,39.5 62,38.5 66,39.5 64.5,38 68,39 66,38 67,38.5 69,37.5" fill="url(#tierGradient)" />
            <polygon points="50,24 30.5,37 31.5,38.5 30,38 33,40 31,38.5 35,40.5 33,38.5 37,40 35,38 39,40.5 41,38 43,40 45,38 47,40 49,38 51,40 53,38 55,40.5 59,38 57,40 61,40.5 59,38 63,40 61,38.5 65,40 63,38.5 67,39.5 65,38 69,38.5 70,37" fill="#1a3a2a" opacity="0.6" />

            {/* Third tier - very jagged */}
            <polygon points="50,34 27,49.5 28,50.5 26,50 29,51 27.5,50 31,51.5 29,50.5 33,52 31,50.5 35,52 33,50 37,52.5 35,50.5 39,52 37,50 41,52.5 39,50.5 43,52 42,50 45,52.5 47,50 49,52 51,50 53,52.5 55,50 58,52 56,50.5 60,52.5 58,50 62,52.5 60,50.5 64,52 62,50 66,52 64,50.5 68,52 66,50.5 70,51.5 68.5,50 72,51 70,50 73,50.5 74,49.5" fill="url(#tierGradient)" />
            <polygon points="50,34 25.5,49 26.5,50.5 25,50 28,52 26,50 30,52.5 28,50.5 32,52 30,50 34,52.5 36,50 38,52 40,50 42,52.5 44,50 46,52 48,50 50,52 52,50 54,52.5 58,50 56,52 60,52.5 58,50 62,52 60,50.5 64,52.5 62,50 66,52 64,50.5 68,52 66,50 70,52 68,50.5 72,51.5 70,50 74,50.5 75,49" fill="#1a3a2a" opacity="0.7" />

            {/* Fourth tier - dense jagged pattern */}
            <polygon points="50,46 22,64.5 23,65.5 21,65 24,66 22.5,65 26,66.5 24,65.5 28,67 26,65.5 30,67 28,65 32,67.5 30,65.5 34,67 32,65 36,67.5 34,65.5 38,67 37,65 40,67.5 42,65 44,67 46,65 48,67 50,65 52,67 54,65 56,67.5 60,65 58,67 62,67.5 60,65 64,67.5 62,65.5 66,67 64,65 68,67.5 66,65.5 70,67 68,65 72,67 70,65.5 74,67 72,65.5 76,66.5 74.5,65 78,66 76,65 77,65.5 79,64.5" fill="url(#tierGradient)" />
            <polygon points="50,46 20.5,64 21.5,65.5 20,65 23,67 21,65 25,67.5 23,65.5 27,67 25,65 29,67.5 31,65 33,67 35,65 37,67.5 39,65 41,67 43,65 45,67 47,65 49,67 51,65 53,67.5 57,65 55,67 59,67.5 57,65 61,67 59,65.5 63,67.5 61,65 65,67 63,65.5 67,67 65,65 69,67 67,65.5 71,67 69,65 73,67 71,65.5 75,67 73,65 77,66.5 75,65 79,65.5 80,64" fill="#1a3a2a" opacity="0.8" />

            {/* Bottom tier - most jagged */}
            <polygon points="50,58 17,79.5 18,80.5 16,80 19,81 17.5,80 21,81.5 19,80.5 23,82 21,80.5 25,82 23,80 27,82.5 25,80.5 29,82 27,80 31,82.5 29,80.5 33,82 32,80 35,82.5 37,80 39,82 41,80 43,82 45,80 47,82 49,80 51,82 53,80 55,82.5 59,80 57,82 61,82.5 59,80 63,82.5 61,80.5 65,82 63,80 67,82.5 65,80.5 69,82 67,80 71,82 69,80.5 73,82 71,80.5 75,82 73,80.5 77,81.5 75.5,80 79,81 77,80 81,80.5 82,79.5 84,80.5 85,79.5" fill="url(#tierGradient)" />
            <polygon points="50,58 15.5,79 16.5,80.5 15,80 18,82 16,80 20,82.5 18,80.5 22,82 20,80 24,82.5 26,80 28,82 30,80 32,82.5 34,80 36,82 38,80 40,82 42,80 44,82 46,80 48,82 50,80 52,82.5 56,80 54,82 58,82.5 56,80 60,82 58,80.5 62,82.5 60,80 64,82 62,80.5 66,82 64,80 68,82 66,80.5 70,82 68,80 72,82 70,80.5 74,82 72,80 76,82 74,80.5 78,82 76,80 80,81.5 78,80 82,81 80,80 84,80.5 85,79" fill="#1a3a2a" opacity="0.9" />

            {/* Random branch details sticking out */}
            <polygon points="34,22 32,23 33,25 35,24" fill="#2d5a3d" opacity="0.8" />
            <polygon points="66,23 68,24 67,26 65,25" fill="#34643d" opacity="0.8" />
            <polygon points="31,31 29,32 30,34 32,33" fill="#2d5a3d" opacity="0.7" />
            <polygon points="69,32 71,33 70,35 68,34" fill="#34643d" opacity="0.7" />
            <polygon points="28,41 26,42 27,44 29,43" fill="#2d5a3d" opacity="0.8" />
            <polygon points="72,42 74,43 73,45 71,44" fill="#34643d" opacity="0.8" />
            <polygon points="26,48 24,49 25,51 27,50" fill="#1e3d2a" opacity="0.9" />
            <polygon points="74,49 76,50 75,52 73,51" fill="#1e3d2a" opacity="0.9" />
            <polygon points="23,56 21,57 22,59 24,58" fill="#2d5a3d" opacity="0.8" />
            <polygon points="77,57 79,58 78,60 76,59" fill="#34643d" opacity="0.8" />
            <polygon points="20,67 18,68 19,70 21,69" fill="#1a3a2a" opacity="0.9" />
            <polygon points="80,68 82,69 81,71 79,70" fill="#1a3a2a" opacity="0.9" />
            <polygon points="18,76 16,77 17,79 19,78" fill="#1e3d2a" opacity="0.85" />
            <polygon points="82,77 84,78 83,80 81,79" fill="#1e3d2a" opacity="0.85" />

            {/* Tree trunk */}
            <rect x="47" y="80" width="6" height="15" fill="#5d4037" rx="1" />

            {/* Gift boxes - Left side (3 boxes) */}
            {/* Left box 1 - red with gold ribbon */}
            <g>
              <rect x="28" y="86" width="6" height="5" fill="#c41e3a" rx="0.3" />
              <rect x="30.7" y="85.5" width="0.6" height="6" fill="#ffd700" />
              <rect x="28" y="88" width="6" height="0.6" fill="#ffd700" />
              <path d="M 31,85.5 L 30,84 L 32,84 Z" fill="#ffd700" />
            </g>

            {/* Left box 2 - green with silver ribbon */}
            <g>
              <rect x="21" y="88" width="5" height="4" fill="#2d5a3d" rx="0.3" />
              <rect x="23.2" y="87.5" width="0.5" height="5" fill="#e8e8e8" />
              <rect x="21" y="89.7" width="5" height="0.5" fill="#e8e8e8" />
              <path d="M 23.5,87.5 L 22.7,86.2 L 24.3,86.2 Z" fill="#e8e8e8" />
            </g>

            {/* Left box 3 - blue with red ribbon */}
            <g>
              <rect x="29" y="91" width="4.5" height="4" fill="#1e88e5" rx="0.3" />
              <rect x="31" y="90.5" width="0.5" height="5" fill="#c41e3a" />
              <rect x="29" y="92.7" width="4.5" height="0.5" fill="#c41e3a" />
              <path d="M 31.25,90.5 L 30.5,89.3 L 32,89.3 Z" fill="#c41e3a" />
            </g>

            {/* Gift boxes - Right side (4 boxes) */}
            {/* Right box 1 - gold with red ribbon */}
            <g>
              <rect x="56" y="85" width="6.5" height="5.5" fill="#ffd700" rx="0.3" />
              <rect x="59" y="84.5" width="0.6" height="6.5" fill="#c41e3a" />
              <rect x="56" y="87.5" width="6.5" height="0.6" fill="#c41e3a" />
              <path d="M 59.3,84.5 L 58.3,83 L 60.3,83 Z" fill="#c41e3a" />
            </g>

            {/* Right box 2 - purple with gold ribbon */}
            <g>
              <rect x="64" y="87" width="5" height="4.5" fill="#7b1fa2" rx="0.3" />
              <rect x="66.2" y="86.5" width="0.5" height="5.5" fill="#ffd700" />
              <rect x="64" y="89" width="5" height="0.5" fill="#ffd700" />
              <path d="M 66.5,86.5 L 65.7,85.2 L 67.3,85.2 Z" fill="#ffd700" />
            </g>

            {/* Right box 3 - red with white ribbon */}
            <g>
              <rect x="62" y="91" width="4" height="4" fill="#d32f2f" rx="0.3" />
              <rect x="63.7" y="90.5" width="0.5" height="5" fill="#ffffff" />
              <rect x="62" y="92.7" width="4" height="0.5" fill="#ffffff" />
              <path d="M 64,90.5 L 63.2,89.2 L 64.8,89.2 Z" fill="#ffffff" />
            </g>

            {/* Right box 4 - green with silver ribbon */}
            <g>
              <rect x="57" y="90" width="4.5" height="5" fill="#43a047" rx="0.3" />
              <rect x="59" y="89.5" width="0.5" height="6" fill="#e8e8e8" />
              <rect x="57" y="92.2" width="4.5" height="0.5" fill="#e8e8e8" />
              <path d="M 59.25,89.5 L 58.4,88.2 L 60.1,88.2 Z" fill="#e8e8e8" />
            </g>

            {/* Small star on top */}
            <g transform="translate(50, 13)">
              <polygon points="0,-3 1,-1 3,-1 1.2,0.5 2,3 0,1.5 -2,3 -1.2,0.5 -3,-1 -1,-1" fill="#ffd700" stroke="#ffed4e" strokeWidth="0.2" />
            </g>

            {/* Garland/beads */}
            <path d="M 35,28 Q 42,30 50,29 T 65,28" fill="none" stroke="#d4af37" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M 30,38 Q 40,41 50,40 T 70,38" fill="none" stroke="#d4af37" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M 25,50 Q 37,54 50,53 T 75,50" fill="none" stroke="#d4af37" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M 20,65 Q 35,69 50,68 T 80,65" fill="none" stroke="#d4af37" strokeWidth="0.8" strokeLinecap="round" />

            {/* Ornament balls scattered on tree */}
            <circle cx="38" cy="25" r="1.5" fill="#e53935" />
            <circle cx="62" cy="26" r="1.5" fill="#1e88e5" />
            <circle cx="45" cy="35" r="1.5" fill="#fdd835" />
            <circle cx="55" cy="36" r="1.5" fill="#e53935" />
            <circle cx="32" cy="47" r="1.5" fill="#1e88e5" />
            <circle cx="68" cy="48" r="1.5" fill="#43a047" />
            <circle cx="50" cy="50" r="1.5" fill="#e53935" />
            <circle cx="28" cy="62" r="1.5" fill="#fdd835" />
            <circle cx="52" cy="63" r="1.5" fill="#1e88e5" />
            <circle cx="72" cy="64" r="1.5" fill="#e53935" />
            <circle cx="40" cy="72" r="1.5" fill="#43a047" />
            <circle cx="60" cy="73" r="1.5" fill="#fdd835" />
            <circle cx="25" cy="75" r="1.5" fill="#1e88e5" />
            <circle cx="75" cy="76" r="1.5" fill="#e53935" />

            {/* Candy canes */}
            <g transform="translate(42, 40) rotate(-20)">
              <path d="M 0,0 Q 0,-2 2,-2 Q 4,-2 4,0 L 4,4" fill="none" stroke="#ff0000" strokeWidth="0.6" />
              <path d="M 0.5,0 Q 0.5,-1.5 2,-1.5 Q 3.5,-1.5 3.5,0 L 3.5,4" fill="none" stroke="#ffffff" strokeWidth="0.3" />
            </g>
            <g transform="translate(35, 58) rotate(15)">
              <path d="M 0,0 Q 0,-2 2,-2 Q 4,-2 4,0 L 4,4" fill="none" stroke="#ff0000" strokeWidth="0.6" />
              <path d="M 0.5,0 Q 0.5,-1.5 2,-1.5 Q 3.5,-1.5 3.5,0 L 3.5,4" fill="none" stroke="#ffffff" strokeWidth="0.3" />
            </g>
            <g transform="translate(65, 55) rotate(-15)">
              <path d="M 0,0 Q 0,-2 2,-2 Q 4,-2 4,0 L 4,4" fill="none" stroke="#ff0000" strokeWidth="0.6" />
              <path d="M 0.5,0 Q 0.5,-1.5 2,-1.5 Q 3.5,-1.5 3.5,0 L 3.5,4" fill="none" stroke="#ffffff" strokeWidth="0.3" />
            </g>

            {/* Small stars decoration */}
            <polygon points="44,32 44.5,33.5 46,34 44.5,34.5 44,36 43.5,34.5 42,34 43.5,33.5" fill="#ffd700" />
            <polygon points="56,44 56.5,45.5 58,46 56.5,46.5 56,48 55.5,46.5 54,46 55.5,45.5" fill="#ffd700" />
            <polygon points="36,68 36.5,69.5 38,70 36.5,70.5 36,72 35.5,70.5 34,70 35.5,69.5" fill="#ffd700" />

            {/* Hanging names - now inside SVG for consistent positioning */}
            {namePositions.map((pos) => {
              const isHighlighted = pos.name === highlightedName;

              return (
                <g key={pos.name}>
                  {/* Hanging string */}
                  <line
                    x1={pos.x}
                    y1={pos.y - 0.8}
                    x2={pos.x}
                    y2={pos.y}
                    stroke="#b8860b"
                    strokeWidth="0.08"
                  />

                  {/* Name text */}
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="hanging"
                    fill={isHighlighted ? '#ffd700' : '#d4af37'}
                    stroke="#000"
                    strokeWidth={isHighlighted ? "0.15" : "0.03"}
                    paintOrder="stroke"
                    style={{
                      fontSize: isHighlighted ? '2.5px' : '0.5px',
                      fontWeight: 'bold',
                      transition: 'all 0.3s',
                      filter: isHighlighted ? 'drop-shadow(0 0 0.5px rgba(255,215,0,0.8))' : 'none',
                    }}
                  >
                    {pos.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Found notification */}
      {highlightedName && (
        <div className="absolute top-32 sm:top-40 md:top-44 left-2 right-2 sm:left-auto sm:right-6 sm:max-w-md bg-green-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded text-xs sm:text-lg font-bold animate-pulse text-center z-30">
          🎉 Found: {highlightedName} 🎉
        </div>
      )}

      {/* Falling snow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white opacity-60 animate-snow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${-20 + Math.random() * 20}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 12}s`,
              fontSize: `${10 + Math.random() * 10}px`,
            }}
          >
            ❄
          </div>
        ))}
      </div>
    </div>
  );
}
