"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as z from "zod";
import { useToast } from "@/hooks/useToast";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { api } from "@/lib/api";

const formSchema = z.object({
  name: z.string().min(3, "Şablon adı en az 3 karakter olmalıdır."),
  template_type: z.enum(["SOZLESME", "SENET", "RAPOR"]),
  content: z.string().min(10, "İçerik alanı zorunludur."),
});

type DocumentTemplateFormModalProps = {
  triggerButton: React.ReactNode;
};

export function DocumentTemplateFormModal({ triggerButton }: DocumentTemplateFormModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    template_type: "SOZLESME",
    content: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/documents/templates/", formData); 
      success("Şablon başarıyla oluşturuldu."); 
      setIsOpen(false);
      setFormData({
        name: "",
        template_type: "SOZLESME",
        content: "",
      });
    } catch (err: any) {
      error(err.response?.data?.detail || "Şablon oluşturulurken bir hata oluştu.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="max-w-4xl bg-brand-DEFAULT border-brand-light">
        <DialogHeader>
          <DialogTitle className="text-white">Yeni Belge Şablonu Oluştur</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Şablon Adı</label>
              <Input name="name" placeholder="Örn: Standart Hizmet Sözleşmesi" value={formData.name} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Şablon Türü</label>
              <Select onValueChange={(value) => handleSelectChange('template_type', value)} defaultValue={formData.template_type}>
                <SelectTrigger>
                  <SelectValue placeholder="Bir tür seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOZLESME">Sözleşme</SelectItem>
                  <SelectItem value="SENET">Senet</SelectItem>
                  <SelectItem value="RAPOR">Rapor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Şablon İçeriği</label>
            <RichTextEditor
              value={formData.content}
              onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
            />
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="btn"
            >
              İptal
            </Button>
            <Button type="submit" className="btn btn-primary">
              Şablonu Kaydet
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}