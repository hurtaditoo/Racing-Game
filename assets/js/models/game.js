class Game {
    
    constructor(ctx) {
        this.ctx = ctx;
        this.car = new Car(ctx, 0);
        this.background = new Background(ctx);

        this.level = 1;
        this.score = 0;
        this.levelDuration = 30000; // 30s in ms

        this.obstacles = [];
        this.roadWidth = this.ctx.canvas.width * 0.6; 
        this.roadOffset = (this.ctx.canvas.width - this.roadWidth) / 2; 

        this.interval = null;
        this.tick = 0;

        this.isBlinking = false; 
        this.blinkDuration = 400; 
        this.blinkInterval = 100; 
        this.blinkStartTime = null;

        this.currentVehicleIndex = 0; 

        this.audio = new Audio("assets/audio/car-theme.mp3");
        this.audio.volume = 0.02;

        this.lastTimeIncreased = Date.now();

        this.levelUpAudio = new Audio("assets/audio/level-up.mp3");
        this.levelUpAudio.volume = 0.1;

        this.isPaused = false;

        this.restartBtn = document.getElementById('restartBtn');
        this.playPauseBtn = document.getElementById('play-pauseBtn');
        this.controlsBtn = document.getElementById('controlsBtn');

        this.controlsImage = new Image("assets/images/controls.png");
        this.controlsImage.onload = () => {
            this.controlsImageLoaded = true;
        };
        this.showingControls = false;

        this.selectedAudio = new Audio('assets/audio/selected.wav');
        this.selectedAudio.volume = 0.1;

        this.arrayScores = window.localStorage.getItem('scores') ? JSON.parse(window.localStorage.getItem('scores')) : [];
        
        this.setListeners();

    }

    start() {
        this.audio.play();  
        this.startTime = Date.now();      

        this.interval = setInterval(() => {
            
            this.restartBtn.style.display = 'none';
            
            this.clear();

            this.move();    

            this.draw();

            this.addObstacle();
            
            this.checkCollisions();

            this.clearObstacles();

            this.checkLevelChange();

            this.tick++; 

            this.increaseSpeed();

            if (this.tick % 50 === 0) {
                this.score += 1;
            }

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
        this.score = 0;

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
            this.score += 100;

            if (this.level < VEHICLE_IMAGES.length) {
                this.levelUpAudio.currentTime = 0;
                this.levelUpAudio.play();
            }
        }
    }

    changeCar() {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0; // Restart the game
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

        this.playPauseBtn.style.pointerEvents = 'none'; // Desactivate the button
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
                return false;  // In case of collision, delete the obstacle
            }
            return true; // Keep the obstacle in the array if not colliding
        });

        if (this.car.isOffRoad(this.roadOffset, this.roadWidth)) {
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

        this.playPauseBtn.style.pointerEvents = 'none'; // Desactivate the button
        this.playPauseBtn.style.opacity = '0.5';

        this.isGameOver = true;
        this.restartBtn.style.display = 'block'; // Display the restart button when the game is over
        const gameOverLogo = new Image();
        gameOverLogo.src = 'assets/images/game-over.png';
    
        gameOverLogo.onload = () => {
          const desiredWidth = 700; 
          const desiredHeight = 400;
          
          const centerX = (this.ctx.canvas.width - desiredWidth) / 2;
          const centerY = (this.ctx.canvas.height - desiredHeight) / 2;
          
          this.ctx.drawImage(gameOverLogo, centerX, centerY, desiredWidth, desiredHeight);
        };

        this.saveScore();

    }

    addObstacle() {    
        if (this.tick >= 200) {  
            this.tick = 0;

            const newObstacle = new Obstacle(this.ctx);
        
            // Position the obstacle randomly on the road
            newObstacle.x = Math.random() * (this.roadWidth - newObstacle.obstacleWidth) + this.roadOffset;
            newObstacle.y = -newObstacle.obstacleHeight; // Start the obstacle from the top of the road
    
            this.obstacles.push(newObstacle);
        }      
    }

    pause() {
        this.audio.pause();
        clearInterval(this.interval);   
    }

    playPauseBtnMethod() {  // Button function to pause/play the game
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

    adjustButtonPosition() {    // Position of the button in the canvas
        const playPauseBtnContainer = document.querySelector('.button-container');
        const restartBtnContainer = document.querySelector('.restartBtn-container');

        const rightEdge = this.ctx.canvas.width + this.roadWidth + 63; 

        playPauseBtnContainer.style.position = 'absolute';
        playPauseBtnContainer.style.top = `94px`;
        playPauseBtnContainer.style.left = `${rightEdge}px`;

        restartBtnContainer.style.position = 'absolute';
        restartBtnContainer.style.top = `94px`;
        restartBtnContainer.style.left = `${rightEdge - 47}px`;
    };

    drawScore() {
        this.ctx.font = "16px 'Press Start 2P'";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(`Score: ${this.score}`, 25, this.background.h - 25); // Draw score on top-left
    }

    saveScore() {
        if (this.score > 10) {  
            this.arrayScores.push(this.score);
            this.arrayScores.sort((a, b) => b - a);  // From highest to lowest

            this.arrayScores = this.arrayScores.slice(0, 10);   // Keep only the top 10 scores
            window.localStorage.setItem('scores', JSON.stringify(this.arrayScores));
        }
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

        this.drawScore();
        this.drawControls();

    }

    move() {
        this.background.move();
        this.obstacles.forEach((e) => e.move());    
        this.car.move();
    }

    clearObstacles() {
        this.obstacles = this.obstacles.filter((obstacle) => obstacle.isVisible());
    }

    clear() {   // Necessary to draw the next image of the game and avoid any memory leaks
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height); 
    }

    toggleControls() {
        this.showingControls = !this.showingControls;

        if (this.showingControls) {
            this.selectedAudio.play();
        }
    }

    drawControls() {
        if (this.showingControls && this.controlsImageLoaded) {
            const imgWidth = 600;
            const imgHeight = 400;
            
            const centerX = (this.ctx.canvas.width - imgWidth) / 2;
            const centerY = (this.ctx.canvas.height - imgHeight) / 2;
            
            this.ctx.drawImage(this.controlsImage, centerX, centerY, imgWidth, imgHeight);
        }
    }

    setListeners() {    
        document.addEventListener('keydown', (event) => {
            this.car.onKeyDown(event.keyCode);
        });
        
        document.addEventListener('keyup', (event) => {
            this.car.onKeyUp(event.keyCode);
        });

        this.restartBtn.addEventListener('click', () => this.restartBtnMethod());

        this.controlsBtn.addEventListener('click', () => this.toggleControls());
    }

}