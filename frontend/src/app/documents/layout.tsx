// Dosya: src/app/documents/layout.tsx
import { ProtectedLayout } from '@/components/layout/protected-layout'

export default function DocumentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // [DÜZELTME] Menülerin görünmesi için ProtectedLayout'u çağırıyoruz.
  return <ProtectedLayout>{children}</ProtectedLayout>
}