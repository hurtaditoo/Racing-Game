let showingControls = false;
let soundEnabled = true;

window.addEventListener('DOMContentLoaded', () => {

    const canvas = document.getElementById("canvas");   //  Gets the HTML element with id "canvas", which represents the canvas (<canvas>) on the web. It is where the game will be drawn.
    const ctx = canvas.getContext("2d");

    const game = new Game(ctx); // Take the context as an argument so the game knows where to draw the elements 

    const startScreen = document.getElementById('start-screen');
    const startBtn = document.getElementById('startBtn');
    const soundToggle = document.getElementById('checkboxInput'); 
    const soundSwitch = document.querySelector('.toggleSwitch'); 

    const controlsBtn = document.getElementById('controlsBtn'); 
    selectedAudio = new Audio('assets/audio/selected.wav');
    selectedAudio.volume = 0.05;

    startBtn.addEventListener('click', () => {
        startScreen.style.display = 'none'; // Hide the start screen
        canvas.style.display = 'block'; // Show the canvas
        soundSwitch.style.display = 'flex'; // Show the sound switch
        if (soundEnabled) {
            selectedAudio.play();
        }
        game.start();
    });

    soundToggle.addEventListener('change', () => {
        soundEnabled = soundToggle.checked; 
        game.toggleSound();
    });

    controlsBtn.addEventListener('click', () => {
        toggleControls();
    });

    rankingBtn.addEventListener('click', () => {
        selectedAudio.play();
        game.showRanking();
    });

    const playPauseBtn = document.getElementById('play-pauseBtn');

    playPauseBtn.addEventListener('click', () => {
        game.playPauseBtnMethod();
    });

    game.adjustButtonPosition();   

});

function toggleControls() {
    showingControls = !showingControls;

    const controlsOverlay = document.getElementById("controls-overlay"); 

    if (showingControls) {
        selectedAudio.play();
        controlsOverlay.style.display = 'block'; 
    } else {
        controlsOverlay.style.display = 'none'; 
    }
}