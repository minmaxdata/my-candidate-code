import * as React from 'react'
import useCardSearch from './useCardSearch'
import '../assets/index.css'

const Card = ({ card, cb }) => {
  const { id, name, text, imageUrl, set, type } = card
  const db_name = 'mycards';
  let cards;

  const saveMyCard = (card__id) => {
    const local_db =  window.localStorage.getItem(db_name)

    if(!local_db) {
      cards = []
    } else {
      cards = JSON.parse(local_db)
    }
    let hascard = cards.indexOf(card__id)
    if(hascard === -1) {
      cards.push(card__id)
      window.localStorage.setItem(db_name,JSON.stringify(cards) );
    }
  }

  const inLocalStorage = (card__id) => {
    const local_db =  window.localStorage.getItem(db_name)
    if (local_db) {
      const cards = JSON.parse(local_db)
      if(cards.indexOf(card__id) !== -1) {
        return true
      }
    }
    
    return false
  }

  return (
    <div className="card" ref={cb}>
      <img alt={name} src={imageUrl} className="card__artwork" />

      <div className="card__details">
        <h2 className="yellow__color">{name}</h2>
        <p>{text}</p>
        <p>Set Name: {set.name}</p>
        <p>Type: {type}</p>
      </div>
      {inLocalStorage(id) ? 
      <div className="yellow__color bg__black"> in my saved collection</div> 
      :
      <button className="yellow__color bg__black" onClick={() => saveMyCard(id)}> I own this! </button>}
    </div>
  )
}
export default function App() {
  const [query, setQuery] = React.useState('')
  const [page, setPage] = React.useState(1)
  const [saved, setSaved] = React.useState(false)


  const { cards, savedCards, hasMore, loading, error } = useCardSearch(query, page)

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
  const displaySavedCards = () => {
    setSaved(true)
  }
  useCardSearch(query, page)
  return (
    <>
      <h1 className="yellow__color">Candidate: Karen McAdams</h1>
      <div className="card">
        <label className="yellow__color">Search By Name:</label>
        <input type="text" value={query} onChange={handleSearch}></input>
      </div>
      <div className="card"> 
        <button className="yellow__color bg__black" onClick = {()=> displaySavedCards()}>Display Saved Collection</button>
      </div>

      <div className="cards">
        {!saved && cards.map((card, index) => {
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
