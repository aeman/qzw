from django.contrib import admin
from article.models import ArArticle

class ArArttcleAdmin(admin.ModelAdmin):
    list_display = ('article_title', 'article_content', 'article_author')
    search_fields = ('article_title', 'article_content', 'article_author')
    ordering = ('-publish_date',)

admin.site.register(ArArticle, ArArttcleAdmin)
