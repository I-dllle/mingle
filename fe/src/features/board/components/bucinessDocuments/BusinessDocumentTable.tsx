interface Document {
  id: number;
  title: string;
  author: string;
  createdAt: string;
}

interface BusinessDocumentTableProps {
  documents: Document[];
}

export default function BusinessDocumentTable({
  documents,
}: BusinessDocumentTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              제목
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              작성자
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              작성일
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {documents.map((doc) => (
            <tr key={doc.id}>
              <td className="px-6 py-4 whitespace-nowrap">{doc.title}</td>
              <td className="px-6 py-4 whitespace-nowrap">{doc.author}</td>
              <td className="px-6 py-4 whitespace-nowrap">{doc.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
