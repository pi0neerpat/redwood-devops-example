const countMoves = (moves) => {
  return Math.round(moves.trim().split(' ').length / 2)
}

const parsePgn = (pgn) => {
  let black
  let white
  let winner = 'white'
  let eventName
  let moves
  let timeControl
  pgn.split(/\n/).map((line) => {
    if (line.includes('[Black ')) black = line.split(`"`)[1]
    if (line.includes('[White ')) white = line.split(`"`)[1]
    if (line.includes('[Event ')) eventName = line.split(`"`)[1]
    let winnerRaw
    if (line.includes('[Result ')) winnerRaw = line.split(`"`)[1]
    if (winnerRaw === '0-1') winner = 'black'
    else if (winnerRaw === '1/2-1/2') winner = 'draw'
    if (line.match(/1./))
      moves = line
        .split(/[0-21/2]+-/)[0]
        .replace(/\{.+?\} /g, '') // remove clock time
        .trim()
    if (line.includes('[TimeControl ')) timeControl = line.split(`"`)[1]
  })

  return {
    black,
    white,
    winner,
    event: eventName,
    moves,
    moveCount: countMoves(moves),
    timeControl,
  }
}

const getGameRuleVariant = (game) => {
  if (game.rules === 'chess') return 'Standard'
  return game.rules.replace(/^\w/, (c) => c.toUpperCase())
}

export const parseGameFromChessDotCom = (game) => {
  const { timeControl, moveCount, moves, winner, event } = parsePgn(game.pgn)
  const splitUrl = game.url.split('/')
  const id = splitUrl[splitUrl.length - 1]
  let winnerUsername
  if (winner === 'white') winnerUsername = game.white.username
  if (winner === 'black') winnerUsername = game.black.username
  return {
    id,
    pgn: game.pgn,
    tcn: game.tcn,
    blackRating: game.black.rating,
    whiteRating: game.white.rating,
    timeControl,
    endTime: new Date(game.end_time * 1000),
    outcome: winner,
    moves,
    moveCount,
    event,
    ruleVariant: getGameRuleVariant(game),
    blackUsername: game.black.username,
    whiteUsername: game.white.username,
    winnerUsername,
    externalUrl: game.url,
  }
}
