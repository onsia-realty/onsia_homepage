import { redirect } from 'next/navigation';

// /market/map은 /market으로 리다이렉트
export default function MapMarketPage() {
  redirect('/market');
}
