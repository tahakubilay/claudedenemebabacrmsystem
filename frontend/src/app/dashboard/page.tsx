// Yeni Klasör/frontend/src/app/dashboard/page.tsx
'use client'

import React, { useEffect } from 'react'
import { StatsCard } from '@/components/dashboard/stats-card'
import { FinancialChart } from '@/components/dashboard/financial-chart'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { OverdueNotes } from '@/components/dashboard/overdue-notes'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { Building, Users, Briefcase, MapPin } from 'lucide-react'
import { useApi } from '@/hooks/useApi'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/useToast';
import { PromissoryNote } from '@/types' 
// --- DÜZELTME 1: ProtectedLayout eklendi ---
import { ProtectedLayout } from '@/components/layout/protected-layout'

// API'den gelecek stat verisinin tipi
interface DashboardStats {
  // --- DÜZELTME 2: İsimler backend ile eşleşecek şekilde güncellendi ---
  companies_count: number;
  brands_count: number;
  branches_count: number;
  people_count: number;
  // ... diğer veriler
}

export default function DashboardPage() {
  
  // 1. API Çağrısı: İstatistikler
  const {
    data: stats,
    loading: statsLoading,
    error: statsError
  } = useApi<DashboardStats>('/dashboard/stats/'); // Trailing slash eklendi

  // 2. API Çağrısı: Vadesi Geçmiş Notlar
  const {
    data: notes,
    loading: notesLoading,
    error: notesError
  } = useApi<PromissoryNote[]>('/promissory-notes/overdue/'); // Endpoint düzeltildi

  // Hata gösterimi
  const { error: showErrorToast } = useToast();
  useEffect(() => {
    if (statsError) {
      showErrorToast('Dashboard istatistikleri çekilemedi.');
    }
    if (notesError) {
      showErrorToast('Vadesi geçmiş notlar çekilemedi.');
    }
  }, [statsError, notesError, showErrorToast]);

  // Her iki API çağrısı da bittiğinde 'isLoading' false olmalı
  const isLoading = statsLoading || notesLoading;

  // --- DÜZELTME 1: Sayfa ProtectedLayout ile sarıldı ---
  return (
    <ProtectedLayout>
      {isLoading ? (
        <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-6">
          <QuickActions />

          {/* İstatistik Kartları */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* --- DÜZELTME 3: 'value' prop'ları backend'den gelen doğru isimlerle güncellendi --- */}
            <StatsCard
              title="Toplam Şirket"
              value={stats?.companies_count ?? 0}
              icon={Building}
              href="/companies"
            />
            <StatsCard
              title="Toplam Marka"
              value={stats?.brands_count ?? 0}
              icon={Briefcase}
              href="/brands"
            />
            <StatsCard
              title="Toplam Şube"
              value={stats?.branches_count ?? 0}
              icon={MapPin}
              href="/branches"
            />
            <StatsCard
              title="Toplam Kişi"
              value={stats?.people_count ?? 0}
              icon={Users}
              href="/people"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <FinancialChart />
            </div>
            <div>
              {/* RecentActivity (Son Etkinlikler) bileşeni aşağıda düzeltilecek */}
              <RecentActivity />
            </div>
          </div>

          <OverdueNotes notes={notes || []} />
        </div>
      )}
    </ProtectedLayout>
  )
}