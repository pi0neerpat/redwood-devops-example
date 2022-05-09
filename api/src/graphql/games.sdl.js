export const schema = gql`
  type Game {
    id: String!
    outcome: String!
    blackRating: Int!
    whiteRating: Int!
    timeControl: String!
    endTime: DateTime!
    event: String!
    moves: String!
    moveCount: Int!
    ruleVariant: String!
    externalUrl: String
    opening: String!
    cardColor: String!
    achievements: [String!]
  }

  type GamesWithFilterResponse {
    games: [Game!]!
    count: Int!
  }
  type Query {
    gamesWithFilter(
      username: String!
      filter: String
      page: Int
    ): GamesWithFilterResponse! @skipAuth
  }
`
