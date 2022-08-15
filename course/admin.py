from django.contrib import admin
from course.models import CrClass, CrKnowtree, CrCourse, CrVideo


class CrClassAdmin(admin.ModelAdmin):
    list_display = ('class_name', 'class_desc', 'class_pic')
    search_fields = ('class_name', 'class_desc')
    ordering = ('-create_time',)

class CrKnowtreeAdmin(admin.ModelAdmin):
    list_display = ('tree_name', 'tree_desc', 'tree_pic')
    search_fields = ('tree_name', 'tree_desc')
    # list_filter = ('tree_name')
    ordering = ('-create_time',)

class CrCourseAdmin(admin.ModelAdmin):
    list_display = ('course_name', 'course_desc', 'course_pic')
    ordering = ('-knowtree_id',)

class CrVideoAdmin(admin.ModelAdmin):
    list_display = ('video_name', 'video_url', 'upload_user', 'video_time')

admin.site.register(CrClass, CrClassAdmin)
admin.site.register(CrKnowtree, CrKnowtreeAdmin)
admin.site.register(CrCourse, CrCourseAdmin)
admin.site.register(CrVideo, CrVideoAdmin)
