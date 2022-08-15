"""web URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin
from django.utils.functional import curry
from django.views.defaults import *

import users.views as v_user
import public.views as v_public
import course.views as v_course

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^video/', include('video.urls', namespace='video')),
    url(r'^search/', include('search.urls', namespace='search')),
    url(r'^article/', include('article.urls', namespace='article')),
    url(r'^knowledge/', include('knowledge.urls', namespace='knowledge')),
    url(r'^$', v_public.index),
    url(r'^class/(?P<classId>\d{1,})$', v_course.get_class),
    url(r'^video/(?P<videoId>\d{1,})$', v_course.get_video),
    url(r'^getMoreCourses/(?P<start>\d{1,})$', v_public.get_more_courses),
    url(r'^checkNameValid/$', v_user.check_user_valid),
    url(r'^checkMailValid/$', v_user.check_mail_valid),
    url(r'^register/$', v_user.register_user),
    url(r'^finishRegister/$', v_user.finish_register_user),
    url(r'^login/$', v_user.login),
    url(r'^logout/$', v_user.logout),
    url(r'^newTree/$', v_user.new_tree),
    url(r'^editTree/(?P<tree_id>\d{1,})$', v_user.edit_tree),
    url(r'^addClass/$', v_course.add_class),
    url(r'^editClass/(?P<class_id>\d{1,})$', v_course.edit_class),
    url(r'^addCourse/(?P<tree_id>\d{1,})/(?P<course_name>.*)/$', v_course.add_course),
    url(r'^addVideoToCourse/(?P<course_id>\d{1,})/(?P<video_id>\d{1,})/$', v_course.add_video_to_course),
    url(r'^deleteVideoFromCourse/(?P<course_id>\d{1,})/(?P<video_id>\d{1,})/$', v_course.delete_video_from_course),
    url(r'^setMark/$', v_user.set_mark),
    url(r'^retakePassword/$', v_user.retake_password),
    url(r'^mailToRetake/$', v_user.send_password_mail),
    url(r'^resetPassword/(?P<user_id>\d{1,9})/(?P<user_md>.*)$', v_user.reset_password),
    url(r'^changePassword/$', v_user.change_password),
    url(r'^changePasswordFromMail/$', v_user.change_password_from_mail),
    url(r'^userOptions/$', v_user.set_options),
    url(r'^uploadAvatar/$', v_user.upload_avatar),
    url(r'^uploadClassPicture/$', v_course.upload_class_picture),
    url(r'^upload_class_picture_article/$', v_course.upload_class_picture_article),
    url(r'^course/index/$', v_course.index),
    url(r'^course/type/(?P<type_id>\d)$', v_course.get_classes_by_type),
    url(r'^class/(?P<class_id>\d)$', v_course.get_course_list),
    url(r'^course/(?P<course_id>\d)$', v_course.get_course_info),
    url(r'^course/fav/(?P<course_id>\d{1,11})/$', v_course.add_fav),
    url(r'^course/cancelFav/(?P<course_id>\d{1,11})/$', v_course.cancel_fav),
    url(r'^course/follow/(?P<course_id>\d{1,})$', v_course.add_follow),
    url(r'^course/cancelFollow/(?P<course_id>\d{1,})$', v_course.cancel_follow),
    url(r'^videos/(?P<page_no>\d*)$', v_course.get_videos),
    url(r'^videos/search/$', v_course.search_video),
    url(r'^videos/search/(?P<content>.*)/(?P<page_no>\d*)$', v_course.search_video),
    url(r'^course/list_knowtrees/(?P<up_video_id>\d*)/(?P<page_no>\d*)$', v_course.list_knowtrees),
    url(r'^videos/upload/$', v_course.video_upload),
    url(r'^videos/delete/(?P<video_id>\d{1,})$', v_course.video_delete),
    url(r'^videos/edit/(?P<video_id>\d{1,})$', v_course.video_edit),
    url(r'^videos/save/$', v_course.video_save),
    url(r'^videos/uploadDetail/$', v_course.upload_detail),
    url(r'^videos/search2/(?P<txtSearch>.*)/(?P<page_no>\d{1,})$', v_course.search_videos2),
    url(r'^setVideoTime/(?P<video_id>\d{1,})/(?P<video_time>\d{1,})$', v_course.set_video_time),
    url(r'^setVideoFlag/(?P<video_id>\d{1,})$', v_course.set_video_flag),
]

handler500 = curry(server_error, template_name='500.html')
