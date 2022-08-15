__author__ = 'sunny'

from django.conf.urls import url

from . import views

urlpatterns = [url(r'^$', views.index, name='index'),
               url(r'^list/(?P<page_no>\d*)(/(?P<search_text>\w*))?$', views.knowledge_list),
               url(r'add', views.knowledge_add),
               url(r'update', views.knowledge_update),
               url(r'edit/(?P<knowledge_id>\d+)$', views.knowledge_edit),
               url(r'delete/(?P<knowledge_id>\d+)$', views.knowledge_delete),
               url(r'get_course_videos/(?P<knowledge_id>\d+)$', views.get_course_videos),
               url(r'get_courses_videos/(?P<knowledge_ids>.*?)$', views.get_courses_videos),
               url(r'analysis/((?P<limit>\d+)*)$', views.analysis),
               url(r'get_knowledge_comment/(?P<knowledg_name>.*)$', views.get_knowledge_comment),
               ]
