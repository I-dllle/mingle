import type { Post } from "../types/post";

export const extractTags = (title: string): string[] => {
  const tagMatch = title.match(/\[태그:(.*?)\]/);
  return tagMatch ? tagMatch[1].split(",") : [];
};

export const removeTagsFromTitle = (title: string): string => {
  return title.replace(/\[태그:.*?\]\s*/, "");
};

export const addTagsToTitle = (title: string, tags: string[]): string => {
  if (tags.length === 0) return title;
  return `[태그:${tags.join(",")}] ${title}`;
};

export const searchByTag = (posts: Post[], tag: string): Post[] => {
  return posts.filter((post) => {
    const postTags = extractTags(post.title);
    return postTags.includes(tag.toLowerCase());
  });
};
