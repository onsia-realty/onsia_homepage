import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error = params.error;

  const errorMessages: Record<string, string> = {
    Configuration: '서버 설정 오류입니다. 관리자에게 문의하세요.',
    AccessDenied: '접근이 거부되었습니다.',
    Verification: '인증 링크가 만료되었거나 이미 사용되었습니다.',
    OAuthSignin: '소셜 로그인 시작 중 오류가 발생했습니다.',
    OAuthCallback: '소셜 로그인 처리 중 오류가 발생했습니다.',
    OAuthCreateAccount: '계정 생성 중 오류가 발생했습니다.',
    EmailCreateAccount: '이메일 계정 생성 중 오류가 발생했습니다.',
    Callback: '콜백 처리 중 오류가 발생했습니다.',
    OAuthAccountNotLinked: '이미 다른 방법으로 가입된 이메일입니다. 기존 로그인 방법을 사용해주세요.',
    EmailSignin: '이메일 전송에 실패했습니다.',
    CredentialsSignin: '로그인 정보가 올바르지 않습니다.',
    SessionRequired: '이 페이지에 접근하려면 로그인이 필요합니다.',
    Default: '알 수 없는 오류가 발생했습니다.',
  };

  const message = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>

          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            로그인 오류
          </h1>

          <p className="text-gray-600 mb-6">
            {message}
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/auth/signin"
              className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              다시 로그인하기
            </Link>
            <Link
              href="/"
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
