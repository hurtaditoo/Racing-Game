const showingControls = false;
const controlsImage = new Image();
controlsImage.src = "assets/images/controls.png";
// controlsImage.onload = () => {
//     controlsImageLoaded = true;
// };

window.addEventListener('DOMContentLoaded', () => {

    const canvas = document.getElementById("canvas");   //  Gets the HTML element with id "canvas", which represents the canvas (<canvas>) on the web. It is where the game will be drawn.
    const ctx = canvas.getContext("2d");

    const game = new Game(ctx); // Take the context as an argument so the game knows where to draw the elements 

    const startScreen = document.getElementById('start-screen');
    const startBtn = document.getElementById('startBtn');

    const controlsBtn = document.getElementById('controlsBtn'); 
    selectedAudio = new Audio('assets/audio/selected.wav');
    selectedAudio.volume = 0.05;

    startBtn.addEventListener('click', () => {
        startScreen.style.display = 'none'; // Hide the start screen
        canvas.style.display = 'block'; // Show the canvas
        selectedAudio.play();
        game.start();
    });

    controlsBtn.addEventListener('click', () => {
        toggleControls();
    });

    const playPauseBtn = document.getElementById('play-pauseBtn');

    playPauseBtn.addEventListener('click', () => {
        game.playPauseBtnMethod();
    });

    game.adjustButtonPosition();   

});

function toggleControls() {
    showingControls = !showingControls;

    if (showingControls) {
        this.selectedAudio.play();
        const imgWidth = 1000;
        const imgHeight = 600;
        
        const centerX = (this.ctx.canvas.width - imgWidth) / 2;
        const centerY = (this.ctx.canvas.height - imgHeight) / 2;
        
        this.drawImage(this.controlsImage, centerX, centerY, imgWidth, imgHeight)
    }
}

// drawControls() {
//     if (this.showingControls && this.controlsImageLoaded) {
//         const imgWidth = 1000;
//         const imgHeight = 600;
        
//         const centerX = (this.ctx.canvas.width - imgWidth) / 2;
//         const centerY = (this.ctx.canvas.height - imgHeight) / 2;
        
//         this.ctx.drawImage(this.controlsImage, centerX, centerY, imgWidth, imgHeight);
//     }
// }