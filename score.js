function getScoreManager() {
  const SCORE_STEP = 10
  const LEVEL_STEP = 100
  let points = 0
  let level = 1
  let nextLevel = 100

  function increasePoints() {
    points += SCORE_STEP
    let levelChanged = false

    if (points >= nextLevel) {
      level += 1
      nextLevel += LEVEL_STEP
      levelChanged = true
    }

    return levelChanged
  }

  function getPoints() {
    return points
  }

  function getLevel() {
    return level
  }

  function setHighScore(highScore) {
    localStorage.setItem('highScore', JSON.stringify(highScore))
  }

  function getHighScore() {
    return Number(localStorage.getItem('highScore')) || 0
  }

  function resetHighScore() {
    localStorage.setItem('highScore', JSON.stringify(0))
  }

  return {
    increasePoints,
    getPoints,
    getLevel,
    setHighScore,
    getHighScore,
    resetHighScore
  }
}
