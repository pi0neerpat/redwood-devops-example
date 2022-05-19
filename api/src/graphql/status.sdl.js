export const schema = gql`
  type Status {
    nodeEnvironment: String
  }

  type Query {
    status: Status! @skipAuth
  }
`
