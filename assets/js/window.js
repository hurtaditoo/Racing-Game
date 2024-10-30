window.addEventListener('DOMContentLoaded', () => {

    const canvas = document.getElementById("canvas");   //  Gets the HTML element with id "canvas", which represents the canvas (<canvas>) on the web. It is where the game will be drawn.
    const ctx = canvas.getContext("2d");

    const game = new Game(ctx); // take the context as an argument so the game knows where to draw the elements 

    const startScreen = document.getElementById('start-screen');
    const startBtn = document.getElementById('startBtn');
    this.selectedAudio = new Audio('assets/audio/selected.wav');
    this.selectedAudio.volume = 0.1;

    startBtn.addEventListener('click', () => {
        startScreen.style.display = 'none'; // Hide the start screen
        canvas.style.display = 'block'; // Show the canvas
        this.selectedAudio.play();
        game.start();
    });

    const playPauseBtn = document.getElementById('play-pauseBtn');

    playPauseBtn.addEventListener('click', () => {
        game.playPauseBtnMethod();
    });

    game.adjustButtonPosition();

});

