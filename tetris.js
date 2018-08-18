const canvasMain = document.querySelector('#tetris')
const ctxMain = canvasMain.getContext('2d')
const canvasNext = document.querySelector('#nextbrick')
const ctxNext = canvasNext.getContext('2d')
const scoreElement = document.querySelector('#score')
const levelElement = document.querySelector('#level')
const highScoreElement = document.querySelector('#highScore')

const ROW_MAIN = 20
const COL_MAIN = 10
const ROW_NEXT = 4
const COL_NEXT = 4
const SQ = 30
const EMPTY = 'white'

const boardMain = getBoard(ROW_MAIN, COL_MAIN, SQ, EMPTY, ctxMain)
const boardNext = getBoard(ROW_NEXT, COL_NEXT, SQ, EMPTY, ctxNext)
let currentBrick = getRandomBrick(boardMain, 0, 3)
let nextBrick = getRandomBrick(boardNext, 0, 0)

const score = getScoreManager()
highScoreElement.innerHTML = score.getHighScore()

let gameInterval = 500
let gameOver = false

function control(evt) {
  switch (evt.keyCode) {
    case 37:
      currentBrick.moveLeft()
      dropStart = Date.now()
      break
    case 38:
      currentBrick.rotate()
      dropStart = Date.now()
      break
    case 39:
      currentBrick.moveRight()
      dropStart = Date.now()
      break
    case 40:
      currentBrick.moveDown()
      dropStart = Date.now()
      break
  }
}
document.addEventListener('keydown', control)

const boards = [boardMain, boardNext]
boards.forEach(x => x.draw())
currentBrick.draw()
nextBrick.draw()

let dropStart = Date.now()
;(function play() {
  let now = Date.now()
  let delta = now - dropStart

  if (delta > gameInterval) {
    dropStart = Date.now()
    let locked = currentBrick.moveDown()

    if (locked) {
      gameOver = currentBrick.lock()

      nextBrick.undraw()
      currentBrick = nextBrick
      currentBrick.y = 3
      currentBrick.board = boardMain
      currentBrick.draw()
      nextBrick = getRandomBrick(boardNext, 0, 0)
      
      while (boardMain.hasFullRow()) {
        boardMain.deleteRow(boardMain.hasFullRow())

        let levelChanged = score.increasePoints()
        if (levelChanged) {
          gameInterval = gameInterval === 100
            ? gameInterval
            : gameInterval - 100
          levelElement.innerHTML = score.getLevel()
        }

        scoreElement.innerHTML = score.getPoints()
      }

      boards.forEach(x => x.draw())
      currentBrick.draw()
      nextBrick.draw()
    }
  }

  if (gameOver) {
    document.removeEventListener('keydown', control)

    if (score.getHighScore() < score.getPoints()) {
      score.setHighScore(score.getPoints())
      highScoreElement.innerHTML = score.getHighScore()
    }

    alert('Game Over')
  } else {
    requestAnimationFrame(play)
  }

})()
