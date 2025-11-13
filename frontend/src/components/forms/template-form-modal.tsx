// Yeni Klasör/frontend/src/components/forms/template-form-modal.tsx
'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/lib/api'
import { useToast } from '@/hooks/useToast'
import { Loader2, Plus, X } from 'lucide-react'
import { Switch } from '@/components/ui/switch'

interface TemplateFormModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  template?: any
}

const TEMPLATE_TYPES = [
  { value: 'contract', label: 'Sözleşme' },
  { value: 'promissory_note', label: 'Senet' },
  { value: 'receipt', label: 'Makbuz' },
  { value: 'agreement', label: 'Anlaşma' },
  { value: 'other', label: 'Diğer' },
]

export function TemplateFormModal({
  open,
  onClose,
  onSuccess,
  template,
}: TemplateFormModalProps) {
  const { success, error } = useToast()
  const [loading, setLoading] = useState(false)
  const [newVariable, setNewVariable] = useState('')
  
  const [formData, setFormData] = useState({
    name: template?.name || '',
    template_type: template?.template_type || 'contract',
    content: template?.content || '',
    variables: template?.variables || [],
    is_active: template?.is_active ?? true,
  })

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name || '',
        template_type: template.template_type || 'contract',
        content: template.content || '',
        variables: template.variables || [],
        is_active: template.is_active ?? true,
      })
    } else {
      setFormData({
        name: '',
        template_type: 'contract',
        content: '',
        variables: [],
        is_active: true,
      })
    }
  }, [template, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleAddVariable = () => {
    if (newVariable.trim()) {
      const varName = newVariable.trim().startsWith('{{') 
        ? newVariable.trim() 
        : `{{${newVariable.trim()}}}`
      
      if (!formData.variables.includes(varName)) {
        setFormData(prev => ({
          ...prev,
          variables: [...prev.variables, varName],
        }))
      }
      setNewVariable('')
    }
  }

  const handleRemoveVariable = (index: number) => {
    setFormData(prev => ({
      ...prev,
      // (Önceki düzeltme)
      variables: prev.variables.filter((_: string, i: number) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (template) {
        await api.put(`/document-templates/${template.id}/`, formData)
        success('Şablon başarıyla güncellendi')
      } else {
        await api.post('/document-templates/', formData)
        success('Şablon başarıyla oluşturuldu')
      }
      onSuccess()
    } catch (err: any) {
      error(err.response?.data?.detail || 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <>
          <DialogTitle>
            {template ? 'Şablonu Düzenle' : 'Yeni Şablon Oluştur'}
          </DialogTitle>
          <DialogDescription>
            Evrak şablonu bilgilerini girin. Değişkenler için {`{{degisken_adi}}`} formatını kullanın.
          </DialogDescription>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Şablon Adı *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="İş Sözleşmesi"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template_type">Şablon Tipi *</Label>
                  <Select
                    value={formData.template_type}
                    onValueChange={(value) =>
                      setFormData(prev => ({ ...prev, template_type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TEMPLATE_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Şablon İçeriği *</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows={12}
                  placeholder="Örnek: Bu sözleşme {{person_name}} ve {{company_name}} arasında {{date}} tarihinde düzenlenmiştir..."
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label>Değişkenler</Label>
                <div className="flex gap-2">
                  <Input
                    value={newVariable}
                    onChange={(e) => setNewVariable(e.target.value)}
                    placeholder="person_name, company_name, date..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddVariable()
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddVariable}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {/* --- DÜZELTME BURADA: Parametrelere tip atandı --- */}
                  {formData.variables.map((variable: string, index: number) => (
                  // --- DÜZELTME BİTTİ ---
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-md"
                    >
                      <span className="text-sm font-mono">{variable}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveVariable(index)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, is_active: checked }))
                  }
                />
                <Label htmlFor="is_active">Aktif</Label>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                İptal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Kaydediliyor...
                  </>
                ) : (
                  'Kaydet'
                )}
              </Button>
            </DialogFooter>
          </form>
        </>
      </DialogContent>
    </Dialog>
  )
}