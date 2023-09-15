document.addEventListener("DOMContentLoaded", function () {
  const startBtn = document.querySelector("#start-btn");
  const mostrador = document.querySelector('#mostrador');

  (function () {
    const cnv = document.querySelector("canvas");
    const ctx = cnv.getContext("2d");
    const height = cnv.height,
          width = cnv.width;
    const left = 37,
          up = 38,
          right = 39,
          down = 40;
    let mvLeft = false,
        mvUp = false,
        mvRight = false,
        mvDown = false;
    const walls = [];
    let gameStarted = false;


    //tamanho dos blocos
    const tileSize = 22;

    const img = new Image();
        img.src = "./images/cat.png";
        img.addEventListener("load",function(){
          requestAnimationFrame(loop);
        },false);

    //player
    const player = {
      x: tileSize - 20,
      y: tileSize + 70,
      width: 32,
      height: 32,
      speed: 2,
      srcX: 0,
      srcY:0,
    };

    //mapa do labirinto
    const maze = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      [1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];

  cnv.width = maze[0].length * tileSize;
  cnv.height = maze.length * tileSize;

    for (const row in maze) {
      for (const column in maze[row]) {
        const tile = maze[row][column];

        if (tile === 1) {
          const wall = {
            x: tileSize * column,
            y: tileSize * row,
            width: tileSize,
            height: tileSize,
          };

          walls.push(wall);
        }
      }
    }

    function blockRectangle(objA, objB) {
      const distX = objA.x + objA.width / 2 - (objB.x + objB.width / 2);
      const distY = objA.y + objA.height / 2 - (objB.y + objB.height / 2);

      const sumWidth = (objA.width + objB.width) / 2;
      const sumHeight = (objA.height + objB.height) / 2;

      if (Math.abs(distX) < sumWidth && Math.abs(distY) < sumHeight) {
        const overlapX = sumWidth - Math.abs(distX);
        const overlapY = sumHeight - Math.abs(distY);

        if (overlapX > overlapY) {
          objA.y = distY > 0 ? objA.y + overlapY : objA.y - overlapY;
        } else {
          objA.x = distX > 0 ? objA.x + overlapX : objA.x - overlapX;
        }
      }
    }

    window.addEventListener("keydown", keydownHandler, false);
    window.addEventListener("keyup", keyupHandler, false);

    function keydownHandler(e) {
      const key = e.keyCode;
      switch (key) {
        case left:
          mvLeft = true;
          break;
        case right:
          mvRight = true;
          break;
        case up:
          mvUp = true;
          break;
        case down:
          mvDown = true;
          break;
      }
    }

    let playerWon = false;

    function reiniciarJogo() {
      player.x = tileSize - 20;
      player.y = tileSize + 70;
      playerWon = false;
      gameStarted = false; // Reset do estado do jogo
    }


    function keyupHandler(e) {
      const key = e.keyCode;
      switch (key) {
        case left:
          mvLeft = false;
          break;
        case right:
          mvRight = false;
          break;
        case up:
          mvUp = false;
          break;
        case down:
          mvDown = false;
          break;
      }
    }


    function update() {
      //movimento do player
      if (mvLeft && !mvRight) {
        player.x -= player.speed;
      } else if (mvRight && !mvLeft) {
        player.x += player.speed;
      }
      if (mvUp && !mvDown) {
        player.y -= player.speed;
      } else if (mvDown && !mvUp) {
        player.y += player.speed;
      }
      for (const i in walls) {
        const wall = walls[i];
        blockRectangle(player, wall);
      }
      if (player.x >= (maze[0].length - 1) * tileSize) {
        playerWon = true;
      }
    }
    
    // renderização
    function render() {
      ctx.clearRect(0, 0, width, height);
    
      for (const row in maze) {
        for (const column in maze) {
          const tile = maze[row][column];
          if (tile === 1) {
            const x = column * tileSize;
            const y = row * tileSize;
            ctx.fillRect(x, y, tileSize, tileSize);
          }
        }
      }
      ctx.fillStyle = "#024059";
      ctx.drawImage(
        img,
        player.srcX, player.srcY, player.width, player.height,
        player.x, player.y, player.width, player.height,
      )
    }
  // timer contador
  startBtn.addEventListener('click', function () {
    if (!gameStarted) {
      new Timer(1, mostrador, function () {
        alert('Game Over! The cat is hungry!');
        reiniciarJogo();
      }).start();
      gameStarted = true; // Inicia o temporizador apenas quando o jogo começa
    }
  });

  function Timer(mins, target, cb) {
      this.counter = mins * 30;
      this.target = target;
      this.callback = cb;
    }

  Timer.prototype.pad = function(s) {
      return (s < 10) ? '0' + s : s;
  }
  Timer.prototype.start = function(s) {
      this.count();
  }
  Timer.prototype.done = function(s) {
      if (this.callback) this.callback();
  }
  Timer.prototype.display = function(s) {
      this.target.innerHTML = this.pad(s);
  }
  Timer.prototype.count = function(s) {
      const self = this;
      self.display.call(self, self.counter);
      self.counter--;
      const clock = setInterval(function() {
          self.display(self.counter);
          self.counter--;
          if (self.counter < 0) {
              clearInterval(clock);
              self.done.call(self);
          }
      }, 1000);
  }
  function loop() {
      update();
      render();
      if (playerWon) {
        alert('Você ganhou! O gato conseguiu sair do labirinto a tempo!');
        reiniciarJogo();
      } else {
        requestAnimationFrame(loop);
      }
    }

  })();
});

