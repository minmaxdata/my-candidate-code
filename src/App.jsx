import * as React from 'react'
import useCardSearch from './useCardSearch'
import '../assets/index.css'

const Card = ({ card, cb }) => {
  const { id, name, text, imageUrl, set, type } = card
  return (
    <div className="card" ref={cb}>
      <img alt={name} src={imageUrl} className="card__artwork" />

      <div className="card__details">
        <h2>{name}</h2>
        <p className="card__desc">{text}</p>
        <p className="card__set">SET: {set.name}</p>
        <p className="card__type">TYPE: {type}</p>
      </div>
    </div>
  )
}
export default function App() {
  const [query, setQuery] = React.useState('')
  const [page, setPage] = React.useState(1)

  const { cards, hasMore, loading, error } = useCardSearch(query, page)

  const observer = React.useRef()
  const lastCardElementRef = React.useCallback(
    (node) => {
      if (loading) return
      if (observer.current) observer.current.disconnect
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1)
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, hasMore],
  )
  function handleSearch(e) {
    setQuery(e.target.value)
    setPage(1) //reset page
  }
  useCardSearch(query, page)
  return (
    <>
      <input type="text" value={query} onChange={handleSearch}></input>
      <div className="cards">
        {cards.map((card, index) => {
          return cards.length === index + 1 ? (
            <Card card={card} key={card.id} cb={lastCardElementRef} />
          ) : (
            <Card card={card} key={card.id} />
          )
        })}
      </div>
      <div className="row">
        <div>{loading && 'loading...'}</div>
        <div>{error && 'error'}</div>
      </div>
    </>
  )
}
