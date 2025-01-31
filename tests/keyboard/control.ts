import {setup} from '#testHelpers'

test('press [Home] in textarea', async () => {
  const {element, user} = setup<HTMLTextAreaElement>(
    `<textarea>foo\nbar\baz</textarea>`,
  )
  element.focus()
  element.setSelectionRange(2, 4)

  await user.keyboard('[Home]')

  expect(element).toHaveProperty('selectionStart', 0)
  expect(element).toHaveProperty('selectionEnd', 0)
})

test('press [Home] in contenteditable', async () => {
  const {element, user} = setup(
    `<div contenteditable="true">foo\nbar\baz</div>`,
  )
  element.focus()
  document.getSelection()?.setPosition(element.firstChild, 2)

  await user.keyboard('[Home]')

  const selection = document.getSelection()
  expect(selection).toHaveProperty('focusNode', element.firstChild)
  expect(selection).toHaveProperty('focusOffset', 0)
})

test('press [End] in textarea', async () => {
  const {element, user} = setup<HTMLTextAreaElement>(
    `<textarea>foo\nbar\baz</textarea>`,
  )
  element.focus()
  element.setSelectionRange(2, 4)

  await user.keyboard('[End]')

  expect(element).toHaveProperty('selectionStart', 10)
  expect(element).toHaveProperty('selectionEnd', 10)
})

test('press [End] in contenteditable', async () => {
  const {element, user} = setup(
    `<div contenteditable="true">foo\nbar\baz</div>`,
  )
  element.focus()
  document.getSelection()?.setPosition(element.firstChild, 2)

  await user.keyboard('[End]')

  const selection = document.getSelection()
  expect(selection).toHaveProperty('focusNode', element.firstChild)
  expect(selection).toHaveProperty('focusOffset', 10)
})

test('move cursor on [PageUp]', async () => {
  const {element, user} = setup<HTMLInputElement>(
    `<input value="foo bar baz"/>`,
  )
  element.focus()
  element.setSelectionRange(2, 4)

  await user.keyboard('[PageUp]')

  expect(element).toHaveProperty('selectionStart', 0)
  expect(element).toHaveProperty('selectionEnd', 0)
})

test('move cursor on [PageDown]', async () => {
  const {element, user} = setup<HTMLInputElement>(
    `<input value="foo bar baz"/>`,
  )
  element.focus()
  element.setSelectionRange(2, 4)

  await user.keyboard('[PageDown]')

  expect(element).toHaveProperty('selectionStart', 11)
  expect(element).toHaveProperty('selectionEnd', 11)
})

test('delete content per Delete', async () => {
  const {element, user} = setup<HTMLInputElement>(`<input value="abcd"/>`)
  element.focus()
  element.setSelectionRange(1, 2)

  await user.keyboard('[Delete]')

  expect(element).toHaveValue('acd')

  await user.keyboard('[Delete]')

  expect(element).toHaveValue('ad')
})

test('use [Delete] on number input', async () => {
  const {element, user} = setup(`<input type="number"/>`)

  await user.type(
    element,
    '1e-5[ArrowLeft][Delete]6[ArrowLeft][ArrowLeft][ArrowLeft][Delete][Delete]',
  )

  expect(element).toHaveValue(16)
})

test('use [Delete] on contenteditable', async () => {
  const {element, user} = setup(`<div contenteditable>foo bar baz</div>`)
  const text = element.firstChild as Text
  element.focus()
  document.getSelection()?.setBaseAndExtent(text, 1, text, 9)

  await user.keyboard('[Delete]')

  expect(element).toHaveTextContent('faz')
})

test('do not fire input events if delete content does nothing', async () => {
  const {element, getEvents, user} =
    setup<HTMLInputElement>(`<input type="foo"/>`)
  element.focus()
  element.setSelectionRange(3, 3)

  await user.keyboard('[Delete]')

  expect(getEvents('input')).toHaveLength(0)

  element.setSelectionRange(0, 0)
  element.readOnly = true

  await user.keyboard('[Delete]')

  expect(getEvents('input')).toHaveLength(0)
})
