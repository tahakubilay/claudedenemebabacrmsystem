'use client'

import React, { useState, useEffect } from 'react';
import { DataTable, Column } from '@/components/tables/data-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CompanyFormModal } from '@/components/forms/company-form-modal';
import { useApi } from '@/hooks/useApi';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import ClientOnly from '@/components/ui/client-only';
import { Company } from '@/types';

const columns: Column<Company>[] = [
  { accessorKey: 'title', header: 'Şirket Adı' },
  { accessorKey: 'created_at', header: 'Oluşturma Tarihi' },
];

const CompaniesPageContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: companies,
    loading: isLoading,
    error: apiError,
    refetch
  } = useApi<Company[]>('/companies/');

  const { error: showErrorToast } = useToast();

  useEffect(() => {
    if (apiError) {
      showErrorToast('Şirket verileri çekilemedi.');
    }
  }, [apiError, showErrorToast]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    refetch();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Şirketler</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Yeni Şirket Ekle
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable columns={columns} data={companies || []} />
      )}

      <CompanyFormModal
        open={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalClose}
      />
    </div>
  );
};

const CompaniesPage = () => {
  return (
    <ClientOnly>
      <CompaniesPageContent />
    </ClientOnly>
  );
};

export default CompaniesPage;