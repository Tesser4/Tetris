const canvasMain = document.querySelector('#tetris')
const ctxMain = canvasMain.getContext('2d')
const canvasNext = document.querySelector('#nextbrick')
const ctxNext = canvasNext.getContext('2d')
const scoreElement = document.querySelector('#score')
const levelElement = document.querySelector('#level')

const ROW_MAIN = 20
const COL_MAIN = 10
const ROW_NEXT = 4
const COL_NEXT = 4
const SQ = 30
const EMPTY = 'white'

let boardMain = getBoard(ROW_MAIN, COL_MAIN, SQ, EMPTY, ctxMain)
let boardNext = getBoard(ROW_NEXT, COL_NEXT, SQ, EMPTY, ctxNext)

let score = getScoreManager()

let gameInterval = 600
let gameOver = false

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

boardMain.draw()
boardNext.draw()

let brick = getRandomBrick(boardMain, 0, 3)
let nextBrick = getRandomBrick(boardNext, 0, 0)
brick.draw()
nextBrick.draw()

let dropStart = Date.now()
;(function play() {
  let now = Date.now()
  let delta = now - dropStart

  if (delta > gameInterval) {
    let locked = brick.moveDown()
    dropStart = Date.now()

    if (locked) {
      gameOver = brick.lock()
      nextBrick.undraw()
      brick = nextBrick
      brick.x = 0
      brick.y = 3
      brick.board = boardMain
      nextBrick = getRandomBrick(boardNext, 0, 0)
      
      while (boardMain.hasFullRow()) {
        boardMain.deleteRow(boardMain.hasFullRow())
        
        if (score.increaseScore()) {
          gameInterval = gameInterval === 200
          ? gameInterval
          : gameInterval - 100
        }
        
        scoreElement.innerHTML = score.getPoints()
        levelElement.innerHTML = score.getLevel()
        boardMain.draw()
        boardNext.draw()
      }
      nextBrick.draw()
    }
  }

  if (gameOver) {
    document.removeEventListener('keydown', control)
    alert('Game Over')
  } else {
    requestAnimationFrame(play)
  }

})()
