export const status = async () => {
  return {
    nodeEnvironment: process.env.NODE_ENV,
  }
}
