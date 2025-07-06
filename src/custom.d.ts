declare module "*.mp4" {
  const src: string;
  export default src;
}
// *.mp4 형식의 파일을 import하면 문자열(string, 즉 URL)로 처리하겠다는 의미
