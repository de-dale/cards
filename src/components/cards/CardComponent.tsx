import { useState } from 'react'
import { Button, Card } from 'react-bootstrap'
import { Card as CardModel } from '../../shared/types'
import './CardComponent.css'

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
  const [face, setFace] = useState(hidden ? 'back' : 'front')
  const flip = () => revealable && setFace(face === 'front' ? 'back' : 'front')

  return (
    <div className="flip-card" onDoubleClick={() => flip()} data-face={face}>
      <div className="flip-card-inner">
        <BackCard/>
        <FrontCard card={card} actions={actions}/>
      </div>
    </div>
  )
}

function BackCard() {
  return <Card className="flip-card-back">
    <Card.Header as="h5"> *** </Card.Header>
    <Card.Body> *** </Card.Body>
  </Card>
}

type CardFrontProps = {
  card: CardModel,
  actions?: Array<CardAction>,
}

function FrontCard({ card, actions = [] }: CardFrontProps) {
  return <Card className="flip-card-front">
    <Card.Header as="h5">{card.name}</Card.Header>
    <Card.Body style={{ overflow: 'auto' }}>
      <Card.Text>{card.content}</Card.Text>
    </Card.Body>
    {(0 < actions.length) && <Card.Footer>
      {actions.map((action, index) =>
        <Button size="sm" key={index}
                onClick={() => action.action()}
                aria-label={action.label}>
          {action.label}
        </Button>
      )}
    </Card.Footer>}
  </Card>
}