# -*- coding: utf-8 -*-

from django.db import models


class SsUser(models.Model):
    name = models.CharField(max_length=50, db_column='user_name', verbose_name='用户名')
    password = models.CharField(max_length=50, db_column='user_pass')
    salt = models.CharField(max_length=50, db_column='user_salt')
    mail = models.CharField(max_length=50, db_column='register_mail',  verbose_name='注册邮箱')
    sex = models.IntegerField(db_column='user_sex', default=0)
    avatar = models.CharField(
        max_length=100, db_column='user_avatar', default='', blank=True,
        null=True)
    register_time = models.DateTimeField()
    type = models.IntegerField(db_column='user_type', default=0)
    exp_value = models.IntegerField(db_column='exp_value', default=0,  verbose_name='经验值')

    class Meta:
        db_table = 'ss_user'
        verbose_name = '用户附加信息'
        verbose_name_plural = "用户附加信息"

    def __str__(self):
        return self.name


class ScStudent(models.Model):
    name = models.CharField(max_length=50, db_column='student_name', verbose_name='学生姓名')
    type = models.IntegerField(default=0)
    school = models.CharField(max_length=100, blank=True, null=True, default='',  verbose_name='学校')
    no = models.CharField(max_length=100)
    major = models.CharField(max_length=100, blank=True, null=True, default='',  verbose_name='专业')
    mail = models.CharField(max_length=50, blank=True, null=True)
    user = models.IntegerField()

    class Meta:
        db_table = 'sc_student'
        verbose_name = '学生附加信息'
        verbose_name_plural = "学生附加信息"

    def __str__(self):
        return self.name


class SsMyfav(models.Model):
    user_id = models.IntegerField(blank=True, null=True)
    course_id = models.IntegerField(blank=True, null=True)
    fav_time = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'ss_myfav'


class SsMymark(models.Model):
    user_id = models.IntegerField()
    class_id = models.IntegerField()
    mark = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ss_mymark'


class SsMycourse(models.Model):
    user_id = models.IntegerField()
    course_id = models.IntegerField()
    study_status = models.IntegerField()
    study_time = models.IntegerField()
    user_rate = models.IntegerField()

    class Meta:
        db_table = 'ss_mycourse'


class SsStudyLog(models.Model):
    user_id = models.IntegerField()
    video_id = models.IntegerField()
    watch_time = models.IntegerField()
    finish_flag = models.IntegerField()

    class Meta:
        db_table = 'ss_study_log'
