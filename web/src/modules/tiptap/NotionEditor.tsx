import React, { useMemo } from "react";
import { Editor, Extension, Range } from "@tiptap/core";
import { EditorContent, ReactRenderer, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyleKit } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { TableKit } from "@tiptap/extension-table";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Suggestion, { SuggestionKeyDownProps } from "@tiptap/suggestion";
import tippy from "tippy.js";
import { all, createLowlight } from "lowlight";
import "tippy.js/dist/tippy.css";
import "./NotionEditor.css";

type SlashCommandItem = {
  title: string;
  description: string;
  keywords?: string[];
  command: (props: { editor: Editor; range: Range }) => void;
};

type SlashCommandListProps = {
  items: SlashCommandItem[];
  command: (item: SlashCommandItem) => void;
};

type SlashCommandListHandle = {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
};

const SlashCommandList = React.forwardRef<SlashCommandListHandle, SlashCommandListProps>(
  (props, ref) => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    React.useEffect(() => {
      setSelectedIndex(0);
    }, [props.items]);

    React.useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: SuggestionKeyDownProps) => {
        if (!props.items.length) {
          return false;
        }

        if (event.key === "ArrowUp") {
          setSelectedIndex((prev) => (prev + props.items.length - 1) % props.items.length);
          return true;
        }

        if (event.key === "ArrowDown") {
          setSelectedIndex((prev) => (prev + 1) % props.items.length);
          return true;
        }

        if (event.key === "Enter") {
          const item = props.items[selectedIndex];
          if (item) {
            props.command(item);
          }
          return true;
        }

        return false;
      },
    }));

    if (!props.items.length) {
      return <div className="slash-menu empty">No commands found</div>;
    }

    return (
      <div className="slash-menu">
        {props.items.map((item, index) => (
          <button
            key={item.title}
            type="button"
            className={`slash-item${index === selectedIndex ? " active" : ""}`}
            onClick={() => props.command(item)}
          >
            <div className="slash-item-title">{item.title}</div>
            <div className="slash-item-desc">{item.description}</div>
          </button>
        ))}
      </div>
    );
  }
);

SlashCommandList.displayName = "SlashCommandList";

const slashCommandItems: SlashCommandItem[] = [
  {
    title: "Text",
    description: "Start writing with plain text",
    keywords: ["paragraph"],
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setParagraph().run(),
  },
  {
    title: "Heading 1",
    description: "Large section heading",
    keywords: ["h1", "title"],
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run(),
  },
  {
    title: "Heading 2",
    description: "Medium section heading",
    keywords: ["h2", "subtitle"],
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run(),
  },
  {
    title: "Heading 3",
    description: "Small section heading",
    keywords: ["h3"],
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run(),
  },
  {
    title: "Bulleted list",
    description: "Create a bullet list",
    keywords: ["ul", "list"],
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleBulletList().run(),
  },
  {
    title: "Numbered list",
    description: "Create a numbered list",
    keywords: ["ol", "list"],
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
  },
  {
    title: "To-do list",
    description: "Track tasks with checkboxes",
    keywords: ["task", "todo"],
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleTaskList().run(),
  },
  {
    title: "Quote",
    description: "Capture a quote",
    keywords: ["blockquote"],
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
  },
  {
    title: "Code block",
    description: "Write a code snippet",
    keywords: ["code"],
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
  {
    title: "Divider",
    description: "Insert a horizontal rule",
    keywords: ["hr", "divider"],
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
  },
  {
    title: "Image",
    description: "Insert an image from a URL",
    keywords: ["photo", "media"],
    command: ({ editor, range }) => {
      const url = window.prompt("Image URL");
      if (!url) {
        return;
      }
      editor.chain().focus().deleteRange(range).setImage({ src: url }).run();
    },
  },
];

const SlashCommand = Extension.create({
  name: "slash-command",
  addOptions() {
    return {
      suggestion: {
        char: "/",
        startOfLine: false,
        items: ({ query }: { query: string }) => {
          const normalized = query.toLowerCase();
          return slashCommandItems
            .filter((item) => {
              if (item.title.toLowerCase().includes(normalized)) {
                return true;
              }
              return item.keywords?.some((keyword) => keyword.includes(normalized));
            })
            .slice(0, 10);
        },
        command: ({ editor, range, props }: { editor: Editor; range: Range; props: SlashCommandItem }) => {
          props.command({ editor, range });
        },
        render: () => {
          let component: ReactRenderer<SlashCommandListHandle> | null = null;
          let popup: ReturnType<typeof tippy> | null = null;

          return {
            onStart: (props) => {
              component = new ReactRenderer(SlashCommandList, {
                props,
                editor: props.editor,
              });

              if (!props.clientRect) {
                return;
              }

              popup = tippy("body", {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: "manual",
                placement: "bottom-start",
                offset: [0, 8],
              });
            },
            onUpdate: (props) => {
              component?.updateProps(props);

              if (!props.clientRect) {
                return;
              }

              popup?.[0].setProps({
                getReferenceClientRect: props.clientRect,
              });
            },
            onKeyDown: (props) => {
              if (props.event.key === "Escape") {
                popup?.[0].hide();
                return true;
              }

              return component?.ref?.onKeyDown(props) ?? false;
            },
            onExit: () => {
              popup?.[0].destroy();
              component?.destroy();
            },
          };
        },
      },
    };
  },
  addProseMirrorPlugins() {
    return [Suggestion({ editor: this.editor, ...this.options.suggestion })];
  },
});

const ToolbarButton = ({
  title,
  active,
  disabled,
  onClick,
  children,
}: {
  title: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    className={`toolbar-btn${active ? " is-active" : ""}`}
    onClick={onClick}
    disabled={disabled}
    title={title}
  >
    {children}
  </button>
);

export const NotionEditor = () => {
  const lowlight = useMemo(() => createLowlight(all), []);

  const extensions = useMemo(
    () => [
      StarterKit.configure({
        codeBlock: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      Image.configure({
        allowBase64: true,
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Typography,
      Subscript,
      Superscript,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Type / for commands...",
      }),
      TextStyleKit,
      Color.configure({
        types: ["textStyle"],
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      TableKit.configure({
        resizable: true,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      SlashCommand,
    ],
    []
  );

  const editor = useEditor({
    extensions,
    content: "<h1>Untitled</h1><p>Start writing here. Type / to open commands.</p>",
    editorProps: {
      attributes: {
        class: "notion-editor",
      },
    },
  });

  if (!editor) {
    return <div className="notion-editor-shell">Loading editor...</div>;
  }

  const promptImage = () => {
    const url = window.prompt("Image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const promptLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous ?? "");

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="notion-editor-shell">
      <div className="notion-toolbar">
        <div className="toolbar-group">
          <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()}>
            Undo
          </ToolbarButton>
          <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()}>
            Redo
          </ToolbarButton>
        </div>
        <div className="toolbar-group">
          <ToolbarButton
            title="Heading 1"
            active={editor.isActive("heading", { level: 1 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            H1
          </ToolbarButton>
          <ToolbarButton
            title="Heading 2"
            active={editor.isActive("heading", { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            H2
          </ToolbarButton>
          <ToolbarButton
            title="Heading 3"
            active={editor.isActive("heading", { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            H3
          </ToolbarButton>
        </div>
        <div className="toolbar-group">
          <ToolbarButton
            title="Bold"
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            Bold
          </ToolbarButton>
          <ToolbarButton
            title="Italic"
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            Italic
          </ToolbarButton>
          <ToolbarButton
            title="Underline"
            active={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            Underline
          </ToolbarButton>
          <ToolbarButton
            title="Strike"
            active={editor.isActive("strike")}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            Strike
          </ToolbarButton>
          <ToolbarButton
            title="Highlight"
            active={editor.isActive("highlight")}
            onClick={() => editor.chain().focus().toggleHighlight().run()}
          >
            Highlight
          </ToolbarButton>
          <ToolbarButton
            title="Inline code"
            active={editor.isActive("code")}
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            Code
          </ToolbarButton>
        </div>
        <div className="toolbar-group">
          <ToolbarButton
            title="Bullet list"
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            Bullets
          </ToolbarButton>
          <ToolbarButton
            title="Numbered list"
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            Numbered
          </ToolbarButton>
          <ToolbarButton
            title="Task list"
            active={editor.isActive("taskList")}
            onClick={() => editor.chain().focus().toggleTaskList().run()}
          >
            Tasks
          </ToolbarButton>
          <ToolbarButton
            title="Blockquote"
            active={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            Quote
          </ToolbarButton>
          <ToolbarButton
            title="Code block"
            active={editor.isActive("codeBlock")}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            Code Block
          </ToolbarButton>
        </div>
        <div className="toolbar-group">
          <ToolbarButton
            title="Align left"
            active={editor.isActive({ textAlign: "left" })}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            Left
          </ToolbarButton>
          <ToolbarButton
            title="Align center"
            active={editor.isActive({ textAlign: "center" })}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            Center
          </ToolbarButton>
          <ToolbarButton
            title="Align right"
            active={editor.isActive({ textAlign: "right" })}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            Right
          </ToolbarButton>
          <ToolbarButton
            title="Justify"
            active={editor.isActive({ textAlign: "justify" })}
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          >
            Justify
          </ToolbarButton>
        </div>
        <div className="toolbar-group">
          <ToolbarButton title="Link" active={editor.isActive("link")} onClick={promptLink}>
            Link
          </ToolbarButton>
          <ToolbarButton title="Image" onClick={promptImage}>
            Image
          </ToolbarButton>
          <ToolbarButton
            title="Horizontal rule"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            Divider
          </ToolbarButton>
        </div>
        <div className="toolbar-group">
          <ToolbarButton
            title="Insert table"
            onClick={() =>
              editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
            }
          >
            Table
          </ToolbarButton>
          <ToolbarButton title="Add row" onClick={() => editor.chain().focus().addRowAfter().run()}>
            +Row
          </ToolbarButton>
          <ToolbarButton title="Add column" onClick={() => editor.chain().focus().addColumnAfter().run()}>
            +Col
          </ToolbarButton>
          <ToolbarButton
            title="Delete table"
            onClick={() => editor.chain().focus().deleteTable().run()}
          >
            Delete
          </ToolbarButton>
        </div>
        <div className="toolbar-group">
          <ToolbarButton
            title="Superscript"
            active={editor.isActive("superscript")}
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
          >
            Sup
          </ToolbarButton>
          <ToolbarButton
            title="Subscript"
            active={editor.isActive("subscript")}
            onClick={() => editor.chain().focus().toggleSubscript().run()}
          >
            Sub
          </ToolbarButton>
          <ToolbarButton
            title="Clear formatting"
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          >
            Clear
          </ToolbarButton>
        </div>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
};
