'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/useToast'
import { api } from '@/lib/api'

// Tipleri bir sabit (const) olarak tanımlıyoruz
const PERSON_TYPES = ['yatirimci', 'calisan', 'diger'] as const;
// TypeScript tipi oluşturuyoruz
type PersonType = (typeof PERSON_TYPES)[number];

const personSchema = z.object({
  firstName: z.string().min(2, 'İsim en az 2 karakter olmalıdır.'),
  lastName: z.string().min(2, 'Soyisim en az 2 karakter olmalıdır.'),
  phone: z.string().optional(),
  email: z.string().email('Geçersiz e-posta adresi.').optional(),
  tc: z.string().length(11, 'TC Kimlik 11 haneli olmalıdır.').optional(),
  type: z
    .string()
    .nonempty('Kişi türü zorunludur.')
    .refine(
      (val): val is PersonType => PERSON_TYPES.includes(val as PersonType),
      {
        message: 'Geçersiz kişi tipi seçtiniz.',
      }
    ),
  companyId: z.string().optional(),
  brandId: z.string().optional(),
  branchId: z.string().optional(),
});

type FormData = z.infer<typeof personSchema>;

interface AddPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddPersonModal({ isOpen, onClose, onSuccess }: AddPersonModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useToast();

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    tc: '',
    type: 'calisan', // Default value
    companyId: '',
    brandId: '',
    branchId: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Basic validation using Zod schema
      personSchema.parse(formData);

      await api.post('/people/', formData);
      
      success(`${formData.firstName} ${formData.lastName} başarıyla eklendi.`);
      
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        tc: '',
        type: 'calisan',
        companyId: '',
        brandId: '',
        branchId: '',
      });
      onSuccess?.();
      onClose();
    } catch (err: any) {
      error(err.errors?.[0]?.message || 'Kişi eklenirken bir sorun oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateContract = () => {
    console.log('Sözleşme oluştur (TODO)');
    error('Önce kişiyi kaydetmelisiniz.');
  };

  const handleCreatePromissory = () => {
    console.log('Senet oluştur (TODO)');
    error('Önce kişiyi kaydetmelisiniz.');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Yeni Kişi Ekle</DialogTitle>
          <DialogDescription>
            Sisteme yeni bir yatırımcı, çalışan veya diğer kişi ekleyin.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">İsim</label>
                <Input name="firstName" placeholder="Ahmet" value={formData.firstName} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Soyisim</label>
                <Input name="lastName" placeholder="Yılmaz" value={formData.lastName} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Telefon</label>
                <Input name="phone" placeholder="555..." value={formData.phone} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">E-posta</label>
                <Input name="email" placeholder="ahmet@example.com" value={formData.email} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">TC Kimlik (İsteğe bağlı)</label>
                <Input name="tc" placeholder="111..." value={formData.tc} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Şirket</label>
                <Select onValueChange={(value) => handleSelectChange('companyId', value)} defaultValue={formData.companyId}>
                  <SelectTrigger>
                    <SelectValue placeholder="İlişkili şirket seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="1">Şirket A</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Kişi Türü</label>
              <RadioGroup
                onValueChange={(value) => handleSelectChange('type', value)}
                defaultValue={formData.type}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yatirimci" />
                  <label className="font-normal">Yatırımcı</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="calisan" />
                  <label className="font-normal">Çalışan</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="diger" />
                  <label className="font-normal">Diğer</label>
                </div>
              </RadioGroup>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={handleCreateContract}>
                Sözleşme Oluştur (İsteğe Bağlı)
              </Button>
              <Button type="button" variant="outline" onClick={handleCreatePromissory}>
                Senet Oluştur (İsteğe Bağlı)
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="ghost">İptal</Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Kişiyi Ekle'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
    </Dialog>
  )
}