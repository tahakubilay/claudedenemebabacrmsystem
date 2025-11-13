from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReceiptViewSet, TemplateViewSet, CalendarEventViewSet

router = DefaultRouter()
router.register(r'receipts', ReceiptViewSet)
router.register(r'templates', TemplateViewSet)
router.register(r'calendar-events', CalendarEventViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
