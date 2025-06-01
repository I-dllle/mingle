'use client';

import { useEffect, useState } from 'react';
import { useArchive } from '@/features/chat/archive/services/useArchive';
import ArchiveTagFilter from './ArchiveTagFilter';
import styles from './ArchiveFileList.module.css';

export default function ArchiveFileList({ roomId }: { roomId: number }) {
  const { archiveItems, fetchItems } = useArchive(roomId); // 자료 목록과 fetch 함수 불러오기
  const [selectedTag, setSelectedTag] = useState<string | null>(null); // 선택된 태그 상태

  useEffect(() => {
    fetchItems(); // 진입 시 자료 메시지 목록 불러오기
  }, [fetchItems]);

  // 전체 자료에서 태그 목록 추출
  const allTags = Array.from(
    new Set(archiveItems.flatMap((item) => item.tags.map((tag) => tag.name)))
  );

  // 선택된 태그에 따른 필터링
  const filteredItems = selectedTag
    ? archiveItems.filter((item) =>
        item.tags.some((tag) => tag.name === selectedTag)
      )
    : archiveItems;

  return (
    <div className={styles.archiveList}>
      {/* 태그 필터 UI */}
      <ArchiveTagFilter
        tags={allTags}
        selectedTag={selectedTag}
        onSelect={setSelectedTag}
      />

      {filteredItems.length === 0 ? (
        <p className={styles.empty}>등록된 자료가 없습니다.</p>
      ) : (
        <ul className={styles.list}>
          {filteredItems.map((item) => (
            <li key={item.id} className={styles.item}>
              <div className={styles.filename}>{item.originalFilename}</div>
              <div className={styles.meta}>
                <span className={styles.uploader}>
                  업로더: {item.uploaderNickname}
                </span>
                <span className={styles.createdAt}>
                  {new Date(item.createdAt).toLocaleString('ko-KR')}
                </span>
              </div>
              <div className={styles.tags}>
                {item.tags.map((tag) => (
                  <span key={tag.id} className={styles.tag}>
                    #{tag.name}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
