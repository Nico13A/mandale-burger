from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import PromotionBurger, PromotionSubscription
from .serializers import PromotionBurgerSerializer, PromotionSubscriptionSerializer
from usuario.permissions import IsInGroup
from subscription.models import SubscriptionPlan

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
    queryset = PromotionBurger.objects.prefetch_related('ingredients__ingredient').all()


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
            active_subscriptions = user.usersubscription_set.filter(is_active=True)
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

        if not promotion_id or not subscription_id:
            return Response({"error": "Faltan datos"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            promo_sub = PromotionSubscription.objects.get(promotion_id=promotion_id)
        except PromotionSubscription.DoesNotExist:
            return Response({"error": "Promoción sin plan asociado"}, status=status.HTTP_404_NOT_FOUND)

        try:
            subscription = SubscriptionPlan.objects.get(id=subscription_id)
        except SubscriptionPlan.DoesNotExist:
            return Response({"error": "Plan no válido"}, status=status.HTTP_400_BAD_REQUEST)

        promo_sub.subscription = subscription
        promo_sub.save()

        return Response({"success": "Plan actualizado"})