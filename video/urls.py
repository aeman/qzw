__author__ = 'chenxuan'

from django.conf.urls import patterns, url

from . import views

urlpatterns = patterns('video.views',
   url(r'^$', 'index', name='index'),
   url(r'^uptoken/$', 'uptoken', name='uptoken'),
)