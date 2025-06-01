interface BusinessDocumentSearchProps {
  searchQuery: string;
  onSearch: (query: string) => void;
}

export default function BusinessDocumentSearch({
  searchQuery,
  onSearch,
}: BusinessDocumentSearchProps) {
  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="문서 검색..."
        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
