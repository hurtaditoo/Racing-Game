window.addEventListener('DOMContentLoaded', () => {

    const canvas = document.getElementById("canvas");   // Obtiene el elemento HTML con el id "canvas", que representa el lienzo (<canvas>) en la web. Es donde se dibujará el juego.
    const ctx = canvas.getContext("2d");    // Con esto tenemos disponibles un monton de métodos para dibujar

    const game = new Game(ctx); // toma el contexto ctx como argumento para que el juego sepa dónde dibujar sus elementos 

    game.start();

    const playPauseBtn  = document.getElementById('play-pauseBtn');
    const pauseIcon = document.getElementById('pause-logo');
    const playIcon = document.getElementById('play-logo');
    let isPaused = false;
    let isGameOver = false;

    playPauseBtn.addEventListener('click', () => {
        if (isGameOver) return;

        if (isPaused) {
            game.start(); 
            pauseIcon.style.display = 'block';
            playIcon.style.display = 'none';
        } 
        else {
            game.pause(); 
            pauseIcon.style.display = 'none';
            playIcon.style.display = 'block';
        }
        isPaused = !isPaused;
    });

    const playPauseBtnContainer = document.querySelector('.button-container');

    const adjustButtonPosition = () => {
        const rightEdge = game.calzadaOffset + game.calzadaWidth + 200; 

        playPauseBtnContainer.style.position = 'absolute';
        playPauseBtnContainer.style.top = `20px`;
        playPauseBtnContainer.style.left = `${rightEdge}px`;
    };

    adjustButtonPosition();

});

