import { Cards } from '../../shared/types'
import { useAppDispatch } from '../../app/hooks'
import { Button, ButtonToolbar, Row } from 'react-bootstrap'
import { putBelowLibrary } from '../../features/playground/reducer'
import { CardComponent } from '../cards/CardComponent'
import React from 'react'

type GraveyardProps = {
  graveyard: Cards,
}

export function Graveyard({ graveyard }: GraveyardProps) {
  const dispatch = useAppDispatch()
  return (
    <>
      <h2>La Défausse : {graveyard.length}</h2>
      <ButtonToolbar>
        <Button size="sm"
                onClick={() => dispatch(putBelowLibrary())}
                aria-label="Remettre sous la pioche">
          Remettre sous la pioche
        </Button>
      </ButtonToolbar>
      <Row xs={1} md={1} className="g-4">
        {graveyard.map((card, index) =>
          <CardComponent key={index} card={card}/>
        )}
      </Row>
    </>)
}
