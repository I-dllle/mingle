export function extractTagsFromFilename(filename: string): string[] {
  // 확장자 제거하고, 이름에서 단어 추출 (예: '회의록_기획_2025.pdf' → ['회의록', '기획', '2025'])
  const nameWithoutExtension = filename.replace(/\.[^/.]+$/, '');
  return nameWithoutExtension
    .split(/[_\s-]/) // 언더스코어, 공백, 대시 기준 분리
    .filter((word) => word.length > 0);
}
