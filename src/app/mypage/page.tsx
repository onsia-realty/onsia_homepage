"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { User, Heart, Clock, FileText, Settings, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  image: string | null;
  createdAt: string;
}

interface FavoriteItem {
  id: string;
  itemType: string;
  createdAt: string;
  property?: { id: string; title: string; slug: string };
  subscription?: { id: string; houseName: string; houseManageNo: string };
  auction?: { id: string; caseNumber: string; address: string };
}

interface ViewHistoryItem {
  id: string;
  itemType: string;
  viewedAt: string;
  property?: { id: string; title: string; slug: string };
  subscription?: { id: string; houseName: string; houseManageNo: string };
  auction?: { id: string; caseNumber: string; address: string };
}

interface InquiryItem {
  id: string;
  message: string;
  status: string;
  createdAt: string;
  property: { id: string; title: string; slug: string };
}

export default function MyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "favorites" | "history" | "inquiries">("profile");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [viewHistory, setViewHistory] = useState<ViewHistoryItem[]>([]);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", phone: "" });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/mypage");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchData();
    }
  }, [session, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "profile") {
        const res = await fetch("/api/user/profile");
        const data = await res.json();
        setProfile(data);
        setEditForm({ name: data.name || "", phone: data.phone || "" });
      } else if (activeTab === "favorites") {
        const res = await fetch("/api/user/favorites");
        const data = await res.json();
        setFavorites(data);
      } else if (activeTab === "history") {
        const res = await fetch("/api/user/history");
        const data = await res.json();
        setViewHistory(data);
      } else if (activeTab === "inquiries") {
        const res = await fetch("/api/user/inquiries");
        const data = await res.json();
        setInquiries(data);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleRemoveFavorite = async (id: string) => {
    try {
      await fetch(`/api/user/favorites/${id}`, { method: "DELETE" });
      setFavorites(favorites.filter((f) => f.id !== id));
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  };

  const getItemLink = (item: FavoriteItem | ViewHistoryItem) => {
    if (item.property) return `/properties/${item.property.slug}`;
    if (item.subscription) return `/subscription/${item.subscription.houseManageNo}`;
    if (item.auction) return `/auctions/${item.auction.id}`;
    return "#";
  };

  const getItemTitle = (item: FavoriteItem | ViewHistoryItem) => {
    if (item.property) return item.property.title;
    if (item.subscription) return item.subscription.houseName;
    if (item.auction) return item.auction.address;
    return "알 수 없음";
  };

  const getItemTypeLabel = (type: string) => {
    switch (type) {
      case "PROPERTY": return "분양권";
      case "SUBSCRIPTION": return "청약";
      case "AUCTION": return "경매";
      default: return type;
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* 헤더 */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex items-center gap-4">
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  alt="프로필"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-10 h-10 text-gray-400" />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {session.user?.name || "사용자"}님
                </h1>
                <p className="text-gray-500">{session.user?.email}</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="ml-auto flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <LogOut className="w-5 h-5" />
                로그아웃
              </button>
            </div>
          </div>

          {/* 탭 메뉴 */}
          <div className="bg-white rounded-2xl shadow-sm mb-6">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex-1 flex items-center justify-center gap-2 py-4 font-medium transition ${
                  activeTab === "profile"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Settings className="w-5 h-5" />
                내 정보
              </button>
              <button
                onClick={() => setActiveTab("favorites")}
                className={`flex-1 flex items-center justify-center gap-2 py-4 font-medium transition ${
                  activeTab === "favorites"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Heart className="w-5 h-5" />
                관심 매물
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`flex-1 flex items-center justify-center gap-2 py-4 font-medium transition ${
                  activeTab === "history"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Clock className="w-5 h-5" />
                최근 본 매물
              </button>
              <button
                onClick={() => setActiveTab("inquiries")}
                className={`flex-1 flex items-center justify-center gap-2 py-4 font-medium transition ${
                  activeTab === "inquiries"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <FileText className="w-5 h-5" />
                문의 내역
              </button>
            </div>
          </div>

          {/* 콘텐츠 */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                {/* 내 정보 */}
                {activeTab === "profile" && profile && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold">내 정보</h2>
                      {!isEditing && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          수정하기
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-4 max-w-md">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            이름
                          </label>
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            연락처
                          </label>
                          <input
                            type="tel"
                            value={editForm.phone}
                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            placeholder="010-0000-0000"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleUpdateProfile}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                          >
                            저장
                          </button>
                          <button
                            onClick={() => {
                              setIsEditing(false);
                              setEditForm({ name: profile.name || "", phone: profile.phone || "" });
                            }}
                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex border-b pb-4">
                          <span className="w-32 text-gray-500">이메일</span>
                          <span className="text-gray-900">{profile.email || "-"}</span>
                        </div>
                        <div className="flex border-b pb-4">
                          <span className="w-32 text-gray-500">이름</span>
                          <span className="text-gray-900">{profile.name || "-"}</span>
                        </div>
                        <div className="flex border-b pb-4">
                          <span className="w-32 text-gray-500">연락처</span>
                          <span className="text-gray-900">{profile.phone || "-"}</span>
                        </div>
                        <div className="flex">
                          <span className="w-32 text-gray-500">가입일</span>
                          <span className="text-gray-900">
                            {new Date(profile.createdAt).toLocaleDateString("ko-KR")}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 관심 매물 */}
                {activeTab === "favorites" && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">관심 매물</h2>
                    {favorites.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>관심 매물이 없습니다.</p>
                        <p className="text-sm mt-2">마음에 드는 매물을 찜해보세요!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {favorites.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
                          >
                            <Link href={getItemLink(item)} className="flex-1">
                              <div className="flex items-center gap-3">
                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                                  {getItemTypeLabel(item.itemType)}
                                </span>
                                <span className="font-medium">{getItemTitle(item)}</span>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                {new Date(item.createdAt).toLocaleDateString("ko-KR")} 추가
                              </p>
                            </Link>
                            <button
                              onClick={() => handleRemoveFavorite(item.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                            >
                              <Heart className="w-5 h-5 fill-current" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 최근 본 매물 */}
                {activeTab === "history" && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">최근 본 매물</h2>
                    {viewHistory.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>최근 본 매물이 없습니다.</p>
                        <p className="text-sm mt-2">관심 있는 매물을 둘러보세요!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {viewHistory.map((item) => (
                          <Link
                            key={item.id}
                            href={getItemLink(item)}
                            className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition"
                          >
                            <div className="flex items-center gap-3">
                              <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                                {getItemTypeLabel(item.itemType)}
                              </span>
                              <span className="font-medium">{getItemTitle(item)}</span>
                            </div>
                            <p className="ml-auto text-sm text-gray-500">
                              {new Date(item.viewedAt).toLocaleDateString("ko-KR")}
                            </p>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 문의 내역 */}
                {activeTab === "inquiries" && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">문의 내역</h2>
                    {inquiries.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>문의 내역이 없습니다.</p>
                        <p className="text-sm mt-2">관심 있는 매물에 문의해보세요!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {inquiries.map((item) => (
                          <div
                            key={item.id}
                            className="p-4 border rounded-lg"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <Link
                                href={`/properties/${item.property.slug}`}
                                className="font-medium text-blue-600 hover:underline"
                              >
                                {item.property.title}
                              </Link>
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded ${
                                  item.status === "PENDING"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : item.status === "RESPONDED"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {item.status === "PENDING" ? "대기중" : item.status === "RESPONDED" ? "답변완료" : "종료"}
                              </span>
                            </div>
                            <p className="text-gray-700 line-clamp-2">{item.message}</p>
                            <p className="text-sm text-gray-500 mt-2">
                              {new Date(item.createdAt).toLocaleDateString("ko-KR")}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
