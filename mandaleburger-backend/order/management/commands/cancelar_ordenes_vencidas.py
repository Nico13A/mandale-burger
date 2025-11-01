from django.core.management.base import BaseCommand
from django.utils import timezone
from order.models import Order
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = "Cancela automáticamente las órdenes que ya expiraron"

    def handle(self, *args, **options):
        ahora = timezone.now()
        expiradas = Order.objects.filter(status="pending", expiration_time__lt=ahora)

        if not expiradas.exists():
            self.stdout.write(self.style.SUCCESS("No hay órdenes vencidas para cancelar."))
            return

        # Obtenemos un usuario AppAdmin para registrar los cambios automáticos
        try:
            app_admin = User.objects.filter(groups__name="AppAdmin").first()
            if not app_admin:
                self.stdout.write(self.style.ERROR("No se encontró ningún usuario con rol AppAdmin."))
                return
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR("No se encontró ningún usuario con rol AppAdmin."))
            return

        for orden in expiradas:
            try:
                orden.advance_status("cancelled", app_admin)
                self.stdout.write(self.style.WARNING(f"Orden #{orden.id} cancelada automáticamente."))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"No se pudo cancelar la orden #{orden.id}: {e}"))

        self.stdout.write(self.style.SUCCESS(f"✅ {expiradas.count()} órdenes canceladas correctamente."))

