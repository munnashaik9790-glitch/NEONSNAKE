# Neon Snake: Premium Browser Game Walkthrough

Neon Snake is a fully functional, high-performance Snake game built with vanilla HTML5, CSS3, and ES6+ JavaScript. It features a modern dark aesthetic, smooth animations, and responsive controls.

## 🚀 How to Run
The game is completely standalone. Simply open `index.html` in any modern web browser. 
- **Direct Link**: [index.html](file:///home/glb-blr-505/.gemini/antigravity/scratch/snake-game/index.html)

## 🎮 How to Play
- **Desktop**: Use **Arrow Keys** or **WASD** to control the snake.
- **Mobile/Touch**: Use the on-screen direction pads or tap the screen.
- **Goal**: Collect the red neon orbs to grow. Don't hit the walls or yourself!

## 🛠 Technical Highlights

### 1. Visual Design (CSS)
- **Modern Dark Theme**: Uses a sophisticated background with radial gradients for depth.
- **Neon Glows**: Leverages `text-shadow` and `box-shadow` in CSS, and `shadowBlur` in Canvas to create a vibrant "cyberpunk" feel.
- **Responsive Layout**: Adapts to mobile screens with touch-friendly controls and a fluid game board.

### 2. Game Core (JavaScript)
- **Smooth Animation**: Utilizes `requestAnimationFrame` for a consistent frame rate, with time-based delta calculations for movement speed.
- **High DPI Support**: Automatically scales the canvas based on the device's pixel ratio for sharp visuals on Retina or 4K displays.
- **Dynamic Speed**: The game gets progressively faster every 50 points, increasing the challenge.
- **Persisted High Score**: Uses `localStorage` to keep track of your best runs across sessions.

### 3. Audio & UX
- **Web Audio API**: Real-time sound synthesis for game events (eating, game over), meaning zero external assets are required.
- **State Management**: Clean separation of "Start", "Playing", and "Game Over" states with interactive overlays.

## 📁 File Structure
- `index.html`: The markup foundation and UI structure.
- `style.css`: The "Neon" design system and layout.
- `script.js`: The game engine, input handling, and rendering logic.

---
> [!TIP]
> Try to beat the high score! The snake will start to glow brighter as you grow longer.
