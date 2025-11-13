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
import RichTextEditor from '../ui/rich-text-editor';

const formSchema = z.object({
  title: z.string().min(1, 'Başlık zorunludur'),
  template_type: z.enum(['contract', 'promissory_note', 'report']),
  content_html: z.string().min(1, 'İçerik zorunludur'),
});

export const CreateTemplateModal = () => {
  const { isOpen, onClose, type } = useModal();

  const isModalOpen = isOpen && type === 'createTemplate';

  const [formData, setFormData] = useState({
    title: '',
    template_type: 'contract',
    content_html: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/document-management/templates/', formData);
      toast.success('Şablon başarıyla oluşturuldu.');
      setFormData({
        title: '',
        template_type: 'contract',
        content_html: '',
      });
      onClose();
    } catch (error: any) {
      toast.error(`Şablon oluşturulurken bir hata oluştu: ${error.message}`);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      template_type: 'contract',
      content_html: '',
    });
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Yeni Şablon Oluştur
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Yeni bir şablon oluşturmak için aşağıdaki alanları doldurun.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-8">
          <div className="space-y-8 px-6">
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Başlık</label>
              <Input name="title" placeholder="Şablon başlığı" value={formData.title} onChange={handleChange} />
            </div>
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Şablon Tipi</label>
              <Select
                onValueChange={(value) => handleSelectChange('template_type', value)}
                defaultValue={formData.template_type}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Şablon tipi seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contract">Sözleşme</SelectItem>
                  <SelectItem value="promissory_note">Senet</SelectItem>
                  <SelectItem value="report">Rapor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">HTML İçerik</label>
              <RichTextEditor
                value={formData.content_html}
                onChange={(value) => setFormData({ ...formData, content_html: value })}
              />
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
