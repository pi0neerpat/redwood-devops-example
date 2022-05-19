import { getGamesWithFilter } from 'src/lib/games'

export const gamesWithFilter = async ({ username, filter, page }) =>
  getGamesWithFilter({
    username,
    filter,
    page,
  })
