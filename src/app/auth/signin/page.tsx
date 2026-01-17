import SocialLoginButtons from '@/components/auth/LoginButton';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Link from 'next/link';

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const params = await searchParams;

  // 이미 로그인 되어 있으면 홈으로 리다이렉트
  if (session) {
    redirect(params.callbackUrl || '/');
  }

  const error = params.error;
  const callbackUrl = params.callbackUrl || '/';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* 로고 & 타이틀 */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-gray-900">ONSIA</h1>
          </Link>
          <p className="mt-2 text-sm text-gray-600">
            AI 기반 부동산 정보 플랫폼
          </p>
        </div>

        {/* 로그인 카드 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
            로그인 / 회원가입
          </h2>

          {/* 에러 메시지 */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
              {error === 'OAuthAccountNotLinked'
                ? '이미 다른 방법으로 가입된 이메일입니다.'
                : error === 'OAuthSignin'
                ? '로그인 중 오류가 발생했습니다.'
                : error === 'OAuthCallback'
                ? '인증 처리 중 오류가 발생했습니다.'
                : '로그인에 실패했습니다. 다시 시도해주세요.'}
            </div>
          )}

          {/* 소셜 로그인 버튼 */}
          <SocialLoginButtons callbackUrl={callbackUrl} />

          {/* 안내 문구 */}
          <p className="mt-6 text-xs text-center text-gray-500">
            소셜 계정으로 간편하게 시작하세요.
            <br />
            최초 로그인 시 자동으로 회원가입됩니다.
          </p>
        </div>

        {/* 하단 안내 */}
        <p className="text-center text-xs text-gray-400">
          로그인 시{' '}
          <Link href="/terms" className="underline hover:text-gray-600">
            이용약관
          </Link>{' '}
          및{' '}
          <Link href="/privacy" className="underline hover:text-gray-600">
            개인정보처리방침
          </Link>
          에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
}
