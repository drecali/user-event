import userEvent from '../'
import {addEventListener, setup} from './helpers/utils'

test('hover', () => {
  const {element, getEventSnapshot} = setup('<button />')

  userEvent.hover(element)
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: button

    button - pointerover
    button - pointerenter
    button - mouseover
    button - mouseenter
    button - pointermove
    button - mousemove
  `)
})

test('hover on disabled element', () => {
  const {element, getEventSnapshot} = setup('<button disabled />')

  userEvent.hover(element)
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: button

    button - pointerover
    button - pointerenter
    button - pointermove
  `)
})

test('no events fired on labels that contain disabled controls', () => {
  const {element, getEventSnapshot} = setup('<label><input disabled /></label>')

  userEvent.hover(element)
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: label

    label - pointerover
    label - pointerenter
    label - mouseover
    label - mouseenter
    label - pointermove
    label - mousemove
  `)
})

test('fires non-bubbling events on parents for hover', () => {
  // Doesn't use getEventSnapshot() because:
  // 1) We're asserting the events of both elements (not what bubbles to the outer div)
  // 2) We're asserting the order of these events in a single list as they're
  //     interleaved across two elements.
  const {element: div} = setup('<div><button></button></div>')
  const button = div.firstChild

  const calls = []
  function addListeners(el) {
    for (const event of [
      'mouseenter',
      'mouseover',
      'mouseleave',
      'mouseout',
      'pointerenter',
      'pointerover',
      'pointerleave',
      'pointerout',
    ]) {
      addEventListener(el, event, () => {
        calls.push(`${el.tagName}: ${event}`)
      })
    }
  }
  addListeners(div)
  addListeners(button)

  userEvent.hover(button)

  expect(calls.join('\n')).toMatchInlineSnapshot(`
    BUTTON: pointerover
    DIV: pointerover
    BUTTON: pointerenter
    BUTTON: mouseover
    DIV: mouseover
    BUTTON: mouseenter
  `)
})

test('fires non-bubbling events on parents for unhover', () => {
  // Doesn't use getEventSnapshot() because:
  // 1) We're asserting the events of both elements (not what bubbles to the outer div)
  // 2) We're asserting the order of these events in a single list as they're
  //     interleaved across two elements.
  const {element: div} = setup('<div><button></button></div>')
  const button = div.firstChild

  const calls = []
  function addListeners(el) {
    for (const event of [
      'mouseenter',
      'mouseover',
      'mouseleave',
      'mouseout',
      'pointerenter',
      'pointerover',
      'pointerleave',
      'pointerout',
    ]) {
      addEventListener(el, event, () => {
        calls.push(`${el.tagName}: ${event}`)
      })
    }
  }
  addListeners(div)
  addListeners(button)

  userEvent.unhover(button)

  expect(calls.join('\n')).toMatchInlineSnapshot(`
    BUTTON: pointerout
    DIV: pointerout
    BUTTON: pointerleave
    BUTTON: mouseout
    DIV: mouseout
    BUTTON: mouseleave
  `)
})

test('throws when hovering element with pointer-events set to none', () => {
  const {element} = setup(`<div style="pointer-events: none"></div>`)
  expect(() => userEvent.hover(element)).toThrowError(/unable to hover/i)
})

test('does not throws when hover element with pointer-events set to none and skipPointerEventsCheck is set', () => {
  const {element, getEventSnapshot} = setup(
    `<div style="pointer-events: none"></div>`,
  )
  userEvent.hover(element, undefined, {skipPointerEventsCheck: true})
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: div

    div - pointerover
    div - pointerenter
    div - mouseover
    div - mouseenter
    div - pointermove
    div - mousemove
  `)
})
