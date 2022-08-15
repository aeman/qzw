__author__ = 'chenxuan'

from django.conf.urls import url

from . import views

urlpatterns = [url(r'^$', views.index, name='index'),
               url(r'get_more_articles/(?P<start>\d+)$', views.get_more_articles),
               url(r'list/(?P<page_no>\d*)(/(?P<search_text>\w*))?$', views.article_list),
               url(r'add', views.article_add),
               url(r'update', views.article_update),
               url(r'edit/(?P<article_id>\d+)', views.article_edit),
               url(r'get_categories', views.get_categories),
               url(r'get_tags/((?P<article_id>\d+)*)$', views.get_tags),
               url(r'delete/(?P<article_id>\d+)$', views.delete_article),
               url(r'get_courses', views.get_courses),
               url(r'analysis/((?P<limit>\d+)*)$', views.analysis),
               url(r'tag/(?P<tag_name>\w+)$', views.article_tags),
               url(r'get_knowledge_info', views.get_knowledge_info),
               url(r'(?P<article_id>\d+)$', views.article),
               ]
