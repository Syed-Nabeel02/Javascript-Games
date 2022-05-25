function collision(player1, player2) {
  if (
    player1.attackBox.position.x + player1.attackBox.width >=
      player2.position.x &&
    player1.attackBox.position.x <= player2.position.x + player2.width &&
    player1.attackBox.position.y + player1.attackBox.height >=
      player2.position.y &&
    player1.attackBox.position.y <= player2.position.y + player2.height
  ) {
    return true;
  }
}

function determineWinner(player, enemy, timerId) {
  clearTimeout(timerId);
  document.querySelector("#result").style.display = "flex";
  if (player.health == enemy.health) {
    document.querySelector("#result").innerHTML = "Draw";
  } else if (player.health > enemy.health) {
    document.querySelector("#result").innerHTML = "Player 1 wins";
  } else {
    document.querySelector("#result").innerHTML = "Player 2 wins";
  }
}
let timer = 60;
let timerId;
function decreaseTime() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTime, 1000); //this sets the time for one second
    timer -= 1;
    document.querySelector("#timer").innerHTML = timer;
  }

  if (timer == 0) {
    document.querySelector("#result").style.display = "flex";
    determineWinner(player, enemy, timerId);
  }
}
