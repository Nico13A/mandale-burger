from .models import Order
from datetime import datetime, timedelta, time as dtime


def validate_pickup_slot(date, time):
    MAX_ORDERS_PER_SLOT = 3

    count = Order.objects.filter(
        pickup_date=date,
        pickup_time=time,
        status__in=['pending', 'paid', 'in_progress', 'ready_for_pickup']
    ).count()

    return count < MAX_ORDERS_PER_SLOT


def validate_pickup_time_format(time):
    opening_time = dtime(12, 0)
    closing_time = dtime(22, 0)

    if not (opening_time <= time <= closing_time):
        return False
    
    if time.minute != 0:
        return False

    return True


def validate_pickup_time_anticipation(date, time):
    now = datetime.now()
    selected_datetime = datetime.combine(date, dtime(time.hour, time.minute))

    if selected_datetime.date() != now.date():
        return True

    min_time = now + timedelta(minutes=30)
    return selected_datetime >= min_time
