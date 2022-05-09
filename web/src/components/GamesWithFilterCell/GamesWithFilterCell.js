export const QUERY = gql`
  query FindGamesWithFilterQuery(
    $username: String!
    $filter: String
    $page: Int
  ) {
    gamesWithFilter: gamesWithFilter(
      username: $username
      filter: $filter
      page: $page
    ) {
      count
      games {
        id
        externalUrl
        outcome
        opening
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({ gamesWithFilter, username }) => {
  const { games, count } = gamesWithFilter
  return (
    <div>
      {username}'s games for this month: {count}
      <br />
      {games.map((game) => (
        <>
          <a href={game.externalUrl}>
            {game.opening} - {game.outcome}
          </a>
          <br />
        </>
      ))}
      ...
    </div>
  )
}
