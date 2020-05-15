import * as React from 'react'
import useCardSearch from './useCardSearch'
import '../assets/index.css'

const Card = ({ card, cb }) => {
  const { id, name, text, imageUrl, set, type } = card
  return (
    <div className="card" ref={cb} key={id}>
      <div className="card-body">
        <div>{set.name}</div>
        <div>{type}</div>
        <img alt={name} src={imageUrl} className="card-img-top" />
      </div>
      <div className="card-footer">
        <p className="card-text text-center text-capitalize text-primary">
          {text}
        </p>
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
      <div id="cards">
        <div className="row">
          <input type="text" value={query} onChange={handleSearch}></input>
        </div>
        <div className="row">
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
      </div>
    </>
  )
}
