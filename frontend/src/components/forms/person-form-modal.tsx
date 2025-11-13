// Yeni Klasör/frontend/src/components/forms/person-form-modal.tsx
'use client'

import { useState, useEffect, useRef } from 'react' 
// --- DÜZELTME 1: 'Image' bileşeni import edildi ---
import Image from 'next/image'
// --- DÜZELTME BİTTİ ---
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader, 
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
import { Loader2, User, Upload, Calendar, FileText, Receipt, Cloud, X } from 'lucide-react' 
import { Branch, Role, Person } from '@/types' 
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'

// Mock Data (Gereksinimlerinizden alındı - backend entegrasyonu olmadan çalışması için)
const CONTRACT_TEMPLATES = [
  { id: 'ct1', name: 'İş Sözleşmesi Şablonu 1' },
  { id: 'ct2', name: 'Ortaklık Sözleşmesi' }
];

const BOND_TEMPLATES = [
  { id: 'bt1', name: 'Yatırım Senedi Şablonu' },
  { id: 'bt2', name: 'Kredi Senedi' }
];
// --- Mock Data Bitti ---

interface PersonFormModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  person?: Person // Tipi güncellendi
}

export function PersonFormModal({
  open,
  onClose,
  onSuccess,
  person,
}: PersonFormModalProps) {
  const { success, error } = useToast()
  const [loading, setLoading] = useState(false)
  const [branches, setBranches] = useState<Branch[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  
  // --- YENİ STATE'LER ---
  const fileInputRef = useRef<HTMLInputElement>(null)
  const receiptInputRef = useRef<HTMLInputElement>(null)
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null)
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null)
  const [uploadedReceipt, setUploadedReceipt] = useState<File | null>(null)
  // --- YENİ BİTTİ ---

  const [formData, setFormData] = useState({
    // Temel alanlar
    full_name: person?.full_name || '',
    role: (person?.role && typeof person.role === 'object' ? person.role.id : person?.role) || '',
    branch: (person?.branch && typeof person.branch === 'object' ? person.branch.id : person?.branch) || '',
    national_id: person?.national_id || '',
    phone: person?.phone || '',
    email: person?.email || '',
    iban: person?.iban || '',
    address: person?.address || '',
    is_active: person?.is_active ?? true,
    
    // --- YATIRIM BİLGİLERİ (Ekstra alanlar) ---
    investment_date: '',
    share_percentage: '',
    investment_amount: '',
    // --- BELGE BİLGİLERİ ---
    contract_template_id: '',
    bond_template_id: '',
    receipt_description: '', // Dekont için ek açıklama
    notes: '', // Not alanı
  })

  // Veri çekme (useCallback ile sarmalanabilir, ancak formun içine gömülü olduğu için şimdilik tutarsızlık yaratmaz)
  useEffect(() => {
    fetchBranches()
    fetchRoles()
  }, [])
  
  // Kişi verisi değiştiğinde formu ve önizlemeyi güncelle
  useEffect(() => {
    if (person) {
      setFormData(prev => ({
        ...prev,
        full_name: person.full_name || '',
        role: (person.role && typeof person.role === 'object' ? person.role.id : person.role) || '',
        branch: (person.branch && typeof person.branch === 'object' ? person.branch.id : person.branch) || '',
        national_id: person.national_id || '',
        phone: person.phone || '',
        email: person.email || '',
        iban: person.iban || '',
        address: person.address || '',
        is_active: person.is_active ?? true,
      }))
      setProfilePhotoPreview(person.profile_photo || null)
    } else if (open) {
      // Yeni kişi modu, modal açıldığında sıfırla
      setFormData({
        full_name: '', role: '', branch: '', national_id: '', phone: '', email: '',
        iban: '', address: '', is_active: true, investment_date: '',
        share_percentage: '', investment_amount: '', contract_template_id: '',
        bond_template_id: '', receipt_description: '', notes: '',
      })
      setProfilePhotoPreview(null)
      setProfilePhotoFile(null)
      setUploadedReceipt(null)
    }
  }, [person, open])

  const fetchBranches = async () => {
    try {
      const data = await api.get<{ results: Branch[] }>('/branches/')
      setBranches(data.results || data as any)
    } catch (err) {
      console.error('Failed to fetch branches:', err)
    }
  }

  const fetchRoles = async () => {
    try {
      const data = await api.get<{ results: Role[] }>('/roles/')
      setRoles(data.results || data as any)
    } catch (err) {
      console.error('Failed to fetch roles:', err)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    let { name, value } = e.target;
    
    if (name === 'phone') {
        const numbers = value.replace(/\D/g, '');
        if (numbers.startsWith('90')) {
            const phoneNumber = numbers.slice(2);
            if (phoneNumber.length <= 3) value = `+90 ${phoneNumber}`;
            else if (phoneNumber.length <= 6) value = `+90 ${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3)}`;
            else if (phoneNumber.length <= 8) value = `+90 ${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3, 6)} ${phoneNumber.slice(6)}`;
            else value = `+90 ${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3, 6)} ${phoneNumber.slice(6, 8)} ${phoneNumber.slice(8, 10)}`;
        }
    } else if (name === 'iban') {
        const cleaned = value.replace(/\s/g, '').toUpperCase();
        if (!cleaned.startsWith('TR')) {
            value = 'TR' + cleaned.replace(/TR/g, '');
        }
        const formatted = value.match(/.{1,4}/g);
        value = formatted ? formatted.join(' ') : cleaned;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setProfilePhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setUploadedReceipt(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhotoFile(null);
    setProfilePhotoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const dataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            if (key === 'phone' || key === 'iban') {
                dataToSend.append(key, String(value).replace(/[^0-9TR]/g, ''));
            } else {
                dataToSend.append(key, String(value));
            }
        }
    });

    if (profilePhotoFile) {
        dataToSend.append('profile_photo', profilePhotoFile);
    }
    
    if (person && !profilePhotoFile && !profilePhotoPreview && person.profile_photo) {
        dataToSend.append('profile_photo', ''); 
    }

    if (typeof formData.role === 'string') {
        dataToSend.set('role', formData.role);
    }
    if (typeof formData.branch === 'string') {
        dataToSend.set('branch', formData.branch);
    }


    try {
      if (person) {
        await api.patch(`/people/${person.id}/`, dataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        success('Kişi başarıyla güncellendi')
      } else {
        await api.post('/people/', dataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        success('Kişi başarıyla oluşturuldu')
      }
      
      onSuccess()
    } catch (err: any) {
      const detail = err.response?.data?.detail || JSON.stringify(err.response?.data) || 'Bir hata oluştu';
      error(detail)
    } finally {
      setLoading(false)
    }
  }
  
  const calculateMonthlyEarnings = () => {
    const amountStr = formData.investment_amount.replace(/\./g, '') || '0';
    const amount = parseFloat(amountStr) || 0;
    const percentage = parseFloat(formData.share_percentage) || 0;
    return Math.round((amount * percentage / 100) / 12);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle>
            {person ? 'Kişiyi Düzenle' : 'Yeni Kişi Ekle'}
          </DialogTitle>
          <DialogDescription>
            Kişi bilgilerini doldurun ve kaydedin
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="flex gap-6">
            {/* SOL KISIM: Fotoğraf ve Adres (Yeni Tasarım) */}
            <div className="flex flex-col w-64 space-y-6">
              {/* Profil Fotoğrafı */}
              <div className="flex flex-col items-center">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-40 h-40 bg-muted/50 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-muted/70 transition-all overflow-hidden relative"
                >
                  {/* --- DÜZELTME 2: <img>, <Image /> ile değiştirildi --- */}
                  {profilePhotoPreview || (person?.profile_photo) ? (
                    <>
                        <Image 
                            src={profilePhotoPreview || (person?.profile_photo || '')} 
                            alt="Profile" 
                            className="w-full h-full object-cover" 
                            width={160} // 10rem = 160px
                            height={160} // 10rem = 160px
                            priority={true} // Modal içindeki önemli resim
                        />
                        <button type="button" onClick={handleRemovePhoto} className="absolute top-2 right-2 p-1 bg-destructive rounded-full text-white hover:bg-destructive/80">
                            <X className="w-4 h-4" />
                        </button>
                    </>
                  ) : (
                    <div className="text-center">
                      <User className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">Profil fotoğrafı yükle</p>
                    </div>
                  )}
                  {/* --- DÜZELTME BİTTİ --- */}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  name="profile_photo"
                />
              </div>

              {/* Adres Bölümü (Basitleştirildi - Sadece Textarea) */}
              <div className="space-y-2">
                <Label htmlFor="address">Adres</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Açık adres, şehir, mahalle..."
                />
              </div>

              {/* Dekont Yükle (Yeni) */}
              <div className="space-y-2">
                <Label>Dekont Yükle</Label>
                <div 
                  onClick={() => receiptInputRef.current?.click()}
                  className="w-full bg-input border-2 border-dashed border-border rounded-xl px-4 py-6 text-center cursor-pointer hover:border-primary transition-all group"
                >
                  {uploadedReceipt ? (
                    <div className="text-primary">
                      <FileText className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">{uploadedReceipt.name}</p>
                      <p className="text-xs text-muted-foreground">Kaydedildikten sonra yüklenecek.</p>
                    </div>
                  ) : (
                    <>
                      <Cloud className="w-8 h-8 text-muted-foreground group-hover:text-primary mx-auto mb-2 transition-colors" />
                      <p className="text-sm text-muted-foreground group-hover:text-foreground">Dosya yüklemek için tıklayın</p>
                    </>
                  )}
                </div>
                <input
                  ref={receiptInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleReceiptUpload}
                  className="hidden"
                />
                
                {uploadedReceipt && (
                  <Input 
                    placeholder="Dekont Açıklaması"
                    value={formData.receipt_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, receipt_description: e.target.value }))}
                  />
                )}
              </div>
            </div>

            {/* SAĞ KISIM: Ana Form ve Belgeler */}
            <div className="flex-1 space-y-6">
                
                {/* 1. KİŞİSEL BİLGİLER */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Ad Soyad *</Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                        placeholder="Ahmet Yılmaz"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Rol *</Label>
                      <Select
                        value={String(formData.role)}
                        onValueChange={(value) =>
                          setFormData(prev => ({ ...prev, role: value }))
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Rol seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.display_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="branch">Şube *</Label>
                      <Select
                        value={String(formData.branch)}
                        onValueChange={(value) =>
                          setFormData(prev => ({ ...prev, branch: value }))
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Şube seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {branches.map((branch) => (
                            <SelectItem key={branch.id} value={branch.id}>
                              {branch.name} ({branch.brand_name})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="email">E-posta</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="ornek@email.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Telefon</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+90 555 555 55 55"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="iban">IBAN</Label>
                        <Input
                          id="iban"
                          name="iban"
                          type="text"
                          value={formData.iban}
                          onChange={handleChange}
                          maxLength={34}
                          placeholder="TR00 0000 0000 0000 0000 0000 00"
                          className="font-mono"
                        />
                    </div>
                </div>

                {/* 2. YATIRIM BİLGİLERİ */}
                <div className="space-y-4 pt-4 border-t border-border">
                    <h3 className="text-lg font-semibold">Yatırım Bilgileri</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="investment_amount">Yatırım Tutarı</Label>
                          <Input
                            id="investment_amount"
                            name="investment_amount"
                            type="text"
                            value={formData.investment_amount}
                            onChange={handleChange}
                            placeholder="100.000"
                            onBlur={(e) => handleChange(e)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="share_percentage">Hisse Oranı (%)</Label>
                          <Input
                            id="share_percentage"
                            name="share_percentage"
                            type="number"
                            value={formData.share_percentage}
                            onChange={handleChange}
                            placeholder="10"
                            min="0"
                            max="100"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Aylık Kazanç</Label>
                          <Input
                            value={`₺ ${calculateMonthlyEarnings()}`}
                            readOnly
                            disabled
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="investment_date">Yatırım Tarihi</Label>
                          <Input
                            id="investment_date"
                            name="investment_date"
                            type="date"
                            value={formData.investment_date}
                            onChange={handleChange}
                          />
                        </div>
                    </div>
                </div>
                
                {/* 3. BELGELER VE NOTLAR */}
                <div className="space-y-4 pt-4 border-t border-border">
                    <h3 className="text-lg font-semibold">BELGELER</h3>
                    <div className="grid grid-cols-2 gap-4">
                        
                        <div className="space-y-2">
                            <Label htmlFor="contract_template_id">Sözleşme Seç</Label>
                            <Select
                              value={formData.contract_template_id}
                              onValueChange={(value) =>
                                setFormData(prev => ({ ...prev, contract_template_id: value }))
                              }
                            >
                                <SelectTrigger>
                                <SelectValue placeholder="Şablon Seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CONTRACT_TEMPLATES.map(template => (
                                        <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {formData.contract_template_id && (
                                <Button size="sm" variant="secondary" className="w-full mt-2">
                                    <FileText className="w-4 h-4 mr-2" /> Oluştur & Önizle
                                </Button>
                            )}
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="bond_template_id">Senet Seç</Label>
                            <Select
                              value={formData.bond_template_id}
                              onValueChange={(value) =>
                                setFormData(prev => ({ ...prev, bond_template_id: value }))
                              }
                            >
                                <SelectTrigger>
                                <SelectValue placeholder="Şablon Seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    {BOND_TEMPLATES.map(template => (
                                        <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {formData.bond_template_id && (
                                <Button size="sm" variant="secondary" className="w-full mt-2">
                                    <Receipt className="w-4 h-4 mr-2" /> Oluştur & Önizle
                                </Button>
                            )}
                        </div>
                        
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="notes">Not</Label>
                            <Textarea
                                id="notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Ek açıklama veya yorumlar..."
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2 pt-4 border-t border-border">
                  <Input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, is_active: e.target.checked }))
                    }
                    className="rounded border-muted w-4 h-4"
                  />
                  <Label htmlFor="is_active" className="font-normal cursor-pointer">
                    Aktif kişi
                  </Label>
                </div>
            </div>

          </div>

          <DialogFooter className="mt-6">
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
      </DialogContent>
    </Dialog>
  )
}