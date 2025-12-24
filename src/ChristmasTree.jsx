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
  ]);

  const [searchName, setSearchName] = useState('');
  const [highlightedName, setHighlightedName] = useState(null);
  const [zoomTransform, setZoomTransform] = useState({ scale: 1, x: 0, y: 0 });
  const treeRef = useRef(null);

  // Generate positions for names - scattered across tree shape only
  const namePositions = names.map((name, index) => {
    const yPercent = 20 + (index / names.length) * 55; // 20% to 75% height (tree area)

    // Calculate tree width at this height (triangle shape)
    // Tree goes from point at top (50%) to wide at bottom (70% width)
    const treeWidthAtY = ((yPercent - 20) / 55) * 35; // 0 to 35% from center
    const xPercent = 50 + (Math.random() - 0.5) * treeWidthAtY;

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

      {/* Tree Container with Zoom */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div
          ref={treeRef}
          className="relative w-full h-full transition-transform duration-700 ease-in-out"
          style={{
            transform: `translate(${zoomTransform.x}%, ${zoomTransform.y}%) scale(${zoomTransform.scale})`,
          }}
        >
          {/* Tree SVG */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            {/* Tree layers - 5 triangular sections */}
            <polygon points="50,18 35,28 65,28" fill="#2d6b3f" />
            <polygon points="50,23 30,38 70,38" fill="#347a45" />
            <polygon points="50,33 25,50 75,50" fill="#2d6b3f" />
            <polygon points="50,45 20,65 80,65" fill="#347a45" />
            <polygon points="50,58 15,80 85,80" fill="#2d6b3f" />

            {/* Tree trunk */}
            <rect x="44" y="80" width="12" height="15" fill="#5d4037" rx="1" />

            {/* Star on top */}
            <g transform="translate(50, 10)">
              <polygon points="0,-8 2,-2 8,-2 3,2 5,8 0,4 -5,8 -3,2 -8,-2 -2,-2" fill="#ffd700" stroke="#ffed4e" strokeWidth="0.5" />
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
          </svg>

          {/* Hanging names */}
          {namePositions.map((pos) => {
            const isHighlighted = pos.name === highlightedName;

            return (
              <div
                key={pos.name}
                className="absolute transition-all duration-300"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: isHighlighted ? 20 : 10,
                }}
              >
                {/* Hanging string */}
                <div
                  className="absolute bottom-full left-1/2 bg-yellow-700"
                  style={{
                    width: '1px',
                    height: '8px',
                    transform: 'translateX(-50%)',
                  }}
                />

                {/* Name - hanging like decoration, no box */}
                <p
                  className="font-bold text-center whitespace-nowrap transition-all duration-300"
                  style={{
                    fontSize: isHighlighted ? '16px' : '7px',
                    color: isHighlighted ? '#ffd700' : '#d4af37',
                    textShadow: isHighlighted
                      ? '0 0 10px rgba(255,215,0,0.8), 0 2px 4px rgba(0,0,0,0.5), 1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000'
                      : '0 1px 2px rgba(0,0,0,0.5), 0.5px 0.5px 0 #000, -0.5px -0.5px 0 #000',
                  }}
                >
                  {pos.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Found notification */}
      {highlightedName && (
        <div className="absolute top-16 sm:top-28 md:top-32 left-2 right-2 sm:left-auto sm:right-6 sm:max-w-md bg-green-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded text-xs sm:text-lg font-bold animate-pulse text-center z-30">
          🎉 Found: {highlightedName} 🎉
        </div>
      )}

      {/* Reset button */}
      {highlightedName && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-40">
          <button
            onClick={resetView}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-lg text-sm sm:text-base flex items-center gap-2"
          >
            <span>←</span>
            <span>Back</span>
          </button>
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
