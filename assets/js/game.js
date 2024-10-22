class Game {
    
    constructor(ctx) {
        this.ctx = ctx;

        this.car = new Car(ctx);

        this.background = new Background(ctx);

        this.obstacles = [];

        this.calzadaWidth = this.ctx.canvas.width * 0.62; 
        this.calzadaOffset = (this.ctx.canvas.width - this.calzadaWidth) / 2; 


        this.interval = null;

        this.setListeners();

    }

    start() {
        let tick = 0;

        this.interval = setInterval(() => {
            
            this.clear();

            this.move();    

            this.draw();

            this.checkCollisions();

            tick++; // Aumenta el contador tick

            if (tick >= 200) {  
                this.addObstacle();
                tick = 0;
            }

        }, 1000 / 60);
    }

    checkCollisions() {

        this.obstacles.forEach((obstacle) => {
          if (this.car.collides(obstacle)) {
            this.gameOver();
          }
        });

        if (this.car.isOffRoad(this.calzadaOffset, this.calzadaWidth)) {
            this.gameOver();
        }

    }

    gameOver() {
        this.pause();

        const gameOverLogo = new Image();
        gameOverLogo.src = 'assets/images/game-over.png';
    
        gameOverLogo.onload = () => {
          const desiredWidth = 700; // Establece el ancho deseado
          const desiredHeight = 400; // Establece la altura deseada
          
          const centerX = (this.ctx.canvas.width - desiredWidth) / 2;
          const centerY = (this.ctx.canvas.height - desiredHeight) / 2;
          
          this.ctx.drawImage(gameOverLogo, centerX, centerY, desiredWidth, desiredHeight);
        };
    }

    addObstacle() {    
        const newObstacle = new Obstacle(this.ctx);
        
        // Posicionar los obstáculos aleatoriamente dentro de los límites de la calzada
        newObstacle.x = Math.random() * (this.calzadaWidth - newObstacle.w) + this.calzadaOffset;
        newObstacle.y = -newObstacle.h; // Empieza por arriba de la pantalla

        this.obstacles.push(newObstacle);
        this.obstacles = this.obstacles.filter((e) => e.y < this.ctx.canvas.height);
    }

    pause() {
        clearInterval(this.interval);   // Detiene el bucle del juego limpiando el intervalo
    }

    draw() {    
        this.background.draw();
        this.obstacles.forEach((e) => e.draw());
        this.car.draw();
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