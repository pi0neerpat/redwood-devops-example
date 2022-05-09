import achievementsCalculator from '@treasure-chess/chess-achievements'
import fetch from 'node-fetch'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

import { parseGameFromChessDotCom } from 'src/lib/games/parsing'

const GAMES_PER_PAGE = 50

const fetchChessGames = async ({ username, year, month }) => {
  let monthString = month.toString()
  if (month.toString().length < 2) monthString = '0' + month
  const response = await fetch(
    `https://api.chess.com/pub/player/${username}/games/${year}/${monthString}`
  ).then((res) => {
    // logger.debug({ custom: res }, 'fetchChessGames')
    return res.json()
  })
  // logger.debug({ custom: response })
  return response.games || []
}

export const getTreasureCardColor = ({ game, username }) =>
  game.whiteUsername.toLowerCase() === username.toLowerCase()
    ? 'white'
    : 'black'

const getFullGameDetails = async ({
  game: rawGame,
  username,
  includeAchievements,
}) => {
  try {
    let game = parseGameFromChessDotCom(rawGame)
    const cardColor = getTreasureCardColor({ game, username })
    const { openingValue, score, achievements } = achievementsCalculator(
      game.pgn,
      cardColor
    )
    const achievementsList = achievements.map((item) => item.value)
    let winnerId
    if (game.winnerUsername === game.whiteUsername)
      winnerId = game.whiteUsername
    else if (game.winnerUsername === game.blackUsername)
      winnerId = game.blackUsername
    return {
      ...game,
      winnerId,
      cardColor,
      opening: openingValue,
      achievements: achievementsList,
      achievementScore: score,
    }
  } catch (e) {
    throw new Error(`Error getting full game details: ${e.message}`)
  }
}

export const getGamesWithFilter = async ({ username, filter, page = 0 }) => {
  const filterParams = new URLSearchParams(filter)
  let filterObj = {}
  // Convert text names to values
  for (var pair of filterParams.entries()) {
    filterObj[pair[0]] = pair[1]
  }
  const now = new Date()
  const year = filterObj.year || now.getFullYear()
  const month = filterObj.month || now.getMonth()
  // const month = filterObj.month === 'Any' ? null : filterObj.month || 0
  // const day = filterObj.day === 'Any' ? null : filterObj.day
  const games = await fetchChessGames({ username, year, month })
  logger.debug(`totalGames: ${games?.length}`)
  if (!games?.length) return { count: 0, games: [] }

  const filteredGames = games.filter((game) => {
    if (
      filterObj.username &&
      ![
        game.black.username.toLowerCase(),
        game.white.username.toLowerCase(),
      ].includes(filterObj.username)
    )
      return false
    if (filterObj?.outcome !== 'any') {
      let member = game.white
      if (game.black.username === username) member = game.black
      if (filterObj.outcome === 'won' && member.result !== 'win') return false
      if (filterObj.outcome === 'draw' && member.result !== 'draw') return false
      if (
        filterObj.outcome === 'lost' &&
        (member.result === 'win' || member.result === 'draw')
      )
        return false
    }
    return true
  })
  // logger.debug(`filteredGames: ${filteredGames.length}`)
  const count = filteredGames.length
  const sortedGames = filteredGames
    .sort((a, b) => b.end_time - a.end_time)
    .slice(page * GAMES_PER_PAGE, (page + 1) * GAMES_PER_PAGE)
  // logger.debug(
  //   `slice params ${page * GAMES_PER_PAGE}, ${(page + 1) * GAMES_PER_PAGE}`
  // )
  let fullGames = []
  await Promise.all(
    sortedGames.map(async (game) => {
      try {
        const fullGame = await getFullGameDetails({ game, username })
        fullGames.push(fullGame)
      } catch (e) {
        logger.error(e)
        // Do nothing
      }
    })
  )
  // logger.debug(`fullGames: ${fullGames.length}`)
  return {
    games: fullGames,
    count,
  }
}
