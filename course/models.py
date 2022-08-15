# -*- coding: utf-8 -*-

from django.db import models

class CrClass(models.Model):
    class_name = models.CharField(max_length=100, blank=True, null=True, verbose_name='知识树名称')
    parent_id = models.IntegerField(blank=True, null=True)
    class_desc = models.CharField(max_length=1000, blank=True, null=True, verbose_name='知识树描述')
    class_pic = models.CharField(max_length=300, blank=True, null=True, verbose_name='图片路径')
    follow_count = models.IntegerField(blank=True, null=True, default=0)
    fav_count = models.IntegerField(blank=True, null=True, default=0)
    user_id = models.IntegerField(blank=True, null=True)
    create_time = models.DateTimeField(blank=True, null=True)
    update_time = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'cr_class'
        verbose_name = '知识树分类'
        verbose_name_plural = "知识树分类"

    @classmethod
    def get_all_types(cls):
        return cls.objects.filter(parent_id=0)

    @classmethod
    def get_all_classes(cls):
        return cls.objects.exclude(parent_id=0)

    @classmethod
    def get_classes_by_type(cls, type_id):
        return cls.objects.filter(parent_id=type_id)

    def __unicode__(self):
        return self.class_name


class CrKnowtree(models.Model):
    tree_name = models.CharField(max_length=100, blank=True, null=True, verbose_name='知识树名称')
    class_id = models.IntegerField(blank=True, null=True)
    tree_desc = models.CharField(max_length=1000, blank=True, null=True, verbose_name='知识树描述')
    tree_pic = models.CharField(max_length=300, blank=True, null=True, verbose_name='图片路径')
    follow_count = models.IntegerField(blank=True, null=True, default=0)
    fav_count = models.IntegerField(blank=True, null=True, default=0)
    user_id = models.IntegerField(blank=True, null=True)
    create_time = models.DateTimeField(blank=True, null=True)
    update_time = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'cr_knowtree'
        verbose_name = '知识树'
        verbose_name_plural = "知识树"
        permissions = (
            ("can_view_tree", "可以观看知识树"),
            ("can_edit_tree", "可以编辑知识树"),
        )

    @classmethod
    def get_all_types(cls):
        return cls.objects.filter(parent_id=0)

    @classmethod
    def get_all_classes(cls):
        return cls.objects.exclude(parent_id=0)

    @classmethod
    def get_classes_by_type(cls, type_id):
        return cls.objects.filter(parent_id=type_id)

    def __unicode__(self):
        return self.tree_name


class CrCourse(models.Model):
    course_name = models.CharField(max_length=200, blank=True, null=True, verbose_name='知识点名称')
    course_desc = models.CharField(max_length=1000, blank=True, null=True, verbose_name='知识点描述')
    prerequisite_desc = models.CharField(max_length=1000, blank=True, null=True)
    course_pic = models.CharField(max_length=300, blank=True, null=True, verbose_name='知识点图片')
    knowtree_id = models.IntegerField(blank=True, null=True)
    user_id = models.IntegerField(blank=True, null=True)
    level_id = models.IntegerField(blank=True, null=True)
    course_time = models.IntegerField(blank=True, null=True, default=0)
    follow_count = models.IntegerField(blank=True, null=True, default=0)
    fav_count = models.IntegerField(blank=True, null=True, default=0)
    order_no = models.IntegerField(blank=True, null=True, default=0)
    play_times = models.IntegerField(blank=True, null=True, default=0, verbose_name='知识点下视频播放总次数')

    class Meta:
        db_table = 'cr_course'
        verbose_name = '知识点'
        verbose_name_plural = "知识点"

    def __unicode__(self):
        return self.course_name


class CrCourseTeacher(models.Model):
    class_id = models.IntegerField()
    teacher_id = models.IntegerField()
    # fav_time = models.DateTimeField()

    class Meta:
        db_table = 'cr_course_teacher'
        unique_together = (('class_id', 'teacher_id'),)


class CrCourseList(models.Model):
    list_name = models.CharField(max_length=200, blank=True, null=True)
    parent_id = models.IntegerField(blank=True, null=True)
    list_time = models.IntegerField(blank=True, null=True)
    list_status = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'cr_course_list'


class CrListTeacher(models.Model):
    list_id = models.IntegerField()
    teacher_id = models.IntegerField()

    class Meta:
        db_table = 'cr_list_teacher'
        unique_together = (('list_id', 'teacher_id'),)


class CrListVideo(models.Model):
    list_id = models.IntegerField()
    video_id = models.IntegerField()

    class Meta:
        db_table = 'cr_list_video'
        unique_together = (('list_id', 'video_id'),)


class CrVideo(models.Model):
    video_name = models.CharField(max_length=100, blank=True, null=True)
    video_url = models.CharField(max_length=300, blank=True, null=True)
    upload_user = models.IntegerField(blank=True, null=True)
    video_time = models.IntegerField(blank=True, null=True)
    play_times = models.IntegerField(blank=True, null=True)
    original_name = models.CharField(max_length=100, blank=True, null=True)
    course_id = models.IntegerField(blank=True, null=True)
    upload_id = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'cr_video'
        verbose_name = '视频'
        verbose_name_plural = "视频"
        permissions = (
            ("can_view_video", "可以观看视频"),
            ("can_edit_video", "可以编辑视频"),
        )

    def __unicode__(self):
        return self.video_name


class SsMyfollow(models.Model):
    user_id = models.IntegerField(blank=True, null=True)
    course_id = models.IntegerField(blank=True, null=True)
    follow_time = models.DateTimeField(blank=True, null=True)
    flag = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ss_myfollow'


class UpVideo(models.Model):
    video_name = models.CharField(max_length=100, blank=True, null=True)
    video_url = models.CharField(max_length=300, blank=True, null=True)
    upload_user = models.IntegerField(blank=True, null=True)
    video_time = models.IntegerField(blank=True, null=True)
    play_times = models.IntegerField(blank=True, null=True, default=0)
    original_name = models.CharField(max_length=100, blank=True, null=True)
    class_id = models.IntegerField(blank=True, null=True)
    upload_time = models.DateTimeField(blank=True, null=True)
    video_desc = models.CharField(max_length=1000, blank=True, null=True)
    video_tag = models.CharField(max_length=200, blank=True, null=True)
    video_status = models.CharField(max_length=10, blank=True, null=True)
    video_pic = models.CharField(max_length=300, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'up_video'
