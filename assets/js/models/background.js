class Background {
    
    constructor(ctx) {
        this.ctx = ctx;

        this.x = 0; 
        this.y = 0; 
        
        this.w = this.ctx.canvas.width; 
        this.h = this.ctx.canvas.height;  

        this.vy = 15;

        this.img = new Image(); 
        this.img.src = "assets/images/road.jpg";
    }

    draw() {
        this.ctx.drawImage(this.img, this.x, this.y, this.w, this.h);

        this.ctx.drawImage( 
          this.img,
          this.x,
          this.y - this.h,
          this.w,
          this.h
        );
      }
    
    move() {  
        this.y += this.vy;  
    
        if (this.y - this.h >= 0) { 
          this.y = 0;
        }
    }

}