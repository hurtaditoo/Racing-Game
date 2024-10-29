class Game {
    
    constructor(ctx) {
        this.ctx = ctx;
        this.car = new Car(ctx, 0);
        this.background = new Background(ctx);

        this.level = 1;
        this.startTime = Date.now();
        this.levelDuration = 7000; // 1 min en ms

        this.obstacles = [];
        this.calzadaWidth = this.ctx.canvas.width * 0.6; 
        this.calzadaOffset = (this.ctx.canvas.width - this.calzadaWidth) / 2; 

        this.interval = null;
        this.tick = 0;

        this.isBlinking = false; 
        this.blinkDuration = 400; 
        this.blinkInterval = 100; 
        this.blinkStartTime = null;

        this.currentVehicleIndex = 0; 

        this.audio = new Audio("assets/audio/car-theme.mp3");
        this.audio.volume = 0.05;

        this.lastTimeIncreased = Date.now();

        this.levelUpAudio = new Audio("assets/audio/level-up.mp3");
        this.levelUpAudio.volume = 0.5;

        this.isPaused = false;

        this.restartBtn = document.getElementById('restartBtn');
        this.playPauseBtn = document.getElementById('play-pauseBtn');

        this.setListeners();

    }

    start() {
        this.audio.play();        

        this.interval = setInterval(() => {
            
            this.restartBtn.style.display = 'none';
            
            this.clear();

            this.move();    

            this.draw();

            this.addObstacle();
            
            this.checkCollisions();

            this.clearObstacles();

            this.checkLevelChange();

            this.tick++; // Aumenta el contador tick

            this.increaseSpeed();

        }, 1000 / 60);
    }

    reset() {
        clearInterval(this.interval);
        this.car = new Car(this.ctx, 0);
        this.background = new Background(this.ctx);
        this.level = 1;

        this.startTime = Date.now(); 
        this.lastTimeIncreased = Date.now();

        this.obstacles = []; 
        this.tick = 0; 
        this.audio.currentTime = 0; 
        this.currentVehicleIndex = 0;

        this.playPauseBtn.style.pointerEvents = 'auto';
        this.playPauseBtn.style.opacity = '1';
        this.start();
    }

    restartBtnMethod() {  
        this.reset();
    }

    increaseSpeed() {
        const currentTime = Date.now();
        const betweenChanges = currentTime - this.lastTimeIncreased;

        if (betweenChanges >= 15000) {
            this.background.vy += 15;
            this.car.currentSpeed += 15; 
            this.car.nitroSpeed += 10;
            this.lastTimeIncreased = currentTime;
        }
    }

    checkLevelChange() {
        const currentTime = Date.now();

        if (currentTime - this.startTime >= this.levelDuration && this.car.lives >= 0) {
            this.level++;
            this.startTime = currentTime;  
            this.changeCar();  

            if (this.level < VEHICLE_IMAGES.length) {
                this.levelUpAudio.currentTime = 0;
                this.levelUpAudio.play();
            }
        }
    }

    changeCar() {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0; // Reinicia el audio
        }

        this.currentVehicleIndex++;

        if (this.currentVehicleIndex >= VEHICLE_IMAGES.length) {
            this.endGameWinning();
        } else {
            const currentLives = this.car.lives;

            this.car = new Car(this.ctx, this.currentVehicleIndex);
            this.car.lives = currentLives;
            this.audio.play();

            this.background.vy = 25;  // Initial speed of the background
            this.car.currentSpeed = 20; // Initial speed of the car
            this.lastTimeIncreased = Date.now();
        }
    }

    endGameWinning() {
        this.pause();

        this.playPauseBtn.style.pointerEvents = 'none'; // Desactiva el botón
        this.playPauseBtn.style.opacity = '0.5';

        const winningLogo = new Image();
        winningLogo.src = 'assets/images/win.png';
    
        winningLogo.onload = () => {
            const desiredWidth = 600; 
            const desiredHeight = 500;
            
            const centerX = (this.ctx.canvas.width - desiredWidth) / 2;
            const centerY = (this.ctx.canvas.height - desiredHeight) / 2;
            
            this.ctx.drawImage(winningLogo, centerX, centerY, desiredWidth, desiredHeight);
        }
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

        this.playPauseBtn.style.pointerEvents = 'none'; // Desactiva el botón
        this.playPauseBtn.style.opacity = '0.5';

        this.isGameOver = true;
        this.restartBtn.style.display = 'block'; // Muestra el botón de reinicio al inicio

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
        }      
    }

    pause() {
        this.audio.pause();
        clearInterval(this.interval);   
    }

    playPauseBtnMethod() {  // Funcionamiento botón
        const pauseIcon = document.getElementById('pause-logo');
        const playIcon = document.getElementById('play-logo');
        
        if (this.isPaused) {
            this.start(); 
            pauseIcon.style.display = 'block';
            playIcon.style.display = 'none';
        } 
        else {
            this.pause(); 
            pauseIcon.style.display = 'none';
            playIcon.style.display = 'block';
        }
        this.isPaused = !this.isPaused;
    }

    adjustButtonPosition() {    // Posición del botón en la road
        const playPauseBtnContainer = document.querySelector('.button-container');
        const restartBtnContainer = document.querySelector('.restartBtn-container');

        const rightEdge = this.calzadaOffset + this.calzadaWidth + 194; 

        playPauseBtnContainer.style.position = 'absolute';
        playPauseBtnContainer.style.top = `24px`;
        playPauseBtnContainer.style.left = `${rightEdge}px`;

        restartBtnContainer.style.position = 'absolute';
        restartBtnContainer.style.top = `25px`;
        restartBtnContainer.style.left = `${rightEdge - 54}px`;
    };

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

    clearObstacles() {
        this.obstacles = this.obstacles.filter((obstacle) => obstacle.isVisible());
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

        this.restartBtn.addEventListener('click', () => this.restartBtnMethod());
    }

}