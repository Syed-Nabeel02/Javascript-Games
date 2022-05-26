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
  imgSrc: "./newAssets/Background.png",
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
      x: 75,
      y: 80,
    },
    width: 100,
    height: 50,
  },
  imgSrc: "./newAssets/Ronin/Idle1.png",
  frames: 18,
  scale: 1.65,
  offest: {
    x: 0,
    y: -10,
  },
  sprites: {
    idle: {
      imgSrc: "./newAssets/Ronin/Idle1.png",
      frames: 18,
    },
    run: {
      imgSrc: "./newAssets/Ronin/Run.png",
      frames: 24,
    },
    jump: {
      imgSrc: "./newAssets/Ronin/jump.png",
      frames: 9,
    },
    fall: {
      imgSrc: "./newAssets/Ronin/Fall.png",
      frames: 10,
    },
    attack1: {
      imgSrc: "./newAssets/Ronin/Attack1.png",
      frames: 8,
    },
    attack2: {
      imgSrc: "./newAssets/Ronin/Attack2.png",
      frames: 12,
    },
    takeHit: {
      imgSrc: "./newAssets/Ronin/Take hit.png",
      frames: 7,
    },
    death: {
      imgSrc: "./newAssets/Ronin/Death.png",
      frames: 4,
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
      x: -108,
      y: 35,
    },
    width: 100,
    height: 50,
  },
  imgSrc: "./newAssets/Striker/Idle.png",
  frames: 10,
  scale: 2.25,
  offest: {
    x: 160,
    y: 70,
  },
  sprites: {
    idle: {
      imgSrc: "./newAssets/Striker/Idle.png",
      frames: 10,
    },
    run: {
      imgSrc: "./newAssets/Striker/run.png",
      frames: 8,
    },
    jump: {
      imgSrc: "./newAssets/Striker/Jump.png",
      frames: 3,
    },
    fall: {
      imgSrc: "./newAssets/Striker/Fall.png",
      frames: 3,
    },
    attack1: {
      imgSrc: "./newAssets/Striker/Attack.png",
      frames: 7,
    },
    attack2: {
      imgSrc: "./newAssets/Striker/Attack2.png",
      frames: 8,
    },
    takeHit: {
      imgSrc: "./newAssets/Striker/Take hit.png",
      frames: 4,
    },
    death: {
      imgSrc: "./newAssets/Striker/death.png",
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
  //shop.update();
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //Movement of player

  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -7;
    player.framesHold = 2;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.framesHold = 2;
    player.velocity.x = 7;
    player.switchSprite("run");
  } else {
    player.framesHold = 5;
    player.switchSprite("idle");
  }
  if (player.velocity.y < 0) {
    player.framesHold = 5;
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.framesHold = 5;
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
  //Attack 1
  if (
    collision(player, enemy) &&
    player.isAttacking1 &&
    player.currentFrame == 1
  ) {
    player.isAttacking1 = false;
    console.log("attack");
    enemy.health -= 8;
    enemy.takeHit();
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }
  if (
    !collision(player, enemy) &&
    player.isAttacking1 &&
    player.currentFrame == 3
  ) {
    player.isAttacking1 = false;
    console.log("attack miss");
  }
  //Attack2
  if (
    collision(player, enemy) &&
    player.isAttacking2 &&
    player.currentFrame == 4
  ) {
    player.isAttacking2 = false;
    console.log("attack2");
    enemy.health -= 14;
    enemy.takeHit();
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }
  if (
    !collision(player, enemy) &&
    player.isAttacking2 &&
    player.currentFrame == 1
  ) {
    player.isAttacking2 = false;
    console.log("attack miss");
  }

  //collision detection for enemy attacking player
  //Attack1
  if (
    collision(enemy, player) &&
    enemy.isAttacking1 &&
    enemy.currentFrame == 3
  ) {
    enemy.isAttacking1 = false;
    console.log("attack enemy");
    player.takeHit();
    player.health -= 12;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }
  if (
    !collision(enemy, player) &&
    enemy.isAttacking1 &&
    enemy.currentFrame == 3
  ) {
    enemy.isAttacking1 = false;
    console.log("attack miss");
  }
  //Attack 2
  if (
    collision(enemy, player) &&
    enemy.isAttacking2 &&
    enemy.currentFrame == 5
  ) {
    enemy.isAttacking2 = false;
    console.log("attack1 enemy");
    player.takeHit();
    player.health -= 16;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }
  if (
    !collision(enemy, player) &&
    enemy.isAttacking2 &&
    enemy.currentFrame == 5
  ) {
    enemy.isAttacking2 = false;
    console.log("attack2 miss");
  }
  //end game
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner(player, enemy, timerId);
  }

  //death animation
  if (player.health <= 0) {
    player.switchSprite("death");
  } else if (enemy.health <= 0) {
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

      case " ": {
        if (player.isAttacking1 == false) {
          player.framesHold = 3;
          player.switchSprite("attack1");
        }
      }
      case "s":
        {
          if (player.isAttacking2 == false) {
            player.framesHold = 3;
            player.switchSprite("attack2");
          }
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
          if (enemy.isAttacking1 == false) {
            enemy.switchSprite("attack1");
          }
        }
        break;

      case "Enter":
        {
          if (enemy.isAttacking2 == false) {
            enemy.switchSprite("attack2");
          }
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
