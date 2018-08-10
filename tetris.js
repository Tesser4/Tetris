const canvas = document.querySelector('#tetris')
const ctx = canvas.getContext('2d')
const scoreElement = document.querySelector('#score')
const levelElement = document.querySelector('#level')

const ROW = 20
const COL = 10
const SQ = squareSize = 20
const VACANT = 'white'
let gameInterval = 700
let score = 0
let level = 1
let nextLevel = 100
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

const BRICKS = [
  [I, 'steelblue'],
  [J, 'orangered'],
  [L, 'purple'],
  [O, 'blue'],
  [S, 'green'],
  [T, 'gold'],
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

drawBoard()
let theBrick = getRandomBrick()
theBrick.draw()

let dropStart = Date.now()
;(function play() {
  let now = Date.now()
  let delta = now - dropStart
  if (delta > gameInterval) {
    theBrick.moveDown()
    dropStart = Date.now()
  }
  if (!gameOver) requestAnimationFrame(play)
})()
