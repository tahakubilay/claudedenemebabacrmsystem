// frontend/src/lib/dynamic-fields.ts

export interface DynamicField {
  tag: string;      // Editöre eklenecek metin (örn: {{sirket_adi}})
  label: string;    // Dropdown menüde görünecek isim (örn: Şirket Adı)
  group: string;    // Gruplama (örn: Şirket, Kişi)
}

export const DYNAMIC_FIELDS: DynamicField[] = [
  // Şirket Bilgileri
  { tag: "{{sirket_adi}}", label: "Şirket Adı", group: "Şirket" },
  { tag: "{{sirket_adresi}}", label: "Şirket Adresi", group: "Şirket" },
  { tag: "{{sirket_vergi_no}}", label: "Şirket Vergi No", group: "Şirket" },

  // Şube Bilgileri
  { tag: "{{sube_adi}}", label: "Şube Adı", group: "Şube" },
  { tag: "{{sube_adresi}}", label: "Şube Adresi", group: "Şube" },

  // Kişi Bilgileri
  { tag: "{{kisi_tam_adi}}", label: "Kişi Adı Soyadı", group: "Kişi" },
  { tag: "{{kisi_tc_no}}", label: "Kişi TC Kimlik No", group: "Kişi" },
  { tag: "{{kisi_telefon}}", label: "Kişi Telefon", group: "Kişi" },
  
  // Tarih Bilgileri
  { tag: "{{tarih_bugun}}", label: "Bugünün Tarihi", group: "Genel" },
  { tag: "{{tarih_araligi_baslangic}}", label: "Tarih Aralığı (Başlangıç)", group: "Genel" },
  { tag: "{{tarih_araligi_bitis}}", label: "Tarih Aralığı (Bitiş)", group: "Genel" },
];

// Gruplama için helper
export const getGroupedFields = () => {
  return DYNAMIC_FIELDS.reduce((acc, field) => {
    (acc[field.group] = acc[field.group] || []).push(field);
    return acc;
  }, {} as Record<string, DynamicField[]>);
};