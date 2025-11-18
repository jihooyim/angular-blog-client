export {}; // 타입 스코프를 global로 확장하기 위해 필요

declare global {
  interface Window {
    kakao: any;
  }
}
