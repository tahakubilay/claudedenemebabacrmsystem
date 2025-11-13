// frontend/src/types/global.d.ts

// CSS Modülleri (veya herhangi bir .css dosyası) için tanım
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

// --- YENİ EKLENEN KOD (Moment Locale'leri için) ---
declare module "moment/locale/tr" {
  import { LocaleSpecification } from "moment";
  const tr: LocaleSpecification;
  export default tr;
}

// Diğer moment locale'ları için de gerekirse diye genel bir tanım
declare module "moment/locale/*" {
  import { LocaleSpecification } from "moment";
  const locale: LocaleSpecification;
  export default locale;
}
// --- GÜNCELLEME BİTTİ ---