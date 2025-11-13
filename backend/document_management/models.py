from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _
import uuid

from common.models import TimeStampedModel, UploadedFile
from core.models import Company, Brand, Branch, Person


class Receipt(TimeStampedModel):
    """Dekontlar - level ile Company/Brand/Branch/Person ilişkisi kurulur."""
    LEVEL_CHOICES = [
        ('company', _('Şirket')),
        ('brand', _('Marka')),
        ('branch', _('Şube')),
        ('person', _('Kişi')),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255, verbose_name=_("Başlık"))
    description = models.TextField(verbose_name=_("Açıklama"))
    amount = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True, verbose_name=_("Tutar"))
    currency = models.CharField(max_length=10, null=True, blank=True, verbose_name=_("Para Birimi"))
    date = models.DateField(verbose_name=_("Tarih"))
    level = models.CharField(max_length=10, choices=LEVEL_CHOICES, default='branch', verbose_name=_("Seviye"))
    level_object_id = models.CharField(max_length=100, null=True, blank=True, verbose_name=_("Seviye ID"))
    attachments = models.ManyToManyField(UploadedFile, blank=True, verbose_name=_("Ekler"))
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_receipts', verbose_name=_("Oluşturan"))
    tags = models.JSONField(null=True, blank=True, default=list, verbose_name=_("Etiketler"))
    metadata = models.JSONField(null=True, blank=True, default=dict, verbose_name=_("Meta Veri"))

    class Meta:
        db_table = 'receipts'
        verbose_name = _("Dekont")
        verbose_name_plural = _("Dekontlar")
        ordering = ['-date']
        indexes = [
            models.Index(fields=['date']),
            models.Index(fields=['level']),
            models.Index(fields=['level_object_id']),
        ]

    def __str__(self):
        return self.title


class Template(TimeStampedModel):
    """Sözleşme / Senet / Rapor şablonları."""
    TEMPLATE_TYPE_CHOICES = [
        ('contract', _('Sözleşme')),
        ('promissory_note', _('Senet')),
        ('report', _('Rapor')),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255, verbose_name=_("Başlık"))
    template_type = models.CharField(max_length=50, choices=TEMPLATE_TYPE_CHOICES, verbose_name=_("Şablon Türü"))
    content_html = models.TextField(verbose_name=_("HTML İçerik"))
    placeholders = models.JSONField(null=True, blank=True, default=list, verbose_name=_("Placeholder'lar"))
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_templates', verbose_name=_("Oluşturan"))
    usage_count = models.IntegerField(default=0, verbose_name=_("Kullanım Sayısı"))
    versioning = models.JSONField(null=True, blank=True, default=dict, verbose_name=_("Versiyon Geçmişi"))

    class Meta:
        db_table = 'templates'
        verbose_name = _("Şablon")
        verbose_name_plural = _("Şablonlar")
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['template_type']),
            models.Index(fields=['title']),
        ]

    def __str__(self):
        return self.title


class CalendarEvent(TimeStampedModel):
    """Takvim etkinlikleri."""
    CATEGORY_CHOICES = [
        ('upcoming_payment', _('Yaklaşan Ödeme')),
        ('overdue_payment', _('Gecikmiş Ödeme')),
        ('new_contract', _('Yeni Sözleşme')),
        ('promissory_note', _('Senet')),
        ('report_reminder', _('Rapor Hatırlatma')),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255, verbose_name=_("Başlık"))
    description = models.TextField(null=True, blank=True, verbose_name=_("Açıklama"))
    start = models.DateTimeField(verbose_name=_("Başlangıç"))
    end = models.DateTimeField(null=True, blank=True, verbose_name=_("Bitiş"))
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, verbose_name=_("Kategori"))
    related_document_type = models.CharField(max_length=100, null=True, blank=True, verbose_name=_("İlişkili Doküman Tipi"))
    related_document_id = models.CharField(max_length=100, null=True, blank=True, verbose_name=_("İlişkili Doküman ID"))
    related_company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True, related_name='calendar_events', verbose_name=_("İlişkili Şirket"))
    related_brand = models.ForeignKey(Brand, on_delete=models.CASCADE, null=True, blank=True, related_name='calendar_events', verbose_name=_("İlişkili Marka"))
    related_branch = models.ForeignKey(Branch, on_delete=models.CASCADE, null=True, blank=True, related_name='calendar_events', verbose_name=_("İlişkili Şube"))
    related_person = models.ForeignKey(Person, on_delete=models.CASCADE, null=True, blank=True, related_name='calendar_events', verbose_name=_("İlişkili Kişi"))
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_calendar_events', verbose_name=_("Oluşturan"))

    class Meta:
        db_table = 'calendar_events'
        verbose_name = _("Takvim Etkinliği")
        verbose_name_plural = _("Takvim Etkinlikleri")
        ordering = ['start']
        indexes = [
            models.Index(fields=['start']),
            models.Index(fields=['category']),
        ]

    def __str__(self):
        return self.title
