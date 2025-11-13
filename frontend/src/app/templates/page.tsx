'use client';

import React from 'react';
import { useApi } from '@/hooks/useApi';
import { DataTable } from '@/components/tables/data-table';
import { columns } from './_components/columns';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useModal } from '@/hooks/use-modal-store';
import { Template } from '@/types';
import ClientOnly from '@/components/ui/client-only';

// ... (imports and component definition remain the same)

const TemplatesPageContent = () => {
  const { onOpen } = useModal();
  const { data: templates, loading: isLoading, error, refetch } = useApi<Template[]>('/document-management/templates/');

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Şablonlar</h1>
        <Button onClick={() => onOpen('createTemplate')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Yeni Şablon Ekle
        </Button>
      </div>
      {isLoading ? (
        <p>Yükleniyor...</p>
      ) : (
        <DataTable columns={columns} data={templates || []} />
      )}
    </div>
  );
};

const TemplatesPage = () => {
  return (
    <ClientOnly>
      <TemplatesPageContent />
    </ClientOnly>
  );
};

export default TemplatesPage;
