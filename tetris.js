const canvas = document.querySelector('#tetris')
const ctx = canvas.getContext('2d')
const scoreElement = document.querySelector('#score')
const levelElement = document.querySelector('#level')

const ROW = 20
const COL = 10
const SQ = 20
const EMPTY = 'white'

let board = getBoard(ROW, COL, SQ, EMPTY)
let score = getScoreManager()

let gameInterval = 700
let gameOver = false

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
      brick.moveLeft()
      dropStart = Date.now()
      break
    case 38:
      brick.rotate()
      dropStart = Date.now()
      break
    case 39:
      brick.moveRight()
      dropStart = Date.now()
      break
    case 40:
      brick.moveDown()
      dropStart = Date.now()
      break
  }
}
document.addEventListener('keydown', control)

board.draw()
let brick = getRandomBrick(board, score)
brick.draw()

let dropStart = Date.now()
;(function play() {
  let now = Date.now()
  let delta = now - dropStart
  if (delta > gameInterval) {
    brick.moveDown()
    dropStart = Date.now()
  }
  if (!gameOver) requestAnimationFrame(play)
})()
