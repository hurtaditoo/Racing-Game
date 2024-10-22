class Obstacle {

    constructor(ctx) {
      this.ctx = ctx;

      this.vehicleImages = [
        { src: "car.png", w: 200, h: 200 },
        { src: "truck.png", w: 400, h: 480 },
        { src: "moto.png", w: 190, h: 170 },
        { src: "maseratti.png", w: 140, h: 220 },
        { src: "mini-truck.png", w: 320, h: 300 }
      ];

      // Seleccionar aleatoriamente un vehículo y sus dimensiones
      const vehicle = this.getRandomVehicle();

      this.w = vehicle.w;
      this.h = vehicle.h;
  
      this.x = Math.random() * (this.ctx.canvas.width - this.w);
      this.y = -this.h; 

      this.vy = 3; 
  
      this.img = new Image();
      this.img.src = `assets/images/${vehicle.src}`;
    }

    getRandomVehicle() {
        const randomIndex = Math.floor(Math.random() * this.vehicleImages.length);
        return this.vehicleImages[randomIndex];
    }
  
    draw() {
      this.ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
    }
  
    move() {
        this.y += this.vy;
    }

}