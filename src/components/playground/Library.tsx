import { Cards } from '../../shared/types'
import { useAppDispatch } from '../../app/hooks'
import { Button, ButtonToolbar, Row } from 'react-bootstrap'
import { draw, shuffleLibrary } from '../../features/playground/reducer'
import { CardComponent } from '../cards/CardComponent'
import React from 'react'

type LibraryProps = {
  library: Cards,
}

export function Library({ library }: LibraryProps) {
  const dispatch = useAppDispatch()
  return (
    <>
      <h2>Pioche : {library.length}</h2>
      <ButtonToolbar>
        <Button size="sm" className="me-2"
                onClick={() => dispatch(draw())}
                aria-label="Pioche">
          Pioche
        </Button>
        <Button size="sm" variant="primary"
                onClick={() => dispatch(shuffleLibrary())}
                aria-label="Mélanger">
          Mélanger
        </Button>
      </ButtonToolbar>
      <Row xs={1} md={1} className="g-4">
        {library.map((card, index) =>
          <CardComponent key={index}
                         card={card}
                         hidden
                         revealable/>
        )}
      </Row>
    </>)
}