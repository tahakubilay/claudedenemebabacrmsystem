import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, User, Calendar, FileText, Receipt, Cloud } from 'lucide-react';

// Mock data - Bu veriler backend'den gelecek
const ROLES = [
  { id: 'admin', name: 'Admin' },
  { id: 'manager', name: 'Yönetici' },
  { id: 'investor', name: 'Yatırımcı' },
  { id: 'employee', name: 'Çalışan' },
  { id: 'contractor', name: 'Taşeron' }
];

const CITIES = [
  { id: 1, name: 'İstanbul' },
  { id: 2, name: 'Ankara' },
  { id: 3, name: 'İzmir' }
];

interface Neighborhood {
  id: number;
  name: string;
}

const NEIGHBORHOODS: { [key: number]: Neighborhood[] } = {
  1: [{ id: 11, name: 'Kadıköy' }, { id: 12, name: 'Beşiktaş' }],
  2: [{ id: 21, name: 'Çankaya' }, { id: 22, name: 'Keçiören' }],
  3: [{ id: 31, name: 'Karşıyaka' }, { id: 32, name: 'Bornova' }]
};

const STREETS: { [key: number]: string[] } = {
  11: ['Bahariye Caddesi', 'Moda Caddesi'],
  12: ['Barbaros Bulvarı', 'Abbasağa Parkı']
};

const BRANCHES = [
  { id: 'b1', name: 'Merkez Şube', company: 'ABC Teknoloji' },
  { id: 'b2', name: 'Kadıköy Şubesi', company: 'ABC Teknoloji' },
  { id: 'b3', name: 'Ankara Şubesi', company: 'XYZ Holding' }
];

const CONTRACT_TEMPLATES = [
  { id: 'ct1', name: 'İş Sözleşmesi Şablonu 1' },
  { id: 'ct2', name: 'Ortaklık Sözleşmesi' }
];

const BOND_TEMPLATES = [
  { id: 'bt1', name: 'Yatırım Senedi Şablonu' },
  { id: 'bt2', name: 'Kredi Senedi' }
];

const PersonAddModal = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploadedReceipt, setUploadedReceipt] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const receiptInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    // Kişisel Bilgiler
    firstName: '',
    lastName: '',
    role: '',
    email: '',
    phone: '+90',
    iban: '',
    
    // Adres
    city: '',
    neighborhood: '',
    street: '',
    addressDetail: '',
    
    // Yatırım Bilgileri
    investmentLocation: '',
    investmentDate: '',
    sharePercentage: '',
    investmentAmount: '',
    
    // Belgeler
    selectedContract: '',
    selectedBond: '',
    notes: ''
  });

  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [streets, setStreets] = useState<string[]>([]);
  const [showContractCreate, setShowContractCreate] = useState(false);
  const [showBondCreate, setShowBondCreate] = useState(false);

  // Şehir değiştiğinde mahalle listesini güncelle
  useEffect(() => {
    const cityId = Number(formData.city);
    if (cityId) {
      setNeighborhoods(NEIGHBORHOODS[cityId] || []);
      setFormData(prev => ({ ...prev, neighborhood: '', street: '' }));
      setStreets([]);
    }
  }, [formData.city]);

  // Mahalle değiştiğinde sokak listesini güncelle
  useEffect(() => {
    const neighborhoodId = Number(formData.neighborhood);
    if (neighborhoodId) {
      setStreets(STREETS[neighborhoodId] || []);
      setFormData(prev => ({ ...prev, street: '' }));
    }
  }, [formData.neighborhood]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedReceipt(file.name);
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.startsWith('90')) {
      const phoneNumber = numbers.slice(2);
      if (phoneNumber.length <= 3) return `+90 ${phoneNumber}`;
      if (phoneNumber.length <= 6) return `+90 ${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3)}`;
      if (phoneNumber.length <= 8) return `+90 ${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3, 6)} ${phoneNumber.slice(6)}`;
      return `+90 ${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3, 6)} ${phoneNumber.slice(6, 8)} ${phoneNumber.slice(8, 10)}`;
    }
    return value;
  };

  const formatIBAN = (value: string) => {
    const cleaned = value.replace(/\s/g, '').toUpperCase();
    if (!cleaned.startsWith('TR')) {
      return 'TR' + cleaned.replace(/TR/g, '');
    }
    const formatted = cleaned.match(/.{1,4}/g);
    return formatted ? formatted.join(' ') : cleaned;
  };

  const formatAmount = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleInputChange = (field: string, value: string) => {
    let processedValue = value;
    
    if (field === 'phone') {
      processedValue = formatPhone(value);
    } else if (field === 'iban') {
      processedValue = formatIBAN(value);
    } else if (field === 'investmentAmount') {
      processedValue = formatAmount(value);
    }
    
    setFormData(prev => ({ ...prev, [field]: processedValue }));
  };

  const calculateMonthlyEarnings = () => {
    const amount = parseFloat(formData.investmentAmount.replace(/\./g, '')) || 0;
    const percentage = parseFloat(formData.sharePercentage) || 0;
    // Basit hesaplama - gerçekte backend'den gelecek
    return Math.round((amount * percentage / 100) / 12);
  };

  const handleSubmit = () => {
    console.log('Form Data:', formData);
    alert('Kişi başarıyla eklendi!');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-[#233232] rounded-2xl shadow-2xl w-full max-w-6xl my-8" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Kişi Ekle</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 12rem)' }}>
          <div className="flex gap-6">
            {/* Left Side - Profile Photo */}
            <div className="flex-shrink-0">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-40 h-40 bg-gray-700 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-all overflow-hidden group relative"
              >
                {profileImage ? (
                  <>
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <User className="w-16 h-16 text-gray-500 mx-auto mb-2" />
                    <p className="text-xs text-gray-400">Profil fotoğrafı<br/>yükle</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Right Side - Form Fields */}
            <div className="flex-1 space-y-6">
              {/* Kişisel Bilgiler */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">İsim</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                    placeholder="İsim"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Soyisim</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                    placeholder="Soyisim"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Rol Seçin</label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Seçiniz</option>
                    {ROLES.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Mail</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                    placeholder="ornek@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Telefon</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                    placeholder="+90 555 555 55 55"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">IBAN</label>
                  <input
                    type="text"
                    value={formData.iban}
                    onChange={(e) => handleInputChange('iban', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                    placeholder="TR00 0000 0000 0000 0000 0000 00"
                    maxLength={34}
                  />
                </div>
              </div>

              {/* Adres Bölümü */}
              <div className="border-t border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Adres</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Şehir</label>
                    <select
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Şehir</option>
                      {CITIES.map(city => (
                        <option key={city.id} value={city.id}>{city.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Mahalle</label>
                    <select
                      value={formData.neighborhood}
                      onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                      disabled={!formData.city}
                      className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Mahalle</option>
                      {neighborhoods.map(n => (
                        <option key={n.id} value={n.id}>{n.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Sokak</label>
                    <select
                      value={formData.street}
                      onChange={(e) => handleInputChange('street', e.target.value)}
                      disabled={!formData.neighborhood}
                      className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Sokak</option>
                      {streets.map((street, idx) => (
                        <option key={idx} value={street}>{street}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Açık Adres</label>
                  <textarea
                    value={formData.addressDetail}
                    onChange={(e) => handleInputChange('addressDetail', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all resize-none"
                    rows={2}
                    placeholder="Bina, daire numarası ve diğer detaylar..."
                  />
                </div>
              </div>

              {/* Yatırım Bilgileri */}
              <div className="border-t border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Yatırım Bilgileri</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Yatırım Yaptığı Yer</label>
                    <select
                      value={formData.investmentLocation}
                      onChange={(e) => handleInputChange('investmentLocation', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Şube Seçin</option>
                      {BRANCHES.map(branch => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name} - {branch.company}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Yatırım Tarihi</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.investmentDate}
                        onChange={(e) => handleInputChange('investmentDate', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Hisse Oranı</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.sharePercentage}
                        onChange={(e) => handleInputChange('sharePercentage', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all pr-8"
                        placeholder="0"
                        min="0"
                        max="100"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Yatırım Tutarı</label>
                    <input
                      type="text"
                      value={formData.investmentAmount}
                      onChange={(e) => handleInputChange('investmentAmount', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Aylık Kazanç</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formatAmount(calculateMonthlyEarnings().toString())}
                        readOnly
                        className="w-full bg-gray-600 border border-gray-600 rounded-xl px-4 py-2.5 text-white outline-none pr-8 cursor-not-allowed"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">₺</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Belgeler Bölümü */}
              <div className="border-t border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">BELGELER</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Sözleşme Seç</label>
                    <select
                      value={formData.selectedContract}
                      onChange={(e) => {
                        handleInputChange('selectedContract', e.target.value);
                        setShowContractCreate(!!e.target.value);
                      }}
                      className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Şablon Seçin</option>
                      {CONTRACT_TEMPLATES.map(template => (
                        <option key={template.id} value={template.id}>{template.name}</option>
                      ))}
                    </select>
                    {showContractCreate && (
                      <button className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                        <FileText className="w-4 h-4" />
                        Oluştur
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Senet Seç</label>
                    <select
                      value={formData.selectedBond}
                      onChange={(e) => {
                        handleInputChange('selectedBond', e.target.value);
                        setShowBondCreate(!!e.target.value);
                      }}
                      className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Şablon Seçin</option>
                      {BOND_TEMPLATES.map(template => (
                        <option key={template.id} value={template.id}>{template.name}</option>
                      ))}
                    </select>
                    {showBondCreate && (
                      <button className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                        <Receipt className="w-4 h-4" />
                        Oluştur
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Dekont Yükle</label>
                    <div 
                      onClick={() => receiptInputRef.current?.click()}
                      className="w-full bg-gray-700 border-2 border-dashed border-gray-600 rounded-xl px-4 py-8 text-center cursor-pointer hover:border-green-500 transition-all group"
                    >
                      {uploadedReceipt ? (
                        <div className="text-green-400">
                          <FileText className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm">{uploadedReceipt}</p>
                        </div>
                      ) : (
                        <>
                          <Cloud className="w-8 h-8 text-gray-500 group-hover:text-green-500 mx-auto mb-2 transition-colors" />
                          <p className="text-sm text-gray-400 group-hover:text-gray-300">Dosya yüklemek için tıklayın</p>
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Not</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all resize-none"
                      rows={5}
                      placeholder="Ek açıklama veya notlar..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-700">
          <button
            onClick={() => setIsOpen(false)}
            className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors"
          >
            İptal
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonAddModal;