# coding:utf-8

import json
from django.shortcuts import render
from django.http import HttpResponse
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from course.models import *
from users.models import SsUser


def index(request):
    return render(request, 'search/index.html')


def s_tips(request):
    keyword = request.GET.get('keyword')
    json_data = [u'<li><a href="/search/video/?keyword=' + keyword + u'">搜<span class="red-txt">' + keyword +
                 u'</span>相关的视频</a></li>']
    courses_list = CrCourse.objects.filter(course_name__contains=keyword).order_by("-id")[0:3]
    classes_list = CrKnowtree.objects.filter(tree_name__contains=keyword).filter(id__gte=100).order_by("-create_time")[
                   0:3]
    for course in courses_list:
        video_data = CrVideo.objects.filter(course_id=course.id)[0]
        course_data = u'<li><a href="/video/' + str(
            video_data.id) + u'">' + course.course_name + u'</a><span>视频</span></li>'
        course_data = course_data.replace(keyword, '<span class="red-txt">' + keyword + '</span>')
        json_data.append(course_data)
    for _class in classes_list:
        class_data = u'<li><a href="/class/' + str(_class.id) + u'">' + _class.tree_name + u'</a><span>知识树</span></li>'
        json_data.append(class_data)
    return HttpResponse(json.dumps(json_data), content_type='application/json')


def s_video(request):
    page_limit = 5  # 每页显示5条
    keyword = request.GET.get('keyword')
    page = request.GET.get('page')

    if keyword is None:
        return render(request, 'search/index.html')

    # 搜索包含关键字的所有知识点
    courses_list = CrCourse.objects.filter(course_name__contains=keyword).order_by("-id")
    # print(courses_list.count())

    # 搜索包含关键字的所有视频,从视频反查知识点,合并到知识点列表
    videos_has_keyword = CrVideo.objects.filter(video_name__contains=keyword).order_by("id")
    for video_has_keyword in videos_has_keyword:
        if not courses_list.filter(id=video_has_keyword.course_id).exists():
            course_from_video = CrCourse.objects.filter(id=video_has_keyword.course_id)
            courses_list = courses_list | course_from_video

    for course in courses_list:
        videos_list = CrVideo.objects.filter(course_id=course.id)
        # 如果知识点下面没有视频,不显示该知识点
        if videos_list.count() == 0:
            course.delete()
            continue
        # course_class = CrKnowtree.objects.get(id=course.knowtree_id)
        course.first_video_id = videos_list[0].id
        course.videos = videos_list
        up_video = UpVideo.objects.get(id=videos_list[0].upload_id)
        course.video_pic = up_video.video_pic
        try:
            if len(course.course_desc) > 150:
                course.course_desc = course.course_desc[0:150] + "..."
        except TypeError:
            course.course_desc = ""

    # 搜索包含关键字的知识树
    classes_list = CrKnowtree.objects.filter(tree_name__contains=keyword).order_by("-create_time")
    classes_count = classes_list.count()

    paginator = Paginator(courses_list, page_limit)
    try:
        courses = paginator.page(page)
    except PageNotAnInteger:
        courses = paginator.page(1)
    except EmptyPage:
        courses = paginator.page(paginator.num_pages)

    if paginator.num_pages - int(courses.number) < 5:
        courses.page_range = paginator.page_range[-5:]
    else:
        courses.page_range = paginator.page_range[courses.number - 1:courses.number - 1 + 5]
    has_previous = courses.has_previous()
    has_next = courses.has_next()
    if has_previous:
        previous_page_number = courses.previous_page_number()
    else:
        previous_page_number = 1
    if has_next:
        next_page_number = courses.next_page_number()
    else:
        next_page_number = paginator.num_pages

    # 搜索视频页面下面的两个知识树
    classes = CrKnowtree.objects.filter(tree_name__contains=keyword).order_by("-create_time")[0:2]
    for course_class in classes:
        user_name = (SsUser.objects.get(id=course_class.user_id)).name
        class_type_name = (CrClass.objects.get(id=course_class.class_id)).class_name
        course_class.user_name = user_name
        course_class.class_type_name = class_type_name
        if len(course_class.tree_desc) > 150:
            course_class.tree_desc = course_class.tree_desc[0:150] + "..."
    return render(request, 'search/video.html', {"courses": courses, "classes": classes,
                                                 "classes_count": classes_count, "keyword": keyword,
                                                 "has_previous": has_previous, "has_next": has_next,
                                                 "previous_page_number": previous_page_number,
                                                 "next_page_number": next_page_number,
                                                 "url": "search"})


def s_course(request):
    page_limit = 10  # 每页显示10条
    keyword = request.GET.get('keyword')
    page = request.GET.get('page')

    if keyword is None:
        return render(request, 'search/index.html')

    courses_list = CrCourse.objects.filter(course_name__contains=keyword).order_by("-id")

    # 搜索包含关键字的所有视频,从视频反查知识点,合并到知识点列表
    videos_has_keyword = CrVideo.objects.filter(video_name__contains=keyword).order_by("id")
    for video_has_keyword in videos_has_keyword:
        if not courses_list.filter(id=video_has_keyword.course_id).exists():
            course_from_video = CrCourse.objects.filter(id=video_has_keyword.course_id)
            courses_list = courses_list | course_from_video
    courses_count = courses_list.count()
    # print(courses_list.count())

    classes_list = CrKnowtree.objects.filter(tree_name__contains=keyword).order_by("-create_time")

    for course_class in classes_list:
        user_name = (SsUser.objects.get(id=course_class.user_id)).name
        class_type_name = (CrClass.objects.get(id=course_class.class_id)).class_name
        course_class.user_name = user_name
        course_class.class_type_name = class_type_name
        if len(course_class.tree_desc) > 150:
            course_class.tree_desc = course_class.tree_desc[0:150] + "..."
    paginator = Paginator(classes_list, page_limit)

    try:
        classes = paginator.page(page)
    except PageNotAnInteger:
        classes = paginator.page(1)
    except EmptyPage:
        classes = paginator.page(paginator.num_pages)

    if paginator.num_pages - int(classes.number) < 5:
        classes.page_range = paginator.page_range[-5:]
    else:
        classes.page_range = paginator.page_range[classes.number - 1:classes.number - 1 + 5]
    has_previous = classes.has_previous()
    has_next = classes.has_next()
    if has_previous:
        previous_page_number = classes.previous_page_number()
    else:
        previous_page_number = 1
    if has_next:
        next_page_number = classes.next_page_number()
    else:
        next_page_number = paginator.num_pages

    return render(request, 'search/course.html', {"classes": classes, "keyword": keyword,
                                                  "courses_count": courses_count,
                                                  "has_previous": has_previous, "has_next": has_next,
                                                  "previous_page_number": previous_page_number,
                                                  "next_page_number": next_page_number,
                                                  "url": "search"})
