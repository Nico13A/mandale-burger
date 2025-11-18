from rest_framework import serializers
from django.utils import timezone
from .models import Publication, Comment, Rating
from customerBurger.models import CustomBurger
from rest_framework.exceptions import ValidationError


class CustomBurgerMiniSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='custom_name')
    price = serializers.DecimalField(
        source='total_price',
        max_digits=10,
        decimal_places=2
    )

    class Meta:
        model = CustomBurger
        fields = ['id', 'name', 'img', 'price']

# =======================
# Comment
# =======================

class CommentSerializer(serializers.ModelSerializer):
    user_display = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'publication', 'user', 'user_display', 'comment_text', 'comment_date']
        read_only_fields = ['id', 'user', 'comment_date', 'publication']

    def validate_comment_text(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("El comentario no puede estar vacío.")
        if len(value) > 2000:
            raise serializers.ValidationError("Máximo 2000 caracteres.")
        return value

    def create(self, validated_data):
        request = self.context['request']
        publication = self.context['publication']
        validated_data['user'] = request.user
        validated_data['publication'] = publication
        
        return super().create(validated_data)


# =======================
# Publication (base única)
# =======================

class PublicationSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    image_url = serializers.URLField(required=False, allow_blank=True, allow_null=True)
    custom_burger_id = serializers.PrimaryKeyRelatedField(
        source='custom_burger',               
        queryset=CustomBurger.objects.all(),
        required=False,
        allow_null=True
    )
    class Meta:
        model = Publication
        fields = [
            'id', 'title', 'description', 'publication_date',
            'custom_burger_id', 'user_id', 'username', 'image_url',
        ]
        read_only_fields = ['id', 'publication_date', 'user_id', 'username']

    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("El título es obligatorio.")
        if len(value) > 255:
            raise serializers.ValidationError("Máximo 255 caracteres.")
        return value

    def validate_description(self, value):
        if value and len(value) > 4000:
            raise serializers.ValidationError("Máximo 4000 caracteres.")
        return value

    def validate_image_url(self, value):
        if not value:
            return value
        if not (value.startswith('http://') or value.startswith('https://')):
            # Si querés aceptar '/media/...', relajá esta regla.
            raise serializers.ValidationError("Debe ser una URL válida (http/https).")
        return value
        
    def validate(self, attrs):
        attrs = super().validate(attrs)

        request = self.context.get('request')
        if not request or request.user.is_anonymous:
            return attrs

        burger = attrs.get('custom_burger')
        if burger is not None:
            qs = Publication.objects.filter(
                user=request.user,
                custom_burger=burger
            )
            # Si estoy editando, excluir esta misma publicación
            if self.instance is not None:
                qs = qs.exclude(pk=self.instance.pk)

            if qs.exists():
                raise ValidationError({
                    "already_published": "Ya publicaste esta burger."
                })

        return attrs


# =======================
# List / Detail
# =======================

class PublicationListSerializer(PublicationSerializer):
    comments_count = serializers.SerializerMethodField()
    burger = CustomBurgerMiniSerializer(
        source='custom_burger',  # nombre del FK en Publication
        read_only=True
    )
    average_score = serializers.FloatField(read_only=True)      
    ratings_count = serializers.IntegerField(read_only=True)  

    class Meta(PublicationSerializer.Meta):
        fields = PublicationSerializer.Meta.fields + [
            'comments_count',
            'burger',
            'average_score',   
            'ratings_count',  
        ]

    def get_comments_count(self, obj):
        return obj.comments.count()

class PublicationDetailSerializer(PublicationSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    user_score = serializers.SerializerMethodField()

    class Meta(PublicationSerializer.Meta):
        fields = PublicationSerializer.Meta.fields + ['comments', 'user_score']

    def get_user_score(self, obj):
        request = self.context.get('request')

        if not request or not request.user or not request.user.is_authenticated:
            return None

        rating = (
            Rating.objects
            .filter(publication=obj, user=request.user)
            .first()
        )

        return rating.score if rating else None

# =======================
# calificacion
# =======================

class RatingSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    publication_id = serializers.IntegerField(source='publication.id', read_only=True)

    class Meta:
        model = Rating
        fields = ['id', 'publication_id', 'user_id', 'user', 'score', 'created_at', 'updated_at']
        read_only_fields = ['id', 'publication_id', 'user_id', 'user', 'created_at', 'updated_at']

    def validate_score(self, value):
        if not 1 <= value <= 5:
            raise ValidationError("La puntuación debe estar entre 1 y 5.")
        return value

    def create(self, validated_data):
        """
        Creamos o actualizamos la puntuación de este usuario para esta publicación.
        La publicación la vamos a pasar desde la vista (no desde el front).
        """
        request = self.context.get('request')
        publication = self.context.get('publication')

        if not request or not request.user or not request.user.is_authenticated:
            raise ValidationError({"user": "Debes estar autenticado para puntuar."})

        if not publication:
            raise ValidationError({"publication": "No se pudo determinar la publicación."})

        score = validated_data['score']
        rating, created = Rating.objects.update_or_create(
            publication=publication,
            user=request.user,
            defaults={'score': score}
        )
        return rating
