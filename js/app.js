// App.js

// Enemies our player must avoid
var Enemy = function(row) {
    this.sprite = 'images/enemy-bug.png';
    this.x = -100 - (Math.random() * 500);
    this.y = 219 - (row * 83);
    this.speed = (Math.random() * 200) + 200;
};

// Update the enemy's position
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// The character our player controls
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 202;
    this.y = 385;
    this.lastX = this.x;
    this.lastY = this.y;
    this.speed = 500;   // speed can be changed to adjust the difficulty
    this.direction = 'stop';
};

// Update the player object
// Parameter: dt, a time delta between ticks
Player.prototype.update = function(dt) {
    this.updatePosition(dt);
    this.enemyCollision();
    this.waterCollision();
};

// Draw the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Update the player's position
// Parameter: dt, a time delta between ticks
Player.prototype.updatePosition = function(dt) {
    if (this.direction === 'left') {
        this.x -= this.speed * dt;

        if (this.x <= this.lastX - 101) {
            this.x = this.lastX - 101;
            this.lastX = this.x;
            this.direction = 'stop';
        }
    }

    else if (this.direction === 'up') {
        this.y -= this.speed * dt;

        if (this.y <= this.lastY - 83) {
            this.y = this.lastY - 83;
            this.lastY = this.y;
            this.direction = 'stop';
        }
    }

    else if (this.direction === 'right') {
        this.x += this.speed * dt;

        if (this.x >= this.lastX + 101) {
            this.x = this.lastX + 101;
            this.lastX = this.x;
            this.direction = 'stop';
        }
    }

    else if (this.direction === 'down') {
        this.y += this.speed * dt;

        if (this.y >= this.lastY + 83) {
            this.y = this.lastY + 83;
            this.lastY = this.y;
            this.direction = 'stop';
        }
    }
};

// Check for collision with an enemy
Player.prototype.enemyCollision = function() {
    for (var i = 0; i < allEnemies.length; i++) {
        if ((this.x + 80 >= allEnemies[i].x && this.x < allEnemies[i].x + 80) && (this.y + 70 >= allEnemies[i].y && this.y < allEnemies[i].y + 70)) {
            this.death();
        }
    }
};

// Check for collision with water
Player.prototype.waterCollision = function() {
    if (this.y < 10) {
        this.respawn();
        game.levelUp();
    }
};

// Respawn the player at the beginning
Player.prototype.death = function() {
    this.respawn();
    game.death();
};

Player.prototype.respawn = function() {
    this.direction = 'stop';
    this.x = 202;
    this.y = 385;
    this.lastX = this.x;
    this.lastY = this.y;
}

// Handle input
// Prevents the player from moving off-screen
Player.prototype.handleInput = function(key) {
    if (this.direction === 'stop') {
        if ((key === 'left' && this.x > 0) || (key === 'up' && this.y > 0) || (key === 'right' && this.x < 404) || (key === 'down' && this.y < 385)) {
            this.direction = key;
            this.lastX = this.x;
            this.lastY = this.y;
        }
    }
};

// Holds non-entity game info and functions
var Game = function() {
    this.level = 1;
    this.hearts = 3;
    this.score = 0;
    this.state = 0;
};

// Draw the game info on the screen
Game.prototype.render = function() {
    // Draw hearts
    for (i = 0; i < this.hearts; i++){
        ctx.drawImage(Resources.get('images/Heart.png'), 470 - i * 30, 540, 30, 50);
    }
    // Draw score
    ctx.fillText(this.score, 10, 575);
    // Draw game over text
    if (this.state) {
        ctx.fillText("GAME OVER", 322, 575);
    }
};

// Handles input ouside of player movement
Game.prototype.handleInput = function(key) {
    this.state = 0;
    this.hearts = 3;
    this.score = 0;
    for (i = 0; i <= 2; i++) {
        var enemy = new Enemy(i);
        allEnemies.push(enemy);
        enemy = new Enemy(i);
        allEnemies.push(enemy);
    }
};

Game.prototype.levelUp = function() {
    this.level++;
    this.score += 100;
};

// Updates game info when the player dies
Game.prototype.death = function() {
    this.hearts--;
    if (this.hearts <= 0) {
        this.gameOver();
    }
};

// Toggles the game state to the game over screen
Game.prototype.gameOver = function() {
    this.state = 1;
    allEnemies = [];
    console.log("Game Over!");
};

// Now instantiate your objects.
var game = new Game();
var player = new Player();
var allEnemies = [];
for (i = 0; i <= 2; i++) {
    var enemy = new Enemy(i);
    allEnemies.push(enemy);
    enemy = new Enemy(i);
    allEnemies.push(enemy);
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    if (game.state){
        game.handleInput(allowedKeys[e.keyCode]);
    }
    else {
        player.handleInput(allowedKeys[e.keyCode]);
    }
});
