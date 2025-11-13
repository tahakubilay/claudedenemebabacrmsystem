'use client';

import { Column } from '@/components/tables/data-table';
import { Template } from '@/types';

export const columns: Column<Template>[] = [
  {
    accessorKey: 'title',
    header: 'Başlık',
  },
  {
    accessorKey: 'template_type',
    header: 'Şablon Tipi',
  },
  {
    accessorKey: 'usage_count',
    header: 'Kullanım Sayısı',
  },
  {
    accessorKey: 'created_at',
    header: 'Oluşturulma Tarihi',
  },
];
