import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { EditorState } from "lexical";

export default function JournalEditor({
  onChange,
}: {
  onChange: (state: EditorState) => void;
}) {
  return (
    <div className="editor-shell">
      <RichTextPlugin
        contentEditable={<ContentEditable className="journal-editor-root" />}
        placeholder={
          <div className="editor-placeholder">
            Start writing your thoughts…
          </div>
        }
        ErrorBoundary={() => null}
      />
      <HistoryPlugin />
      <ListPlugin />
      <OnChangePlugin onChange={onChange} />
    </div>
  );
}
