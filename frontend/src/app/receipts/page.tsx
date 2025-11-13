'use client';

import React from 'react';
import { useApi } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useModal } from '@/hooks/use-modal-store';
import { ReceiptTimeline } from '@/components/ui/timeline';
import { Receipt } from '@/types';
import ClientOnly from '@/components/ui/client-only';

// ... (imports and component definition remain the same)

const ReceiptsPageContent = () => {
  const { onOpen } = useModal();
  const { data: receipts, loading: isLoading, error, refetch } = useApi<Receipt[]>('/document-management/receipts/');

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dekontlar</h1>
        <Button onClick={() => onOpen('createReceipt')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Yeni Dekont Ekle
        </Button>
      </div>
      {isLoading ? (
        <p>Yükleniyor...</p>
      ) : (
        <ReceiptTimeline receipts={receipts || []} />
      )}
    </div>
  );
};

const ReceiptsPage = () => {
  return (
    <ClientOnly>
      <ReceiptsPageContent />
    </ClientOnly>
  );
};

export default ReceiptsPage;
