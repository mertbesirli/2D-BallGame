//Access canvas
const cvs = document.getElementById("gamecanvas")
//Access context
const ctx = cvs.getContext("2d");

//Draw rectangle
const drawRect = (x,y,w,h,color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x,y,w,h);

}
//Draw fill circle
const drawCircleFull = (x,y,r,color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,2 * Math.PI,false);
    ctx.closePath();
    ctx.fill();
}

//Draw empty circle
const drawCircleEmpty = (x,y,r,w,color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.arc(x,y,r,0,2 * Math.PI);
    ctx.closePath();
    ctx.stroke();
}

//Write text for score board
const drawText = (text,x,y,color) => {
    ctx.fillStyle = color;
    ctx.font = '50px sans-serif';
    ctx.fillText(text,x,y);
}

/*We created an object to keep the score 
separately for the computer and the user.*/
const user = {
    x:20,
    y:cvs.height/2 - 50,
    w:10,
    h:100,
    color: '#ffff',
    score:0
};
const computer = {
    x:cvs.width - 30,
    y:cvs.height/2 - 50,
    w:10,
    h:100,
    color: '#ffff',
    score:0
};

//Object for ball to game
const ball = {
    x :cvs.width/2,
    y : cvs.height/2,
    r : 13,
    color: '#4298b5',
    speed: 5,
    velocityX: 3,
    velocityY: 4,
    stop: true
};


const movePaddle = (e) => {
    let rect = cvs.getBoundingClientRect();
    user.y = e.clientY - rect.top - user.h/2;
    ball.stop = false;
}
//For mouse move
cvs.addEventListener('mousemove',movePaddle);


//Collision check
const collision = (b,p) => {
    b.top = b.y - b.r;
    b.bottom = b.y + b.r;
    b.left = b.x - b.r;
    b.right = b.x + b.r;

    p.top = p.y;
    p.bottom = p.y + p.h;
    p.left = p.x;
    p.right = p.x + p.w;

    return (b.top < p.bottom && b.bottom > p.top && b.left < p.right && b.right > p.left);
}
const resetBall = () => {
    ball.x = cvs.width/2;
    ball.y = cvs.height/2;

    ball.speed = 5;
    ball.velocityX = 3;
    ball.velocityY = 4;
    ball.stop = true;
}

/*As the ball moves, update it
according to the velocities in the coordinate.*/
const update = () => {
    if(!ball.stop){
        ball.x += ball.velocityX;
        ball.y += ball.velocityY;
    }

    /*The ball does not go out of the screen, 
    it moves as if there is a wall above and below.*/
    if(ball.y + ball.r > cvs.height || ball.y - ball.r < 0){
        ball.velocityY = -ball.velocityY;
    }
    //Actually, this is difficulty level of game
    let comLvl = 0.1; 
    computer.y += (ball.y -(computer.y + computer.h /2)) * comLvl;
    //Need to determine which side the ball is on.
    let player = (ball.x < cvs.width/2) ? user : computer;

    if(collision(ball,player)){
        ball.velocityX = -ball.velocityX;
        let intersectY = ball.y - (player.y + player.h/2);
        intersectY /= player.h/2;

        let maxBounceRate = Math.PI / 3;
        let bounceAngle = intersectY * maxBounceRate;

        let direction = (ball.x < cvs.width/2) ? 1 : -1;

        ball.velocityX = direction * ball.speed * Math.cos(bounceAngle);
        ball.velocityY = ball.speed * Math.sin(bounceAngle);

        //Increase the speed of the ball in each collision.
        ball.speed  += 1.5;
    }
    if(ball.x > cvs.width){
        user.score++;
        resetBall();
    }
    else if(ball.x < 0){
        computer.score++;
        resetBall();
    }
}


const render = () => {
    drawRect(0,0,cvs.width,cvs.height,'#008374');
    drawRect(cvs.width/2-2,0,4,cvs.height,'#fff');
    drawCircleFull(cvs.width/2,cvs.height/2,8,'#ffff');
    drawCircleEmpty(cvs.width/2,cvs.height/2,50,4,'#ffff');
    drawText(user.score,cvs.width/4,100,'#ffff');
    drawText(computer.score,3*cvs.width/4,100,'#ffff');

    //Line bar for computer and user
    drawRect(user.x,user.y,user.w,user.h,user.color);
    drawRect(computer.x,computer.y,computer.w,computer.h,computer.color);
    drawCircleFull(ball.x,ball.y,ball.r,ball.color);
}

const game = () => {
    update();
    render();
}

const fps = 50;
setInterval(game,1000/fps);