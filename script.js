/**
 * Neon Snake - Game Logic
 * Pure ES6+ JavaScript, no frameworks.
 */

class NeonSnake {
    constructor() {
        // Elements
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreEl = document.getElementById('score');
        this.highScoreEl = document.getElementById('high-score');
        this.finalScoreEl = document.getElementById('final-score');
        this.startScreen = document.getElementById('start-screen');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.startBtn = document.getElementById('start-btn');
        this.restartBtn = document.getElementById('restart-btn');

        // Config
        this.gridSize = 20; // 20x20 cells
        this.tileSize = 0; // Calculated on resize
        this.baseSpeed = 120; // Initial interval in ms
        this.speed = this.baseSpeed;
        
        // State
        this.snake = [];
        this.food = { x: 0, y: 0 };
        this.direction = 'RIGHT';
        this.nextDirection = 'RIGHT';
        this.score = 0;
        this.highScore = localStorage.getItem('snake-high-score') || 0;
        this.gameStarted = false;
        this.isGameOver = false;
        this.lastUpdateTime = 0;
        this.animationId = null;

        this.init();
    }

    init() {
        this.setupCanvas();
        this.updateScoreUI();
        this.addEventListeners();
        this.resize();
        
        // Initial drawing
        this.drawPlaceholder();
    }

    setupCanvas() {
        // High DPI support
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        this.tileSize = rect.width / this.gridSize;
    }

    resize() {
        window.addEventListener('resize', () => {
            this.setupCanvas();
            if (!this.gameStarted || this.isGameOver) {
                this.drawPlaceholder();
            }
        });
    }

    addEventListeners() {
        // Core Controls
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // Buttons
        this.startBtn.addEventListener('click', () => this.startGame());
        this.restartBtn.addEventListener('click', () => this.resetGame());

        // Mobile Controls
        const controls = {
            'ctrl-up': 'UP',
            'ctrl-down': 'DOWN',
            'ctrl-left': 'LEFT',
            'ctrl-right': 'RIGHT'
        };

        Object.keys(controls).forEach(id => {
            document.getElementById(id).addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleMove(controls[id]);
            });
            document.getElementById(id).addEventListener('click', () => {
                this.handleMove(controls[id]);
            });
        });
    }

    handleKeyDown(e) {
        const keyMap = {
            'ArrowUp': 'UP',
            'ArrowDown': 'DOWN',
            'ArrowLeft': 'LEFT',
            'ArrowRight': 'RIGHT',
            'w': 'UP',
            's': 'DOWN',
            'a': 'LEFT',
            'd': 'RIGHT'
        };

        if (keyMap[e.key]) {
            this.handleMove(keyMap[e.key]);
        }
    }

    handleMove(dir) {
        // Prevent reverse movement
        const opp = {
            'UP': 'DOWN',
            'DOWN': 'UP',
            'LEFT': 'RIGHT',
            'RIGHT': 'LEFT'
        };

        if (opp[dir] !== this.direction) {
            this.nextDirection = dir;
        }

        // Quick start if on splash
        if (!this.gameStarted && !this.isGameOver && (dir)) {
            this.startGame();
        }
    }

    startGame() {
        this.gameStarted = true;
        this.isGameOver = false;
        this.score = 0;
        this.speed = this.baseSpeed;
        this.direction = 'RIGHT';
        this.nextDirection = 'RIGHT';
        
        // Initial snake: 3 segments in middle
        const midY = Math.floor(this.gridSize / 2);
        this.snake = [
            { x: 5, y: midY },
            { x: 4, y: midY },
            { x: 3, y: midY }
        ];

        this.spawnFood();
        this.startScreen.classList.add('hidden');
        this.gameOverScreen.classList.add('hidden');
        this.updateScoreUI();
        
        this.lastUpdateTime = performance.now();
        this.gameLoop(performance.now());
    }

    resetGame() {
        this.startGame();
    }

    spawnFood() {
        let newFood;
        let collision = true;

        while (collision) {
            newFood = {
                x: Math.floor(Math.random() * this.gridSize),
                y: Math.floor(Math.random() * this.gridSize)
            };
            
            // Check if food spawned on snake
            collision = this.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
        }

        this.food = newFood;
    }

    update() {
        this.direction = this.nextDirection;
        const head = { ...this.snake[0] };

        switch (this.direction) {
            case 'UP': head.y--; break;
            case 'DOWN': head.y++; break;
            case 'LEFT': head.x--; break;
            case 'RIGHT': head.x++; break;
        }

        // Collision: Walls
        if (head.x < 0 || head.x >= this.gridSize || head.y < 0 || head.y >= this.gridSize) {
            this.endGame();
            return;
        }

        // Collision: Self
        if (this.snake.some((seg, i) => i !== 0 && seg.x === head.x && seg.y === head.y)) {
            this.endGame();
            return;
        }

        // Move snake
        this.snake.unshift(head);

        // Check Food
        if (head.x === this.food.x && head.y === this.food.y) {
            this.handleEat();
        } else {
            this.snake.pop();
        }
    }

    handleEat() {
        this.score += 10;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snake-high-score', this.highScore);
        }
        this.updateScoreUI();
        this.spawnFood();
        this.playSound(440, 'sine', 0.1); // Eat sound

        // Slight speed increase
        this.speed = Math.max(60, this.baseSpeed - Math.floor(this.score / 50) * 5);
    }

    endGame() {
        this.isGameOver = true;
        this.gameStarted = false;
        this.finalScoreEl.textContent = this.score;
        this.gameOverScreen.classList.remove('hidden');
        this.playSound(110, 'sawtooth', 0.3); // Game over sound
        cancelAnimationFrame(this.animationId);
    }

    gameLoop(timestamp) {
        if (!this.gameStarted) return;

        const deltaTime = timestamp - this.lastUpdateTime;

        if (deltaTime >= this.speed) {
            this.update();
            this.lastUpdateTime = timestamp;
        }

        this.draw();
        this.animationId = requestAnimationFrame((t) => this.gameLoop(t));
    }

    draw() {
        // Clear background
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw food
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = '#ff2d55';
        this.ctx.fillStyle = '#ff2d55';
        this.drawRoundedRect(
            this.food.x * this.tileSize + 2,
            this.food.y * this.tileSize + 2,
            this.tileSize - 4,
            this.tileSize - 4,
            this.tileSize / 2
        );

        // Draw snake
        this.snake.forEach((segment, index) => {
            const isHead = index === 0;
            this.ctx.shadowBlur = isHead ? 20 : 10;
            this.ctx.shadowColor = '#00ff88';
            this.ctx.fillStyle = isHead ? '#00ff88' : '#00cc6e';
            
            const padding = isHead ? 1 : 2;
            this.drawRoundedRect(
                segment.x * this.tileSize + padding,
                segment.y * this.tileSize + padding,
                this.tileSize - (padding * 2),
                this.tileSize - (padding * 2),
                4
            );
        });

        // Reset shadow for performance
        this.ctx.shadowBlur = 0;
    }

    drawRoundedRect(x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x + r, y);
        this.ctx.arcTo(x + w, y, x + w, y + h, r);
        this.ctx.arcTo(x + w, y + h, x, y + h, r);
        this.ctx.arcTo(x, y + h, x, y, r);
        this.ctx.arcTo(x, y, x + w, y, r);
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawPlaceholder() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
        // Draw some "ghost" snake or patterns
        for (let i = 0; i < 5; i++) {
            this.drawRoundedRect(
                (5 + i) * this.tileSize + 2,
                10 * this.tileSize + 2,
                this.tileSize - 4,
                this.tileSize - 4,
                4
            );
        }
    }

    updateScoreUI() {
        this.scoreEl.textContent = this.score.toString().padStart(3, '0');
        this.highScoreEl.textContent = this.highScore.toString().padStart(3, '0');
    }

    playSound(freq, type, duration) {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            // Audio might be blocked by browser until interaction
            console.log("Audio context error:", e);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new NeonSnake();
});
