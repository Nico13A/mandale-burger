from django.conf import settings
from django.db import models
from customerBurger.models import CustomBurger
from django.db.models import Q                
from django.core.validators import MinValueValidator, MaxValueValidator

class Publication(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='publications')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    publication_date = models.DateTimeField(auto_now_add=True)
    custom_burger = models.ForeignKey(        
        CustomBurger,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='publications'
    )
    image_url = models.URLField(null=True, blank=True)

    class Meta:
        ordering = ['-publication_date']
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'custom_burger'],
                name='uniq_user_custom_burger_publication',
                condition=Q(custom_burger__isnull=False),
            ),
        ]


class Comment(models.Model):
    publication = models.ForeignKey(Publication, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='comments')
    comment_text = models.TextField()
    comment_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['comment_date']

class Rating(models.Model):
    publication = models.ForeignKey(
        'Publication', 
        on_delete=models.CASCADE,
        related_name='ratings'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='ratings'
    )
    score = models.PositiveSmallIntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5),
        ],
        help_text="Valor entre 1 y 5."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['publication', 'user'],
                name='uniq_publication_user_rating'
            ),
            models.CheckConstraint(
                check=Q(score__gte=1) & Q(score__lte=5),
                name='chk_score_range'
            ),
        ]
        verbose_name = 'Puntuación'
        verbose_name_plural = 'Puntuaciones'

    def __str__(self):
        return f"Rating {self.score} de {self.user} en {self.publication_id}"
