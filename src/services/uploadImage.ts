import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../lib/firebase"; // 올바른 storage 가져오기

export const uploadImageToFirebase = async (
  file: File | null,
  email: string
): Promise<string | null> => {
  if (!file) return null;

  const fileRef = ref(storage, `ever/${email}/profile.jpg`);
  await uploadBytes(fileRef, file); // 파일 업로드
  return await getDownloadURL(fileRef); // 다운로드 URL 리턴
};
