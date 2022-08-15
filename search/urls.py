__author__ = 'chenxuan'

from django.conf.urls import url

from . import views

urlpatterns = [url(r'^$', views.index, name='index'),
               url(r'^video/$', views.s_video, name='video'),
               url(r'^course/$', views.s_course, name='course'),
               url(r'^tips/$', views.s_tips, name='tips'),
               ]
