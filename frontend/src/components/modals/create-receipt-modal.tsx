'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useModal } from '@/hooks/use-modal-store';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import React, { useState } from 'react';
import * as z from 'zod';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const formSchema = z.object({
  title: z.string().min(1, 'Başlık zorunludur'),
  description: z.string().min(1, 'Açıklama zorunludur'),
  amount: z.number().optional(),
  date: z.string().min(1, 'Tarih zorunludur'),
});

export const CreateReceiptModal = () => {
  const { isOpen, onClose, type } = useModal();

  const isModalOpen = isOpen && type === 'createReceipt';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: 0,
    date: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/document-management/receipts/', formData);
      toast.success('Dekont başarıyla oluşturuldu.');
      setFormData({
        title: '',
        description: '',
        amount: 0,
        date: '',
      });
      onClose();
    } catch (error: any) {
      toast.error(`Dekont oluşturulurken bir hata oluştu: ${error.message}`);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      amount: 0,
      date: '',
    });
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Yeni Dekont Oluştur
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Yeni bir dekont oluşturmak için aşağıdaki alanları doldurun.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-8">
          <div className="space-y-8 px-6">
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Başlık</label>
              <Input name="title" placeholder="Dekont başlığı" value={formData.title} onChange={handleChange} />
            </div>
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Açıklama</label>
              <Textarea name="description" placeholder="Dekont açıklaması" value={formData.description} onChange={handleChange} />
            </div>
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Tutar</label>
              <Input type="number" name="amount" placeholder="Tutar" value={formData.amount} onChange={handleChange} />
            </div>
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Tarih</label>
              <Input type="date" name="date" value={formData.date} onChange={handleChange} />
            </div>
          </div>
          <DialogFooter className="bg-gray-100 px-6 py-4">
            <Button type="submit" variant="default">
              Oluştur
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
