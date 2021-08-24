import React, { FormEvent, useState } from 'react'
import {
  Button,
  ButtonToolbar,
  Card,
  Col,
  Container,
  DropdownButton,
  Form,
  ListGroup,
  Offcanvas,
  Row
} from 'react-bootstrap'
import { useAppDispatch, useAppSelector } from '../../app/hooks'

import {
  addCardToLibrary, addDeckToLibrary,
  discardAll,
  discardByIndex,
  draw,
  getFullDeck,
  PlaygroundState,
  putBelowLibrary,
  selectPlayground,
  shuffleLibrary,
} from './reducer'
import { Card as CardModel, Cards } from '../../shared/types'
import { Dropdown } from 'react-bootstrap'

const tarotDeck = [
  {
    name: 'Le Fou',
    content: 'Le Fou est une des seules cartes sans numéro dans la plupart des variantes du tarot de Marseille'
  },
  {
    name: 'Le Bateleur',
    content: 'Le Bateleur est la première carte du tarot de Marseille. Elle suit peut-être la carte sans numéro Le Mat. Sa lame figure un jeune homme coiffé d\'un large chapeau (en forme de lemniscat) se tenant debout devant une table sur laquelle sont disposés différents objets pour réaliser des tours de passe passe.'
  },
  {
    name: 'La Papesse',
    content: 'La Papesse est la deuxième carte du tarot de Marseille.'
  },
  {
    name: 'L\'Impératrice',
    content: 'L\'Impératrice est la troisième carte du tarot de Marseille.'
  },
  {
    name: 'L\'Empereur ',
    content: 'L\'Empereur est le 4e arcane des 22 arcanes majeurs du tarot de Marseille.'
  }
]

export function Playground() {
  const playground = useAppSelector(selectPlayground)

  const dispatch = useAppDispatch()
  const fullDeck = getFullDeck(playground)

  return (
    <>
      <h1>Playground</h1>
      <Container fluid>
        <Row>
          <Col>
            <Tools/>
            <FullDeck deck={fullDeck}/>
          </Col>
          <Col md={2}>
            <DropdownButton title="Decks d'exemple">
              <Dropdown.Item onClick={() => dispatch(addDeckToLibrary(tarotDeck))}>Jeu de Tarot</Dropdown.Item>
            </DropdownButton>
          </Col>
        </Row>
        <Row>
          <Col>
            <InnerPlayground playground={playground}/>
          </Col>
        </Row>
      </Container>
    </>
  )
}

function Tools() {
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <>
      <Button variant="primary" className="me-2" onClick={handleShow}>
        Outils
      </Button>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Outils</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <CreateCardForm close={() => handleClose()}/>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

type CardFormProps = {
  close: Function
}

function CreateCardForm({ close }: CardFormProps) {
  const [validated, setValidated] = useState(false)
  const [end, setEnd] = useState(false)
  const dispatch = useAppDispatch()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget
    event.preventDefault()
    if (!form.checkValidity()) {
      event.stopPropagation()
    } else {
      dispatch(addCardToLibrary({
        name: form['cardName'].value,
        content: form['cardContent'].value,
      }))
      end && close()
    }
    setEnd(false)
    setValidated(true)
  }

  return (
    <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e)}>
      <Form.Label>Créer une carte</Form.Label>
      <Form.Control
        id="cardName"
        required
        type="text"
        placeholder="Nom de la carte"/>
      <Form.Control.Feedback type="invalid">Une carte doit avoir un nom</Form.Control.Feedback>
      <Form.Control as="textarea" rows={3} className="mt-1"
                    id="cardContent"
                    required
                    style={{ height: '100px' }}
                    placeholder="Effets de la carte"/>
      <Form.Control.Feedback type="invalid">Une carte doit avoir des effets</Form.Control.Feedback>
      <Button type="submit" className="mt-3 me-2">Créer</Button>
      <Button type="submit" className="mt-3" onClick={() => setEnd(true)}>Créer et fermer</Button>
    </Form>
  )
}

type DeckProps = {
  deck: Cards,
}

function FullDeck({ deck }: DeckProps) {
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        {show ? 'Masquer le Deck' : 'Montrer le deck'}
      </Button>

      <Offcanvas show={show} onHide={handleClose} placement={'end'}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Deck Complet : {deck.length}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ListGroup>
            {deck.map((card, index) =>
              <ListGroup.Item key={index}>
                <strong>{card.name}</strong>
                <div>{card.content}</div>
              </ListGroup.Item>
            )}
          </ListGroup>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

type InnerPlaygroundProps = {
  playground: PlaygroundState,
}

function InnerPlayground({ playground }: InnerPlaygroundProps) {
  return (
    <>
      <Row>
        <Col md={3}>
          <LibraryComponent library={playground.library}/>
        </Col>
        <Col md={6}>
          <HandComponent hand={playground.hand}/>
        </Col>
        <Col md={3}>
          <GraveyardComponent graveyard={playground.graveyard}/>
        </Col>
      </Row>
    </>
  )

}

type LibraryProps = {
  library: Cards,
}

function LibraryComponent({ library }: LibraryProps) {
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


type HandProps = {
  hand: Cards,
}

function HandComponent({ hand }: HandProps) {
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

type GraveyardProps = {
  graveyard: Cards,
}

function GraveyardComponent({ graveyard }: GraveyardProps) {
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

function CardComponent({ card, actions = [], hidden = false, revealable = false }: CardProps) {
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