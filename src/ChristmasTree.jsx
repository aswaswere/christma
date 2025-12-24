import { useState } from 'react';

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

  // Generate random positions for names on the tree
  const namePositions = names.map((name, index) => {
    // Tree shape: wider at bottom, narrower at top
    const yPercent = (index / names.length) * 80 + 10; // 10% to 90% height
    const treeWidth = 60 - (yPercent * 0.4); // 60% wide at bottom, 20% at top
    const xPercent = 50 + (Math.random() - 0.5) * treeWidth;

    return {
      name,
      x: xPercent,
      y: yPercent,
      color: `hsl(${index * 18}, 70%, 50%)` // Different color for each ornament
    };
  });

  const handleSearch = () => {
    const found = names.find(name => name.toLowerCase() === searchName.toLowerCase());
    if (found) {
      setHighlightedName(found);
    } else {
      alert('Name not found in the list!');
    }
    setSearchName('');
  };

  const resetView = () => {
    setHighlightedName(null);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-blue-900 to-green-900">
      {/* Title */}
      <div className="absolute top-0 left-0 right-0 p-2 sm:p-6 text-center z-20">
        <h1 className="text-sm sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight px-1" style={{ textShadow: '0 0 20px rgba(255,215,0,0.8), 0 0 40px rgba(255,215,0,0.5)' }}>
          🎄 Old Toons Wishes You A Very Merry Christmas 🎄
        </h1>
      </div>

      {/* Search Bar */}
      <div className="absolute top-12 sm:top-24 md:top-32 left-2 right-2 sm:left-auto sm:right-6 sm:w-72 z-20">
        <div className="flex gap-1 sm:gap-2">
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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

      {/* Tree Container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full max-w-4xl">
          {/* Tree Shape - SVG */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            {/* Tree body - three triangular sections */}
            <polygon points="50,15 30,35 35,35" fill="#2d5016" />
            <polygon points="50,15 70,35 65,35" fill="#2d5016" />
            <polygon points="50,20 25,45 30,45" fill="#3d6b2e" />
            <polygon points="50,20 75,45 70,45" fill="#3d6b2e" />
            <polygon points="50,30 20,60 25,60" fill="#2d5016" />
            <polygon points="50,30 80,60 75,60" fill="#2d5016" />
            <polygon points="50,40 15,75 20,75" fill="#3d6b2e" />
            <polygon points="50,40 85,75 80,75" fill="#3d6b2e" />

            {/* Main tree triangle */}
            <polygon points="50,15 15,75 85,75" fill="#4a7c3d" opacity="0.9" />

            {/* Tree trunk */}
            <rect x="45" y="75" width="10" height="12" fill="#3d2517" />

            {/* Star on top */}
            <polygon points="50,5 52,12 59,12 53,16 55,23 50,19 45,23 47,16 41,12 48,12" fill="#ffd700" />
          </svg>

          {/* Names scattered on tree */}
          {namePositions.map((pos) => {
            const isHighlighted = pos.name === highlightedName;

            return (
              <div
                key={pos.name}
                className={`absolute transition-all duration-300 ${isHighlighted ? 'z-30' : 'z-10'}`}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Ornament circle */}
                <div
                  className={`rounded-full transition-all duration-300 ${
                    isHighlighted ? 'w-6 h-6 sm:w-8 sm:h-8' : 'w-4 h-4 sm:w-6 sm:h-6'
                  }`}
                  style={{
                    backgroundColor: pos.color,
                    boxShadow: isHighlighted
                      ? '0 0 20px rgba(255,215,0,0.8), 0 0 40px rgba(255,215,0,0.6)'
                      : '0 2px 4px rgba(0,0,0,0.3)',
                  }}
                />

                {/* Name label */}
                <div
                  className={`absolute top-full mt-1 whitespace-nowrap transition-all duration-300 ${
                    isHighlighted ? 'opacity-100 scale-110' : 'opacity-70'
                  }`}
                  style={{
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                >
                  <div
                    className={`px-2 py-1 rounded ${
                      isHighlighted ? 'bg-white' : 'bg-white/80'
                    }`}
                    style={{
                      boxShadow: isHighlighted
                        ? '0 4px 12px rgba(0,0,0,0.3)'
                        : '0 1px 3px rgba(0,0,0,0.2)',
                    }}
                  >
                    <p
                      className={`font-bold text-center ${
                        isHighlighted ? 'text-sm sm:text-lg' : 'text-xs sm:text-sm'
                      }`}
                      style={{
                        color: isHighlighted ? '#FFD700' : '#333',
                        textShadow: isHighlighted ? '1px 1px 2px #000' : 'none',
                      }}
                    >
                      {pos.name}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Found notification */}
      {highlightedName && (
        <div className="absolute top-20 sm:top-40 md:top-48 left-2 right-2 sm:left-auto sm:right-6 sm:max-w-md bg-green-600 text-white px-3 sm:px-8 py-2 sm:py-4 rounded text-sm sm:text-xl font-bold animate-pulse text-center z-20">
          🎉 Found: {highlightedName} 🎉
        </div>
      )}

      {/* Back button */}
      {highlightedName && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <button
            onClick={resetView}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-lg text-sm sm:text-base flex items-center gap-2"
          >
            <span>←</span>
            <span>Reset</span>
          </button>
        </div>
      )}

      {/* Falling snow effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white opacity-70 animate-snow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
              fontSize: `${8 + Math.random() * 8}px`,
            }}
          >
            ❄
          </div>
        ))}
      </div>
    </div>
  );
}
