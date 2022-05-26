class Sprite {
  constructor({
    position,
    imgSrc,
    scale = 1,
    frames = 1,
    offest = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.height = 150;
    this.width = 50;
    this.image = new Image();
    this.image.src = imgSrc;
    this.scale = scale;
    this.frames = frames;
    this.currentFrame = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.offest = offest;
  }
  draw() {
    c.drawImage(
      this.image,
      this.currentFrame * (this.image.width / this.frames),
      0,
      this.image.width / this.frames,
      this.image.height,
      this.position.x - this.offest.x,
      this.position.y - this.offest.y,
      (this.image.width / this.frames) * this.scale,
      this.image.height * this.scale
    );
  }

  animations() {
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold == 0) {
      if (this.currentFrame < this.frames - 1) {
        this.currentFrame++;
      } else {
        this.currentFrame = 0;
      }
    }
  }
  update() {
    this.draw();
    this.animations();
  }
}

class fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = "red",
    offest,
    imgSrc,
    scale = 1,
    frames = 1,
    sprites,
    attackBox = {
      offest: {},
      width: undefined,
      height: undefined,
    },
  }) {
    super({
      imgSrc,
      scale,
      frames,
    });
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.lastKey;
    this.color = color;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offest: attackBox.offest,
      //position is assigned to the position of the player
      width: attackBox.width,
      height: attackBox.height,
    };
    this.isAttacking1 = false;
    this.isAttacking2 = false;
    this.offest = offest;
    this.health = 100;
    this.currentFrame = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.sprites = sprites;
    this.dead = false;

    for (let sprite in this.sprites) {
      this.sprites[sprite].image = new Image();
      this.sprites[sprite].image.src = this.sprites[sprite].imgSrc;
    }
  }

  update() {
    this.draw();
    if (!this.dead) {
      this.animations();
    }
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    //c.fillRect(this.position.x, this.position.y, this.width, this.height);

    this.attackBox.position.x = this.position.x + this.attackBox.offest.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offest.y;
    // c.fillRect(
    //   this.attackBox.position.x,
    //   this.attackBox.position.y,
    //   this.attackBox.width,
    //   this.attackBox.height
    // );

    if (this.position.y + this.height >= canvas.height - 50) {
      this.velocity.y = 0;
      this.position.y = canvas.height - this.height - 50;
    } else {
      this.velocity.y += gravity;
    }
  }

  attack1() {
    this.isAttacking1 = true;
    // this.switchSprite("attack1");
    // setTimeout(() =>{
    //   50,
    //   this.isAttacking = false;
    // })
    //the figther is not in range this function set the atccking to false after 100ms
  }
  attack2() {
    this.isAttacking2 = true;
    // this.switchSprite("attack1");
    // setTimeout(() =>{
    //   50,
    //   this.isAttacking = false;
    // })
    //the figther is not in range this function set the atccking to false after 100ms
  }
  takeHit() {
    this.switchSprite("takeHit");
  }
  switchSprite(sprite) {
    if (this.image == this.sprites.death.image) {
      if (this.currentFrame == this.sprites.death.frames - 1) {
        this.dead = true;
      }
      return;
    }
    //This is done to override all other animations with the attack anuimation
    if (
      this.image == this.sprites.attack1.image &&
      this.currentFrame < this.sprites.attack1.frames - 1
    ) {
      return;
    }
    if (
      this.image == this.sprites.takeHit.image &&
      this.currentFrame < this.sprites.takeHit.frames - 1
    ) {
      return;
    }
    if (
      this.image == this.sprites.attack2.image &&
      this.currentFrame < this.sprites.attack2.frames - 1
    ) {
      return;
    }
    if (
      this.image == this.sprites.jump.image &&
      this.currentFrame < this.sprites.jump.frames - 1 &&
      sprite != "attack1" &&
      sprite != "attack2"
    ) {
      return;
    }
    if (
      this.image == this.sprites.fall.image &&
      this.currentFrame < this.sprites.fall.frames - 1 &&
      sprite != "attack1" &&
      sprite != "attack2"
    ) {
      return;
    }
    switch (sprite) {
      case "idle":
        {
          if (this.image != this.sprites.idle.image) {
            this.image = this.sprites.idle.image;
            this.frames = this.sprites.idle.frames;
            this.currentFrame = 0;
          }
        }
        break;
      case "run":
        {
          if (this.image != this.sprites.run.image) {
            this.image = this.sprites.run.image;
            this.frames = this.sprites.run.frames;
            this.currentFrame = 0;
          }
        }
        break;
      case "jump":
        {
          if (this.image != this.sprites.jump.image) {
            this.currentFrame = 0;
            this.frames = this.sprites.jump.frames;
            this.image = this.sprites.jump.image;
          }
        }
        break;

      case "fall":
        {
          if (this.image != this.sprites.fall.image) {
            this.currentFrame = 0;
            this.frames = this.sprites.fall.frames;
            this.image = this.sprites.fall.image;
          }
        }
        break;
      case "attack2":
        {
          if (this.image != this.sprites.attack2.image) {
            this.attack2();
            this.currentFrame = 0;
            this.frames = this.sprites.attack2.frames;
            this.image = this.sprites.attack2.image;
          }
        }
        break;
      case "attack1":
        {
          if (this.image != this.sprites.attack1.image) {
            this.attack1();
            this.currentFrame = 0;
            this.frames = this.sprites.attack1.frames;
            this.image = this.sprites.attack1.image;
          }
        }
        break;
      case "takeHit":
        {
          if (this.image != this.sprites.takeHit.image) {
            this.currentFrame = 0;
            this.frames = this.sprites.takeHit.frames;
            this.image = this.sprites.takeHit.image;
          }
        }
        break;
      case "death":
        {
          if (this.image != this.sprites.death.image) {
            this.frames = this.sprites.death.frames;
            this.image = this.sprites.death.image;
            this.currentFrame = 0;
          }
        }
        break;
      default:
        break;
    }
  }
}
