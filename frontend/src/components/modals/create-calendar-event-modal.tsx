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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const formSchema = z.object({
  title: z.string().min(1, 'Başlık zorunludur'),
  description: z.string().optional(),
  start: z.string().min(1, 'Başlangıç tarihi zorunludur'),
  end: z.string().optional(),
  category: z.enum([
    'upcoming_payment',
    'overdue_payment',
    'new_contract',
    'promissory_note',
    'report_reminder',
  ]),
});

export const CreateCalendarEventModal = () => {
  const { isOpen, onClose, type } = useModal();

  const isModalOpen = isOpen && type === 'createCalendarEvent';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    category: 'upcoming_payment',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/document-management/calendar-events/', formData);
      toast.success('Etkinlik başarıyla oluşturuldu.');
      setFormData({
        title: '',
        description: '',
        start: '',
        end: '',
        category: 'upcoming_payment',
      });
      onClose();
    } catch (error: any) {
      toast.error(`Etkinlik oluşturulurken bir hata oluştu: ${error.message}`);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      start: '',
      end: '',
      category: 'upcoming_payment',
    });
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Yeni Etkinlik Oluştur
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Yeni bir takvim etkinliği oluşturmak için aşağıdaki alanları doldurun.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-8">
          <div className="space-y-8 px-6">
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Başlık</label>
              <Input name="title" placeholder="Etkinlik başlığı" value={formData.title} onChange={handleChange} />
            </div>
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Açıklama</label>
              <Textarea name="description" placeholder="Etkinlik açıklaması" value={formData.description} onChange={handleChange} />
            </div>
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Başlangıç Tarihi</label>
              <Input type="datetime-local" name="start" value={formData.start} onChange={handleChange} />
            </div>
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Bitiş Tarihi</label>
              <Input type="datetime-local" name="end" value={formData.end} onChange={handleChange} />
            </div>
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Kategori</label>
              <Select
                onValueChange={(value) => handleSelectChange('category', value)}
                defaultValue={formData.category}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming_payment">
                    Yaklaşan Ödeme
                  </SelectItem>
                  <SelectItem value="overdue_payment">
                    Gecikmiş Ödeme
                  </SelectItem>
                  <SelectItem value="new_contract">
                    Yeni Sözleşme
                  </SelectItem>
                  <SelectItem value="promissory_note">Senet</SelectItem>
                  <SelectItem value="report_reminder">
                    Rapor Hatırlatma
                  </SelectItem>
                </SelectContent>
              </Select>
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
