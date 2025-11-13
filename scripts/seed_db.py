import os
import django
import random
from faker import Faker

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.models import Company, Brand, Branch, Person, Role
from document_management.models import Receipt, Template, CalendarEvent
from django.contrib.auth.models import User

fake = Faker('tr_TR')

def create_roles():
    roles = ['Yönetici', 'Çalışan', 'Yatırımcı', 'İş Ortağı']
    for role_name in roles:
        Role.objects.get_or_create(name=role_name.lower(), display_name=role_name)

def create_users(count=10):
    for _ in range(count):
        username = fake.user_name()
        email = fake.email()
        password = 'password123'
        User.objects.create_user(username=username, email=email, password=password)

def create_companies_brands_branches(company_count=5, brand_per_company=3, branch_per_brand=2):
    for _ in range(company_count):
        company = Company.objects.create(
            title=fake.company(),
            tax_number=fake.unique.numerify(text='##########'),
            email=fake.company_email(),
            iban=fake.iban(),
            description=fake.text(),
        )
        for _ in range(brand_per_company):
            brand = Brand.objects.create(
                name=fake.company_suffix(),
                company=company,
            )
            for _ in range(branch_per_brand):
                Branch.objects.create(
                    name=fake.city(),
                    address=fake.address(),
                    phone=fake.phone_number(),
                    email=fake.email(),
                    brand=brand,
                )

def create_people(person_per_branch=5):
    roles = list(Role.objects.all())
    branches = list(Branch.objects.all())
    for branch in branches:
        for _ in range(person_per_branch):
            Person.objects.create(
                full_name=fake.name(),
                national_id=fake.unique.numerify(text='###########'),
                address=fake.address(),
                phone=fake.phone_number(),
                email=fake.email(),
                iban=fake.iban(),
                role=random.choice(roles),
                branch=branch,
            )

def create_receipts(receipt_count=50):
    users = list(User.objects.all())
    companies = list(Company.objects.all())
    brands = list(Brand.objects.all())
    branches = list(Branch.objects.all())
    people = list(Person.objects.all())

    for _ in range(receipt_count):
        level = random.choice(['company', 'brand', 'branch', 'person'])
        level_object_id = None
        if level == 'company':
            level_object_id = random.choice(companies).id
        elif level == 'brand':
            level_object_id = random.choice(brands).id
        elif level == 'branch':
            level_object_id = random.choice(branches).id
        elif level == 'person':
            level_object_id = random.choice(people).id

        Receipt.objects.create(
            title=fake.sentence(nb_words=3),
            description=fake.text(),
            amount=fake.pydecimal(left_digits=5, right_digits=2, positive=True),
            currency=random.choice(['TRY', 'USD', 'EUR']),
            date=fake.date_this_year(),
            level=level,
            level_object_id=level_object_id,
            created_by=random.choice(users),
        )

def create_templates(template_count=10):
    users = list(User.objects.all())
    for _ in range(template_count):
        template_type = random.choice(['contract', 'promissory_note', 'report'])
        Template.objects.create(
            title=fake.sentence(nb_words=4),
            template_type=template_type,
            content_html=fake.text(),
            created_by=random.choice(users),
        )

def create_calendar_events(event_count=20):
    users = list(User.objects.all())
    for _ in range(event_count):
        start_date = fake.date_time_this_year()
        end_date = start_date + fake.time_delta()
        CalendarEvent.objects.create(
            title=fake.sentence(nb_words=3),
            description=fake.text(),
            start=start_date,
            end=end_date,
            category=random.choice([
                'upcoming_payment',
                'overdue_payment',
                'new_contract',
                'promissory_note',
                'report_reminder',
            ]),
            created_by=random.choice(users),
        )

def run_seed():
    print('Seeding database...')
    create_roles()
    create_users()
    create_companies_brands_branches()
    create_people()
    create_receipts()
    create_templates()
    create_calendar_events()
    print('Seeding complete.')

if __name__ == '__main__':
    run_seed()