console.log("JS connected");
const startBtn = document.getElementById("start-btn");
// startBtn.onclick=drawGame;

(function(){
	//elemento canvas e contexto de renderização
	var cnv = document.querySelector("canvas");
	var ctx = cnv.getContext("2d");
    var height = cnv.height, width = cnv.width;
    var left = 37, up = 38, right = 39, down = 40;
	var mvLeft = mvUp = mvRight = mvDown = false;
	
	//tamanho dos blocos
	var tileSize = 10;

    var wall = [];

    //objeto player
    var player = {
		x: tileSize+2,
		y: tileSize+2,
		width: 12,
		height: 12,
		speed: 2
	};
	
	//mapa do labirinto
	var maze = [
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
		[0,0,0,0,0,0,0,0,0,1,0,0,1,1,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0],
		[1,0,0,1,0,0,0,1,1,1,0,0,0,0,0,0,1,0,0,1],
		[1,0,0,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1],
		[1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
		[1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
		[1,0,0,1,1,1,1,0,0,1,0,0,0,1,0,0,1,0,0,1],
		[1,0,0,0,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0,1],
		[1,0,0,0,0,0,1,0,0,1,0,0,0,1,1,1,1,0,0,1],
		[1,0,0,1,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,1,0,0,0,0,0,1,0,0,0,1,1,1,1,0,0,1],
		[1,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,1,0,0,1],
		[1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,1],
		[1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,0,0,1],
		[1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
	];

    //entradas das setas do teclado
	window.addEventListener("keydown",keydownHandler,false);
	window.addEventListener("keyup",keyupHandler,false);
	
	function keydownHandler(e){
		var key = e.keyCode;
		switch(key){
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
	
	function keyupHandler(e){
		var key = e.keyCode;
		switch(key){
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
	
	
	//atualização cíclica do programa
	function update(){
		//movimento do player
		if(mvLeft && !mvRight){
			player.x -= player.speed;
		} else 
		if(mvRight && !mvLeft){
			player.x += player.speed;
		}
		if(mvUp && !mvDown){
			player.y -= player.speed;
		} else 
		if(mvDown && !mvUp){
			player.y += player.speed;
		}
	}
	
	//renderização (desenha na tela)
	function render(){
        ctx.clearRect(0,0,width,height);
        ctx.save();
		//procedimento que varre as linhas e colunas do labirinto
		for(var row in maze){
			for(var column in maze){
				//pega o elemento armazenado em uma determinada linha/coluna
				var tile = maze[row][column];
				//se for um tijolo...
				if(tile === 1){
					//...especifica as dimensões e a posição...
					var x = column*tileSize;
					var y = row*tileSize;
					//...e desenha na tela
					ctx.fillRect(x,y,tileSize,tileSize);
				}
			}
		}
        ctx.fillStyle = "#038C8C";
        ctx.fillRect(player.x,player.y,player.width,player.height);
        ctx.restore();
	}
	
	function loop(){
		update();
		render();
		requestAnimationFrame(loop);
	}
	
	requestAnimationFrame(loop);
}());


