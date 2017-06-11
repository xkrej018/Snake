//promenne
var mycanvas = document.getElementById('canvas');
var home = document.getElementById('home');
var ctx = mycanvas.getContext('2d');
var snakeSize = 20;
var w = 700;
var h = 700;
var score = 0;
var snake;
var food;
var SnakeColor = 'green';
var snakeLength = 4;
var backgroundColor = 'grey';
var gameInterval;
var pocitadlo = 1;
var name;
var nick = localStorage.getItem("nick");
var hs = localStorage.getItem("hs");
var lastPlayer = localStorage.getItem("lastPlayer");
var btn = document.getElementById('btn');
var btnMenu = document.getElementById('menu-button');
var displayHighScore = document.getElementById('hs');
var nejskore = hs + " (" + nick + ")";
var setDifficulty = 0;
var difficulty = [[],[[10,10],[10,11],[10,12],[10,13],[10,14],[10,15],[10,16],[10,17],[10,18],[10,19],[10,20],[10,21],[10,22],[10,23],[10,24],[10,25],[25,10],[25,11],[25,12],[25,13],[25,14],[25,15],[25,16],[25,17],[25,18],[25,19],[25,20],[25,21],[25,22],[25,23],[25,24],[25,25]],
    [[10,10],[10,11],[10,12],[10,13],[10,14],[10,15],[10,16],[10,17],[10,18],[10,19],[10,20],[10,21],[10,22],[10,23],[10,24],[10,25],[25,10],[25,11],[25,12],[25,13],[25,14],[25,15],[25,16],[25,17],[25,18],[25,19],[25,20],[25,21],[25,22],[25,23],[25,24],[25,25],[17,10],[17,11],[17,12],[17,13],[17,14],[17,15],[17,16],[17,17],[17,18],[17,19],[17,20],[17,21],[17,22],[17,23],[17,24],[17,25],
        [10,10],[11,10],[12,10],[13,10],[14,10],[15,10],[16,10],[17,10],[18,10],[19,10],[20,10],[21,10],[22,10],[23,10],[24,10],[25,10]]];
displayHighScore.innerHTML = nejskore;

btn.addEventListener("click", function () {
    init();
});

var nickFunction = function() {
    if (document.getElementById("name").value == "") {
        if (lastPlayer != null) {
            document.getElementById("name").value = lastPlayer;
        } else {
            document.getElementById("name").value = "Anonymní had";
        }
    } else {
        localStorage.setItem("lastPlayer", document.getElementById("name").value);
    }
}

//checking if some relevant key was pressed
document.onkeydown = function (event) {
    keyCode = window.event.keyCode;
    keyCode = event.keyCode;

    switch (keyCode) {
        case 37:
            if (direction != 'right') {
                direction = 'left';
            }
            break;

        case 39:
            if (direction != 'left') {
                direction = 'right';
            }
            break;

        case 38:
            if (direction != 'down') {
                direction = 'up';
            }
            break;

        case 40:
            if (direction != 'up') {
                direction = 'down';
            }
            break;
    }
}

//start a game
var init =function() {
    home.style.backgroundImage = "none";
    mycanvas.style.visibility = 'visible';
    mycanvas.style.display = 'block';
    mycanvas.style.marginTop='15px';
    btn.disabled = 'true';
    btn.style.visibility="hidden";
    btnMenu.disabled = 'true';
    btnMenu.style.visibility="hidden";
    document.getElementById('title').style.display="none";
    direction = 'down';
    walls(difficulty[setDifficulty]);
    nickFunction();
    SnakeColor = document.querySelector('input[name="color"]:checked').value;
    snakeLength = document.getElementById("length").value;
    backgroundColor = document.querySelector('input[name="colorBackground"]:checked').value;
    gameInterval = document.getElementById("gameInterval").value;
    name = document.getElementById("name").value;
    setDifficulty = document.getElementById("difficulty").value
    if (menuVisible) {
        document.body.classList.remove('menu-visible');
        menuVisible = !menuVisible;
    }
    drawSnake();
    createFood();
    gameloop = setInterval(play, gameInterval);
}

//play loop function
var play = function() {
    console.log(gameInterval);
    pocitadlo = pocitadlo + 1;
    makingHarder();

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'white';
    ctx.strokeRect(0, 0, w, h);

    walls(difficulty[setDifficulty]);
    var snakeX = snake[0].x;
    var snakeY = snake[0].y;

    if (direction == 'right') {
        snakeX++;
    }
    else if (direction == 'left') {
        snakeX--;
    }
    else if (direction == 'up') {
        snakeY--;
    }
    else if (direction == 'down') {
        snakeY++;
    }
    if (snakeX == -1 || snakeX == w / snakeSize || snakeY == -1 || snakeY == h / snakeSize || checkCollision(snakeX, snakeY, snake) || wallCollision(snakeX,snakeY)) {
        //restart
        btn.removeAttribute('disabled', true);
        menuButton.removeAttribute('disabled', true);
        home.style.backgroundImage = "url('http://allproplumbing.org/wp-content/uploads/2016/07/Red-Snake.png')";
        mycanvas.style.visibility = 'hidden';
        mycanvas.style.display = 'none';
        btn.style.visibility="visible";
        btnMenu.style.visibility="visible";
        document.getElementById('title').style.display="block";
        ctx.clearRect(0, 0, w, h);
        gameloop = clearInterval(gameloop);
        console.log(nick);
        console.log(hs);
        //trying high score
        if (nick != null) {
            if (score > hs) {
                localStorage.setItem("nick", name);
                localStorage.setItem("hs", score);
                nejskore = score + " (" + name + ")";
                displayHighScore.innerHTML = nejskore;
            }
        } else {
            nejskore = score + " (" + name + ")";
            displayHighScore.innerHTML = nejskore;
            localStorage.setItem("nick", name);
            localStorage.setItem("hs", score);
        }
        score = 0;
        pocitadlo = 1;
        return;
    }

    if (snakeX == food.x && snakeY == food.y) {
        //snake ate a thing
        var tail = {x: snakeX, y: snakeY};
        score++;
        var audio = new Audio('eating.mp3');
        audio.play();
        createFood();
    } else {
        //he ate nothing
        var tail = snake.pop();
        tail.x = snakeX;
        tail.y = snakeY;
    }
    snake.unshift(tail);

    headSnake(snake[0].x, snake[0].y);
    for (var i = 1; i < snake.length; i++) {
        bodySnake(snake[i].x, snake[i].y);
    }

    scoreDisplay();
    foodDraw(food.x, food.y);
}

//speeding up the game
var makingHarder= function() {
    if (pocitadlo % 100 == 0 && gameInterval > 50) {
        gameInterval = gameInterval - 5;
        clearInterval(gameloop);
        gameloop = setInterval(play, gameInterval);
    }
}

//try if snake eat himself
var checkCollision=function(x, y, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].x === x && array[i].y === y)
            return true;
    }
    return false;
}

//generate position of snake's food
var createFood =function() {
    food = {
        x: Math.floor((Math.random() * 30) + 1),
        y: Math.floor((Math.random() * 30) + 1)
    }

    //food can not be generated on position of wall
    for(var i=0;i < difficulty[setDifficulty].length;i++) {
        if(food.x == difficulty[setDifficulty][i][0] && food.y == difficulty[setDifficulty][i][1]) {
            food.x = Math.floor((Math.random() * 30) + 1);
            food.y = Math.floor((Math.random() * 30) + 1);
            i=0;
        }
    }
}

//draw a snake's food
var foodDraw =function(x, y) {
    ctx.fillStyle = 'blue';
    ctx.fillRect(x * snakeSize, y * snakeSize, snakeSize, snakeSize);
    ctx.fillStyle = 'darkblue';
    ctx.fillRect(x * snakeSize + 1, y * snakeSize + 1, snakeSize - 2, snakeSize - 2);
}

//draw a snake in the beginning of game, taking length setted in menu
var drawSnake =function() {
    var length = snakeLength;
    snake = [];
    for (var i = length - 1; i >= 0; i--) {
        snake.push({x: i, y: 0});
    }
}

//drawing a snake's head in direction he goes
var headSnake=function(x, y) {
    ctx.fillStyle = SnakeColor;
    ctx.fill
    ctx.fillRect(x * snakeSize, y * snakeSize, snakeSize, snakeSize);
    ctx.strokeStyle = 'darkgreen';
    ctx.strokeRect(x * snakeSize, y * snakeSize, snakeSize, snakeSize);
    var a, b, c, d;
    switch (direction) {
        case 'right':
            a = x * snakeSize + snakeSize * 0.7;
            b = y * snakeSize + snakeSize * 0.3;
            c = x * snakeSize + snakeSize * 0.7;
            d = y * snakeSize + snakeSize * 0.7;
            eyes(a, b, c, d);
            break;
        case 'left':
            a = x * snakeSize + snakeSize * 0.3;
            b = y * snakeSize + snakeSize * 0.3;
            ;
            c = x * snakeSize + snakeSize * 0.3;
            d = y * snakeSize + snakeSize * 0.7;
            ;
            eyes(a, b, c, d);
            break;
        case 'up':
            a = x * snakeSize + snakeSize * 0.3;
            b = y * snakeSize + snakeSize * 0.3;
            c = x * snakeSize + snakeSize * 0.7;
            d = y * snakeSize + snakeSize * 0.3;
            eyes(a, b, c, d);
            break;
        case 'down':
            a = x * snakeSize + snakeSize * 0.3;
            b = y * snakeSize + snakeSize * 0.7;
            ;
            c = x * snakeSize + snakeSize * 0.7;
            d = y * snakeSize + snakeSize * 0.7;
            ;
            eyes(a, b, c, d);
            break;
    }
}

//drawing snake's eyes
var eyes=function(a, b, c, d) {
    ctx.beginPath();
    ctx.arc(a, b, 2, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'darkgreen';
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(c, d, 2, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'darkgreen';
    ctx.fill();
    ctx.closePath();
}

//drawing snake's body part
var bodySnake=function(x, y) {
    ctx.fillStyle = SnakeColor;
    ctx.fill
    ctx.fillRect(x * snakeSize, y * snakeSize, snakeSize, snakeSize);
    ctx.strokeStyle = 'darkgreen';
    ctx.strokeRect(x * snakeSize, y * snakeSize, snakeSize, snakeSize);
}

//display score
var scoreDisplay=function() {
    ctx.fillStyle = 'white';
    ctx.font = "30px Georgia";
    var score_text = "Score: " + score;
    ctx.fillText(score_text, 550, h - 15);
}

//draw an array of walls
var walls = function(x) {
    console.log(x)
    for (var i = 0; i < x.length; i++) {
        drawWall(x[i][0],x[i][1])
    }
}

//draw a piece of wall
var drawWall = function(x,y) {
    ctx.fillStyle = 'black';
    ctx.fillRect(x * snakeSize, y * snakeSize, snakeSize, snakeSize);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x * snakeSize, y * snakeSize, snakeSize, snakeSize);
}

//try wall collision
var wallCollision=function(x, y) {
    for (var i = 0; i < difficulty[setDifficulty].length; i++) {
        if (difficulty[setDifficulty][i][0] === x && difficulty[setDifficulty][i][1] === y)
            return true;
    }
    return false;
}