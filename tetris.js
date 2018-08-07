const canvas = document.querySelector('#tetris')
const ctx = canvas.getContext('2d')

const ROW = 20
const COL = 10
const SQ = squareSize = 20
const VACANT = 'white'

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
  this.undraw()
  this.x += 1
  this.draw()
}

brickProto.moveRight = function() {
  this.undraw()
  this.y += 1
  this.draw()
}

brickProto.moveLeft = function() {
  this.undraw()
  this.y -= 1
  this.draw()
}



let theBrick = popBrick(BRICKS[2][0], BRICKS[2][1])
theBrick.draw()

let dropStart = Date.now()
function drop() {
  let now = Date.now()
  let delta = now - dropStart
  if (delta > 800) {
    theBrick.moveDown()
    dropStart = Date.now()
  }
  requestAnimationFrame(drop)
}





// video: 56:25
