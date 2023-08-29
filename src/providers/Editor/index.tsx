'use client';
import {createContext, useContext, useCallback, useMemo, useState, useEffect} from 'react'
import {LexicalEditor} from 'lexical'
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

type EditorMutations = {
  createEditor: (id: string, editor: LexicalEditor) => void
  deleteEditor: (id: string) => void
}

type EditorMap = Partial<Record<string, LexicalEditor>>

type EditorContextValue = EditorMutations & {
  editors: EditorMap
}

const EditorContext = createContext<EditorContextValue | null>(null)

const EditorProvider = (props: React.PropsWithChildren<{}>) => {
  const [editors, setEditors] = useState<EditorMap>({})

  const createEditor = useCallback((id: string, editor: LexicalEditor) => {
    setEditors((editors) => {
      if (editors[id]) return editors
      return {...editors, [id]: editor}
    })
  }, [])

  const deleteEditor = useCallback((id: string) => {
    setEditors((editors) => {
      if (!editors[id]) return editors
      const {[id]: _, ...rest} = editors
      return rest
    })
  }, [])

  const value = useMemo(() => {
    return {
      editors,
      createEditor,
      deleteEditor
    }
  }, [
    editors,
    createEditor,
    deleteEditor
  ])

  return (
    <EditorContext.Provider value={value}>
      {props.children}
    </EditorContext.Provider>
  )
}

const useEditorContext = (): EditorMutations => {
  const context = useContext(EditorContext)
  if (context === null) {
    throw new Error(
      `The \`useEditors\` hook must be used inside the <EditorProvider> component's context.`
    )
  }
  const {createEditor, deleteEditor} = context
  return {createEditor, deleteEditor}
}

const useEditor = (id: string): LexicalEditor | null => {
  const context = useContext(EditorContext)
  if (context === null) {
    throw new Error(
      `The \`useEditor\` hook must be used inside the <EditorProvider> component's context.`
    )
  }
  const editor = context.editors[id];
  // const [_editor] = useLexicalComposerContext();
  return editor || null;
}

const EditorRegister = ({id}: { id: string }) => {
  const [editor] = useLexicalComposerContext();
  const context = useEditorContext();
  useEffect(() => {
    if (editor) {
      context.createEditor(id, editor);
    }
    return () => {
      context.deleteEditor(id);
    }
  }, [id]);
  return null;
}

export {
  EditorProvider,
  useEditor,
  EditorRegister
}
