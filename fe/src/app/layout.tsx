import './globals.css';
import { AuthProvider } from '@/features/auth/AuthProvider';

export const metadata = {
  title: 'Mingle',
  description: '엔터테인먼트 그룹 통합 솔루션',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
