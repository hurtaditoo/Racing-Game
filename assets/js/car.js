class Car {

    constructor(ctx) {
        
        this.ctx = ctx;

        this.img = new Image();
        this.img.src = 'assets/images/moto.png';

        this.w = 100;
        this.h = 160;

        this.img.onload = () => {
            this.x = this.ctx.canvas.width / 2 - this.w / 2;  // Centrar el coche horizontalmente
            this.y = this.ctx.canvas.height - this.h;  // Posicionarlo en la parte inferior
        };

        this.vx = 0;   
        this.vy = 0;

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
            this.x = 0; // No permitir que el coche salga por la izquierda
        } else if (this.x + this.w > this.ctx.canvas.width) {
            this.x = this.ctx.canvas.width - this.w; // No permitir que el coche salga por la derecha
        }

        // Límites en la dirección vertical abajo
        if (this.y + this.h > this.ctx.canvas.height) {
            this.y = this.ctx.canvas.height - this.h; 
        }

    }

    draw() {

        this.ctx.drawImage(
            this.img,
            this.x,
            this.y,
            this.w,
            this.h
        );

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

            // case KEY_SPACE:
            //     this.fire();
            //     break;
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
        const margin = 30; 
        const colX = el.x <= (this.x + this.w + margin) && (el.x + el.w - margin) >= this.x;
        const colY = el.y <= (this.y + this.h + margin) && (el.y + el.h - margin) >= this.y;
        return colX && colY;
    }

    isOffRoad(calzadaOffset, calzadaWidth) {
        return this.x < calzadaOffset || this.x + this.w > calzadaOffset + calzadaWidth;
    }

}