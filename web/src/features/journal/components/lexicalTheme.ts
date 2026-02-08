import { EditorThemeClasses } from "lexical";

const theme: EditorThemeClasses = {
  root: "journal-editor-root",
  paragraph: "journal-paragraph",
  heading: {
    h1: "journal-h1",
    h2: "journal-h2",
  },
  list: {
    ul: "journal-ul",
    ol: "journal-ol",
    listitem: "journal-li",
  },
  text: {
    bold: "journal-bold",
    italic: "journal-italic",
    underline: "journal-underline",
  },
};

export default theme;
