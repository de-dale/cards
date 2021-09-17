import { createAsyncThunk, createSlice, Draft, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { fetchDeck } from './loadDeckAPI'
import { Card, Cards } from '../../shared/types'

export interface PlaygroundState {
  library: Cards;
  hand: Cards;
  battlefield: Cards;
  graveyard: Cards;
  stack: Cards;
  exile: Cards;
  command: Cards;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: PlaygroundState = {
  library: [] as Cards,
  hand: [] as Cards,
  battlefield: [] as Cards,
  graveyard: [] as Cards,
  stack: [] as Cards,
  exile: [] as Cards,
  command: [] as Cards,
  status: 'idle',
}

export const importDeckFromUrlToLibrary = createAsyncThunk(
  'playground/loadLibrary',
  async (deckUrl: string, thunkAPI) => {
    const deck: Cards = await fetchDeck(deckUrl)
    thunkAPI.dispatch(addDeckToLibrary(deck))
  }
)

const shuffleArray = (array: Array<any>) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
}

export const playgroundSlice = createSlice({
  name: 'playground',
  initialState,
  reducers: {
    draw: (playground: Draft<PlaygroundState>) => {
      if (playground.library.length === 0) {
        return
      }
      const [cardToDraw, ...remainingLibrary] = playground.library
      playground.hand.push(cardToDraw)
      playground.library = [...remainingLibrary]
    },
    addDeckToLibrary: (playground: Draft<PlaygroundState>, action: PayloadAction<Cards>) => {
      playground.library = playground.library.concat(action.payload)
    },
    addCardToLibrary: (playground: Draft<PlaygroundState>, action: PayloadAction<Card>) => {
      playground.library.push(action.payload)
    },
    discardAll: (playground: Draft<PlaygroundState>) => {
      playground.graveyard = playground.graveyard.concat(playground.hand)
      playground.hand = []
    },
    discardByIndex: (playground: Draft<PlaygroundState>, action: PayloadAction<number>) => {
      const cardToDiscard: Cards = playground.hand.splice(action.payload, 1)
      playground.graveyard = playground.graveyard.concat(cardToDiscard)
    },
    putBelowLibrary: (playground: Draft<PlaygroundState>) => {
      playground.library = playground.library.concat(playground.graveyard)
      playground.graveyard = []
    },
    shuffleLibrary: (playground: Draft<PlaygroundState>) => {
      shuffleArray(playground.library)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(importDeckFromUrlToLibrary.pending, (playground) => {
        playground.status = 'loading'
      })
      .addCase(importDeckFromUrlToLibrary.fulfilled, (playground, action) => {
        playground.status = 'idle'
      })
  },
})

export const getFullDeck = (playground: PlaygroundState) => playground.library
  .concat(playground.hand)
  .concat(playground.battlefield)
  .concat(playground.graveyard)
  .concat(playground.stack)
  .concat(playground.exile)
  .concat(playground.command)

export const {
  addCardToLibrary,
  addDeckToLibrary,
  discardAll,
  discardByIndex,
  draw,
  putBelowLibrary,
  shuffleLibrary
} = playgroundSlice.actions

export const selectPlayground = (state: RootState) => state.playground

export default playgroundSlice.reducer
