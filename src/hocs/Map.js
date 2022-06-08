const stateWithEntity = editorState1.getCurrentContent().createEntity(
  'mention',
  'SEGMENTED',
  {
    mention: {id: 'foobar', name: '@foobar'},
  },
)
const entityKey = stateWithEntity.getLastCreatedEntityKey()
const stateWithText = Modifier.insertText(stateWithEntity, editorState1.getSelection(), 'foobar', null, entityKey)

const [editorState, setEditorState] = useState(() =>
EditorState.createWithContent(stateWithText)
);