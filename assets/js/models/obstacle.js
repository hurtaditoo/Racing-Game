class Obstacle {

    constructor(ctx) {
      this.ctx = ctx;

      const vehicle = this.getRandomVehicle();

      this.obstacleWidth = vehicle.w;
      this.obstacleHeight = vehicle.h;
  
      this.x = Math.random() * (this.ctx.canvas.width - this.obstacleWidth);
      this.y = -this.obstacleHeight; 

      this.vy = 3; 
  
      this.img = new Image();
      this.img.src = `assets/images/${vehicle.src}`;
    }

    getRandomVehicle() {
        const randomIndex = Math.floor(Math.random() * VEHICLE_IMAGES.length);
        return VEHICLE_IMAGES[randomIndex];
    }
  
    draw() {
      this.ctx.drawImage(this.img, this.x, this.y, this.obstacleWidth, this.obstacleHeight);
    }
  
    move() {
        this.y += this.vy;
    }

}