# 🎄 Christmas Tree 3D

An interactive 3D Christmas tree built with React and Three.js. Add names as ornaments and search to find them on the tree!

## Features

- 🎨 Realistic 3D Christmas tree with:
  - Multiple layers of pine needles
  - Twinkling colored lights
  - Falling snow animation
  - Golden star on top
  - Ornaments with personalized names

- 🔍 **Search Functionality**: Find specific names on the tree - the camera will zoom in and highlight the ornament
- 🎅 **Admin Mode**: Add new names to the tree (password: `admin123`)
- ✨ **Dynamic Display**: Name labels become more visible as you zoom closer
- 🌟 **Smooth Animations**: Rotating tree, twinkling lights, and ambient effects

## Getting Started

### Installation

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

The app will automatically open in your browser at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## How to Use

1. **Search for Names**: Use the search bar in the top-right to find a name on the tree
2. **Zoom In**: Names become more readable as the camera gets closer to ornaments
3. **Admin Access**: Login with password `admin123` to add new names to the tree
4. **Enjoy**: Watch the tree rotate, lights twinkle, and snow fall!

## Tech Stack

- **React** - UI framework
- **Three.js** - 3D graphics library
- **Vite** - Build tool
- **Tailwind CSS** - Styling

## Project Structure

```
christma-main/
├── src/
│   ├── ChristmasTree.jsx  # Main 3D tree component
│   ├── App.jsx            # App wrapper
│   ├── main.jsx           # React entry point
│   └── index.css          # Global styles
├── index.html             # HTML entry point
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
└── tailwind.config.js     # Tailwind configuration
```

## Customization

To customize the tree, edit [src/ChristmasTree.jsx](src/ChristmasTree.jsx):

- **Initial names**: Modify the `names` state (line 5)
- **Admin password**: Change in `handleAdminLogin` function (line 420)
- **Tree colors**: Adjust material colors throughout the component
- **Animation speed**: Modify the rotation and twinkling values in the animate loop

## License

Created with love for Old Toons. Merry Christmas! 🎄
