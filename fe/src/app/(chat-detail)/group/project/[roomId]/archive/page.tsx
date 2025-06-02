'use client';

import ArchiveFileList from '@/features/chat/archive/components/ArchiveFileList';
import ArchiveUploadForm from '@/features/chat/archive/components/ArchiveUploadForm';
import { useParams } from 'next/navigation';

export default function ProjectArchivePage() {
  const { roomId } = useParams();

  return (
    <div>
      <h3>프로젝트 자료방</h3>
      <ArchiveUploadForm roomId={Number(roomId)} />
      <ArchiveFileList roomId={Number(roomId)} />
    </div>
  );
}
