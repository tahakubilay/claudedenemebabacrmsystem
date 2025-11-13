from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # 'events' ve 'reports' için olan yanlış girişler kaldırıldı.
    # Takvim, Dekont ve Şablonları içeren doğru yol (document_management) eklendi:
    path('api/document-management/', include('document_management.urls')),
    
    path('api/auth/', include('authentication.urls')),
    
    # Bu satır (core.urls) dashboard, financial-records, companies, reports vb.
    # tüm ana viewset'leri içerir ve en sonda kalmalıdır.
    path('api/', include('core.urls')), 
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)