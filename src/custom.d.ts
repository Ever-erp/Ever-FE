// *.mp4 형식의 파일을 import하면 문자열(string, 즉 URL)로 처리하겠다는 의미
declare module "*.mp4" {
  const src: string;
  export default src;
}

// .svg?react로 import된 컴포넌트에 대해 TypeScript가 타입을 추론
declare module "*.svg?react" {
  import type { SVGProps } from "react";
  const ReactComponent: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  export default ReactComponent;
}
