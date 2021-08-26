import React, { useState } from 'react'
import { Button, Card, Col } from 'react-bootstrap'
import { Card as CardModel } from '../../shared/types'

type CardAction = {
  label: string,
  action: Function,
}

type CardProps = {
  card: CardModel,
  actions?: Array<CardAction>,
  hidden?: boolean,
  revealable?: boolean
}

export function CardComponent({ card, actions = [], hidden = false, revealable = false }: CardProps) {
  const [show, setShow] = useState(!hidden)
  return (
    <>
      <Col>
        {!show && <Card style={{ width: '18rem', height: '12rem' }}>
          <Card.Header as="h5"> *** </Card.Header>
          <Card.Body> *** </Card.Body>
          <Card.Footer>
            {revealable && <Button size="sm" variant="secondary"
                                   onClick={() => setShow(!show)}
                                   aria-label="Révéler">
              Révéler
            </Button>}
          </Card.Footer>
        </Card>}
        {show && <Card style={{ width: '18rem', height: '12rem' }}>
          <Card.Header as="h5">{card.name}</Card.Header>
          <Card.Body style={{ overflow: 'auto' }}>
            <Card.Text>{card.content}</Card.Text>
          </Card.Body>
          {(0 < actions.length || revealable) && <Card.Footer>
            {actions.map((action, index) =>
              <Button size="sm" key={index}
                      onClick={() => action.action()}
                      aria-label={action.label}>
                {action.label}
              </Button>
            )}
            {revealable && <Button size="sm" variant="secondary"
                                   onClick={() => setShow(!show)}
                                   aria-label="Masquer">
              Masquer
            </Button>}
          </Card.Footer>}
        </Card>}
      </Col>
    </>)
}