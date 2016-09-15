// RequestAnimFrame: a browser API for getting smooth animations
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame    || 
		window.oRequestAnimationFrame      || 
		window.msRequestAnimationFrame     ||  
		function( callback ){
			return window.setTimeout(callback, 1000 / 60);
		};
})();

window.cancelRequestAnimFrame = ( function() {
	return window.cancelAnimationFrame          ||
		window.webkitCancelRequestAnimationFrame    ||
		window.mozCancelRequestAnimationFrame       ||
		window.oCancelRequestAnimationFrame     ||
		window.msCancelRequestAnimationFrame        ||
		clearTimeout
} )();


var canvas = document.getElementById("canvas"),
	ctx = canvas.getContext("2d"), // Context 2d pour le canvas
	W = window.innerWidth, // Taille de la fenetre
	H = window.innerHeight,
	ball = {}, // La balle
	paddles = [2], // Les paddles dans un tableau
	mouses = [2], // Les souris des joueurs
	points = 0, // Les points obtenues par les joueurs
	startBtn = {}, // Le bouton start
	restartBtn = {}, // Le bouton restart
	init,
	gameOver = 0; // GameOver

canvas.width = W;
canvas.height = H;

canvas.addEventListener("mousedown", btnClick, true);

// Ball
ball = {
	x: 50,
	y: 50,
	r: 5,
	c : "white",
	vx: 4,
	vy: 8,

	draw: function(){
		ctx.beginPath();
		ctx.fillStyle = this.c;
		ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
		ctx.fill();
	}
};

//Start Btn
startBtn = {
	w: 100,
	h: 50,
	x: W/2 - this.w/2,
	y: H/2 - this.h/2,

	draw: function(){
		ctx.strokeStyle = "white";
		ctx.lineWidth = "2";
		ctx.strokeRect(this.x, this.y, this.w, this.h);

		ctx.font = "18px Arial, sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStyle = "white";
		ctx.fillText("Start", W/2, H/2);
	}
}

//Start Btn
restartBtn = {
	w: 100,
	h: 50,
	x: W/2 - this.w/2,
	y: H/2 - this.h/2,

	draw: function(){
		ctx.strokeStyle = "white";
		ctx.lineWidth = "2";
		ctx.strokeRect(this.x, this.y, this.w, this.h);

		ctx.font = "18px Arial, sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStyle = "white";
		ctx.fillText("ReStart", W/2, H/2);
	}

}

function paintCanvas(){
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, W, H);
}

function draw(){
	paintCanvas();
	for (var i = 0; i >= paddles.length ; i++) {
		p = paddles[i];

		ctx.fillStyle = "white";
		ctx.fillRect(p.x, p.y, p.w, p.h);
	}

	ball.draw();
}

function collide(ball, paddle){
	if(ball.x + ball.r >= paddle.x && ball.x - ball.r <= 
		paddle.x + paddle.w){
		if(ball.y >= (paddle.y - paddle.h) && paddle.y > 0){
			paddleHit = 1;
			return true;

		}else if(ball.y < paddle.height && paddle.y == 0){
			paddleHit = 2;
			return true;
		}
	}
	return false;
}

function collideAction(ball, paddle){
	ball.vy = -ball.vy;

	if(paddleHit == 1){
		ball.y = paddle.y - paddle.h;
	}else if(paddleHit == 2){
		ball.y = paddle.h + ball.r;
	}

	points++;

	// Explosions David Cameron Style
	// Accel tout le X times
}

function newPosition(X, Y, idPlayer){
	console.log("Position reçue dans OnlinePong.js"
		+ X + Y + idPlayer);

	mouses[idPlayer].x = X;
	mouses[idPlayer].y = Y;
}

function gameOver(){
	ctx.fillStyle = "white";
	ctx.font = "20px Arial, sans-sherif";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("Game Over - You Scored "+points+ "Points!",
		W/2, H/2, 25);

	cancelAnimationFrame(init);

	restartBtn.draw();
}


function update(){
	for (var i = 0; i < paddles.length; i++) {
		if(mouses[i].x && mouses[i].y){
			paddles[i].x = mouses[i].x;
			//paddles[i].y = mouses[i].y;
		}
	}

	ball.x += ball.vx;
	ball.y += ball.vy;

	for (var i = 0; i < paddles.length; i++) {
		if(collide(ball, paddles[i]) == true){
			collideAction(ball, paddles[i]);
		}
	};

	if(ball.y + ball.r > H){
		ball.y = H - ball.r;
		gameOver();
	}

	// Si collision avec les murs 
	// GameOver.

	ctx.fillStyle = "White";
	ctx.font = "20px Arial, sans-sherif";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("Score: " + points, 20, 20);



}

function animLoop(){
	init = requestAnimationFrame(animLoop);
	draw();
	update();
}

function btnClick(e){
	var mx = e.pageX,
		my = e.pageY;

	if(mx >= startBtn.x && mx <= startBtn.x + startBtn.w){
		// On a clické sur le start
		// Lance le jeu;
		
		startBtn = {};
		animLoop();
	}

	if(mx >= restartBtn.x && mx <= restartBtn.x + restartBtn.w){
		
		restartBtn = {};

		ball.x = 20;
		ball.y = 20;
		points = 0;
		ball.vx = 4;
		ball.vy = 8;
		animloop();
	}
}

function startScreen(){
	draw();
	startBtn.draw();
}

function initPaddles(pos){
	
	this.h = 5;
	this.w = 150;

	this.x = W/2 - this.w/2;
	this.y = (pos == "top") ? 0 : H - this.h;

}

function initMouses(){
	this.x = 0;
	this.y = 0;
}

mouses.push(new initMouses());
mouses.push(new initMouses());

paddles.push(new initPaddles('bottom'));
paddles.push(new initPaddles('top'));

startScreen();