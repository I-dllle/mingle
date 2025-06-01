import React, { useState, useRef } from "react";
import type { Goods } from "../types/Goods";

interface GoodsFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Goods, "id" | "createdBy">, files: File[]) => void;
  initialData?: Partial<Goods>;
  isEdit?: boolean;
}

const GoodsForm: React.FC<GoodsFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = {},
  isEdit,
}) => {
  const [itemName, setItemName] = useState(initialData.itemName || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [itemPrice, setItemPrice] = useState(initialData.itemPrice || 0);
  const [isActive, setIsActive] = useState(initialData.isActive ?? true);
  const [imgFiles, setImgFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImgFiles((prev) => [...prev, ...newFiles]);

      // Create preview URLs
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImgFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]); // Clean up the URL
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(
      { itemName, description, itemPrice, isActive, imgUrl: [] },
      imgFiles
    );
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setItemPrice(Number(value));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">
          {isEdit ? "상품 수정" : "상품 등록"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">상품명</label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">설명</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-3 py-2"
              rows={3}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">
              이미지 (여러장 가능)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="w-full"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {previews.map((preview, index) => (
                <div key={`preview-${preview}`} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">
              가격 (40% 할인 적용가)
            </label>
            <input
              type="text"
              value={itemPrice.toLocaleString()}
              onChange={handlePriceChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">판매 상태</label>
            <select
              value={isActive ? "판매중" : "품절"}
              onChange={(e) => setIsActive(e.target.value === "판매중")}
              className="w-full border rounded px-3 py-2"
            >
              <option value="판매중">판매중</option>
              <option value="품절">품절</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold"
          >
            {isEdit ? "수정" : "등록"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GoodsForm;
