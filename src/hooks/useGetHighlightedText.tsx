export const useGetHighlightedText = () => {
  function getHighlightedText(text: string, highlight: string) {
    if (!highlight || !highlight.trim()) {
      return text;
    }

    const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = text.split(new RegExp(`(${escapedHighlight})`, "gi"));

    if (parts.length === 1) {
      return text;
    }

    return (
      <span data-testid="highlighted-text" data-original-text={text}>
        {parts.map((part, index) => {
          const isHighlighted = part.toLowerCase() === highlight.toLowerCase();
          return isHighlighted ? (
            <mark
              key={`highlight-${index}`}
              className="bg-background"
              data-highlight="true"
            >
              {part}
            </mark>
          ) : (
            <span key={`text-${index}`}>{part}</span>
          );
        })}
      </span>
    );
  }

  return { getHighlightedText };
};
