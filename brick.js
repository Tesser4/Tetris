function getRandomBrick(board) {
  let rnd = Math.floor(Math.random() * BRICKS.length)
  let tetromino = BRICKS[rnd][0]
  let color = BRICKS[rnd][1]
  let activePattern = 0
  let activeTetromino = tetromino[activePattern]
  let length = activeTetromino.length
  let x = 0
  let y = 3
  
  let brick = {
    tetromino,
    color,
    activePattern,
    activeTetromino,
    length,
    x,
    y
  }
  Object.setPrototypeOf(brick, brickProto)

  return brick
}

const brickProto = {}

brickProto.fill = function(color) {
  for (let r = 0; r < this.length; r++) {
    for (let c = 0; c < this.length; c++) {
      if (this.activeTetromino[r][c])
        board.drawSquare(this.x + r, this.y + c, color)
    }
  }
}

brickProto.draw = function() {
  this.fill(this.color)
}

brickProto.undraw = function() {
  this.fill(EMPTY)
}

brickProto.moveDown = function() {
  if (!this.collision(1, 0, this.activeTetromino)) {
    this.undraw()
    this.x += 1
    this.draw()
  } else {
    this.lock()
    brick = getRandomBrick()
  }
}

brickProto.moveRight = function() {
  if (!this.collision(0, 1, this.activeTetromino)) {
    this.undraw()
    this.y += 1
    this.draw()
  }
}

brickProto.moveLeft = function() {
  if (!this.collision(0, -1, this.activeTetromino)) {
    this.undraw()
    this.y -= 1
    this.draw()
  }
}

brickProto.rotate = function() {
  this.undraw()
  this.activePattern += 1
  this.activePattern %= this.tetromino.length
  this.activeTetromino = this.tetromino[this.activePattern]
  if (this.collision(0, 0, this.activeTetromino))
    this.y = this.y < COL / 2 ? this.y + 1 : this.y - 1
  this.draw()
}

brickProto.lock = function() {
  for (let r = 0; r < this.length; r++) {
    for (let c = 0; c < this.length; c++) {
      if (this.activeTetromino[r][c]) {
        if (this.x === 0) {
          alert('Game Over')
          gameOver = true
          break
        } else {
          board.setSquare(this.x + r, this.y + c, this.color)
        }
      }
    }
  }
  console.log('out', board.hasFullRow())
  // Check for full lines and manage them
  while (board.hasFullRow()) {
    console.log('in', board.hasFullRow())
    board.deleteRow(board.hasFullRow())
    score += 10
    scoreElement.innerHTML = score
    if (score >= nextLevel) {
      level += 1
      nextLevel +=100
      levelElement.innerHTML = level
      gameInterval =
        gameInterval === 300
          ? 300
          : gameInterval - 100
    }
    board.draw()
  }
}

brickProto.collision = function(x, y, tetromino) {
  for (let r = 0; r < this.length; r++) {
    for (let c = 0; c < this.length; c++) {
      if (tetromino[r][c]) {
        let newX = this.x + x
        let newY = this.y + y
        if (newY + c >= COL || newY + c < 0 || newX + r >= ROW)
          return true
        if (!board.isSquareEmpty(newX + r, newY + c))
          return true
      }
    }
  }
  return false
}
