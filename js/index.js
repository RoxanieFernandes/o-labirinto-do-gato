console.log("JS connected");
const startBtn = document.querySelector("#start-btn");
var mostrador = document.querySelector('#mostrador');

(function () {
  var cnv = document.querySelector("canvas");
  var ctx = cnv.getContext("2d");
  var height = cnv.height,
    width = cnv.width;
  var left = 37,
    up = 38,
    right = 39,
    down = 40;
  var mvLeft = (mvUp = mvRight = mvDown = false);
  const walls = [];

  //tamanho dos blocos
  var tileSize = 22;

  var img = new Image();
      img.src = "./images/catfaceA.png";
      img.addEventListener("load",function(){
        requestAnimationFrame(loop);
      },false);

  //player
  var player = {
    x: tileSize - 20,
    y: tileSize + 70,
    width: 32,
    height: 32,
    speed: 2,
    srcX: 0,
    srcY:0,
  };

  //mapa do labirinto
  var maze = [
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

  for (var row in maze) {
    for (var column in maze[row]) {
      var tile = maze[row][column];

      if (tile === 1) {
        var wall = {
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
    var distX = objA.x + objA.width / 2 - (objB.x + objB.width / 2);
    var distY = objA.y + objA.height / 2 - (objB.y + objB.height / 2);

    var sumWidth = (objA.width + objB.width) / 2;
    var sumHeight = (objA.height + objB.height) / 2;

    if (Math.abs(distX) < sumWidth && Math.abs(distY) < sumHeight) {
      var overlapX = sumWidth - Math.abs(distX);
      var overlapY = sumHeight - Math.abs(distY);

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
    var key = e.keyCode;
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

  function keyupHandler(e) {
    var key = e.keyCode;
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
    for (var i in walls) {
      var wall = walls[i];
      blockRectangle(player, wall);
    }
  }

  // renderização
  function render() {
    ctx.clearRect(0, 0, width, height);
  
    for (var row in maze) {
      for (var column in maze) {
        var tile = maze[row][column];
        if (tile === 1) {
          var x = column * tileSize;
          var y = row * tileSize;
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
   
    ctx.restore();
  }
// timer contador
  startBtn.addEventListener('click', function() {
    new Timer(1, mostrador, function() {
        alert('Game Over! The cat is hungry!');
    }).start();
});

function Timer(mins, target, cb) {
    this.counter = mins * 45;
    this.target = target;
    this.callback = cb;
}
Timer.prototype.pad = function(s) {
    return (s < 10) ? '0' + s : s;
}
Timer.prototype.start = function(s) {
    this.count();
}
Timer.prototype.stop = function(s) {
    this.count();
}
Timer.prototype.done = function(s) {
    if (this.callback) this.callback();
}
Timer.prototype.display = function(s) {
    this.target.innerHTML = this.pad(s);
}
Timer.prototype.count = function(s) {
    var self = this;
    self.display.call(self, self.counter);
    self.counter--;
    var clock = setInterval(function() {
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
  requestAnimationFrame(loop);
}


})();
