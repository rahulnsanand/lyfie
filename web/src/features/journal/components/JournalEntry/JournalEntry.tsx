import "./JournalEntry.css";
import {$getRoot, $getSelection} from 'lexical';
import {useEffect} from 'react';

import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import JournalToolbar from "../JournalToolbar";
import JournalEditor from "../JournalEditor";

// ✅ IMPORT THE NODES
import { ListNode, ListItemNode } from "@lexical/list";

interface JournalEntryProps {
  date: string;
  editorState: string | null;
}

export default function JournalEntry({
  date,
  editorState,
}: JournalEntryProps) {
  const dateObj = new Date(date);
  const theme = {
    // Theme styling goes here
    //...
  }

  // Catch any errors that occur during Lexical updates and log them
  // or throw them as needed. If you don't throw them, Lexical will
  // try to recover gracefully without losing user data.
  function onError(error) {
    console.error(error);
  }

  const initialConfig = {
        namespace: 'MyEditor',
        nodes: [QuoteNode, HeadingNode],
        theme,
        editorState(editor) {
            editor.update($initialEditorState, {tag: HISTORY_MERGE_TAG});
        },
        // This is the default when using Lexical Extension
        onError(err) {
            throw err;
        },
  };

  const handleChange = (state: EditorState) => {
    // later:
    // JSON.stringify(state.toJSON())
  };

  return (
    <section className="journal-entry">
      <header className="entry-header">
        {dateObj.toLocaleDateString(undefined, {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </header>

      <LexicalComposer initialConfig={initialConfig}>
        <RichTextPlugin
            contentEditable={
            <ContentEditable
                aria-placeholder={'Enter some text...'}
                placeholder={<div>Enter some text...</div>}
            />
            }
            ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
      </LexicalComposer>
    </section>
  );
}
