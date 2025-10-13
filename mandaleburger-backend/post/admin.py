from django.contrib import admin
from .models import Publication, Comment

@admin.register(Publication)
class PublicationAdmin(admin.ModelAdmin):
    list_display = ('id','title','user','publication_date','custom_burger_id')
    search_fields = ('title','description','user__username')
    list_filter = ('publication_date',)

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id','publication','user','comment_date')
    search_fields = ('comment_text','user__username')
    list_filter = ('comment_date',)
