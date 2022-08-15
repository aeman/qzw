# ^_^ coding:utf-8 ^_^
from django.contrib.auth.decorators import permission_required, login_required

__author__ = 'sunny'

import json, datetime, re
import public.consts as consts
from public.utils import *
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from course.models import *
from django.db.models.fields import *
from django.db import connection, transaction

# ##########################  华丽的分隔符 ##########################


# 删除知识点
def knowledge_delete(request, knowledge_id):
    cursor = connection.cursor()
    cursor.execute('delete from cr_video where course_id=%s', [knowledge_id])
    cursor.execute('delete from cr_course where id=%s', [knowledge_id])
    return redirect("/knowledge/list")


# 知识点首页
def index(request):
    return redirect("/knowledge/list")


# 获取知识点列表
@login_required(login_url='/')
@permission_required('article.can_view_article', raise_exception=True)
def knowledge_list(request, page_no, search_text):
    page_no = page_no or 1
    user_id = request.session.get('user_id', '0')
    if not search_text:
        paginator = Paginator(CrCourse.objects.filter(user_id=user_id).order_by('-id'), consts.page_limit)
    else:
        paginator = Paginator(CrCourse.objects.filter(user_id=user_id).filter(course_name__contains=search_text).order_by('-id'), consts.page_limit)
    context = dict()
    context["searchText"] = search_text or ""
    try:
        current_page = paginator.page(page_no)
    except PageNotAnInteger, e:
        return redirect("/knowledge/list")
    except EmptyPage, e:
        page_no = paginator.num_pages
        return redirect("/knowledge/list/" + str(page_no))
    context["items"] = current_page.object_list
    context["page"] = current_page
    return render(request, "knowledge/knowledge_list.html", context)


# 新增知识点
@login_required(login_url='/')
@permission_required('article.can_view_article', raise_exception=True)
def knowledge_add(request):
    return render(request, "knowledge/knowledge_add.html")


# 编辑知识点
def knowledge_edit(request, knowledge_id):
    course = CrCourse.objects.filter(id=knowledge_id)
    if not course or len(course) == 0:
        return error("Knowledge not found")
    return render(request, "knowledge/knowledge_add.html", {"knowledge": course[0]})


# 没错，我不生产数据，我只是大自然的搬运工
def copy_video(video_id, course_id):
    all_video_time = 0
    up_video = UpVideo.objects.filter(id=video_id)
    if not up_video or len(up_video) == 0:
        return all_video_time
    item = up_video[0]
    obj = CrVideo()
    obj.video_name = item.video_name
    obj.course_id = course_id
    obj.video_url = item.video_url
    obj.play_times = item.play_times
    obj.video_time = item.video_time
    all_video_time = item.video_time
    obj.upload_user = item.upload_user
    obj.upload_id = item.id
    #obj.id = item.id
    obj.original_name = item.original_name
    obj.save()
    return all_video_time


# 更新，新建知识点
def knowledge_update(request):
    know_id = request.POST["id"]
    name = request.POST["title"] or ""
    desc = request.POST["desc"] or ""
    ids = request.POST["videos"] or ""
    ids = ids.split(",")
    if not know_id:
        item = CrCourse()
        item.course_name = name
        item.course_desc = desc
        item.user_id = request.session.get('user_id', '')
        item.save()
        video_time = 0
        for video_id in ids:
            video_time = video_time + copy_video(video_id, item.id)
        item.course_time = video_time
        item.save()
        return redirect("/knowledge/list")
    else:
        cursor = connection.cursor()
        cursor.execute('delete from cr_video where course_id=%s',
                   [know_id])
        items = CrCourse.objects.filter(id=know_id)
        if not items or len(items) == 0:
            return error("Courser not found")
        item = items[0]
        item.course_name = name
        item.course_desc = desc
        item.save()
        video_time = 0
        for video_id in ids:
            video_time = video_time + copy_video(video_id, item.id)
        item.course_time = video_time
        item.save()
        return redirect("/knowledge/edit/" + know_id)


def _get_course_videos(knowledge_id):
    videos = CrVideo.objects.filter(course_id=knowledge_id).order_by('id')
    result = []
    for video in videos:
        item = dict()
        item["id"] = video.upload_id
        item["oid"] = video.id
        item["name"] = video.video_name
        item["play_times"] = video.play_times
        item["video_time"] = video.video_time
        result.append(item)
    return result


# 获取知识点相关视频
def get_course_videos(request, knowledge_id):
    return render_json(_get_course_videos(knowledge_id))


# 获取更多的知识点相关视频
def get_courses_videos(request, knowledge_ids):
    # 字符串分隔的
    ids = knowledge_ids.split(",")
    result = dict()
    for know_id in ids:
        result[know_id] = _get_course_videos(int(know_id))
    return render_json(result)


def course_wrapper(course):
    obj = dict()
    obj["course_name"] = course.course_name
    obj["course_desc"] = course.course_desc
    obj["course_pic"] = course.course_pic
    obj["knowtree_id"] = course.knowtree_id
    obj["follow_count"] = course.follow_count
    obj["play_times"] = course.play_times
    obj["id"] = course.id
    return obj


# 获取知识点视频播放排序
def analysis(request, limit):
    cnt = limit or "5"
    courses = CrCourse.objects.order_by('-play_times')[0: int(cnt)]
    json_objs = []
    for course in courses:
        json_objs.append(course_wrapper(course))
    return render_json(json_objs)


# 获取某个知识点的描述
def get_knowledge_comment(request, knowledg_name):
    courses = CrCourse.objects.filter(course_name__contains=knowledg_name)
    if courses and len(courses) == 1:
        return render_json({"comment": courses[0].course_desc})
    else:
        return render_json({"comment": ""})

