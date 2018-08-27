function tetrisControl(evt) {
  switch (evt.keyCode) {
    case 37:
      tetrisAPI.state.currentBrick.moveLeft()
      dropStart = Date.now()
      break
    case 38:
      tetrisAPI.state.currentBrick.rotate()
      dropStart = Date.now()
      break
    case 39:
      tetrisAPI.state.currentBrick.moveRight()
      dropStart = Date.now()
      break
    case 40:
      tetrisAPI.state.currentBrick.moveDown()
      dropStart = Date.now()
      break
  }
}
document.addEventListener('keydown', tetrisControl)

let dropStart = Date.now()

;(function play() {
  let now = Date.now()
  let delta = now - dropStart

  if (delta > tetrisAPI.state.interval) {
    dropStart = Date.now()
    let locked = tetrisAPI.state.currentBrick.moveDown()

    if (locked) {
      tetrisAPI.state.isOver = tetrisAPI.state.currentBrick.lock()

      tetrisAPI.state.nextBrick.undraw()
      tetrisAPI.state.currentBrick = tetrisAPI.state.nextBrick
      tetrisAPI.state.currentBrick.y = 3
      tetrisAPI.state.currentBrick.board = tetrisAPI.boards[0]
      tetrisAPI.state.currentBrick.draw()
      tetrisAPI.state.nextBrick = getRandomBrick(tetrisAPI.boards[1], 0, 0)

      while (tetrisAPI.boards[0].hasFullRow()) {
        tetrisAPI.boards[0].deleteRow(tetrisAPI.boards[0].hasFullRow())

        let levelChanged = tetrisAPI.state.score.increasePoints()
        if (levelChanged) {
          tetrisAPI.state.interval = tetrisAPI.state.interval === 100
            ? tetrisAPI.state.interval
            : tetrisAPI.state.interval - 100
          tetrisAPI.html.levelElement.innerHTML = tetrisAPI.state.score.getLevel()
        }

        tetrisAPI.html.scoreElement.innerHTML = tetrisAPI.state.score.getPoints()
      }

      tetrisAPI.boards.forEach(x => x.draw())
      tetrisAPI.state.currentBrick.draw()
      tetrisAPI.state.nextBrick.draw()
    }
  }

  if (tetrisAPI.state.isOver) {
    document.removeEventListener('keydown', tetrisControl)

    if (tetrisAPI.state.score.getHighScore() < tetrisAPI.state.score.getPoints()) {
      tetrisAPI.state.score.setHighScore(tetrisAPI.state.score.getPoints())
      tetrisAPI.html.highScoreElement.innerHTML = tetrisAPI.state.score.getHighScore()
    }

    alert('Game Over')
  } else {
    requestAnimationFrame(play)
  }

})()
