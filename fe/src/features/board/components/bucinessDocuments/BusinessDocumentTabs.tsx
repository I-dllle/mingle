interface BusinessDocumentTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function BusinessDocumentTabs({
  activeTab,
  onTabChange,
}: BusinessDocumentTabsProps) {
  const tabs = [
    { id: "all", label: "전체" },
    { id: "meeting_minutes", label: "회의록" },
    { id: "business_documents", label: "업무문서" },
  ];

  return (
    <div className="flex space-x-4 border-b">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 font-medium ${
            activeTab === tab.id
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
