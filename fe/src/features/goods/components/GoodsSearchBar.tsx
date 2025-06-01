import React, { useState } from "react";

interface GoodsSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
}

const GoodsSearchBar: React.FC<GoodsSearchBarProps> = ({
  value,
  onChange,
  onSearch,
}) => {
  const [input, setInput] = useState(value);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    onChange(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(input);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 w-full max-w-lg mb-6"
    >
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="상품명을 입력하세요"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
      >
        검색
      </button>
    </form>
  );
};

export default GoodsSearchBar;
