import { storage } from "@/lib/firebase"; // 경로는 프로젝트 구조에 맞게

export const uploadImageToFirebase = async (file) => {
  if (!file) return null;

  const fileRef = storage.ref().child(`profile/${Date.now()}_${file.name}`);
  await fileRef.put(file); // 업로드
  return await fileRef.getDownloadURL(); // 다운로드 URL 리턴
};
