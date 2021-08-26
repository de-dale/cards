import React, { FormEvent, useState } from 'react'
import { Button, Form, Offcanvas } from 'react-bootstrap'
import { useAppDispatch } from '../../app/hooks'
import { addCardToLibrary, importDeckFromUrlToLibrary } from '../../features/playground/reducer'

export function PlaygroundTools() {
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
          <ImportDeckForm close={() => handleClose()}/>
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
    <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e)} className="mt-3">
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

type ImportDeckFormProps = {
  close: Function
}

function ImportDeckForm({ close }: ImportDeckFormProps) {
  const [validated, setValidated] = useState(false)
  const [end, setEnd] = useState(false)
  const dispatch = useAppDispatch()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget
    event.preventDefault()
    if (!form.checkValidity()) {
      event.stopPropagation()
    } else {
      const deckUrl = form['deckUrl'].value
      dispatch(importDeckFromUrlToLibrary(deckUrl))
      end && close()
    }
    setEnd(false)
    setValidated(true)
  }

  return (
    <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e)} className="mt-3">
      <Form.Label>Importer un deck existant</Form.Label>
      <Form.Control
        id="deckUrl"
        required
        type="text"
        placeholder="URL vers le deck à charger"/>
      <Form.Control.Feedback type="invalid">Une carte doit avoir un nom</Form.Control.Feedback>
      <Button type="submit" className="mt-3 me-2">Importer</Button>
      <Button type="submit" className="mt-3" onClick={() => setEnd(true)}>Importer et fermer</Button>
    </Form>
  )
}