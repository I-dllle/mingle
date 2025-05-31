export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  author: string;
  tags?: string[];
}

export interface PostEditorProps {
  onSubmit: (data: { title: string; content: string; tags: string[] }) => void;
}

export interface PostListProps {
  posts: Post[];
}

export interface PostSearchProps {
  posts: Post[];
  onSearch: (filteredPosts: Post[]) => void;
}
