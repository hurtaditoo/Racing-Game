window.addEventListener('DOMContentLoaded', () => {

    const canvas = document.getElementById("canvas");   // Obtiene el elemento HTML con el id "canvas", que representa el lienzo (<canvas>) en la web. Es donde se dibujará el juego.
    const ctx = canvas.getContext("2d");    // Con esto tenemos disponibles un monton de métodos para dibujar

    const game = new Game(ctx); // toma el contexto ctx como argumento para que el juego sepa dónde dibujar sus elementos 

    game.start();

});

