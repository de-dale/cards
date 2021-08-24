import { Cards } from '../../shared/types'

// A mock function to mimic making an async request for data
export function fetchDeck(cards: Cards) {
  return new Promise<{ data: Cards }>((resolve) =>
    setTimeout(() => resolve({ data: cards }), 500)
  )
}
