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
    balls1 = [];
    balls2 = [];

    for (let i = 0; i < 5; i++) {
        let dx = Math.random() * 4 - 2;
        let dy = Math.random() * 4 - 2;
        let color = 'red';
        let radius = i === 0 ? 12.5 : Math.random() * 10 + 5
        let ball = new Ball(canvas.width / 2, canvas.height / 2, dx, dy, radius, color);
        balls1.push(ball);
    }

    for (let i = 0; i < 10; i++) {
        let dx = Math.random() * 4 - 2;
        let dy = Math.random() * 4 - 2;
        let color = 'green';
        let radius = Math.random() * 10 + 5;
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

    // Delete balls that touch the mouse object
    balls2 = balls2.filter(ball => {
        const dx = ball.x - mouseX;
        const dy = ball.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance > 25; // Keep balls that are more than 20 pixels away from the mouse
    });    

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
        startGame();
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
    document.querySelector("#click").pointerEvents = "none";

    const canvas = document.querySelector('#myCanvas');
    let currentHeight = parseInt(canvas.style.height.slice(0, -2));
    if(isNaN(currentHeight)) {
        currentHeight = 0;
    }

    let vel = ((((-((currentHeight - 150) * (currentHeight - 150))) / 150) + 150) / 18) + 1;

    canvas.style.height = (currentHeight + vel) + 'px';

    if(currentHeight >= 300) {
        canvas.style.height = '300px';
        canvas.height = 300;
        startGame();
    } else {
        setTimeout(() => {
            expandCanvas();
        }, 10);
    }
}

function expandContactForm() {
    const form = document.querySelector('#signup');

    // Temporarily set the height to 'auto' and padding to the desired value to get the full height
    form.style.height = 'auto';
    const fullHeight = (form.offsetHeight + 10 * 2 * 16) + 'px';

    // Reset the height and padding back to 0, then trigger the transition
    form.style.height = '0';
    form.style.padding = '0';
    setTimeout(() => {
        form.style.height = fullHeight;
        form.style.padding = '10rem 0';
    }, 0);

    // Optionally, remove the height after the transition to allow for future content changes
    form.addEventListener('transitionend', function handler() {
        form.style.height = 'auto';
        form.removeEventListener('transitionend', handler);
    });
}