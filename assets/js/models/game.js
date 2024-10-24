class Game {
    
    constructor(ctx) {
        this.ctx = ctx;

        this.car = new Car(ctx, 0);

        this.background = new Background(ctx);

        this.obstacles = [];

        this.calzadaWidth = this.ctx.canvas.width * 0.6; 
        this.calzadaOffset = (this.ctx.canvas.width - this.calzadaWidth) / 2; 

        this.interval = null;

        this.tick = 0;

        this.isBlinking = false; 
        this.blinkDuration = 300; 
        this.blinkInterval = 100; 
        this.blinkStartTime = null;

        this.setListeners();

    }

    start() {
        this.interval = setInterval(() => {
            
            this.clear();

            this.move();    

            this.draw();

            this.addObstacle();
            
            this.checkCollisions();

            this.tick++; // Aumenta el contador tick

        }, 1000 / 60);
    }

    checkCollisions() {

        this.obstacles = this.obstacles.filter((obstacle) => {
            if (this.car.collides(obstacle)) {
                this.car.loseLive();  
                this.startBlinking(); 
                return false;  // Elimina el obstáculo si hay colisión
            }
            return true; // Mantiene el obstáculo si no hay colisión
        });

        if (this.car.isOffRoad(this.calzadaOffset, this.calzadaWidth)) {
            this.car.loseLive(); 
            this.startBlinking();
            this.car.resetPosition();
        }

        if (this.car.lives === 0) {
            this.gameOver();
        }

    }

    startBlinking() {
        this.isBlinking = true; 
        this.blinkStartTime = Date.now(); 
    }

    gameOver() {
        this.pause();

        const gameOverLogo = new Image();
        gameOverLogo.src = 'assets/images/game-over.png';
    
        gameOverLogo.onload = () => {
          const desiredWidth = 700; 
          const desiredHeight = 400;
          
          const centerX = (this.ctx.canvas.width - desiredWidth) / 2;
          const centerY = (this.ctx.canvas.height - desiredHeight) / 2;
          
          this.ctx.drawImage(gameOverLogo, centerX, centerY, desiredWidth, desiredHeight);
        };
    }

    addObstacle() {    

        if (this.tick >= 200) {  
            this.tick = 0;

            const newObstacle = new Obstacle(this.ctx);
        
            // Posicionar los obstáculos aleatoriamente dentro de los límites de la calzada
            newObstacle.x = Math.random() * (this.calzadaWidth - newObstacle.obstacleWidth) + this.calzadaOffset;
            newObstacle.y = -newObstacle.obstacleHeight; // Empieza por arriba de la pantalla
    
            this.obstacles.push(newObstacle);
            this.obstacles = this.obstacles.filter((e) => e.y < this.ctx.canvas.height);    
        }
           
    }

    pause() {
        clearInterval(this.interval);   // Detiene el bucle del juego limpiando el intervalo
    }

    draw() {    
        this.background.draw();
        this.obstacles.forEach((e) => e.draw());

        if (this.isBlinking) {
            const timeElapsed = Date.now() - this.blinkStartTime;
    
            if (timeElapsed < this.blinkDuration) {
                if (Math.floor(timeElapsed / this.blinkInterval) % 2 === 0) {
                    this.car.draw(); 
                }
            } 
            else {
                this.isBlinking = false; 
                this.car.draw(); 
            }
        } 
        else {
            this.car.draw();
        }
    }

    move() {
        this.background.move();
        this.obstacles.forEach((e) => e.move());
        this.car.move();
    }

    clear() {   // necesario para poder dibujar la siguiente "imagen" del juego y evitar que se vean "rastros" de los elementos anteriores
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    setListeners() {    
        document.addEventListener('keydown', (event) => {
            this.car.onKeyDown(event.keyCode);
        });
        
        document.addEventListener('keyup', (event) => {
            this.car.onKeyUp(event.keyCode);
        });
    }

}