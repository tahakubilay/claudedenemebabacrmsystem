from django.db import models

class Event(models.Model):
    TYPE_CHOICES = (
        ('promissory_note', 'Senet'),
        ('contract', 'Sözleşme'),
        ('report', 'Rapor'),
        ('receipt', 'Dekont'),
    )

    STATUS_CHOICES = (
        ('upcoming', 'Yaklaşan'),
        ('delayed', 'Geciken'),
        ('completed', 'Tamamlandı'),
        ('reminder', 'Hatırlatma'),
    )

    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    title = models.CharField(max_length=255)
    date = models.DateTimeField()
    related_id = models.PositiveIntegerField()
    description = models.TextField(blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='upcoming')

    def __str__(self):
        return self.title