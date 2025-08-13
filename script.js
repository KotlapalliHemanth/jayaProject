// Global variables
let confettiSystem;
let isTypewriterActive = false;
let currentMessageIndex = 0;

// Birthday messages for typewriter effect
const birthdayMessages = [
    "Happy Birthday, Jiju2! 🎉",
    "May your lifecode be bug-free! ✨",
    "Wishing you infinite happiness! 💖",
    "Another year of awesome lifecoding! 🚀",
    "Hope your day is as amazing as you! 🌟"
];

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTypewriter();
    initializeConfetti();
    initializeButtons();
    initializeScrollAnimations();
    addRippleEffect();
    
    // Start initial typewriter animation
    setTimeout(() => {
        startTypewriter();
    }, 1500);
});

// Typewriter Effect System
function initializeTypewriter() {
    const typewriterElement = document.getElementById('typewriter-text');
    if (!typewriterElement) return;
    
    typewriterElement.textContent = '';
}

function typeWriter(text, element, speed = 80, callback = null) {
    if (isTypewriterActive) return;
    
    isTypewriterActive = true;
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            isTypewriterActive = false;
            if (callback) callback();
        }
    }
    
    type();
}

function startTypewriter() {
    const typewriterElement = document.getElementById('typewriter-text');
    if (!typewriterElement) return;
    
    function cycleMessages() {
        const message = birthdayMessages[currentMessageIndex];
        typeWriter(message, typewriterElement, 100, () => {
            setTimeout(() => {
                currentMessageIndex = (currentMessageIndex + 1) % birthdayMessages.length;
                setTimeout(cycleMessages, 500);
            }, 2000);
        });
    }
    
    cycleMessages();
}

// Advanced Confetti System
class AdvancedConfetti {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.isActive = false;
        this.animationId = null;
        
        this.colors = [
            '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', 
            '#ffeaa7', '#dda0dd', '#98d8c8', '#f7dc6f',
            '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3'
        ];
        
        this.shapes = ['circle', 'square', 'triangle', 'star'];
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: -10,
            vx: (Math.random() - 0.5) * 8,
            vy: Math.random() * 3 + 2,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            size: Math.random() * 12 + 4,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            shape: this.shapes[Math.floor(Math.random() * this.shapes.length)],
            gravity: 0.15,
            life: 1,
            decay: Math.random() * 0.02 + 0.005,
            bounce: Math.random() * 0.6 + 0.4
        };
    }
    
    updateParticle(particle) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += particle.gravity;
        particle.rotation += particle.rotationSpeed;
        particle.life -= particle.decay;
        
        // Bounce off walls
        if (particle.x <= 0 || particle.x >= this.canvas.width) {
            particle.vx *= -particle.bounce;
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
        }
        
        // Bounce off ground
        if (particle.y >= this.canvas.height - particle.size) {
            particle.vy *= -particle.bounce;
            particle.y = this.canvas.height - particle.size;
            particle.vx *= 0.9; // Friction
        }
    }
    
    drawParticle(particle) {
        this.ctx.save();
        this.ctx.globalAlpha = particle.life;
        this.ctx.translate(particle.x, particle.y);
        this.ctx.rotate(particle.rotation * Math.PI / 180);
        this.ctx.fillStyle = particle.color;
        
        const size = particle.size;
        
        switch (particle.shape) {
            case 'circle':
                this.ctx.beginPath();
                this.ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
                this.ctx.fill();
                break;
                
            case 'square':
                this.ctx.fillRect(-size / 2, -size / 2, size, size);
                break;
                
            case 'triangle':
                this.ctx.beginPath();
                this.ctx.moveTo(0, -size / 2);
                this.ctx.lineTo(-size / 2, size / 2);
                this.ctx.lineTo(size / 2, size / 2);
                this.ctx.closePath();
                this.ctx.fill();
                break;
                
            case 'star':
                this.drawStar(0, 0, 5, size / 2, size / 4);
                this.ctx.fill();
                break;
        }
        
        this.ctx.restore();
    }
    
    drawStar(cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;
        
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy - outerRadius);
        
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            this.ctx.lineTo(x, y);
            rot += step;
            
            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            this.ctx.lineTo(x, y);
            rot += step;
        }
        
        this.ctx.lineTo(cx, cy - outerRadius);
        this.ctx.closePath();
    }
    
    start(duration = 6000) {
        this.isActive = true;
        this.animate();
        
        // Add initial burst
        for (let i = 0; i < 100; i++) {
            this.particles.push(this.createParticle());
        }
        
        // Continue adding particles
        const addParticles = setInterval(() => {
            if (this.isActive) {
                for (let i = 0; i < 15; i++) {
                    this.particles.push(this.createParticle());
                }
            }
        }, 200);
        
        // Stop after duration
        setTimeout(() => {
            this.isActive = false;
            clearInterval(addParticles);
        }, duration);
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles = this.particles.filter(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
            return particle.life > 0 && particle.y < this.canvas.height + 50;
        });
        
        // Continue animation if active or particles exist
        if (this.isActive || this.particles.length > 0) {
            this.animationId = requestAnimationFrame(() => this.animate());
        }
    }
    
    stop() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Balloon Animation System
class BalloonSystem {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.balloons = [];
        this.colors = [
            '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', 
            '#ffeaa7', '#dda0dd', '#98d8c8', '#f7dc6f'
        ];
    }
    
    createBalloon() {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.background = this.colors[Math.floor(Math.random() * this.colors.length)];
        balloon.style.left = Math.random() * 90 + '%';
        balloon.style.animationDuration = (Math.random() * 3 + 5) + 's';
        balloon.style.animationDelay = Math.random() * 2 + 's';
        
        this.container.appendChild(balloon);
        this.balloons.push(balloon);
        
        // Remove balloon after animation
        setTimeout(() => {
            if (balloon.parentNode) {
                balloon.parentNode.removeChild(balloon);
            }
            this.balloons = this.balloons.filter(b => b !== balloon);
        }, 8000);
    }
    
    start(count = 20) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                this.createBalloon();
            }, i * 300);
        }
    }
    
    clear() {
        this.balloons.forEach(balloon => {
            if (balloon.parentNode) {
                balloon.parentNode.removeChild(balloon);
            }
        });
        this.balloons = [];
    }
}

// Terminal Animation System
class TerminalAnimator {
    constructor(outputId) {
        this.output = document.getElementById(outputId);
        this.messages = [
            { type: 'success', text: '✓ Loading birthday celebration modules...' },
            { type: 'info', text: '→ Initializing happiness.js' },
            { type: 'info', text: '→ Compiling joy.css' },
            { type: 'info', text: '→ Executing party.html' },
            { type: 'success', text: '🎉 Happy Birthday, Jiju!' },
            { type: 'success', text: '🎂 Celebration deployed successfully!' },
            { type: 'info', text: '→ Generating infinite smiles...' },
            { type: 'success', text: '✨ May your year be filled with amazing code!' },
            { type: 'success', text: '🚀 Birthday protocol executed with 0 errors!' }
        ];
    }
    
    addLine(message, type = 'info', delay = 0) {
        setTimeout(() => {
            const line = document.createElement('div');
            line.className = 'terminal-line';
            
            const timestamp = new Date().toLocaleTimeString();
            const colors = {
                success: '#4caf50',
                error: '#f44747',
                info: '#2196f3',
                warning: '#ffc107'
            };
            
            line.innerHTML = `
                <span style="color: #666;">[${timestamp}]</span>
                <span style="color: ${colors[type]};">${message}</span>
            `;
            
            this.output.appendChild(line);
            this.output.scrollTop = this.output.scrollHeight;
        }, delay);
    }
    
    runCelebration() {
        // Clear previous output except first line
        const firstLine = this.output.firstElementChild;
        this.output.innerHTML = '';
        if (firstLine) {
            this.output.appendChild(firstLine);
        }
        
        // Add celebration messages with delays
        this.messages.forEach((msg, index) => {
            this.addLine(msg.text, msg.type, index * 800);
        });
    }
}

// Initialize systems
function initializeConfetti() {
    confettiSystem = new AdvancedConfetti('confettiCanvas');
}

function initializeButtons() {
    const runButton = document.getElementById('runCelebration');
    const surpriseButton = document.getElementById('surpriseButton');
    const terminalAnimator = new TerminalAnimator('terminal-output');
    const balloonSystem = new BalloonSystem('balloonsContainer');
    
    if (runButton) {
        runButton.addEventListener('click', function() {
            // Disable button temporarily
            this.disabled = true;
            this.style.opacity = '0.7';
            
            // Run terminal animation
            terminalAnimator.runCelebration();
            
            // Start confetti after a delay
            setTimeout(() => {
                confettiSystem.start(8000);
            }, 2000);
            
            // Re-enable button
            setTimeout(() => {
                this.disabled = false;
                this.style.opacity = '1';
            }, 3000);
        });
    }
    
    if (surpriseButton) {
        surpriseButton.addEventListener('click', function() {
            // Disable button temporarily
            this.disabled = true;
            this.style.opacity = '0.7';
            
            // Start balloons and confetti simultaneously
            balloonSystem.start(25);
            confettiSystem.start(10000);
            
            // Add special terminal message
            terminalAnimator.addLine('🎁 Special surprise activated!', 'success');
            terminalAnimator.addLine('🎈 Launching birthday balloons...', 'info', 500);
            terminalAnimator.addLine('✨ Extra confetti deployed!', 'success', 1000);
            
            // Re-enable button
            setTimeout(() => {
                this.disabled = false;
                this.style.opacity = '1';
            }, 3000);
        });
    }
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    document.querySelectorAll('.wish-card, .comment-block, .terminal-window').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
}

// Ripple effect for buttons
function addRippleEffect() {
    document.querySelectorAll('.run-button, .surprise-button').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = this.querySelector('.button-ripple');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            
            setTimeout(() => {
                ripple.style.animation = '';
            }, 600);
        });
    });
}

// Smooth scrolling for navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Easter egg: Konami code
let konamiSequence = [];
const konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', function(e) {
    konamiSequence.push(e.code);
    
    if (konamiSequence.length > konamiCode.length) {
        konamiSequence.shift();
    }
    
    if (konamiSequence.join(',') === konamiCode.join(',')) {
        // Easter egg activated!
        const terminalAnimator = new TerminalAnimator('terminal-output');
        terminalAnimator.addLine('🎮 KONAMI CODE ACTIVATED!', 'success');
        terminalAnimator.addLine('🌟 Secret developer mode unlocked!', 'info', 500);
        terminalAnimator.addLine('🎉 Extra birthday magic deployed!', 'success', 1000);
        
        // Super confetti
        confettiSystem.start(15000);
        
        // Reset sequence
        konamiSequence = [];
    }
});

// Particle cursor effect (optional enhancement)
class CursorParticles {
    constructor() {
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '9999';
        
        document.body.appendChild(this.canvas);
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        document.addEventListener('mousemove', (e) => this.updateMouse(e));
        
        this.animate();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    updateMouse(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
        
        // Add particle at mouse position
        if (Math.random() < 0.3) {
            this.particles.push({
                x: this.mouse.x,
                y: this.mouse.y,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                life: 1,
                decay: 0.02,
                size: Math.random() * 3 + 1,
                color: `hsl(${Math.random() * 360}, 70%, 60%)`
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            
            this.ctx.save();
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
            
            return particle.life > 0;
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize cursor particles (uncomment to enable)
// new CursorParticles();

// Performance optimization: Reduce animations on mobile
if (window.innerWidth <= 768) {
    // Reduce particle counts and animation complexity for mobile
    document.documentElement.style.setProperty('--animation-duration', '2s');
}