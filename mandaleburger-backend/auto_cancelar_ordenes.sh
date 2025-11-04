# Bucle infinito: ejecuta cada 5 minutos (300 segundos)
while true
do
    echo "[$(date)] Ejecutando cancelación automática..." >> logs/cancelar_ordenes.log
    python manage.py cancelar_ordenes_vencidas >> logs/cancelar_ordenes.log 2>&1
    echo "[$(date)] Ejecución finalizada." >> logs/cancelar_ordenes.log
    echo "----------------------------------------" >> logs/cancelar_ordenes.log
    sleep 300  # Espera 5 minutos
done