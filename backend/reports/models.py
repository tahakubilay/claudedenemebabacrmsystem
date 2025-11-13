from django.db import models
from django.contrib.auth import get_user_model
from core.models import Company, Brand, Branch, Person

class Report(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Bekliyor'),
        ('completed', 'Tamamlandı'),
        ('approved', 'Onaylandı'),
    )

    REPORT_TYPE_CHOICES = (
        ('financial', 'Finansal'),
        ('payment', 'Ödeme'),
        ('performance', 'Performans'),
        ('general', 'Genel'),
    )

    name = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=REPORT_TYPE_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField()
    created_by = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, null=True, blank=True)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, null=True, blank=True)
    person = models.ForeignKey(Person, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.name