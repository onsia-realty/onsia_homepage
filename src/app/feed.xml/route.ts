// /feed.xml 은 하드코딩 2개 항목만 있던 스텁이라 중복 피드로 취급됨.
// 실제 콘텐츠 피드(/rss.xml)로 영구 리다이렉트하여 피드 URL을 하나로 통일.
export function GET() {
  return Response.redirect('https://www.onsia.city/rss.xml', 308);
}
