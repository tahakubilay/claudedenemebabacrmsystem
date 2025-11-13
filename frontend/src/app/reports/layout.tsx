// Yeni Klasör/frontend/src/app/reports/layout.tsx
import React from 'react';
// --- DÜZELTME: ProtectedLayout eklendi ---
import { ProtectedLayout } from '@/components/layout/protected-layout';

const ReportsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProtectedLayout> {/* Düzeltme */}
      <div className="p-4">
        {children}
      </div>
    </ProtectedLayout> /* Düzeltme */
  );
};

export default ReportsLayout;