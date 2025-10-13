from django.conf import settings
from django.db import models

class Publication(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='publications')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    publication_date = models.DateTimeField(auto_now_add=True)
    custom_burger_id = models.IntegerField(null=True, blank=True) 
    image = models.ImageField(upload_to='publications/', null=True, blank=True)

    class Meta:
        ordering = ['-publication_date']

class Comment(models.Model):
    publication = models.ForeignKey(Publication, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='comments')
    comment_text = models.TextField()
    comment_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['comment_date']

