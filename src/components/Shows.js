import Helmet from 'preact-helmet'
import Preact, { h } from 'preact' /** @jsx h */
import PushPermissionToggle from './PushPermissionToggle'
import Show from './Show'
import getShows from '../getShows'

// const shows = [
//   {
//     date: 'May 26 2017',
//     location: 'George, WA, United States',
//     venue: "Smith's Olde Bar",
//     link: 'https://www.facebook.com/events/1896051557318043/'
//   },
//   {
//     date: 'Jun 24 2017',
//     location: 'Athens, GA',
//     venue: 'AthFest',
//     link: 'https://www.facebook.com/events/393752004323423/'
//   }
// ]

const li = props =>
  <li class='show'>
    <Show {...props} />
  </li>
const Spinner = () =>
  <div class='loading center-contents'>
    <p>loading shows</p>
    <div class='sk-rotating-plane' />
  </div>
const showList = state => {
  if (state.shows) {
    return (<div>
      <PushPermissionToggle />
      <ol class='shows'>{state.shows.map(li)}</ol>
    </div>)
  } else {
    return <Spinner />
  }
}

const awaitShows = getShows()

class Shows extends Preact.Component {
  componentWillMount () {
    awaitShows.then(shows => this.setState({ shows }))
  }
  render (props, state) {
    state = state || {}
    return (<main class='container'>
      <Helmet title='Shows | Partials' />
      {showList(state)}
    </main>)
  }
}

export default Shows
