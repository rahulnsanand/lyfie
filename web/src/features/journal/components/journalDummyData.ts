export interface JournalDay {
  date: string;
  editorState: string | null; // Lexical JSON
}

export const generateJournalDays = (
  startDate: Date,
  days: number
): JournalDay[] => {
  const data: JournalDay[] = [];

  for (let i = 0; i < days; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const iso = d.toISOString().split("T")[0];

    const hasEntry = Math.random() > 0.5;

    data.push({
      date: iso,
      editorState: hasEntry
        ? JSON.stringify({
            root: {
              type: "root",
              children: [
                {
                  type: "paragraph",
                  children: [
                    {
                      type: "text",
                      text: "Today felt calm. I focused on small wins and clarity.",
                      format: 1, // bold
                    },
                  ],
                },
              ],
            },
          })
        : null,
    });
  }

  return data;
};
