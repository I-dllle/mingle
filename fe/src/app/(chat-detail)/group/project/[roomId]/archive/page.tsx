'use client';

import ChatTopTitle from '@/features/chat/panel/ChatTopTitle';
import ArchiveFileList from '@/features/chat/archive/components/ArchiveFileList';
import ArchiveUploadForm from '@/features/chat/archive/components/ArchiveUploadForm';
import { useParams } from 'next/navigation';
import ChatPanelChatLayout from '@/features/chat/panel/ChatPanelChatLayout';

export default function ProjectArchivePage() {
  const { roomId } = useParams();

  return (
    <ChatPanelChatLayout
      title={<ChatTopTitle />}
      onBack={() => {}}
      tabs={<div>자료방</div>}
    >
      <ArchiveUploadForm roomId={Number(roomId)} />
      <ArchiveFileList roomId={Number(roomId)} />
    </ChatPanelChatLayout>
  );
}
