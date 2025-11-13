// Yeni Klasör/frontend/src/components/dashboard/recent-activity.tsx
'use client'

import React, { useEffect, useCallback } from 'react'; // useCallback eklendi
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { useApi } from '@/hooks/useApi';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

interface Activity {
  id: string;
  actor_name: string; // Serializer'dan 'actor_name' geliyor
  action: string;
  object_type: string;
  timestamp: string;
}

export function RecentActivity() {
  // --- DÜZELTME 1: API endpoint'i düzeltildi ---
  const {
    data: activities,
    loading: isLoading,
    error: apiError,
    refetch // refetch eklendi
  } = useApi<Activity[]>('/dashboard/recent-activity/');

  const { error: showErrorToast } = useToast();

  // --- DÜZELTME 2: useEffect kuralı (exhaustive-deps) düzeltildi ---
  useEffect(() => {
    if (apiError) {
      console.error('Son etkinlikler çekilemedi:', apiError);
      showErrorToast('Son etkinlikler çekilemedi.');
    }
  }, [apiError, showErrorToast]);
  
  // (useApi'nin 'immediate: true' varsayımıyla, ilk yükleme için ayrı bir useEffect gerekmez)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Son Etkinlikler</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (activities ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground text-center">
            Gösterilecek son etkinlik bulunamadı.
          </p>
        ) : (
          <div className="space-y-4">
            {(activities ?? []).map((activity) => (
              <div key={activity.id} className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/20">
                    {/* --- DÜZELTME 3: Backend'den gelen 'actor_name' kullanıldı --- */}
                    {getInitials(activity.actor_name || 'Sistem')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-sm">
                  <p>
                    <span className="font-medium">
                      {activity.actor_name || 'Sistem'}
                    </span>
                    <span className="text-muted-foreground ml-1">
                      {/* Backend'den gelen verilere göre düzeltme (verb yerine action) */}
                      {activity.action} ({activity.object_type})
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleString('tr-TR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}