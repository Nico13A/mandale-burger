from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import PromotionBurger, PromotionSubscription
from .serializers import PromotionBurgerSerializer, PromotionSubscriptionSerializer
from usuario.permissions import IsInGroup
from subscription.models import SubscriptionPlan
from django.utils import timezone

# -------------------------
# Crear promoción
# -------------------------
class PromotionBurgerCreateView(generics.CreateAPIView):
    serializer_class = PromotionBurgerSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    allowed_groups = ['AppAdmin']


# -------------------------
# Obtener detalle de promoción
# -------------------------
class PromotionBurgerDetailView(generics.RetrieveAPIView):
    serializer_class = PromotionBurgerSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    allowed_groups = ['Client', 'AppAdmin']
    queryset = PromotionBurger.objects.prefetch_related('ingredients__ingredient', 'promotionsubscription_set__subscription').all()


# -------------------------
# Editar promoción
# -------------------------
class PromotionBurgerUpdateView(generics.UpdateAPIView):
    serializer_class = PromotionBurgerSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    allowed_groups = ['AppAdmin']
    queryset = PromotionBurger.objects.all()


# -------------------------
# Baja promoción
# -------------------------
class PromotionBurgerDeactivateView(APIView):
    permission_classes = [IsAuthenticated, IsInGroup]
    allowed_groups = ['AppAdmin']

    def patch(self, request, pk):
        try:
            promo = PromotionBurger.objects.get(pk=pk, is_active=True)
        except PromotionBurger.DoesNotExist:
            return Response({"error": "Promoción no encontrada o ya inactiva"}, status=status.HTTP_404_NOT_FOUND)

        promo.deactivate()
        return Response({"success": "Promoción dada de baja"}, status=status.HTTP_200_OK)


# -------------------------
# Alta promoción
# -------------------------
class PromotionBurgerActivateView(APIView):
    permission_classes = [IsAuthenticated, IsInGroup]
    allowed_groups = ['AppAdmin']

    def patch(self, request, pk):
        try:
            promo = PromotionBurger.objects.get(pk=pk, is_active=False)
        except PromotionBurger.DoesNotExist:
            return Response({"error": "Promoción no encontrada o ya activa"}, status=status.HTTP_404_NOT_FOUND)

        promo.activate()
        return Response({"success": "Promoción activada"}, status=status.HTTP_200_OK)
    

# -------------------------
# Crear asociación promoción-plan
# -------------------------
class PromotionSubscriptionCreateView(generics.CreateAPIView):
    serializer_class = PromotionSubscriptionSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    allowed_groups = ['AppAdmin']


# -------------------------
# Listar promociones (Cliente o Admin)
# -------------------------
class PromotionBurgerListView(generics.ListAPIView):
    serializer_class = PromotionBurgerSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    allowed_groups = ['Client', 'AppAdmin']

    def get_queryset(self):
        user = self.request.user
        if user.groups.filter(name='AppAdmin').exists():
            return PromotionBurger.objects.prefetch_related('ingredients__ingredient').all()
        else:
            active_subscriptions = user.usersubscription_set.filter(
                end_date__gte=timezone.now()
            )
            plan_ids = [sub.plan.id for sub in active_subscriptions]
            return PromotionBurger.objects.prefetch_related('ingredients__ingredient').filter(
                promotionsubscription__subscription_id__in=plan_ids,
                is_active=True
            ).distinct()


# -------------------------
# Editar plan de una promoción
# -------------------------
class PromotionPlanUpdateView(APIView):
    permission_classes = [IsAuthenticated, IsInGroup]
    allowed_groups = ['AppAdmin']

    def patch(self, request):
        promotion_id = request.data.get('promotion_id')
        subscription_id = request.data.get('subscription_id')

        if not promotion_id:
            return Response({"error": "Falta promotion_id"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            promotion = PromotionBurger.objects.get(id=promotion_id)
        except PromotionBurger.DoesNotExist:
            return Response({"error": "Promoción no encontrada"}, status=status.HTTP_404_NOT_FOUND)

        if not subscription_id:
            try:
                promo_sub = PromotionSubscription.objects.get(promotion=promotion)
                promo_sub.delete()
                return Response({"success": "Plan eliminado"}, status=status.HTTP_200_OK)
            except PromotionSubscription.DoesNotExist:
                return Response({"success": "Sin cambios en el plan"}, status=status.HTTP_200_OK)

        try:
            subscription = SubscriptionPlan.objects.get(id=subscription_id)
        except SubscriptionPlan.DoesNotExist:
            return Response({"error": "Plan no válido"}, status=status.HTTP_400_BAD_REQUEST)

        _, created = PromotionSubscription.objects.update_or_create(
            promotion=promotion,
            defaults={'subscription': subscription}
        )

        return Response({
            "success": "Plan asociado" if created else "Plan actualizado"
        }, status=status.HTTP_200_OK)