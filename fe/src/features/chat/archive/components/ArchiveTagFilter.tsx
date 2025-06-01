'use client';

import styles from './ArchiveTagFilter.module.css';

interface ArchiveTagFilterProps {
  tags: string[]; // 모든 태그 목록
  selectedTag: string | null;
  onSelect: (tag: string | null) => void;
}

export default function ArchiveTagFilter({
  tags,
  selectedTag,
  onSelect,
}: ArchiveTagFilterProps) {
  return (
    <div className={styles.tagFilter}>
      <button
        className={`${styles.tagButton} ${
          selectedTag === null ? styles.active : ''
        }`}
        onClick={() => onSelect(null)}
      >
        전체
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          className={`${styles.tagButton} ${
            selectedTag === tag ? styles.active : ''
          }`}
          onClick={() => onSelect(tag)}
        >
          #{tag}
        </button>
      ))}
    </div>
  );
}
