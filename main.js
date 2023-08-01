const NUM_BAll = 20;
const MIN_RADIUS = 10;
const MAX_RADIUS = 40;
const MIN_VELOCITY = 1;
const MAX_VELOCITY = 5;


let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

function getRandom(min,max){
	return Math.floor(Math.random()*(max-min+1))+min;
};

class ball{
	constructor(x, y){
		this.x = x;
		this.y = y;
		this.r = getRandom(MIN_RADIUS, MAX_RADIUS);
		this.m = this.r ** 2;
		this.v = getRandom(MIN_VELOCITY, MAX_VELOCITY);
		this.angle = getRandom(0, Math.PI * 2);
		this.vx = Math.cos(this.angle) * this.v;
		this.vy = Math.sin(this.angle) * this.v;
		this.color = 'white';
	}

	move(){
		this.x += this.vx
        		this.y += this.vy

        		//bounce off wall
        		if(this.x - this.r <= 0 && this.vx <= 0 || 
         			this.x + this.r >= canvas.width && this.vx >= 0){
            			this.vx *= -1
        		}
        		if(this.y - this.r <= 0 && this.vy <= 0 || 
            			this.y + this.r >= canvas.height && this.vy >= 0){
            			this.vy *= -1
        		}
	}

	draw(){
		ctx.beginPath();
		ctx.strokeStyle = 'black';
		ctx.fillStyle = this.color;
		ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
		ctx.stroke();
		ctx.fill();
	}
}

function isCollision(b1, b2){
	let curDistance = (b1.x - b2.x) ** 2 + (b1.y - b2.y) ** 2;
	let nextDistance = ((b1.x + b1.vx) - (b2.x + b2.vx)) ** 2 + ((b1.y + b1.vy) - (b2.y + b2.vy)) ** 2;
	return  curDistance <= (b1.r + b2.r) ** 2 && nextDistance  <  curDistance ;
}

function collision(b1, b2){
	let nb1vx = (b1.vx * (b1.m - b2.m) + 2 * b2.m * b2.vx) / (b1.m +b2.m);
	let nb1vy = (b1.vy * (b1.m - b2.m) + 2 * b2.m * b2.vy) / (b1.m +b2.m);

	let nb2vx = (b2.vx * (b2.m - b1.m) + 2 * b1.m * b1.vx) / (b2.m +b1.m);
	let nb2vy = (b2.vy * (b2.m - b1.m) + 2 * b1.m * b1.vy) / (b2.m +b1.m);

	b1.vx = nb1vx;
	b1.vy = nb1vy;
	b2.vx = nb2vx;
	b2.vy = nb2vy;
	
	//prevent balls stuck together
	//while(isCollision(b1, b2)){
	//	b1.move();
	//	b2.move();
	//}
}

function init(){
	balls = [];
	for(let i=0; i<NUM_BAll; i++) balls.push(new ball(getRandom(1, canvas.width-1), getRandom(0, canvas.height-1)))
}

function update(){
	canvas.width = canvas.width

	for(let i=0; i<NUM_BAll; i++){
		for(let j=i+1; j<NUM_BAll; j++){
			if(isCollision(balls[i], balls[j])) collision(balls[i], balls[j]);
		}
	}
	
	for(let i=0; i<NUM_BAll; i++) {
		balls[i].move();
		balls[i].draw();
	}
}

function loop(){
	update()
	requestAnimationFrame(loop)
}

init();
loop();