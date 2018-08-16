function getRandomBrick(board) {
  const BRICKS = [
    [I, 'steelblue'],
    [J, 'orangered'],
    [L, 'purple'],
    [O, 'blue'],
    [S, 'green'],
    [T, 'gold'],
    [Z, 'red']
  ]
  
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

brickProto.draw = function() {
  for (let r = 0; r < this.length; r++) {
    for (let c = 0; c < this.length; c++) {
      if (this.activeTetromino[r][c])
        board.drawSquare(this.x + r, this.y + c, this.color)
    }
  }
}

brickProto.undraw = function() {
  for (let r = 0; r < this.length; r++) {
    for (let c = 0; c < this.length; c++) {
      if (this.activeTetromino[r][c])
        board.undrawSquare(this.x + r, this.y + c)
    }
  }
}

brickProto.moveDown = function() {
  let locked = false

  if (!this.collision(1, 0, this.activeTetromino)) {
    this.undraw()
    this.x += 1
    this.draw()
  } else {
    locked = true
  }

  return locked
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
  if (this.collision(0, 0, this.activeTetromino)) {
    let kickWall =
      this.y === -2 ||
      this.y === board.getColumns() - 2 &&
      this.tetromino === I &&
      this.activePattern === 0
        ? 2
        : 1
    this.y = this.y < COL / 2 ? this.y + kickWall : this.y - kickWall
  }
  this.draw()
}

brickProto.lock = function() {
  let gameOver = false
  
  for (let r = 0; r < this.length; r++) {
    for (let c = 0; c < this.length; c++) {
      if (this.activeTetromino[r][c]) {
        if (this.x === 0) {
          gameOver = true
          break
        } else {
          board.setSquare(this.x + r, this.y + c, this.color)
        }
      }
    }
  }
  
  return gameOver
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
