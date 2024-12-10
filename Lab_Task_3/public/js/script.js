// Create and inject necessary styles

const injectStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        .animated-background {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            opacity: 0.3;
        }

        .project-card {
            backdrop-filter: blur(5px);
            background: rgba(255, 255, 255, 0.9) !important;
        }

        .header {
            background: linear-gradient(135deg, #2a2a72dd, #009ffddd) !important;
            backdrop-filter: blur(5px);
        }
    `;
    document.head.appendChild(style);
};

// Create animated background
class AnimatedBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'animated-background';
        this.ctx = this.canvas.getContext('2d');
        document.body.prepend(this.canvas);
        
        // Array of color schemes
        this.colorSchemes = [
            ['#4158D0', '#C850C0', '#FFCC70'], // Purple to Pink to Yellow
            ['#0093E9', '#80D0C7', '#ffffff'], // Blue to Cyan to White
            ['#8EC5FC', '#E0C3FC', '#ffffff'], // Light Blue to Lavender
            ['#4158D0', '#C850C0', '#FFCC70'], // Purple to Pink to Gold
            ['#43CBFF', '#9708CC', '#ffffff']  // Cyan to Purple to White
        ];
        
        this.currentScheme = 0;
        this.squares = [];
        this.init();
    }

    init() {
        // Set canvas size
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Initialize squares
        this.createSquares();

        // Start animation
        this.animate();

        // Change color scheme periodically
        setInterval(() => {
            this.currentScheme = (this.currentScheme + 1) % this.colorSchemes.length;
        }, 10000);
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createSquares();
    }

    createSquares() {
        this.squares = [];
        const numberOfSquares = Math.floor((window.innerWidth * window.innerHeight) / 15000);
        
        for (let i = 0; i < numberOfSquares; i++) {
            this.squares.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 15 + 5,
                speedX: (Math.random() - 0.5) * 1.5,
                speedY: (Math.random() - 0.5) * 1.5,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                colorIndex: Math.floor(Math.random() * 3),
                pulsePhase: Math.random() * Math.PI * 2,
                pulseSpeed: 0.05 + Math.random() * 0.05
            });
        }
    }

    drawSquare(square) {
        const colors = this.colorSchemes[this.currentScheme];
        const nextScheme = (this.currentScheme + 1) % this.colorSchemes.length;
        const progress = (Date.now() % 10000) / 10000;
        
        // Interpolate between current and next color scheme
        const currentColor = colors[square.colorIndex];
        const nextColor = this.colorSchemes[nextScheme][square.colorIndex];
        
        const color = this.interpolateColors(currentColor, nextColor, progress);
        
        this.ctx.save();
        this.ctx.translate(square.x, square.y);
        this.ctx.rotate(square.rotation);
        
        // Add pulse effect
        const pulse = Math.sin(square.pulsePhase) * 0.2 + 0.8;
        const size = square.size * pulse;
        
        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = 0.6 * pulse;
        this.ctx.fillRect(-size/2, -size/2, size, size);
        this.ctx.restore();
    }

    interpolateColors(color1, color2, progress) {
        const r1 = parseInt(color1.slice(1,3), 16);
        const g1 = parseInt(color1.slice(3,5), 16);
        const b1 = parseInt(color1.slice(5,7), 16);
        
        const r2 = parseInt(color2.slice(1,3), 16);
        const g2 = parseInt(color2.slice(3,5), 16);
        const b2 = parseInt(color2.slice(5,7), 16);
        
        const r = Math.round(r1 + (r2 - r1) * progress);
        const g = Math.round(g1 + (g2 - g1) * progress);
        const b = Math.round(b1 + (b2 - b1) * progress);
        
        return `rgb(${r},${g},${b})`;
    }

    updateSquare(square) {
        // Update position
        square.x += square.speedX;
        square.y += square.speedY;
        
        // Bounce off edges
        if (square.x < 0 || square.x > this.canvas.width) {
            square.speedX *= -1;
        }
        if (square.y < 0 || square.y > this.canvas.height) {
            square.speedY *= -1;
        }
        
        // Update rotation
        square.rotation += square.rotationSpeed;
        
        // Update pulse
        square.pulsePhase += square.pulseSpeed;
        
        // Keep squares within bounds
        square.x = Math.max(0, Math.min(this.canvas.width, square.x));
        square.y = Math.max(0, Math.min(this.canvas.height, square.y));
    }

    animate() {
        // Clear canvas with a slight trail effect
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw squares
        this.squares.forEach(square => {
            this.updateSquare(square);
            this.drawSquare(square);
        });

        // Continue animation
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize animation on page load
document.addEventListener('DOMContentLoaded', () => {
    injectStyles();
    const background = new AnimatedBackground();
    
    // Add smooth scroll functionality
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Add smooth fade-in for project cards
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    document.querySelectorAll('.project-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
});