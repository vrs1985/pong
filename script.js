// Code goes here
  var canvas = document.getElementById('canvas');
  canvas.width = 480;
  canvas.height = 320;
  canvas.addEventListener("click", function(){
    if(!ball.dx){init();}
  });


    var ctx = canvas.getContext('2d');
  // Variables
    var ball = [], paddle = [], brick = [], bricks = [], score = 0, life = 3;
        // use boolean value for move paddle
    var leftPressed = false, rightPressed = false;
    var start = false;
      // pause
    document.addEventListener("keypress", function(e){
      if(e.keyCode === 32 && !start){
        start = true;
      }else{
        start = false;
      }
    });

    (function(){
      drawSentence("Click for run game", "black", 20, true, canvas.width/2, canvas.height/2);
    })();

    function init(){
      // ball's coordinate
    ball.x = canvas.width/2; ball.y = canvas.height-30;
    ball.dx = 2; ball.dy = -2; ball.radius = 10;
      // create paddle
    paddle.height = 10; paddle.width = 75;
    paddle.x = (canvas.width - paddle.width)/2;
    paddle.y = canvas.height - paddle.height;
      // create a brick
    brick.height = 20; brick.width = 75; brick.padding = 10;
    brick.rows = 3; brick.columns = 5;
    brick.offsetTop = 30; brick.offsetLeft = 30;
        // create bricks use two-dimensional array through loop
    for(var c = 0; c < brick.columns; c++){
      bricks[c] = [];
      for(var r = 0; r < brick.rows; r++){
        bricks[c][r] = {x: 0, y: 0, status: 1};
      }
    }
    draw();
    }
    // init();
    function drawSentence(arg, color, size, center, width, height){
      ctx.beginPath();
      ctx.font = size+"px Arial";
      ctx.fillStyle = color;
      if(center){ctx.textAlign = "center";}
      ctx.fillText(arg, width, height);
      ctx.closePath();
    }
        // move ball
    function draw(){
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBricks();
      drawBall();
      drawPaddle();
      collisionDetection();
      drawSentence("Score " + score, "#ccc", 25, true, 50, 25);
      drawSentence("Life " + life, "#ccc", 25, true, canvas.width-40, 25);
      ball.x += ball.dx;
      ball.y += ball.dy;

          // restrict ball near border
      if (ball.x + ball.dx > canvas.width - ball.radius || ball.x < ball.radius){
        ball.dx = -ball.dx;
      }
      if (ball.y + ball.dy < ball.radius){
        ball.dy = -ball.dy;
      }else if(ball.y > canvas.height - ball.radius){
        //ball.dy = -ball.dy;
        if(ball.x > paddle.x && ball.x < paddle.x + paddle.width){
          ball.dy = -ball.dy;
        }else{
          if(!life){
            drawSentence("GAME OVER", "red", 30, true, canvas.width/2, canvas.height/2);
            document.location.reload();
          }else{
            ball.dy = -ball.dy;
            life--;
          }
        }
      }
      (function animate(){
        if(start){
          setTimeout(animate, 200);
        }else{
          requestAnimationFrame(draw);
        }
      })();


    }

    //draw ball
    function drawBall(){
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2, false);
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.fill();
      ctx.closePath();
    }

    function drawPaddle(){
      ctx.beginPath();
      ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.fill();
      ctx.closePath();
      // move paddle
      if(leftPressed && paddle.x > 0){
        paddle.x -= 7;
      }else if(rightPressed && paddle.x < canvas.width - paddle.width){
        paddle.x += 7;
      }
    }

        // listen event left or right arrow on the keyboard
    document.addEventListener("keydown", handlerKeyDown, false);
    document.addEventListener("keyup", handlerKeyUp, false);

        // callback if key down
    function handlerKeyDown(e){
      if(e.keyCode === 37){
        leftPressed = true;
      }else if(e.keyCode === 39){
        rightPressed = true;
      }
    }

        // callback if key down
    function handlerKeyUp(e){
      if(e.keyCode === 37){
        leftPressed = false;
      }else if(e.keyCode === 39){
        rightPressed = false;
      }
    }

        // draw bricks
    function drawBricks(){
      for(let c=0; c< brick.columns; c++){
        for(let r=0; r < brick.rows; r++){
        // brick's position
        brick.x = (c*(brick.width + brick.padding))+brick.offsetLeft;
        brick.y = (r*(brick.height + brick.padding))+brick.offsetTop;
        bricks[c][r].x = brick.x;
        bricks[c][r].y = brick.y;
        if(bricks[c][r].status === 1){
          ctx.beginPath(bricks[c]);
          ctx.rect(brick.x, brick.y, brick.width, brick.height);
          if(r===0){
            ctx.fillStyle = "#9f0000";
          }else if(r===1){
            ctx.fillStyle = "#009f00";
          }else if(r===2){
            ctx.fillStyle = "#00009f";
          }
          ctx.fill();
          ctx.closePath();
        }
        }
      }
    }

        function collisionDetection(){
      for(let c=0; c< brick.columns; c++){
        for(let r=0; r < brick.rows; r++){
          var b = bricks[c][r];
          if( ball.x > b.x && ball.x < b.x + brick.width &&
              ball.y > b.y && ball.y < b.y + brick.height && b.status === 1 ){
                ball.dy = -ball.dy;
                b.status = 0;
                if(r === 2){
                score++;
                }else if(r === 1){
                  score += 2;
                }else if(r === 0){
                  score += 3;
                }
                if(score === (brick.rows*brick.columns)*2){
                  drawSentence("You Win", "#0f0", 30, true, canvas.width/2, canvas.height/2);
                  document.location.reload();
                }
              }
        }
      }
    }


    // need to add number level's and func level up and lose game


