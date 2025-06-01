'use client';

import { useState } from 'react';
import { uploadArchiveItem } from '@/features/chat/archive/services/uploadArchiveItem';
import { useArchive } from '@/features/chat/archive/services/useArchive';
import { useTagAutocomplete } from '@/features/chat/archive/services/useTagAutocomplete';
import type { ArchiveItemResponse } from '@/features/chat/archive/types/ArchiveItemResponse';
import { extractTagsFromFilename } from '@/features/chat/common/utils/chatUtils';
import { useSocket } from '@/hooks/useSocket';
import { MessageFormat } from '@/features/chat/common/types/MessageFormat';
import { ChatRoomType } from '@/features/chat/common/types/ChatRoomType';

interface ArchiveUploadFormProps {
  roomId: number;
}

export default function ArchiveUploadForm({ roomId }: ArchiveUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]); // 유저가 직접 입력하는 태그 상태
  const [isUploading, setIsUploading] = useState(false); // 업로드 중 여부 상태
  const [currentInput, setCurrentInput] = useState(''); // 자동완성 검색어 상태

  const { suggestions } = useTagAutocomplete(currentInput); // 자동완성 hook 사용
  const { fetchItems } = useArchive(roomId);
  const token = localStorage.getItem('token')!; // 토큰 가져오기
  const { send } = useSocket(token, () => {}); // 메시지 전송용 useSocket 훅 사용

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected); // 기존 onChange 로직을 별도 함수로 분리
    if (selected) {
      const extracted = extractTagsFromFilename(selected.name); // 자동 태그 추출
      setTags(extracted); // 자동 추출 태그 저장
    }
  };

  const handleUpload = async () => {
    if (!file || isUploading) return; // 중복 업로드 방지
    setIsUploading(true); // 업로드 시작

    const formData = new FormData();
    formData.append('file', file);
    formData.append('roomId', String(roomId));
    tags.forEach((tag) => formData.append('tags', tag));

    try {
      // 업로드 후 반환값 받기
      const uploaded: ArchiveItemResponse = await uploadArchiveItem({
        roomId,
        file,
        uploaderId: Number(localStorage.getItem('userId')),
        chatType: ChatRoomType.GROUP,
      });

      fetchItems(); // 자료 목록 갱신

      // 업로드된 값 기반으로 메시지 전송
      send({
        roomId,
        senderId: Number(localStorage.getItem('userId')), // 향후 auth 적용
        chatType: ChatRoomType.GROUP,
        format: MessageFormat.ARCHIVE,
        content: uploaded.fileName,
        createdAt: uploaded.createdAt,
        tagNames: uploaded.tags,
      });

      setFile(null);
      setTags([]); // 업로드 후 태그 초기화
      setCurrentInput(''); // 입력 초기화
    } catch (err) {
      alert('업로드에 실패했어요. 다시 시도해주세요.');
      console.error(err);
    } finally {
      setIsUploading(false); // 업로드 종료
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />

      <input
        type="text"
        placeholder="태그를 입력하고 Enter"
        value={currentInput}
        onChange={(e) => setCurrentInput(e.target.value)}
        onKeyDown={(e) => {
          const value = currentInput.trim();
          if ((e.key === 'Enter' || e.key === ',') && value) {
            e.preventDefault(); // 쉼표와 엔터 모두 처리
            if (!tags.includes(value)) {
              setTags([...tags, value]); // 중복 태그 방지
            }
            setCurrentInput('');
          }
        }}
      />

      {/* 자동완성 리스트 UI */}
      {currentInput && suggestions.length > 0 && (
        <ul
          style={{
            listStyle: 'none',
            padding: '4px 8px',
            border: '1px solid #ccc',
            backgroundColor: '#fff',
            maxHeight: '120px',
            overflowY: 'auto',
            marginBottom: '8px',
          }}
        >
          {suggestions.map((tag) => (
            <li
              key={tag}
              style={{ cursor: 'pointer', padding: '4px 0' }}
              onClick={() => {
                if (!tags.includes(tag)) {
                  setTags([...tags, tag]);
                }
                setCurrentInput('');
              }}
            >
              #{tag}
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: '8px' }}>
        {tags.map((tag) => (
          <span key={tag} style={{ marginRight: '6px' }}>
            #{tag}{' '}
            <button
              type="button"
              onClick={() => setTags(tags.filter((t) => t !== tag))}
            >
              ❌
            </button>
          </span>
        ))}
      </div>

      <button onClick={handleUpload} disabled={!file || isUploading}>
        {isUploading ? '업로드 중...' : '업로드'}
      </button>
    </div>
  );
}
