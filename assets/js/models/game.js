class Game {
    
    constructor(ctx) {
        this.ctx = ctx;
        this.car = new Car(ctx, 0);
        this.background = new Background(ctx);

        this.level = 1;
        this.score = 0;
        this.levelDuration = 25000; // 30s in ms

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
        this.audio.volume = 0.01;

        this.lastTimeIncreased = Date.now();

        this.levelUpAudio = new Audio("assets/audio/level-up.mp3");
        this.levelUpAudio.volume = 0.1;

        this.isPaused = false;

        this.restartBtn = document.getElementById('restartBtn');
        this.playPauseBtn = document.getElementById('play-pauseBtn');

        this.arrayScores = localStorage.getItem('scores') ? JSON.parse(localStorage.getItem('scores')) : [];
        
        this.nameInput = document.getElementById('player-name');
        this.coolInputDiv = document.querySelector('.coolinput');
        this.playerName = null;

        if (!this.playerName) {
            this.coolInputDiv.style.display = 'flex';
        }
        
        this.setListeners();

    }

    start() {
        if (soundEnabled) this.audio.play();  
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

    toggleSound() {
        if (this.audio.muted && this.levelUpAudio.muted && this.car.loseLiveSound && this.car.lastLiveSound) {
            this.audio.muted = false;
            this.levelUpAudio.muted = false;
            this.car.loseLiveSound.muted = false;
            this.car.lastLiveSound.muted = false;
        } 
        else {
            this.audio.muted = true;
            this.levelUpAudio.muted = true;
            this.car.loseLiveSound.muted = true;
            this.car.lastLiveSound.muted = true;
        }

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

        if (betweenChanges >= 10000) {
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
        } 
        else {
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

        this.playPauseBtn.style.pointerEvents = 'none'; // Deactivate the button
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

        this.playPauseBtn.style.pointerEvents = 'none'; // Deactivate the button
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
    
    saveScore() {
        if (!this.playerName.trim()) {
            this.playerName = document.getElementById('player-name').value.trim();
        }
        if (!this.playerName || this.score === undefined || this.score === null) return;
        
        this.arrayScores = JSON.parse(localStorage.getItem('scores')) || [];
        this.arrayScores.push({ name: this.playerName, score: this.score });

        this.arrayScores.sort((a, b) => b.score - a.score);  // From highest to lowest
        // if (this.arrayScores.length > 10) this.arrayScores = this.arrayScores.slice(0, 10);
        this.arrayScores = this.arrayScores.slice(0, 10);

        localStorage.setItem('scores', JSON.stringify(this.arrayScores));
    }

    showRanking() {
        const startScreen = document.getElementById('start-screen');
        const playPauseBtn = document.getElementById('play-pauseBtn');
        const restartBtn = document.getElementById('restartBtn');

        // Hide the play and restart buttons and the start screen
        if (playPauseBtn) playPauseBtn.style.display = 'none';
        if (restartBtn) restartBtn.style.display = 'none';
        if (startScreen) startScreen.style.display = 'none';

        // Cleanup 
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // Semi-transparent fill for the ranking background
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)"; // Black background with 20% opacity
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // Shadow configuration
        this.ctx.shadowColor = "black";
        this.ctx.shadowBlur = 4;    // Amount of blur
        this.ctx.shadowOffsetX = 2; // Horizontal offset of the shadow effect
        this.ctx.shadowOffsetY = 2; // Vertical offset of the shadow effect

        // Ranking Title
        this.ctx.font = "40px 'Press Start 2P'";
        this.ctx.fillStyle = "#ffd700";
        this.ctx.textAlign = "center";
        this.ctx.fillText("Top 10 Scores", this.ctx.canvas.width / 2, 100); // Positioned 100 px from the top

        // Gets the scores from local storage
        const scores = JSON.parse(localStorage.getItem('scores')) || [];

        // Show the best 10 scores
        this.ctx.font = "30px 'Press Start 2P'";
        scores
            .sort((a, b) => b.score - a.score)
            .slice(0, 10)
            .forEach((score, index) => {
                this.ctx.fillText(
                    `${index + 1}. ${score.name}: ${score.score}`,
                    this.ctx.canvas.width / 2,
                    220 + index * 90    // 90px spacing for each score, y starting at 220 
                );
        });

        // Draw the home button
        const buttonX = this.ctx.canvas.width / 2 - 100;  
        const buttonY = this.ctx.canvas.height - 100;     
        const buttonWidth = 200;
        const buttonHeight = 50;

        // Disable shadow before drawing the button
        this.ctx.shadowColor = "transparent";
        this.ctx.shadowBlur = 0;

        // Draw the rectangle of the button
        this.ctx.fillStyle = "#ffd700";
        this.ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

        this.ctx.font = "20px 'Press Start 2P'";
        this.ctx.fillStyle = "#000";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle"; // Vertically centered alignment
        this.ctx.fillText("Home", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);

        const handleClick = (event) => {
            const rect = this.ctx.canvas.getBoundingClientRect();   // getBoundingClientRect() gets the position and size of the canvas
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            if (x > buttonX && x < buttonX + buttonWidth && y > buttonY && y < buttonY + buttonHeight) {
                // Clear the ranking and return to the start screen
                this.clear();
                if (startScreen) {
                    startScreen.style.display = 'block';
                }
                // Remove the event listener after returning to the start screen
                this.ctx.canvas.removeEventListener('click', handleClick);
            }
        };

        this.ctx.canvas.addEventListener('click', handleClick);
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

        const rightEdge = this.ctx.canvas.width + this.roadOffset + 380; 

        playPauseBtnContainer.style.position = 'absolute';
        playPauseBtnContainer.style.top = `88px`;
        playPauseBtnContainer.style.left = `${rightEdge}px`;

        restartBtnContainer.style.position = 'absolute';
        restartBtnContainer.style.top = `89px`;
        restartBtnContainer.style.left = `${rightEdge - 47}px`;
    }

    drawScore() {
        this.ctx.font = "16px 'Press Start 2P'";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(`Score: ${this.score}`, 25, this.background.h - 25); // Draw score on top-left
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

    setListeners() {
        document.addEventListener('keydown', (event) => {
            this.car.onKeyDown(event.keyCode);
        });
        
        document.addEventListener('keyup', (event) => {
            this.car.onKeyUp(event.keyCode);
        });

        this.restartBtn.addEventListener('click', () => this.restartBtnMethod());

        this.nameInput.addEventListener('change', (event) => {  // This is used so the input button for the name dissapear once you have written in it
            this.nameInput = event.target.value.trim();
            if (this.nameInput) {
                this.coolInputDiv.style.display = 'none'; 
            }
        });
    }

}