class Car {

    constructor(ctx, vehicleIndex) {
        
        this.ctx = ctx;

        const vehicle = VEHICLE_IMAGES[vehicleIndex];

        this.img = new Image();
        this.img.src = `assets/images/${vehicle.src}`;

        this.carWidth= vehicle.w;
        this.carHeight = vehicle.h;

        this.img.onload = () => {
            this.x = this.ctx.canvas.width / 2 - this.carWidth / 2;  // Centrar el coche horizontalmente
            this.y = this.ctx.canvas.height - this.carHeight;  // Posicionarlo en la parte inferior
        };

        this.vx = 0;   
        this.vy = 0;
        
        this.isNitroActive = false;
        this.nitroDuration = 300; 
        this.nitroSpeed = 35;  

        this.lives = 4;
        this.heartImg = new Image();
        this.heartImg.src = 'assets/images/lives.png';

    }

    activateNitro() {
        if (!this.isNitroActive) {  // Si no está ya activo ...
            this.isNitroActive = true; 
            this.vy += this.nitroSpeed;  

            setTimeout(() => {
                this.isNitroActive = false;
                this.vy = 0; 
 
            }, this.nitroDuration);
        }
    }

    loseLive() {
        if (this.lives >= 0) {
            this.lives--;  
        }
    }

    move() {    

        this.y -= this.vy;
        this.x -= this.vx;

        // Límites del canvas para el movimiento vertical
        if (this.y < 0) {
            this.y = 0; // No permitir que el coche salga por la parte superior
        }

        // Límites del canvas para el movimiento horizontal
        if (this.x < 0) {
            this.x = 0; // Que no salga por la izq
        } else if (this.x + this.carWidth > this.ctx.canvas.width) {
            this.x = this.ctx.canvas.width - this.carWidth; // Que no salga por la derecha
        }

        // Límites en la dirección vertical abajo
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
        const heartHeight = 30;  
        const heartX = 25;  
        const heartY = 25;  

        for (let i = 0; i < this.lives - 1; i++) {
            this.ctx.drawImage(
                this.heartImg,
                heartX + i * (heartWidth + 30),  // 5 para poner distancia entre los corazones 
                heartY,
                heartWidth,
                heartHeight
            );
        }

    }

    onKeyDown(code) {
        switch (code) {
            case KEY_UP:
                this.vy = 20;
                break;

            case KEY_DOWN:
                this.vy = -20;
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

    isOffRoad(calzadaOffset, calzadaWidth) {
        return this.x < calzadaOffset || this.x + this.carWidth > calzadaOffset + calzadaWidth;
    }

    resetPosition() {
        this.x = this.ctx.canvas.width / 2 - this.carWidth / 2;  
        this.y = this.ctx.canvas.height - this.carHeight;  
    }

}