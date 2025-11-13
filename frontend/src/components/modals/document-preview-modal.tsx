// frontend/src/components/modals/document-preview-modal.tsx
// !!! BU DOSYADAKİ DOĞRU KOD BUDUR (PDF ÖNİZLEME) !!!

import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DYNAMIC_FIELDS } from '@/lib/dynamic-fields'; // Adım 7.2'de oluşturmuştuk
import html2pdf from 'html2pdf.js'; // Adım 8.1'de kurmuştuk

interface DocumentPreviewModalProps {
  triggerButton: React.ReactNode;
  templateContent: string; // Şablonun ham HTML içeriği
  templateName: string;
}

// HTML içindeki {{tag}} etiketlerini bulan yardımcı fonksiyon
const findTagsInHtml = (html: string): string[] => {
  const regex = /\{\{([^}]+)\}\}/g;
  const matches = html.match(regex) || [];
  // Benzersiz etiketleri döndür
  
  // (Önceki düzeltme)
  return Array.from(new Set(matches)); // Örn: ["{{sirket_adi}}", "{{kisi_tam_adi}}"]
};

// Etikete karşılık gelen "Label" (etiket) adını bulan yardımcı fonksiyon
const getLabelForTag = (tag: string): string => {
  const field = DYNAMIC_FIELDS.find((f) => f.tag === tag);
  return field ? field.label : tag.replace(/\{\{|\}\}/g, ''); // Bulamazsa etiketi temizle
};

// --- HATA DÜZELTME (ts(2307)) ---
// Fonksiyon 'export function' olarak dışa aktarılıyor (named export)
export function DocumentPreviewModal({
  triggerButton,
  templateContent,
  templateName,
}: DocumentPreviewModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  // Form verilerini tutacak state: { "{{sirket_adi}}": "ABC Holding" }
  const [formData, setFormData] = useState<Record<string, string>>({});
  // Doldurulmuş önizleme HTML'ini tutacak state
  const [previewHtml, setPreviewHtml] = useState<string>('');

  // 1. Şablon içeriğindeki gerekli dinamik alanları bul
  const requiredTags = useMemo(() => findTagsInHtml(templateContent), [templateContent]);

  // 2. Formdaki input değişimlerini state'e yaz
  const handleInputChange = (tag: string, value: string) => {
    setFormData((prev) => ({ ...prev, [tag]: value }));
  };

  // 3. Önizleme HTML'ini oluştur
  const generatePreview = () => {
    let filledHtml = templateContent;
    for (const tag of requiredTags) {
      const value = formData[tag] || ''; // Formdan değeri al
      // Tüm {{tag}}'leri, girilen değerle (vurgulu) değiştir
      filledHtml = filledHtml.replace(
        new RegExp(tag, 'g'), 
        `<strong class="text-brand-green bg-yellow-100 px-1">${value}</strong>`
      );
    }
    setPreviewHtml(filledHtml);
  };

  // 4. PDF İndirme İşlemi
  const handlePdfDownload = () => {
    // Önizleme alanındaki HTML'i al
    const element = document.getElementById('pdf-preview-content');
    if (!element) return;
    
    // PDF'e basılacak nihai HTML'i oluştur
    let finalHtml = templateContent;
     for (const tag of requiredTags) {
      const value = formData[tag] || '[BOŞ]';
      // PDF'te vurgu olmadan, sadece metni bas
      finalHtml = finalHtml.replace(new RegExp(tag, 'g'), `<strong>${value}</strong>`);
    }
    element.innerHTML = finalHtml;

    const opt = {
      margin: 1,
      filename: `${templateName.replace(/ /g, '_')}_${new Date().toLocaleDateString('tr-TR')}.pdf`,
      
      // (Önceki düzeltme)
      image: { type: 'jpeg' as const, quality: 0.98 },
      
      html2canvas: { scale: 2 },

      // --- DÜZELTME BURADA: 'portrait' tipini 'as const' ile belirttik ---
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' as const },
      // --- DÜZELTME BİTTİ ---
    };

    html2pdf().from(element).set(opt).save();
  };
  
  // Modal kapandığında state'leri sıfırla
  const onOpenChange = (open: boolean) => {
    if (!open) {
      setFormData({});
      setPreviewHtml('');
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="max-w-6xl h-[90vh] bg-brand-DEFAULT border-brand-light flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-white">Şablon Önizleme ve Dışa Aktarma: {templateName}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
          {/* Sol Taraf: Dinamik Alan Formu */}
          <div className="col-span-4 bg-brand-dark p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Verileri Doldur</h3>
            <ScrollArea className="h-[calc(80vh-150px)]">
              <div className="space-y-4">
                {requiredTags.length > 0 ? (
                  requiredTags.map((tag) => (
                    <div key={tag}>
                      <Label htmlFor={tag} className="text-white">{getLabelForTag(tag)}</Label>
                      <Input
                        id={tag}
                        value={formData[tag] || ''}
                        onChange={(e) => handleInputChange(tag, e.target.value)}
                        placeholder={getLabelForTag(tag)}
                        className="mt-1 bg-brand-light border-brand-light text-white"
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">Bu şablonda dinamik alan bulunamadı.</p>
                )}
              </div>
            </ScrollArea>
            <Button onClick={generatePreview} className="btn btn-primary w-full mt-4">
              Önizle
            </Button>
          </div>

          {/* Sağ Taraf: HTML Önizleme */}
          <div className="col-span-8 bg-white text-black p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-black mb-4">Belge Önizlemesi</h3>
            <ScrollArea className="h-[calc(80vh-150px)] border rounded-md">
              {/* html2pdf bu elementi yakalayacak */}
              <div
                id="pdf-preview-content"
                // 'prose' sınıfı ham HTML'i (p, h1, ul etiketleri) güzelleştirir
                className="prose p-4" 
                dangerouslySetInnerHTML={{ __html: previewHtml || '<p class="text-gray-500">Önizleme oluşturmak için lütfen soldaki formu doldurup \'Önizle\' butonuna basın.</p>' }}
              />
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="btn">
            Kapat
          </Button>
          <Button 
            type="button" 
            onClick={handlePdfDownload} 
            className="btn btn-primary"
            disabled={!previewHtml} // Önizleme yapılmadıysa butonu kapa
          >
            PDF Olarak İndir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}