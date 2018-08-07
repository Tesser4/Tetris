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

const PIECES = [
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
  let tetrominoPattern = 0
  let activeTetromino = tetromino[tetrominoPattern]
  let x = 0
  let y = 0

  let brick = {
    tetromino,
    color,
    tetrominoPattern,
    activeTetromino,
    x,
    y
  }
  Object.setPrototypeOf(brick, brickProto)

  return brick
}

brickProto.draw = function() {
  let l = this.activeTetromino.length
  for (let r = 0; r < l; r++) {
    for (let c = 0; c < l; c++) {
      if (this.activeTetromino[r][c])
        drawSquare(this.x + r, this.y + c, this.color)
    }
  }
}






// video: 53:00
