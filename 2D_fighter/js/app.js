//Project setup
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
//This will allow you to use contextAPi

canvas.width = 1024;
canvas.height = 576;
const gravity = 0.7;

c.fillRect(0, 0, canvas.width, canvas.height);
//(0,0) makes it start from top left

//end of class
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imgSrc: "./assets/background.png",
});
const shop = new Sprite({
  position: {
    x: 600,
    y: 130,
  },
  imgSrc: "./assets/shop.png",
  scale: 2.75,
  frames: 6,
});
const player = new fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  attackBox: {
    offest: {
      x: 65,
      y: 50,
    },
    width: 150,
    height: 50,
  },
  imgSrc: "./assets/samuraiMack/Idle.png",
  frames: 8,
  scale: 2.5,
  offest: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imgSrc: "./assets/samuraiMack/Idle.png",
      frames: 8,
    },
    run: {
      imgSrc: "./assets/samuraiMack/Run.png",
      frames: 8,
    },
    jump: {
      imgSrc: "./assets/samuraiMack/Jump.png",
      frames: 2,
    },
    fall: {
      imgSrc: "./assets/samuraiMack/Fall.png",
      frames: 2,
    },
    attack1: {
      imgSrc: "./assets/samuraiMack/Attack1.png",
      frames: 6,
    },
    takeHit: {
      imgSrc: "./assets/samuraiMack/Take hit.png",
      frames: 4,
    },
    death: {
      imgSrc: "./assets/samuraiMack/Death.png",
      frames: 6,
    },
  },
});

const enemy = new fighter({
  position: {
    x: 900,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  attackBox: {
    offest: {
      x: -148,
      y: 35,
    },
    width: 150,
    height: 50,
  },
  imgSrc: "./assets/kenji/Idle.png",
  frames: 4,
  scale: 2.5,
  offest: {
    x: 215,
    y: 175,
  },
  sprites: {
    idle: {
      imgSrc: "./assets/kenji/Idle.png",
      frames: 4,
    },
    run: {
      imgSrc: "./assets/kenji/Run.png",
      frames: 8,
    },
    jump: {
      imgSrc: "./assets/kenji/Jump.png",
      frames: 2,
    },
    fall: {
      imgSrc: "./assets/kenji/Fall.png",
      frames: 2,
    },
    attack1: {
      imgSrc: "./assets/kenji/Attack1.png",
      frames: 4,
    },
    takeHit: {
      imgSrc: "./assets/kenji/Take hit.png",
      frames: 3,
    },
    death: {
      imgSrc: "./assets/kenji/Death.png",
      frames: 7,
    },
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
};

decreaseTime();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  //rectanle with black canvas every frame
  background.update();
  shop.update();
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //Movement of player
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  //Movement of enemy
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  //collision detection player attacking enemy
  if (
    collision(player, enemy) &&
    player.isAttacking &&
    player.currentFrame == 4
  ) {
    player.isAttacking = false;
    console.log("attack");
    enemy.health -= 14;
    enemy.takeHit();
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }
  if (
    !collision(player, enemy) &&
    player.isAttacking &&
    player.currentFrame == 4
  ) {
    player.isAttacking = false;
    console.log("attack miss");
  }

  //collision detection for player attacking enemy

  if (collision(enemy, player) && enemy.isAttacking && enemy.currentFrame == 2) {
    enemy.isAttacking = false;
    console.log("attack enemy");
    player.takeHit();
    player.health -= 10;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }
  if (
    !collision(player, enemy) &&
    enemy.isAttacking &&
    enemy.currentFrame == 2
  ) {
    player.isAttacking = false;
    console.log("attack miss");
  }
  //end game
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner(player, enemy, timerId);
  }

  //death animation
  if (player.health <= 0) {
    player.switchSprite("death");
  }
  if (enemy.health <= 0) {
    enemy.switchSprite("death");
  }
}

animate();
window.addEventListener("keydown", (event) => {
  //player event
  if (!player.dead) {
    switch (event.key) {
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        //Done so that you cannot infinitley jump
        if (player.velocity.y === 0) {
          player.velocity.y = -20;
        }
        break;

      case " ":
        {
          player.attack();
          player.switchSprite("attack1");
        }
        break;
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      //enemy events
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;

      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;

      case "ArrowUp":
        if (enemy.velocity.y == 0) {
          enemy.velocity.y = -20;
        }
        break;
      case "ArrowDown":
        {
          enemy.attack();
          enemy.switchSprite("attack1");
        }
        break;
    }
  }
  console.log(event.key);
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;

    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;

    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
  }
});
