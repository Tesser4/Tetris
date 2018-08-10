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

let theBrick = getRandomBrick()
theBrick.draw()

let dropStart = Date.now()
;(function play() {
  let now = Date.now()
  let delta = now - dropStart
  if (delta > GAME_INTERVAL) {
    theBrick.moveDown()
    dropStart = Date.now()
  }
  if (!gameOver) requestAnimationFrame(play)
})()
