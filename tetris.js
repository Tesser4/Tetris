const canvas = document.querySelector('#tetris')
const ctx = canvas.getContext('2d')
const scoreElement = document.querySelector('#score')

const ROW = 20
const COL = 10
const SQ = squareSize = 20
const VACANT = 'white'
const GAME_INTERVAL = 800
let score = 0
let gameOver = false

function drawSquare(x, y, color) {
  ctx.fillStyle = color
  ctx.fillRect(y * SQ, x * SQ, SQ, SQ)

  ctx.strokeStyle = 'black'
  ctx.strokeRect(y * SQ, x * SQ, SQ, SQ)
}

let board = []
for (let r = 0; r < ROW; r++) {
  board[r] = []
  for (let c = 0; c < COL; c++) {
    board[r][c] = VACANT
  }
}

function drawBoard() {
  for (let r = 0; r < ROW; r++) {
    for (let c = 0; c < COL; c++) {
      drawSquare(r, c, board[r][c])
    }
  }
}

drawBoard()

const BRICKS = [
  [I, 'cyan'],
  [J, 'orange'],
  [L, 'purple'],
  [O, 'blue'],
  [S, 'green'],
  [T, 'yellow'],
  [Z, 'red']
]

const brickProto = {}
function popBrick(tetromino, color) {
  let activePattern = 0
  let activeTetromino = tetromino[activePattern]
  let length = activeTetromino.length
  let x = 0
  let y = 0
  
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

brickProto.fill = function(color) {
  for (let r = 0; r < this.length; r++) {
    for (let c = 0; c < this.length; c++) {
      if (this.activeTetromino[r][c])
        drawSquare(this.x + r, this.y + c, color)
    }
  }
}

brickProto.draw = function() {
  this.fill(this.color)
}

brickProto.undraw = function() {
  this.fill(VACANT)
}

brickProto.moveDown = function() {
  if (!this.collision(1, 0, this.activeTetromino)) {
    this.undraw()
    this.x += 1
    this.draw()
  } else {
    this.lock()
    theBrick = getRandomBrick()
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
          board[this.x + r][this.y + c] = this.color
        }
      }
    }
  }
  // Full lines?
  for (let r = 0; r < ROW; r++) {
    if (board[r].every(x => x !== VACANT)) {
      for (let rr = r; rr >= 0; rr--) {
        for (let c = 0; c < COL; c++) {
          rr === 0
            ? board[rr][c] = VACANT
            : board[rr][c] = board[rr - 1][c]
        }
      }
      score += 10
      scoreElement.innerHTML = score
      drawBoard()
    }
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
        if (board[newX + r][newY + c] !== VACANT)
          return true
      }
    }
  }
  return false
}

function control(evt) {
  switch (evt.keyCode) {
    case 37:
      theBrick.moveLeft()
      dropStart = Date.now()
      break
    case 38:
      theBrick.rotate()
      dropStart = Date.now()
      break
    case 39:
      theBrick.moveRight()
      dropStart = Date.now()
      break
    case 40:
      theBrick.moveDown()
      dropStart = Date.now()
      break
  }
}
document.addEventListener('keydown', control)

function getRandomBrick() {
  let rnd = Math.floor(Math.random() * BRICKS.length)
  let brick = popBrick(BRICKS[rnd][0], BRICKS[rnd][1])
  brick.draw()
  return brick
}
let theBrick = getRandomBrick()

let dropStart = Date.now()
function drop() {
  let now = Date.now()
  let delta = now - dropStart
  if (delta > GAME_INTERVAL) {
    theBrick.moveDown()
    dropStart = Date.now()
  }
  if (!gameOver)
    requestAnimationFrame(drop)
}

drop()
