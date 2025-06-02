'use client';

import ChatTopTitle from '@/features/chat/common/components/ChatTopTitle';
import ArchiveFileList from '@/features/chat/archive/components/ArchiveFileList';
import ArchiveUploadForm from '@/features/chat/archive/components/ArchiveUploadForm';
import { useParams } from 'next/navigation';

export default function TeamArchivePage() {
  const { roomId } = useParams();

  return (
    <div>
      <ChatTopTitle />
      <h3>팀 자료방</h3>
      <ArchiveUploadForm roomId={Number(roomId)} />
      <ArchiveFileList roomId={Number(roomId)} />
    </div>
  );
}
