# -*- coding: utf-8 -*-

from django.db import models
from course.models import *


# Create your models here.
class ArArticle(models.Model):
    article_title = models.CharField(max_length=500)
    article_content = models.CharField(max_length=999999)
    article_author = models.CharField(max_length=45, blank=True, null=True)
    publish_date = models.CharField(max_length=100, null=True)
    pic_file = models.CharField(max_length=100)
    class_id = models.IntegerField(blank=True, null=True)
    read_times = models.IntegerField(default=0)

    class Meta:
        db_table = 'ar_article'
        verbose_name = '文章'
        verbose_name_plural = "文章"
        permissions = (
            ("can_view_article", "可以观看文章"),
            ("can_edit_article", "可以编辑文章"),
        )

class ArArticleTag(models.Model):
    article = models.ForeignKey(ArArticle)
    tag_id = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'ar_article_tag'


class ArTopArticle(models.Model):
    article = models.ForeignKey(ArArticle)
    click_times = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'ar_top_article'


class CrTag(models.Model):
    tag_name = models.CharField(max_length=500)

    class Meta:
        managed = False
        db_table = 'cr_tag'
