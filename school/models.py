from django.db import models


class ScTeacher(models.Model):
    teacher_name = models.CharField(max_length=50, blank=True, null=True)
    teacher_desc = models.CharField(max_length=1000, blank=True, null=True)
    school_id = models.IntegerField(blank=True, null=True)
    major_id = models.IntegerField(blank=True, null=True)
    contact_mail = models.CharField(max_length=50, blank=True, null=True)
    teacher_url = models.CharField(max_length=200, blank=True, null=True)
    user_id = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'sc_teacher'


class ScGrade(models.Model):
    user_grade = models.CharField(max_length=50, blank=True)
    grade_name = models.CharField(max_length=50, blank=True)
    upper_limit = models.IntegerField(blank=True, null=False)
    lower_limit = models.IntegerField(blank=True, null=False)

    class Meta:
        db_table = 'sc_grade'
