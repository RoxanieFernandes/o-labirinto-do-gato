console.log("JS connected");
const startBtn = document.getElementById("start-btn");


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
  const freeEspace = [];

  //tamanho dos blocos
  var tileSize = 22;

  //player
  var player = {
    x: tileSize + 2,
    y: tileSize + 2,
    width: 32,
    height: 32,
    speed: 2,
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
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
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
    [1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
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

  function render() {
    ctx.clearRect(0, 0, width, height);
    // ctx.save();
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
    ctx.fillStyle = "#024059" ;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.restore();
  }

  function loop() {
    update();
    render();
    requestAnimationFrame(loop);
  }

//   const drawGame = render ()

//   function start () {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
    

//   }

// //   startBtn.onclick = start;
//   startBtn.addEventListener('click', () => {
//     start()
//   })

  requestAnimationFrame(loop);
})();
