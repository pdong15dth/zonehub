import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chỉnh sửa bài viết | Admin',
  description: 'Chỉnh sửa bài viết tin tức',
};

export default function EditNewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 