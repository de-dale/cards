import React, { useState } from 'react'
import { Button, Col, Container, Dropdown, DropdownButton, ListGroup, Offcanvas, Row } from 'react-bootstrap'
import { useAppDispatch, useAppSelector } from '../../app/hooks'

import {
  addDeckToLibrary,
  getFullDeck,
  importDeckFromUrlToLibrary,
  PlaygroundState,
  selectPlayground,
} from '../../features/playground/reducer'
import { Cards } from '../../shared/types'
import { PlaygroundTools } from './PlaygroundTools'
import { Library } from './Library'
import { Hand } from './Hand'
import { Graveyard } from './Graveyard'

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

const socialEncountersURL = 'https://raw.githubusercontent.com/de-dale/spherier/master/data/social-encounter.json'

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
            <PlaygroundTools/>
            <FullDeck deck={fullDeck}/>
          </Col>
          <Col md={2}>
            <DropdownButton title="Decks d'exemple">
              <Dropdown.Item onClick={() => dispatch(addDeckToLibrary(tarotDeck))}>Jeu de Tarot</Dropdown.Item>
              <Dropdown.Item onClick={() => dispatch(importDeckFromUrlToLibrary(socialEncountersURL))}>Sphérier - Rencontres Sociales</Dropdown.Item>
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
          <Library library={playground.library}/>
        </Col>
        <Col md={6}>
          <Hand hand={playground.hand}/>
        </Col>
        <Col md={3}>
          <Graveyard graveyard={playground.graveyard}/>
        </Col>
      </Row>
    </>
  )

}






