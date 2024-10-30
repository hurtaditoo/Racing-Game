class Car {

    constructor(ctx, vehicleIndex) {
        
        this.ctx = ctx;

        const vehicle = VEHICLE_IMAGES[vehicleIndex];

        this.img = new Image();
        this.img.src = `assets/images/${vehicle.src}`;

        this.carWidth = vehicle.w;
        this.carHeight = vehicle.h;

        this.img.onload = () => {
            this.x = this.ctx.canvas.width / 2 - this.carWidth / 2;  // So the car is centered horizontally
            this.y = this.ctx.canvas.height - this.carHeight;  // Ubicates the car at the bottom of the canvas
        };

        this.vx = 0;   
        this.vy = 0;

        this.currentSpeed = 20;
        
        this.isNitroActive = false;
        this.nitroDuration = 300; 
        this.nitroSpeed = 35;  

        this.lives = 4;
        this.heartImg = new Image();
        this.heartImg.src = 'assets/images/lives.png';

        this.lastLiveSound = new Audio("assets/audio/game-over.mp3"); 
        this.lastLiveSound.volume = 0.1;
        this.loseLiveSound = new Audio("assets/audio/life-lost.mp3"); 
        this.loseLiveSound.volume = 0.1;

    }

    activateNitro() {
        if (!this.isNitroActive) {  // If it's not active
            this.isNitroActive = true; 
            this.vy += this.nitroSpeed;  

            setTimeout(() => {
                this.isNitroActive = false;
                this.vy = 0; 
 
            }, this.nitroDuration);
        }
    }

    loseLive() {
        if (this.lives > 0) {
            if (this.lives === 1) { 
                this.lastLiveSound.play();
            } 
            else {
                this.loseLiveSound.play();
            }
            this.lives--;
        }
    }

    move() {    

        this.y -= this.vy;
        this.x -= this.vx;

        // Limits in the canvas for the vertical movement
        if (this.y < 0) {
            this.y = 0; // Do not allow the car to exit the top of the canvas
        }

        // Limits for the horizontal movement
        if (this.x < 0) {
            this.x = 0; // So it can't exit the left of the canvas
        } else if (this.x + this.carWidth > this.ctx.canvas.width) {
            this.x = this.ctx.canvas.width - this.carWidth; // So it can't exit the right of the canvas
        }

        // Limits in the canvas for the vertical movement down the canvas
        if (this.y + this.carHeight > this.ctx.canvas.height) {
            this.y = this.ctx.canvas.height - this.carHeight; 
        }

    }

    draw() {
        this.ctx.drawImage(
            this.img,
            this.x,
            this.y,
            this.carWidth,
            this.carHeight
        );

        const heartWidth = 40;  
        const heartHeight = 35;  
        const heartX = 25;  
        const heartY = 20;  

        for (let i = 0; i < this.lives - 1; i++) {
            this.ctx.drawImage(
                this.heartImg,
                heartX + i * (heartWidth + 30),  // 30-25=5 for the gap between hearts 
                heartY,
                heartWidth,
                heartHeight
            );
        }
    }

    onKeyDown(code) {
        switch (code) {
            case KEY_UP:
                this.vy = this.currentSpeed;
                break;

            case KEY_DOWN:
                this.vy = -this.currentSpeed;
                break;
            
            case KEY_RIGHT:
                this.vx = -10;
                break;
            
            case KEY_LEFT:
                this.vx = 10;
                break;

            case KEY_SPACE:
                this.activateNitro();
                break;
        }
    }

    onKeyUp(code) {
        switch (code) {
            case KEY_RIGHT:
            case KEY_LEFT:
                this.vx = 0;
                break;

            case KEY_UP:
            case KEY_DOWN:
                this.vy = 0;
                break;
        }
    }

    collides(el) {
        const margin = 35; 

        const colX = el.x <= (this.x + this.carWidth + margin) && (el.x + el.obstacleWidth - margin) >= this.x;
        const colY = el.y <= (this.y + this.carHeight + margin) && (el.y + el.obstacleHeight - margin) >= this.y;
        
        return colX && colY;
    }

    isOffRoad(roadOffset, roadWidth) {
        return this.x < roadOffset || this.x + this.carWidth > roadOffset + roadWidth;
    }

    resetPosition() {
        this.x = this.ctx.canvas.width / 2 - this.carWidth / 2;  
        this.y = this.ctx.canvas.height - this.carHeight;  
    }

}