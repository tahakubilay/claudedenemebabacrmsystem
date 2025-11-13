// Yeni Klasör/frontend/src/components/forms/report-form-modal.tsx
'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DatePicker } from '@/components/ui/datepicker'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'

// [YENİ] Rapor türlerini tanımlıyoruz (upgrade v2.txt )
type ReportType = 'finansal' | 'personel' | 'yatirimci' | 'odeme' | 'gecikme';

// Değerleri bir sabit olarak tanımlıyoruz
const REPORT_TYPES = [
  'finansal',
  'personel',
  'yatirimci',
  'odeme',
  'gecikme',
] as const;

const reportFormSchema = z.object({
  reportType: z.enum(REPORT_TYPES, {
    message: 'Rapor türü seçmek zorunludur.',
  }),
  dateRange: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
  amountRange: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
    })
    .optional(),
  companyId: z.string().optional(),
  branchId: z.string().optional(),
  personId: z.string().optional(),
});

type ReportFormValues = z.infer<typeof reportFormSchema>;

interface ReportFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportFormModal: React.FC<ReportFormModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<ReportFormValues>({
    reportType: REPORT_TYPES[0], // Set a default value
    dateRange: { from: undefined, to: undefined },
    amountRange: { min: undefined, max: undefined },
    companyId: undefined,
    branchId: undefined,
    personId: undefined,
  });

  const handleChange = (name: keyof ReportFormValues, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: 'from' | 'to', date: Date | null) => {
    setFormData(prev => ({
      ...prev,
      dateRange: { ...prev.dateRange, [name]: date },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      reportFormSchema.parse(formData);
      console.log('Rapor oluşturuluyor:', formData);
      // TODO: API'ye backend'e isteği gönder
      await new Promise(resolve => setTimeout(resolve, 1000));
      onClose();
      setFormData({
        reportType: REPORT_TYPES[0],
        dateRange: { from: undefined, to: undefined },
        amountRange: { min: undefined, max: undefined },
        companyId: undefined,
        branchId: undefined,
        personId: undefined,
      });
      setStep(1);
    } catch (err: any) {
      console.error('Form validation error:', err);
      alert(err.errors?.[0]?.message || 'Formda bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const goToNextStep = () => {
    // Sadece reportType alanını doğrula
    try {
      reportFormSchema.pick({ reportType: true }).parse(formData);
      setStep(2);
    } catch (err: any) {
      alert(err.errors?.[0]?.message || 'Rapor türü seçmek zorunludur.');
    }
  };

  const goToPrevStep = () => {
    setStep(1);
  };

  const renderDynamicFields = () => {
    switch (formData.reportType) {
      case 'finansal':
      case 'odeme':
      case 'gecikme':
        return (
          <>
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Başlangıç Tarihi</label>
              <DatePicker
                placeholderText="Tarih seçin"
                selected={formData.dateRange?.from}
                onSelect={(date) => handleDateChange('from', date)}
              />
            </div>
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Bitiş Tarihi</label>
              <DatePicker
                placeholderText="Tarih seçin"
                selected={formData.dateRange?.to}
                onSelect={(date) => handleDateChange('to', date)}
              />
            </div>
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Şirket</label>
              <Select
                onValueChange={(value) => handleChange('companyId', value)}
                defaultValue={formData.companyId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Şirket seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comp1">Şirket A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      case 'personel':
        return (
          <div>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Şube</label>
            <Select
              onValueChange={(value) => handleChange('branchId', value)}
              defaultValue={formData.branchId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Şube seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="branch1">Merkez Şube</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case 'yatirimci':
        return (
          <div>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Kişi</label>
            <Select
              onValueChange={(value) => handleChange('personId', value)}
              defaultValue={formData.personId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Kişi seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="person1">Yatırımcı A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {step === 1
              ? 'Rapor Oluştur (Adım 1/2)'
              : 'Rapor Filtreleri (Adım 2/2)'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Adım 1: Rapor Türü Seçimi */}
          <div className={step === 1 ? 'block' : 'hidden'}>
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Rapor Türü</label>
              <Select
                onValueChange={(value) => handleChange('reportType', value)}
                defaultValue={formData.reportType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Rapor türü seçin..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="finansal">Finansal Rapor</SelectItem>
                  <SelectItem value="personel">Personel Raporu</SelectItem>
                  <SelectItem value="yatirimci">
                    Yatırımcı Raporu
                  </SelectItem>
                  <SelectItem value="odeme">Ödeme Raporu</SelectItem>
                  <SelectItem value="gecikme">Gecikme Raporu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Adım 2: Dinamik Filtreler */}
          <div className={step === 2 ? 'block' : 'hidden'}>
            {renderDynamicFields()}
          </div>

          <DialogFooter>
            {/* Adım 1 Butonları */}
            {step === 1 && (
              <Button type="button" onClick={goToNextStep}>
                İleri
              </Button>
            )}

            {/* Adım 2 Butonları */}
            {step === 2 && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={goToPrevStep}
                >
                  Geri
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Raporu Oluştur'
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};