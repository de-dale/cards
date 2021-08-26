import { Card, Cards } from '../../shared/types'

export function fetchDeck(deckUrl: string): Promise<Cards> {
  return fetch(deckUrl)
    .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText)
        }
        return response.json()
      }
    )
    .then(data => [...data].map(({ name, content }) => ({ name, content }) as Card))
}
