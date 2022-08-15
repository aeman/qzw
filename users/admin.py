from django.contrib import admin
from users.models import SsUser, ScStudent

class SsUserAdmin(admin.ModelAdmin):
    list_display = ('name', 'mail', 'register_time', 'exp_value',)
    search_fields = ('name',)
    ordering = ('-register_time',)

class ScStudentAdmin(admin.ModelAdmin):
    list_display = ('name', 'school', 'major',)
    search_fields = ('name',)
    ordering = ('id',)

admin.site.register(SsUser, SsUserAdmin)
admin.site.register(ScStudent, ScStudentAdmin)
