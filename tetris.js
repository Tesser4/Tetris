const canvasMain = document.querySelector('#tetris')
const ctxMain = canvasMain.getContext('2d')
const canvasNext = document.querySelector('#nextbrick')
const ctxNext = canvasNext.getContext('2d')
const scoreElement = document.querySelector('#score')
const levelElement = document.querySelector('#level')
const highScoreElement = document.querySelector('#highScore')

const gameParams = {
  rowsMain: 20,
  columnsMain: 10,
  rowsNext: 4,
  columnsNext: 4,
  squareSize: 30,
  emptySquare: 'white'
}  

const gameState = {
  interval: 500,
  isOver: false,
  currentBrick: null,
  nextBrick: null
}  

const boardMain = getBoard(
  gameParams.rowsMain,
  gameParams.columnsMain,
  gameParams.squareSize,
  gameParams.emptySquare,
  ctxMain
)

const boardNext = getBoard(
  gameParams.rowsNext,
  gameParams.columnsNext,
  gameParams.squareSize,
  gameParams.emptySquare,
  ctxNext
)

gameState.currentBrick = getRandomBrick(boardMain, 0, 3)
gameState.nextBrick = getRandomBrick(boardNext, 0, 0)

const score = getScoreManager()
highScoreElement.innerHTML = score.getHighScore()

function control(evt) {
  switch (evt.keyCode) {
    case 37:
      gameState.currentBrick.moveLeft()
      dropStart = Date.now()
      break
    case 38:
      gameState.currentBrick.rotate()
      dropStart = Date.now()
      break
    case 39:
      gameState.currentBrick.moveRight()
      dropStart = Date.now()
      break
    case 40:
      gameState.currentBrick.moveDown()
      dropStart = Date.now()
      break
  }
}
document.addEventListener('keydown', control)

const boards = [boardMain, boardNext]
boards.forEach(x => x.draw())
gameState.currentBrick.draw()
gameState.nextBrick.draw()

let dropStart = Date.now()
;(function play() {
  let now = Date.now()
  let delta = now - dropStart

  if (delta > gameState.interval) {
    dropStart = Date.now()
    let locked = gameState.currentBrick.moveDown()

    if (locked) {
      gameState.isOver = gameState.currentBrick.lock()

      gameState.nextBrick.undraw()
      gameState.currentBrick = gameState.nextBrick
      gameState.currentBrick.y = 3
      gameState.currentBrick.board = boardMain
      gameState.currentBrick.draw()
      gameState.nextBrick = getRandomBrick(boardNext, 0, 0)
      
      while (boardMain.hasFullRow()) {
        boardMain.deleteRow(boardMain.hasFullRow())

        let levelChanged = score.increasePoints()
        if (levelChanged) {
          gameState.interval = gameState.interval === 100
            ? gameState.interval
            : gameState.interval - 100
          levelElement.innerHTML = score.getLevel()
        }

        scoreElement.innerHTML = score.getPoints()
      }

      boards.forEach(x => x.draw())
      gameState.currentBrick.draw()
      gameState.nextBrick.draw()
    }
  }

  if (gameState.isOver) {
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
