import { Cards } from '../../shared/types'
import { useAppDispatch } from '../../app/hooks'
import { Button, ButtonToolbar, Row } from 'react-bootstrap'
import { discardAll, discardByIndex } from '../../features/playground/reducer'
import { CardComponent } from '../cards/CardComponent'
import React from 'react'

type HandProps = {
  hand: Cards,
}

export function Hand({ hand }: HandProps) {
  const dispatch = useAppDispatch()
  return (
    <>
      <h2>La Main : {hand.length}</h2>
      <ButtonToolbar>
        <Button size="sm" variant="primary"
                onClick={() => dispatch(discardAll())}
                aria-label="Défausser la main">
          Défausser la main
        </Button>
      </ButtonToolbar>
      <Row xs={1} md={3} className="g-4">
        {hand.map((card, index) =>
          <CardComponent key={index} card={card} actions={[
            {
              label: 'Défausser',
              action: () => dispatch(discardByIndex(index))
            }
          ]}/>
        )}
      </Row>
    </>)
}