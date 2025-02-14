class Ball {
    constructor(x, y, dx, dy, radius, color) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.color = color;
        this.radius = radius
        this.trail = []
        this.speed = 1
    }

    drawTrail() {                
        for (let i = 0; i < this.trail.length; i++) {
            const trailBall = this.trail[i];
            const alpha = i / this.trail.length / 10;
            const trailRadius = this.radius * (i / (this.trail.length * 2)) + this.radius/2;
            ctx.beginPath();
            ctx.arc(trailBall.x, trailBall.y, trailRadius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, ' + alpha + ')';
            ctx.fill();
            ctx.closePath();
        }
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update_mouse() {                
        this.x = mouseX
        this.y = mouseY;

        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 50) {
            this.trail.shift();
        }
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }
    }

    update_towards() {
        const mx = mouseX - this.x;
        const my = mouseY - this.y;
        const distance = Math.sqrt(mx * mx + my * my);

        if(distance > 0) {
            this.x += (mx / distance) * this.speed;
            this.y += (my / distance) * this.speed;
        }

        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 50) {
            this.trail.shift();
        }
    }
}

const canvas = document.querySelector('#myCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth-17;

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth-17;
});

let balls1 = [];
let balls2 = [];

function startGame() {  
    canvas.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    balls1 = [];
    balls2 = [];

    for (let i = 0; i < 5; i++) {
        let dx = Math.random() * 4 - 2;
        let dy = Math.random() * 4 - 2;
        let color = 'red';
        let radius = i === 0 ? 25 : Math.random() * 10 + 10;
        let ball = new Ball(canvas.width / 2, canvas.height / 2, dx, dy, radius, color);
        balls1.push(ball);
    }

    for (let i = 0; i < 10; i++) {
        let dx = Math.random() * 4 - 2;
        let dy = Math.random() * 4 - 2;
        let color = '#16899d';
        let radius = Math.random() * 10 + 10;
        let ball = new Ball(canvas.width / 2, canvas.height / 2, dx, dy, radius, color);
        balls2.push(ball);
    }

    setTimeout(() => {
        animateBalls();
    }, 10);
}

mouseX = 0
mouseY = 0

let mouseBall = new Ball(0, 0, 0, 0, 12.5, 'white');

function animateBalls() {
    gameOver = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < balls1.length; i++) {
        const ball = balls1[i];
        const dx = ball.x - mouseX;
        const dy = ball.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= 25) {
            gameOver = true;
        }
    }

    // Delete balls that touch the mouse object and flash the screen for each deletion
    const initialLength = balls2.length;
    balls2 = balls2.filter(ball => {
        const dx = ball.x - mouseX;
        const dy = ball.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance > 25; // Keep balls that are more than 20 pixels away from the mouse
    });
    if (balls2.length < initialLength) {
        canvas.style.backgroundColor = 'rgba(0, 255, 0, 0.1)'; // Flash the screen green
        setTimeout(() => {
            canvas.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        }, 100);
    }

    balls1.forEach(ball => {
        ball.draw();
        if (ball === balls1[0]) {
            ball.speed = 1 + (10 - balls2.length) * 0.2;
            ball.drawTrail();
            ball.update_towards();
        } else {
            ball.update();
        }
    });

    balls2.forEach(ball => {
        ball.draw();
        ball.update();
    });
    
    mouseBall.drawTrail();
    mouseBall.draw();
    mouseBall.update_mouse();
    
    if(gameOver) {
        canvas.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
        setTimeout(() => {
            startGame();
        }, 250);
        return;
    }

    if(balls2.length == 0) {
        expandContactForm();
    } else {
        requestAnimationFrame(animateBalls);
    }
}
        
canvas.addEventListener('mousemove', function(event) {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
});

function expandCanvas() {
    const canvas = document.querySelector('#myCanvas');
    const header = document.querySelector('#mainNav');
    const headerHeight = header.offsetHeight;
    const newCanvasHeight = window.innerHeight - headerHeight;
    document.getElementById('header-text').style.display = 'none';
    document.getElementById('reveal').style.display = 'none';

    canvas.style.height = newCanvasHeight + 'px';
    canvas.height = newCanvasHeight;
    startGame();
}

function expandContactForm() {
    const canvas = document.querySelector('#myCanvas');
    canvas.style.height = '0px';
    document.getElementById('header-text').style.display = '';
    document.getElementById('signup').style.display = '';
}