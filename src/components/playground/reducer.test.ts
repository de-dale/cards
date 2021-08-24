import playgroundReducer, {
  PlaygroundState,
  draw,
  discardByIndex,
  addDeckToLibrary,
  putBelowLibrary, addCardToLibrary, discardAll, shuffleLibrary,
} from './reducer'
import { Card, Cards } from '../../shared/types'

const deck = [
  {
    name: `S'enquérir`,
    content: `Permet de s'intéresser à son interlocuteur`
  } as Card,
  {
    name: `Rassurer`,
    content: `Permet de rassurer l'interlocuteur`
  } as Card,
  {
    name: `Complimenter`,
    content: `Si votre ramage ressemble à votre plumage`
  } as Card
] as Cards

const initialState: PlaygroundState = {
  library: [],
  hand: [],
  battlefield: [],
  graveyard: [],
  stack: [],
  exile: [],
  command: [],
  status: 'idle'
}

describe('Playground', () => {

  it('initial state should have seven zones', () => {
    expect(playgroundReducer(undefined, { type: 'unknown' })).toEqual(expect.objectContaining({
      library: [],
      hand: [],
      battlefield: [],
      graveyard: [],
      stack: [],
      exile: [],
      command: [],
      status: 'idle',
    }))
  })

  describe('library', () => {
    it(`should be filled by given deck`, () => {
      const actual = playgroundReducer(undefined, addDeckToLibrary([{
        name: `S'enquérir`,
        content: `Permet de s'intéresser à son interlocuteur`
      }]))

      expect(actual.library).toContainEqual({
        name: `S'enquérir`,
        content: `Permet de s'intéresser à son interlocuteur`
      })
    })

    it(`should be filled by given card`, () => {
      const actual = playgroundReducer(undefined, addCardToLibrary({
        name: `S'enquérir`,
        content: `Permet de s'intéresser à son interlocuteur`
      }))

      expect(actual.library).toContainEqual({
        name: `S'enquérir`,
        content: `Permet de s'intéresser à son interlocuteur`
      })
    })

    it('should remove first card when drawn', () => {
      const actual = playgroundReducer({
        ...initialState,
        library: deck
      }, draw())

      expect(actual.library).not.toContainEqual({
        name: `S'enquérir`,
        content: `Permet de s'intéresser à son interlocuteur`
      })
    })

    it(`should be filled with whole graveyard when put below library`, () => {
      const actual = playgroundReducer({
        ...initialState,
        graveyard: deck
      }, putBelowLibrary())

      expect(actual.library).toEqual(expect.arrayContaining(deck))
    })

    it(`should keep library in order`, () => {
      const actual = playgroundReducer({
        ...initialState,
        library: [{
          name: 'Première carte de la pioche',
          content: 'Première carte de la pioche',
        }],
        graveyard: deck
      }, putBelowLibrary())

      expect(actual.library[0]).toEqual({
        name: 'Première carte de la pioche',
        content: 'Première carte de la pioche',
      })
    })

    it(`should keep same cards when shuffle`, () => {
      const actual = playgroundReducer({
        ...initialState,
        library: deck
      }, shuffleLibrary())

      expect(actual.library).toEqual(expect.arrayContaining(deck))
    })

  })

  describe('hand', () => {

    it(`should put first library's card in hand when draw`, () => {
      const actual = playgroundReducer({
        ...initialState,
        library: deck
      }, draw())

      expect(actual.hand).toContainEqual({
        name: `S'enquérir`,
        content: `Permet de s'intéresser à son interlocuteur`
      })
    })

    it(`should do not draw anything when library is empty`, () => {
      const actual = playgroundReducer({
        ...initialState,
        library: []
      }, draw())

      expect(actual.hand).toHaveLength(0)
    })

    it(`should remove selected card when discardByIndex`, () => {
      const actual = playgroundReducer({
        ...initialState,
        hand: deck
      }, discardByIndex(1))

      expect(actual.hand).not.toContainEqual({
        name: `Rassurer`,
        content: `Permet de rassurer l'interlocuteur`
      })
    })

    it(`should be empty when discardAll`, () => {
      const actual = playgroundReducer({
        ...initialState,
        hand: deck
      }, discardAll())

      expect(actual.hand).toHaveLength(0)
    })

  })

  describe('graveyard', () => {

    it(`should put selected hand's card in graveyard when discardByIndex`, () => {
      const actual = playgroundReducer({
        ...initialState,
        hand: deck
      }, discardByIndex(1))

      expect(actual.graveyard).toContainEqual({
        name: `Rassurer`,
        content: `Permet de rassurer l'interlocuteur`
      })
    })

    it(`should be filled with whole hand when discard all`, () => {
      const actual = playgroundReducer({
        ...initialState,
        hand: deck
      }, discardAll())

      expect(actual.graveyard).toEqual(expect.arrayContaining(deck))
    })

    it(`is empty when put below to library`, () => {
      const actual = playgroundReducer({
        ...initialState,
        graveyard: deck
      }, putBelowLibrary())

      expect(actual.graveyard).toHaveLength(0)
    })

  })

})
