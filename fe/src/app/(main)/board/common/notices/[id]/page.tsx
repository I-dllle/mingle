import PostDetail from "@/features/post/components/PostDetail";
import Link from "next/link";

// 임시 더미데이터
const dummyPosts = [
  {
    id: 1,
    title: "첫 번째 공지사항",
    content: `<p>이것은 첫 번째 공지사항입니다.<br/>이미지도 들어갈 수 있어요!</p><img src='https://images.unsplash.com/photo-1506744038136-46273834b3fb' style='max-width:100%;margin:24px 0;border-radius:12px;' />`,
  },
  {
    id: 2,
    title: "두 번째 공지사항",
    content: `<p>두 번째 공지사항에는 유튜브 영상도 들어갑니다.</p><iframe width='560' height='315' src='https://www.youtube.com/embed/ScMzIvxBSi4' title='YouTube video' frameborder='0' allowfullscreen style='margin:24px 0;border-radius:12px;max-width:100%;'></iframe>`,
  },
  {
    id: 3,
    title: "세 번째 공지사항",
    content: `<p>세 번째 공지에는 오디오도 들어갑니다.</p><audio controls src='https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' style='width:100%;margin:24px 0;'></audio>`,
  },
];

export default function NoticeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  const post = dummyPosts.find((p) => p.id === id);

  // 이전/다음 글 찾기
  const currentIdx = dummyPosts.findIndex((p) => p.id === id);
  const prevPost = dummyPosts[currentIdx - 1];
  const nextPost = dummyPosts[currentIdx + 1];

  if (!post)
    return <div className="p-8 text-center">게시글을 찾을 수 없습니다.</div>;

  return (
    <div>
      <PostDetail post={post} />
      <div className="flex justify-between gap-2 mt-8 max-w-2xl mx-auto">
        {prevPost ? (
          <Link
            href={`/board/common/notices/${prevPost.id}`}
            className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            이전
          </Link>
        ) : (
          <span />
        )}
        <Link
          href={`/board/common/notices`}
          className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          목록으로
        </Link>
        {nextPost ? (
          <Link
            href={`/board/common/notices/${nextPost.id}`}
            className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            다음
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
