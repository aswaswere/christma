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
            {/* Tree layers - multiple overlapping for ferny look */}
            {/* Top tier */}
            <polygon points="50,18 38,28 62,28" fill="#2d5a3d" />
            <polygon points="50,18 36,28 64,28" fill="#34643d" opacity="0.9" />
            <polygon points="48,20 35,29 50,27 65,29 52,20" fill="#3d7a4e" />

            {/* Second tier */}
            <polygon points="50,24 33,38 67,38" fill="#2d5a3d" />
            <polygon points="50,24 31,38 69,38" fill="#34643d" opacity="0.9" />
            <polygon points="48,26 30,39 50,36 70,39 52,26" fill="#3d7a4e" />

            {/* Third tier */}
            <polygon points="50,34 28,50 72,50" fill="#2d5a3d" />
            <polygon points="50,34 26,50 74,50" fill="#34643d" opacity="0.9" />
            <polygon points="48,36 25,51 50,47 75,51 52,36" fill="#3d7a4e" />

            {/* Fourth tier */}
            <polygon points="50,46 23,65 77,65" fill="#2d5a3d" />
            <polygon points="50,46 21,65 79,65" fill="#34643d" opacity="0.9" />
            <polygon points="48,48 20,66 50,61 80,66 52,48" fill="#3d7a4e" />

            {/* Bottom tier */}
            <polygon points="50,58 18,80 82,80" fill="#2d5a3d" />
            <polygon points="50,58 16,80 84,80" fill="#34643d" opacity="0.9" />
            <polygon points="48,60 15,81 50,75 85,81 52,60" fill="#3d7a4e" />

            {/* Fern-like branches sticking out */}
            <polygon points="35,30 33,32 36,33" fill="#2d5a3d" />
            <polygon points="65,30 67,32 64,33" fill="#2d5a3d" />
            <polygon points="30,42 28,44 31,45" fill="#34643d" />
            <polygon points="70,42 72,44 69,45" fill="#34643d" />
            <polygon points="25,55 23,57 26,58" fill="#2d5a3d" />
            <polygon points="75,55 77,57 74,58" fill="#2d5a3d" />
            <polygon points="20,68 18,70 21,71" fill="#34643d" />
            <polygon points="80,68 82,70 79,71" fill="#34643d" />

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
