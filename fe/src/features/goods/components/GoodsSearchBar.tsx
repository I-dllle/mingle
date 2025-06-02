import React, { useState, useEffect } from "react";

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

  useEffect(() => {
    setInput(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInput(newValue);
    onChange(newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(input);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 w-full max-w-sm"
    >
      <div className="relative flex-1">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="상품명을 입력하세요"
          className="w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
        />
        {input && (
          <button
            type="button"
            onClick={() => {
              setInput("");
              onChange("");
              onSearch("");
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>
      <button
        type="submit"
        className="px-3 py-1.5 text-sm bg-indigo-500 text-white rounded-md hover:bg-indigo-600 min-w-fit whitespace-nowrap"
      >
        검색
      </button>
    </form>
  );
};

export default GoodsSearchBar;
