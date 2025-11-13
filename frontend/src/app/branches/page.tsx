'use client'

import React, { useState, useEffect } from 'react';
// 'Column' tipini artık data-table'dan import edebiliyoruz
import { DataTable, Column } from '@/components/tables/data-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { BranchFormModal } from '@/components/forms/branch-form-modal';
import { useApi } from '@/hooks/useApi';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

// Branch arayüzü
interface Branch {
  id: string;
  name: string;
  status: 'active' | 'passive';
  created_at: string;
}

// --- DÜZELTME: 'columns' sabitine 'Column<Branch>[]' tipi atandı ---
// Bu, DataTable'ın beklediği özel tiptir.
const columns: Column<Branch>[] = [
  { accessorKey: 'name', header: 'Şube Adı' },
  { accessorKey: 'status', header: 'Durum' },
  { accessorKey: 'created_at', header: 'Oluşturma Tarihi' },
];

const BranchesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // useApi hook'u, endpoint'i (1. argüman) alır
  const {
    data: branches,
    loading: isLoading,
    error: apiError,
    refetch
  } = useApi<Branch[]>('/branches/'); // 1. argüman (endpoint)

  // useToast hook'undan 'error' fonksiyonunu alıyoruz
  const { error: showErrorToast } = useToast();

  // apiError state'i değiştiğinde (hata oluştuğunda) toast göster
  useEffect(() => {
    if (apiError) {
      showErrorToast('Şube verileri çekilemedi.');
    }
  }, [apiError, showErrorToast]);

  // Modal kapandığında veriyi yeniden çek (tabloyu güncelle)
  const handleModalClose = () => {
    setIsModalOpen(false);
    refetch();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Şubeler</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Yeni Şube Ekle
        </Button>
      </div>

      {/* isLoading durumunu doğrudan useApi hook'undan alıyoruz */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        /* 'columns' artık doğru tipte
           'data' ise (branches) useApi'dan geliyor
        */
        <DataTable columns={columns} data={branches || []} />
      )}

      <BranchFormModal
        open={isModalOpen}
        onClose={handleModalClose} // Güncellenmiş kapatma fonksiyonu
        onSuccess={handleModalClose}
      />
    </div>
  );
};

export default BranchesPage;