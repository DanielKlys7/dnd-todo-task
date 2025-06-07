export const useGetHighlightedText = () => {
  function getHighlightedText(text: string, highlight: string) {
    const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = text.split(new RegExp(`(${escapedHighlight})`, "gi"));
    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={`${part}${index}`} className="bg-red-500">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  }

  return { getHighlightedText };
};
