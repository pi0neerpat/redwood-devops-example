import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import StatusCell from 'src/components/StatusCell'
import GamesWithFilterCell from 'src/components/GamesWithFilterCell'
const HomePage = () => {
  return (
    <>
      <MetaTags title="Home" description="Home page" />

      <h1>HomePage</h1>
      <p>
        Find me in <code>./web/src/pages/HomePage/HomePage.js</code>
      </p>
      <p>
        My default route is named <code>home</code>, link to me with `
        <Link to={routes.home()}>Home</Link>`
      </p>
      <StatusCell />
      <GamesWithFilterCell username="hikaru" />
    </>
  )
}

export default HomePage
