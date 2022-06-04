// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Router, Route, Private } from '@redwoodjs/router'
import Loader from 'src/components/Loader'

const Routes = () => {
  return (
    <Router>
      <Route path="/" page={HomePage} name="home" />
      <Route prerender notfound page={NotFoundPage} />
      <Private unauthenticated="home" whileLoadingAuth={Loader}>
        <Route path="/profile" page={ProfilePage} name="profile" />
      </Private>
    </Router>
  )
}

export default Routes
