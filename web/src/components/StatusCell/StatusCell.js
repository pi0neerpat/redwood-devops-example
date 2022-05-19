export const QUERY = gql`
  query GetStatusQuery {
    status {
      nodeEnvironment
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({ status }) => {
  return <div>{`nodeEnvironment: ${status.nodeEnvironment}`}</div>
}
