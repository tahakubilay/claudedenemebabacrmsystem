'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'
import { useSidebarStore } from '@/lib/store'
import {
  // v2 için gerekli ikonlar
  Building,
  Briefcase,
  Users,
  FileText,
  LayoutDashboard,
  Settings,
  Calendar,
  CreditCard,
  DollarSign,
  X,
  FileTextIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

// Sizin arayüz tanımınız (Bu doğru, kalsın)
interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

// --- GÜNCELLENMİŞ navItems DİZİSİ (v2) ---
// 'label:' yerine 'title:' kullanıldı ve v2 listesine göre düzenlendi.
const navItems: NavItem[] = [
  { href: "/dashboard", title: "Dashboard", icon: LayoutDashboard },
  { href: "/companies", title: "Şirketler", icon: Building },
  { href: "/branches", title: "Şubeler", icon: Briefcase },
  { href: "/brands", title: "Markalar", icon: Briefcase }, // İkonlar aynı kalabilir
  { href: "/people", title: "Kişiler", icon: Users },
  { href: "/financials", title: "Finans", icon: DollarSign },
  {
    href: "/receipts",
    title: "Dekontlar", // (Dekontlar ve Belgeler Zaman Tüneli)
    icon: CreditCard,
  },
  {
    href: "/documents", // YENİ MERKEZİ YAPI
    title: "Belge Şablonları", // (Sözleşme, Senet, Raporlar)
    icon: FileText,
  },
  { href: "/calendar", title: "Takvim", icon: Calendar },
  { href: "/promissory-notes", title: "Vadesi Geçmiş Notlar", icon: FileTextIcon  },
  { href: "/reports", title: "Raporlar", icon: FileTextIcon }, // Raporlar eklendi
  { href: "/templates", title: "Şablonlar", icon: FileText },
  { href: "/settings", title: "Ayarlar", icon: Settings },
  // upgrade v2.txt'ye göre /contracts ve /promissory-notes linkleri
  // /documents altına alındığı için kaldırıldı.
];
// --- GÜNCELLEME BİTTİ ---

export function Sidebar() {
  const pathname = usePathname()
  const { isOpen, close } = useSidebarStore()

  return (
    <>
      {/* Mobile Overlay (Bu kısım aynı kaldı) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar (Bu kısım aynı kaldı) */}
      <aside
        className={cn(
          // Not: Adım 1'deki global.css güncellemesiyle 'bg-card' ve 'border-border'
          // zaten v2'nin koyu yeşil tonlarına (#253636, #2E3E3E) dönüşmüş olmalı.
          'fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 bg-card border-r border-border transition-transform duration-300',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Close Button (Mobile) (Bu kısım aynı kaldı) */}
        <div className="flex justify-end p-2 lg:hidden">
          <Button variant="ghost" size="icon" onClick={close}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation (Bu kısım aynı kaldı) */}
        <ScrollArea className="h-full px-3 py-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              // Aktif link mantığınız (pathname.startsWith) gayet iyi
              // Sadece dashboard'un diğer sayfalarda aktif olmasını engellemek için küçük bir ekleme
              const isActive = item.href === '/dashboard' 
                ? pathname === item.href 
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    // Close sidebar on mobile after navigation
                    if (window.innerWidth < 1024) {
                      close()
                    }
                  }}
                  className={cn(
                    // Not: Adım 1'deki global.css güncellemesiyle 'bg-primary'
                    // v2'nin ana yeşil rengi (#4ADE80) olmalı.
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    'hover:bg-primary/10 hover:text-primary',
                    isActive
                      // 'text-white' yerine 'text-primary-foreground' kullanmak
                      // shadcn temaları için daha güvenlidir.
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'text-muted-foreground'
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  
                  {/* DÜZELTME BURADAYDI: item.label -> item.title */}
                  <span>{item.title}</span>
                  
                  {item.badge && (
                    <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Quick Stats Widget (Bu kısım aynı kaldı) */}
          <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <h4 className="text-sm font-semibold mb-2">Hızlı İstatistikler</h4>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Aktif Şirketler</span>
                <span className="font-semibold text-foreground">12</span>
              </div>
              <div className="flex justify-between">
                <span>Toplam Çalışan</span>
                <span className="font-semibold text-foreground">245</span>
              </div>
              <div className="flex justify-between">
                <span>Bu Ay Rapor</span>
                <span className="font-semibold text-foreground">18</span>
              </div>
            </div>
          </div>

          {/* Footer (Versiyonu güncelledim) */}
          <div className="mt-6 px-3 text-xs text-muted-foreground">
            <p>Versiyon 2.0.0</p>
            <p className="mt-1">© 2024 Tüm hakları saklıdır.</p>
          </div>
        </ScrollArea>
      </aside>
    </>
  )
}