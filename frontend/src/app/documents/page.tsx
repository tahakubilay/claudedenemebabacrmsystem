// Yeni Klasör/frontend/src/app/documents/page.tsx
"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic"; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileEdit, Trash, Eye, Loader2 } from "lucide-react";

import { DataTable, Column } from "@/components/tables/data-table";

// --- DÜZELTME 1: Doğru dosya yolu import edildi ---
const DocumentTemplateFormModal = dynamic(
  () => 
    import("@/components/forms/document-template-form-modal").then(
      (mod) => mod.DocumentTemplateFormModal
    ),
  { 
    ssr: false, 
    loading: () => <Button className="btn btn-primary" disabled><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Yükleniyor...</Button> 
  }
);
// --- DÜZELTME BİTTİ ---

const DocumentPreviewModal = dynamic(
  () =>
    import("@/components/modals/document-preview-modal").then(
      (mod) => mod.DocumentPreviewModal
    ),
  { 
    ssr: false, 
    loading: () => <Button variant="outline" size="icon" className="btn border-blue-500"><Loader2 className="h-4 w-4 animate-spin" /></Button>
  }
);


// Template Tipi (Adım 8'deki 'content' alanı dahil)
type Template = {
  id: string;
  name: string;
  type: 'Sözleşme' | 'Senet' | 'Rapor';
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  content: string; // PDF'e basılacak HTML içeriği
};

// --- MOCK DATA (Global Kapsamda) ---
const mockContractTemplates: Template[] = [
  { 
    id: 'c1', 
    name: 'Standart Hizmet Sözleşmesi V2', 
    type: 'Sözleşme', 
    createdAt: '01.10.2025', 
    updatedAt: '05.11.2025', 
    usageCount: 42,
    content: `
      <h1>Hizmet Sözleşmesi</h1>
      <p>Bu sözleşme, <strong>{{sirket_adi}}</strong> ile <strong>{{kisi_tam_adi}}</strong> arasında 
      {{tarih_bugun}} tarihinde imzalanmıştır.</p>
      <p>Şirket Adresi: {{sirket_adresi}}</p>
    `
  },
];
const mockNoteTemplates: Template[] = [
  { id: 'n1', name: 'Genel Senet Şablonu', type: 'Senet', createdAt: '02.10.2025', updatedAt: '03.11.2025', usageCount: 105, content: '<p>Senet içeriği {{kisi_tam_adi}}</p>' },
];
const mockReportTemplates: Template[] = [
  { id: 'r1', name: 'Aylık Faaliyet Raporu', type: 'Rapor', createdAt: '03.10.2025', updatedAt: '06.11.2025', usageCount: 22, content: '<h1>Aylık Rapor</h1><p>Şube: {{sube_adi}}</p>' },
];


const templateColumns: Column<Template>[] = [
  {
    accessorKey: "name",
    header: "Şablon Adı",
    cell: (row) => <span className="font-medium text-white">{row.name}</span>,
  },
  {
    accessorKey: "type",
    header: "Türü",
    cell: (row) => (
      <span className="bg-brand-light px-2 py-1 rounded-md text-xs">{row.type}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Oluşturma Tarihi",
  },
  {
    accessorKey: "updatedAt",
    header: "Son Düzenleme",
  },
  {
    accessorKey: "usageCount",
    header: "Kullanım Sayısı",
    cell: (row) => (
      <span className="font-bold text-brand-green text-center block">
        {row.usageCount}
      </span>
    ),
  },
  {
    header: "İşlemler",
    cell: (template) => { 
      return (
        <div className="flex justify-end gap-2">
          
          <DocumentPreviewModal
            templateName={template.name}
            templateContent={template.content}
            triggerButton={
              <Button variant="outline" size="icon" className="btn border-blue-500 hover:bg-blue-500/10">
                <Eye className="h-4 w-4 text-blue-400" />
              </Button>
            }
          />

          <Button variant="outline" size="icon" className="btn border-yellow-500 hover:bg-yellow-500/10">
            <FileEdit className="h-4 w-4 text-yellow-400" />
          </Button>

          <Button variant="destructive" size="icon" className="btn">
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

export default function DocumentsPage() {
  const [contracts] = useState(mockContractTemplates);
  const [notes] = useState(mockNoteTemplates);
  const [reports] = useState(mockReportTemplates);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="bg-brand-DEFAULT border-brand-light">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl text-white">Belge Şablonları</CardTitle>
            <p className="text-gray-400">Sözleşme, senet ve rapor şablonlarını yönetin.</p>
          </div>
          
          {/* Bu bileşen artık 'triggerButton' prop'unu kabul ediyor */}
          <DocumentTemplateFormModal 
            triggerButton={
              <Button className="btn btn-primary">
                <Plus className="mr-2 h-4 w-4" /> Yeni Şablon Ekle
              </Button>
            } 
          />
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="contracts" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-brand-dark mb-4 h-12">
              <TabsTrigger value="contracts" className="text-base">Sözleşme Şablonları</TabsTrigger>
              <TabsTrigger value="promissory-notes" className="text-base">Senet Şablonları</TabsTrigger>
              <TabsTrigger value="reports" className="text-base">Rapor Şablonları</TabsTrigger>
            </TabsList>

            <TabsContent value="contracts" className="mt-6">
              <DataTable columns={templateColumns} data={contracts} />
            </TabsContent>
            <TabsContent value="promissory-notes" className="mt-6">
              <DataTable columns={templateColumns} data={notes} />
            </TabsContent>
            <TabsContent value="reports" className="mt-6">
              <DataTable columns={templateColumns} data={reports} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}