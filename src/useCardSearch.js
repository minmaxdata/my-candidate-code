import { useEffect, useState } from 'react'
import axios from 'axios'

export default function useCardSearch(query, page) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [cards, setCards] = useState([])
  const [hasMore, setHasMore] = useState(false)
  const [savedCards, setSavedCards] = useState([])
  const db_name = 'mycards';

  useEffect(() => {
    setCards([])
  }, [query])

  useEffect(()=> {
    const local_db =  window.localStorage.getItem(db_name)
    let cardids = []
    if (local_db) {
      cardids = JSON.parse(local_db)
    }
    const saved = cardids.map(id => cards.filter(card => card.id === id))
    setSavedCards(saved)
  },[cards])

  useEffect(() => {
    setError(false)
    setLoading(true)
    let cancel
    axios({
      method: 'GET',
      url: 'https://api.elderscrollslegends.io/v1/cards',
      params: { name: query, pageSize: 20, page: page },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((response) => {
        setCards((prevCards) => {
          return [...prevCards, ...response.data.cards]
        })
        setLoading(false)
        setHasMore(response.data.cards.length > 0)
      })
      .catch((err) => {
        if (axios.isCancel(err)) return
        setError(true)
        console.log(err)
      })
    return () => cancel()
  }, [query, page])
  return { loading, error, cards, hasMore }
}
