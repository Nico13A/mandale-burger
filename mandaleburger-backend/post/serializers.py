from rest_framework import serializers
from django.utils import timezone
from .models import Publication, Comment

class CommentSerializer(serializers.ModelSerializer):
    user_display = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Comment
        fields = [
            'id', 'publication', 'user', 'user_display',
            'comment_text', 'comment_date'
        ]

        read_only_fields = ['id', 'user', 'comment_date', 'publication']

    def get_user_display(self, obj):
        #  username en el front sin otra consulta
        return getattr(obj.user, 'username', str(obj.user_id))

    def validate_comment_text(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("El comentario no puede estar vacío.")
        if len(value) > 2000:
            raise serializers.ValidationError("Máximo 2000 caracteres.")
        return value

    def create(self, validated_data):
        """
        La vista setea en el context:
          - request
          - publication (objeto Publication)
        """
        request = self.context['request']
        publication = self.context['publication']
        validated_data['user'] = request.user
        validated_data['publication'] = publication
        validated_data['comment_date'] = timezone.now()
        return super().create(validated_data)


# ==== Publicaciones ====

class PublicationBaseSerializer(serializers.ModelSerializer):
    """
    Base con utilidades comunes (image_url, user_display, validaciones).
    Heredan de esta: List y Detail.
    """
    user_display = serializers.SerializerMethodField(read_only=True)
    image = serializers.ImageField(required=False, allow_null=True)
    image_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Publication
        fields = [
            'id', 'title', 'description', 'publication_date',
            'custom_burger_id', 'user', 'user_display',
            'image', 'image_url',
        ]
        read_only_fields = ['id', 'publication_date', 'user', 'image_url']

   
    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("El título es obligatorio.")
        if len(value) > 255:
            raise serializers.ValidationError("Máximo 255 caracteres.")
        return value

    def validate_description(self, value):
        # opcional, pero evita textos enormes
        if value and len(value) > 4000:
            raise serializers.ValidationError("Máximo 4000 caracteres.")
        return value

    def validate_image(self, img):
        # límites razonables para dev. Ajustá si querés.
        if not img:
            return img
        if img.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("La imagen no puede superar 5MB.")
        valid_types = {'image/jpeg', 'image/png', 'image/webp'}
        if getattr(img, 'content_type', None) not in valid_types:
            raise serializers.ValidationError("Solo JPG, PNG o WEBP.")
        return img

    # --------- Helpers de presentación ----------
    def get_user_display(self, obj):
        return getattr(obj.user, 'username', str(obj.user_id))

    def get_image_url(self, obj):
        if not obj.image:
            return None
        request = self.context.get('request')
        url = obj.image.url
        return request.build_absolute_uri(url) if request else url


class PublicationListSerializer(PublicationBaseSerializer):
    comments_count = serializers.IntegerField(source='comments.count', read_only=True)

    class Meta(PublicationBaseSerializer.Meta):
        fields = PublicationBaseSerializer.Meta.fields + ['comments_count']


class PublicationDetailSerializer(PublicationBaseSerializer):
    
    comments = CommentSerializer(many=True, read_only=True)

    class Meta(PublicationBaseSerializer.Meta):
        fields = PublicationBaseSerializer.Meta.fields + ['comments']

    
