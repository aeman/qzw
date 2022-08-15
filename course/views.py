# coding:utf-8

import uuid
import os.path
import urllib2
import urllib

import datetime
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.contrib.auth.decorators import permission_required, login_required
from django.core import serializers
from django.conf import settings
from qiniu import Auth, BucketManager, PersistentFop, op_save

from course.models import *
from school.models import *
from users.models import *
from public.utils import *


# 预设的几个视频转码类型
video_set = {
    '320': 'avthumb/mp4/ab/128k/ar/22050/acodec/libfaac/r/30/vb/300k/vcodec/libx264/s/320x240/autoscale/1/stripmeta/0',
    '480p': 'avthumb/mp4/ab/128k/ar/44100/acodec/libfaac/r/30/vb/900k/vcodec/libx264/s/640x480/autoscale/1/stripmeta/0',
    '720p': 'avthumb/mp4/ab/160k/ar/44100/acodec/libfaac/r/30/vb/2400k/vcodec/libx264/s/1280x720/autoscale/1/stripmeta/0',
    '960p': 'avthumb/mp4/ab/160k/ar/44100/acodec/libfaac/r/30/vb/2400k/vcodec/libx264/s/1280x960/autoscale/1/stripmeta/0',
    '1080p': 'avthumb/mp4/ab/160k/ar/44100/acodec/libfaac/r/30/vb/5400k/vcodec/libx264/s/1920x1080/autoscale/1/strpmeta/0',
    'web': 'avthumb/mp4/ab/160k/ar/44100/acodec/libfaac/r/30/vb/2200k/vcodec/libx264/s/1280x720/autoscale/1/stripmeta/0'
}


# 视频转码
def video_op(q, v_set, bucket_src, key_src, bucket_save, key_save, pipeline):
    pfop = PersistentFop(q, bucket_src, pipeline)
    op = op_save(video_set[v_set], bucket_save, key_save)
    ops = []
    ops.append(op)
    ret, info = pfop.execute(key_src, ops, 1)
    print(info)


# 视频列表
def list_all(bucket_name, bucket=None, prefix=None, limit=None):
    access_key = 'TBCggnDqnGg9ytfNu53Wd0cMSasyTLyH6l8HCvCe'
    secret_key = 's2fZVWHG_s2K_syviSN_vVZlqaTMpFj_eavUsrfm'
    q = Auth(access_key, secret_key)
    if bucket is None:
        bucket = BucketManager(q)
    marker = None
    eof = False
    items = []
    while eof is False:
        ret, eof, info = bucket.list(bucket_name, prefix=prefix, marker=marker, limit=limit)
        marker = ret.get('marker', None)
        for item in ret['items']:
            # print(item['key'])
            items.append(item['key'])
            pass
    if eof is not True:
        # 错误处理
        pass
    return items


# 视频删除
def video_del(key):
    access_key = 'TBCggnDqnGg9ytfNu53Wd0cMSasyTLyH6l8HCvCe'
    secret_key = 's2fZVWHG_s2K_syviSN_vVZlqaTMpFj_eavUsrfm'
    q = Auth(access_key, secret_key)
    bucket = BucketManager(q)
    bucket_name = "transcode"
    ret, info = bucket.delete(bucket_name, key)
    print(info)


def index(request):
    course_types = CrKnowtree.get_all_types()
    course_classes = CrKnowtree.get_all_classes()

    return render(request, 'course/index.html', {'type_list': course_types, 'class_list': course_classes})


def get_class(request, classId):
    tree = CrKnowtree.objects.get(id=classId)
    title = tree.tree_name
    desc = tree.tree_desc[0:50]
    creator = SsUser.objects.get(id=tree.user_id)
    courses = CrCourse.objects.filter(knowtree_id=classId)
    courses = courses[0:14]
    user_id = request.session.get('user_id', '')
    followFlag = 1
    if user_id != '':
        myMark = SsMymark.objects.filter(user_id=user_id).filter(class_id=classId)
        myFav = SsMyfav.objects.filter(user_id=user_id).filter(course_id=classId)
        ifFav = myFav.count() > 0
        if myMark.count() > 0:
            mark_value = myMark[0].mark
        else:
            mark_value = 0
    else:
        mark_value = 0
        ifFav = False
    if not user_id == '':
        user = SsUser.objects.get(id=user_id)
        # 用户等级
        gd = ScGrade.objects.filter(upper_limit__gte=user.exp_value).filter(lower_limit__lte=user.exp_value)[0]
    else:
        user = None
        gd = None

    videos = []
    arrowDList = []
    iLoop = 0
    treeFlags = (3, 0, 4, 7, 14, 8, 15, 16, 26, 25, 10, 17, 18, 23)
    studiedCourses = []
    for course in courses:
        course_id = course.id
        video = CrVideo.objects.filter(course_id=course_id)
        videos.append(video)

        for v in video:
            videoId = v.id
            if user_id != '':
                try:
                    studiedVideo = SsStudyLog.objects.filter(user_id=user_id).get(video_id=videoId)
                    v.play_times = studiedVideo.finish_flag
                except SsStudyLog.DoesNotExist:
                    v.play_times = 0
                except SsStudyLog.MultipleObjectsReturned:
                    studiedVideo = SsStudyLog.objects.filter(user_id=user_id).filter(video_id=videoId)
                    v.play_times = studiedVideo[0].finish_flag

        course.video = video

        if iLoop in (1, 2, 5, 10, 11, 12, 13):
            arrowDList.append("<a class='treeArrowRight'></a>")
        else:
            arrowDList.append("<a class='treeArrowLeft'></a>")
        if user_id != '':
            studiedCourse = SsMycourse.objects.filter(user_id=user_id).filter(course_id=course.id)
            if not (studiedCourse.count() > 0 and studiedCourse[0].study_status == 2):
                studiedCourses.append(treeFlags[iLoop])
        # ++iLoop
        iLoop = iLoop + 1
    if user_id != '':
        follows = SsMyfollow.objects.filter(user_id=user_id).filter(course_id=classId).order_by('-follow_time')
        if follows.count() > 0:
            followFlag = follows[0].flag

    # 一起学习的同学
    mates = SsMyfollow.objects.filter(course_id=classId, flag=0).order_by("-follow_time")
    for mate in mates:
        m = SsUser.objects.get(id=mate.user_id)
        mate.mate_name = m.name
        mate.mate_pic = m.avatar

    indexRightList = (1, 2, 5, 10, 11, 12, 13)

    return render(request, 'tree.html', {
        'title': title + u' - 千字文教育', 'tree': tree, 'creator': creator, 'courses': courses, 'videos': videos,
        'user': user, 'class_id': classId, 'mark_value': mark_value, 'ifFav': ifFav, 'mates': mates,
        'arrowDList': arrowDList, 'gd': gd,
        'indexRightList': indexRightList, 'followFlag': followFlag, 'studiedCourses': studiedCourses,
        'shareTitle': title + ' - ' + desc + u' - 千字文教育',
    })


def get_video(request, videoId):
    video_found = CrVideo.objects.get(id=videoId)
    up_video_found = UpVideo.objects.get(id=video_found.upload_id)
    auto_play = request.GET.get("autoplay");

    # 记录视频播放次数
    v = UpVideo.objects.get(id=video_found.upload_id)
    v.play_times += 1
    v.save()

    video_current_ime = 0

    course_id = video_found.course_id
    videos = CrVideo.objects.filter(course_id=course_id)
    user_id = request.session.get('user_id', '')
    for video in videos:
        videoTimeSec = str(video.video_time % 60)
        if len(videoTimeSec) == 1:
            videoTimeSec = '0' + videoTimeSec
        video.original_name = str(video.video_time / 60) + ":" + videoTimeSec
        if user_id != '':
            sVideo = SsStudyLog.objects.filter(video_id=video.id).filter(user_id=user_id)
            if sVideo.count() > 0:
                video.play_times = sVideo[0].finish_flag
                if video.id == int(videoId):
                    video_current_ime = sVideo[0].watch_time
            else:
                video.play_times = 2
        else:
            video.play_times = 2

    course = CrCourse.objects.get(id=course_id)
    if course.knowtree_id is None:
        class_tree = None
    else:
        class_tree = CrKnowtree.objects.get(id=course.knowtree_id)

    print user_id, course_id
    ifStudied = False
    if user_id != '':
        user = SsUser.objects.get(id=user_id)
        if class_tree is not None:
            fo = SsMyfollow.objects.filter(user_id=user_id, course_id=class_tree.id)
            follow_flag = fo.count() > 0
            print fo.count()
        try:
            studyVideo = SsStudyLog.objects.filter(video_id=videoId).get(user_id=user_id)
            if studyVideo.finish_flag == 1:
                ifStudied = True
        except SsStudyLog.DoesNotExist:
            ifStudied = False
    else:
        user = None
        follow_flag = False

    follow_flag = 1
    if user_id != '':
        if class_tree is not None:
            follows = SsMyfollow.objects.filter(user_id=user_id).filter(course_id=class_tree.id).order_by('-follow_time')
            if follows.count() > 0:
                follow_flag = follows[0].flag
    my_tree_list = None
    if user_id != '':
        my_tree_list = CrKnowtree.objects.filter(user_id=user_id).order_by('-id')
        for tree in my_tree_list:
            my_course_list = CrCourse.objects.filter(knowtree_id=tree.id)
            tree.courseList = my_course_list
        # page_no = 1
        # paginator = Paginator(my_tree_list, 10)
        # pageCount = paginator.num_pages
        # if pageCount - int(page_no) < 5:
        #     videos.paginator = str(paginator.page_range[-5:])
        # else:
        #     videos.paginator = str(paginator.page_range[int(page_no) - 1:int(page_no) - 1 + 5])
        # page = paginator.page(page_no)
        # dataList = page.object_list


    return render(request, 'video.html',
                  {'video': video_found, 'videos': videos, 'class_tree': class_tree, 'user': user, 'follow_flag': follow_flag,
                   'title': u'千字文教育 - ' + video.video_name, 'ifStudied': ifStudied, 'videoCurrentTime': video_current_ime, 'autoPlay': auto_play,
                   'followFlag': follow_flag, 'videoPic': up_video_found.video_pic,
                   'myTreeList': my_tree_list})


def list_knowtrees(request, up_video_id, page_no=1):
    user_id = request.session.get('user_id', '')
    knowtrees = CrKnowtree.objects.filter(user_id=user_id).order_by('-id')
    paginator = Paginator(knowtrees, 10)
    pageCount = paginator.num_pages
    if pageCount - int(page_no) < 5:
        knowtrees.paginator = str(paginator.page_range[-5:])
    else:
        knowtrees.paginator = str(paginator.page_range[int(page_no) - 1:int(page_no) - 1 + 5])
    page = paginator.page(page_no)
    dataList = page.object_list

    response_data = serializers.serialize("json", dataList)
    jsonData = json.loads(response_data)

    for data_item in jsonData:
        my_course_list = CrCourse.objects.filter(knowtree_id=data_item['pk'])
        # data_item.courseList = my_course_list
        # json_course_item = serializers.serialize("json", my_course_list)
        courses = []
        for course in my_course_list:
            test_list = CrVideo.objects.filter(upload_id=up_video_id).filter(course_id=course.id)
            check_value = ''
            if test_list.count() > 0:
                check_value = 'checked="true"'
            courses.append({'course_id': course.id, 'course_name': course.course_name, 'course_checked': check_value})
        data_item['courses'] = courses

    jsonData.insert(0, '{"pageList": "' + knowtrees.paginator + '", "canNext": "' + str(page.has_next()) + '", "canPrev": "' + str(page.has_previous()) + '"}')
    response_data = json.dumps(jsonData)
    # print response_data
    return HttpResponse(response_data, content_type="application/json")


def get_classes_by_type(request, type_id):
    course_types = CrKnowtree.get_all_types()
    course_classes = CrKnowtree.get_classes_by_type(int(type_id))
    return render(request, 'course/index.html', {'type_list': course_types, 'class_list': course_classes})


def get_course_list(request, class_id):
    course_list = CrCourse.objects.filter(class_id=int(class_id))
    teacher_id = CrCourseTeacher.objects.get(course_id=6)
    print 'teacher_id:', teacher_id.teacher_id
    teacher_name = ScTeacher.objects.get(id=int(teacher_id.teacher_id))
    print 'teacher:', teacher_name.teacher_name
    print(course_list.count())
    return render(request, 'course/class.html', {'course_list': course_list})


def get_course_info(request, course_id):
    table_list = CrCourseList.objects.filter(parent_id=int(course_id))
    course_info = CrCourse.objects.get(id=int(course_id))
    return render(request, 'course/course.html', {'table_list': table_list, 'course_info': course_info})


def add_fav(request, course_id):
    user_id = request.session.get('user_id', '')
    if user_id == '':
        return render(request, 'index.html', {})
    else:
        fav = SsMyfav(user_id=user_id, course_id=course_id,
                      fav_time=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
        fav.save()
        json_data = {'result': True}
        return HttpResponse(json.dumps(json_data), content_type='application/json')


def cancel_fav(request, course_id):
    user_id = request.session.get('user_id', '')
    if user_id == '':
        return render(request, 'index.html', {})
    else:
        fav = SsMyfav.objects.filter(user_id=user_id, course_id=course_id)
        if fav.count() > 0:
            for ff in fav:
                ff.delete()
        json_data = {'result': True}
        return HttpResponse(json.dumps(json_data), content_type='application/json')


def add_follow(request, course_id):
    user_id = request.session.get('user_id', '')
    if user_id == '':
        # return render(request, 'index.html', {})
        json_data = {'result': False, 'message': '未登录'}
        return HttpResponse(json.dumps(json_data), content_type='application/json')
    else:
        fo = SsMyfollow.objects.filter(user_id=user_id, course_id=course_id)
        if fo.count() == 0:
            follow = SsMyfollow(user_id=user_id, course_id=course_id,
                                follow_time=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), flag=0)
            follow.save()
            tree = CrKnowtree.objects.get(id=course_id)
            tree.follow_count += 1
            tree.save()
            user = SsUser.objects.get(id=user_id)
            user.exp_value += 2
            user.save()
        json_data = {'result': True}
        return HttpResponse(json.dumps(json_data), content_type='application/json')
        # return render_to_response('tree.html', {}, context_instance=RequestContext(request))


def cancel_follow(request, course_id):
    user_id = request.session.get('user_id', '')
    if user_id == '':
        return render(request, 'index.html', {})
    else:
        tree = CrKnowtree.objects.get(id=course_id)
        tree.follow_count -= 1
        tree.save()
        follow = SsMyfollow.objects.filter(user_id=user_id, course_id=course_id)
        follow.delete()
        user = SsUser.objects.get(id=user_id)
        user.exp_value -= 2
        user.save()
        json_data = {'result': True}
        return HttpResponse(json.dumps(json_data), content_type='application/json')


def add_course(request, tree_id, course_name):
    user_id = request.session.get('user_id', '')
    course = CrCourse(course_name=course_name, knowtree_id=tree_id, user_id=user_id)
    course.save()
    json_data = {'result': True, 'id': course.id}
    return HttpResponse(json.dumps(json_data), content_type='application/json')


def add_video_to_course(request, course_id, video_id):
    video = CrVideo.objects.get(id=video_id)
    new_video = CrVideo(video_name=video.video_name, video_url=video.video_url,
                        upload_user=video.upload_user, video_time=video.video_time,
                        course_id=course_id, upload_id=video.upload_id)
    new_video.save()
    json_data = {'result': True}
    return HttpResponse(json.dumps(json_data), content_type='application/json')


def delete_video_from_course(request, course_id, video_id):
    video = CrVideo.objects.get(id=video_id)
    wish_del_video = CrVideo.objects.filter(course_id=course_id).get(upload_id=video.upload_id)
    wish_del_video.delete()
    json_data = {'result': True}
    return HttpResponse(json.dumps(json_data), content_type='application/json')


def upload_class_picture(request):
    file_name = str(uuid.uuid1()) + '.png';
    json_data = {'result': file_name}
    f = request.FILES['picTree']
    file_name = '../static/images/' + file_name
    with open(os.path.join(os.path.dirname(__file__), file_name), 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)
    # return render_to_response('AccountSet.html', {}, context_instance=RequestContext(request))
    return HttpResponse(json.dumps(json_data), content_type='application/json')


def upload_class_picture_article(request):
    file_name = str(uuid.uuid1()) + '.png';
    json_data = {'error': 0, 'url': "/static/images/" + file_name}
    f = request.FILES['imgFile']
    file_name = '../static/images/' + file_name
    with open(os.path.join(os.path.dirname(__file__), file_name), 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)
    return HttpResponse(json.dumps(json_data), content_type='application/json')


def add_class(request):
    user_id = request.session.get('user_id', '')
    data = json.loads(request.body)
    if data['picFileName'] == '':
        data['picFileName'] = 'default_tree.jpg'

    data_class = CrKnowtree(tree_name=data['classTitle'], tree_desc=data['classDesc'],
                         tree_pic='images/' + data['picFileName'], class_id=data['parentId'],
                         user_id=user_id, create_time=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                         update_time=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    data_class.save()
    json_data = {'id': data_class.id}

    data_course_teacher = CrCourseTeacher(class_id=data_class.id, teacher_id=1)
    data_course_teacher.save()
    for course in data['courses']:
        data_course = CrCourse(course_name=course['title'], knowtree_id=data_class.id)
        data_course.save()
        total_video_time = 0
        for video in course['videos']:
            data_video = CrVideo(video_name=video['videoName'], video_url=video['url'], course_id=data_course.id,
                                 video_time=video['duration'], upload_id=video['uploadId'])
            data_video.save()
            total_video_time += int(video['duration'])
        data_course.user_id = user_id
        data_course.course_time = total_video_time
        data_course.save()
    return HttpResponse(json.dumps(json_data), content_type='application/json')


def edit_class(request, class_id):
    json_data = {'result': True}
    user_id = request.session.get('user_id', '')
    data = json.loads(request.body)
    if data['picFileName'] == '':
        data['picFileName'] = 'default_tree.jpg'

    # data_class = CrClass(tree_name=data['classTitle'], class_desc=data['classDesc'],
    # class_pic='images/' + data['picFileName'], parent_id=data['parentId'],
    # user_id=user_id, create_time=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    data_class = CrKnowtree.objects.get(id=class_id)
    data_class.tree_name = data['classTitle']
    data_class.tree_desc = data['classDesc']
    data_class.tree_pic = 'images/' + data['picFileName']
    data_class.parent_id = data['parentId']
    data_class.user_id = user_id
    data_class.update_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    data_class.save()

    # data_course_teacher = CrCourseTeacher(class_id=data_class.id, teacher_id=1)
    # data_course_teacher.save()

    for course in CrCourse.objects.filter(knowtree_id=data_class.id):
        CrVideo.objects.filter(course_id=course.id).delete()
        course.delete()

    for course in data['courses']:
        data_course = CrCourse(course_name=course['title'], knowtree_id=data_class.id)
        data_course.save()
        total_video_time = 0
        for video in course['videos']:
            data_video = CrVideo(video_name=video['videoName'], video_url=video['url'], course_id=data_course.id,
                                 video_time=video['duration'], upload_id=video['uploadId'])
            data_video.save()
            total_video_time += int(video['duration'])
        data_course.course_time = total_video_time
        data_course.user_id = user_id
        data_course.save()
    return HttpResponse(json.dumps(json_data), content_type='application/json')


@login_required(login_url='/')
@permission_required('course.can_edit_video', raise_exception=True)
def get_videos(request, page_no):
    page_no = page_no or 1
    user_id = request.session.get('user_id', '')
    # bucket_src = 'transcode'
    # q_videos = list_all(bucket_src)
    videos = UpVideo.objects.filter(upload_user=user_id).order_by("-upload_time")
    paginator = Paginator(videos, 10)
    try:
        current_page = paginator.page(page_no)
    except PageNotAnInteger, e:
        return redirect("/videos/")
    except EmptyPage, e:
        page_no = paginator.num_pages
        return redirect("/videos/" + str(page_no))
    context = dict()
    context["items"] = current_page.object_list
    context["page"] = current_page
    context["content"] = ""
    # for video in videos:
    #     if video.original_name == "":
    #         video.video_status = u"可播放"
    #     else:
    #         iPos = video.video_url.rfind('/')
    #         if video.video_url[iPos + 1:] in q_videos:
    #             video.video_status = u"可播放"
    #         else:
    #             video.video_status = u"转码中"
    return render(request, "videos.html", context)


def search_video(request, content = "", page_no = 1):
    # bucket_src = 'transcode'
    # q_videos = list_all(bucket_src)
    if not content:
        redirect("/videos/")
    page_no = page_no or 1
    user_id = request.session.get('user_id', '')
    videos = UpVideo.objects.filter(video_name__contains=content).filter(upload_user=user_id).order_by("-upload_time")
    paginator = Paginator(videos, 10)
    try:
        current_page = paginator.page(page_no)
    except PageNotAnInteger, e:
        return redirect("/videos/" + content)
    except EmptyPage, e:
        page_no = paginator.num_pages
        return redirect("/videos/" + content + "/" + str(page_no))
    context = dict()
    context["items"] = current_page.object_list
    context["page"] = current_page
    context["content"] = content
    context["searching"] = True
    # for video in videos:
    #     if video.original_name == "":
    #         video.video_status = u"可播放"
    #     else:
    #         iPos = video.video_url.rfind('/')
    #         if video.video_url[iPos + 1:] in q_videos:
    #             video.video_status = u"可播放"
    #         else:
    #             video.video_status = u"转码中"
    return render(request, "videos.html", context)


def search_videos2(request, txtSearch, page_no = 1):
    videos = UpVideo.objects.filter(video_name__contains=txtSearch).order_by("-upload_time")
    paginator = Paginator(videos, 10)
    pageCount = paginator.num_pages
    if pageCount - int(page_no) < 5:
        videos.paginator = str(paginator.page_range[-5:])
    else:
        videos.paginator = str(paginator.page_range[int(page_no) - 1:int(page_no) - 1 + 5])
    page = paginator.page(page_no)
    dataList = page.object_list

    response_data = serializers.serialize("json", dataList)
    jsonData = json.loads(response_data)
    jsonData.insert(0, '{"pageList": "' + videos.paginator + '", "canNext": "' + str(page.has_next()) + '", "canPrev": "' + str(page.has_previous()) + '", "searchContent": "' + txtSearch + '"}')
    response_data = json.dumps(jsonData)
    # print response_data
    return HttpResponse(response_data, content_type="application/json")


@login_required(login_url='/')
@permission_required('course.can_edit_tree', raise_exception=True)
def video_upload(request):
    tree_class = CrClass.objects.filter(parent_id=0)
    return render(request, "video_upload.html", {"tree_class": tree_class})


def upload_detail(request):
    return render(request, "upload_detail.html")


@login_required(login_url='/')
@permission_required('course.can_edit_video', raise_exception=True)
def video_save(request):
    videoId = request.POST["videoId"];
    videoName = request.POST["videoName"];
    videoDesc = request.POST["videoDesc"];
    videoClass = request.POST["videoClass"];
    videoTag = request.POST["videoTag"];
    videoUrl = request.POST["videoUrl"];
    videoOriginalUrl = request.POST["videoOriginalUrl"];
    videoOriginalName = request.POST["videoOriginalName"];
    user_id = request.session.get('user_id', '');
    uploadTime = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    videoInfoUrl = videoOriginalUrl + '?avinfo'
    try:
        ret = urllib2.urlopen(videoInfoUrl).read()
        ret = json.loads(ret)
        duration = float(ret['format']['duration'])
        videoDuration = int(duration)
    except:
        videoDuration = 0
    # videoDuration = str(int(duration/60)) + ":" + str(int(duration%60))

    #获取视频第一帧缩略图
    data_image = urllib.urlopen(videoOriginalUrl + "?vframe/jpg/offset/0/w/240/h/135/").read()
    file_name = str(uuid.uuid1()) + '.jpg'
    image_file = open(settings.STATICFILES_DIRS[0] + "/images/videos/" + file_name, "wb")
    image_file.write(data_image)
    image_file.close()

    mode = request.POST["mode"]
    if mode == "edit":
        video = UpVideo.objects.get(id=videoId)
        video.video_name = videoName
        video.video_desc = videoDesc
        video.video_tag = videoTag
        video.class_id = videoClass
        video.save()
        return HttpResponseRedirect('/videos')

    video = UpVideo(video_name=videoName, video_url=videoUrl, upload_user=user_id, original_name=videoOriginalName,
                    class_id=videoClass, upload_time=uploadTime, video_desc=videoDesc, video_tag=videoTag,
                    video_time=videoDuration, video_pic="images/videos/" + file_name)
    video.save()

    # 执行转码操作
    if videoOriginalName != "":
        access_key = 'TBCggnDqnGg9ytfNu53Wd0cMSasyTLyH6l8HCvCe'
        secret_key = 's2fZVWHG_s2K_syviSN_vVZlqaTMpFj_eavUsrfm'
        q = Auth(access_key, secret_key)
        bucket_src = 'original'
        key_src = videoId
        saved_bucket = 'transcode'
        saved_key = videoId
        pipeline = 'qianziwen'
        video_op(q, '720p', bucket_src, key_src, saved_bucket, saved_key, pipeline)
    return HttpResponseRedirect('/videos')


@login_required(login_url='/')
@permission_required('course.can_edit_video', raise_exception=True)
def video_delete(request, video_id):
    video = UpVideo.objects.get(id=video_id)
    video.delete()

    videos = CrVideo.objects.filter(upload_id=video_id)
    videos.delete()

    iPos = video.video_url.rfind('/');
    qVideoId = video.video_url[iPos + 1:]
    video_del(qVideoId)

    json_data = {'result': True}
    return HttpResponse(json.dumps(json_data), content_type='application/json')


@login_required(login_url='/')
@permission_required('course.can_edit_video', raise_exception=True)
def video_edit(request, video_id):
    video = UpVideo.objects.get(id=video_id)
    tree_class = CrClass.objects.all()
    return render(request, "video_upload.html", {"video": video, "mode": "edit", "tree_class": tree_class})


def search_videos(request, keyword, pageNo=1):
    videos = UpVideo.objects.filter(video_name__contains=keyword).order_by('-upload_time')[
             int(pageNo) * 10 - 10:int(pageNo) * 10]
    ret = []
    for video in videos:
        data = {'videoName': video.video_name,
                'videoUrl': video.video_url,
                'videoId': video.id,
                'videoTime': video.video_time}
        ret.append(data)
    return HttpResponse(json.dumps(ret), content_type='application/json')


def set_video_flag(request, video_id):
    user_id = request.session.get('user_id', '')
    if user_id == '':
        return HttpResponse(json.dumps({'result': False}), content_type='application/json')
    else:
        video = SsStudyLog.objects.filter(video_id=video_id).get(user_id=user_id)
        video.finish_flag = 1
        video.save()

        upload_id = CrVideo.objects.get(id=video_id).upload_id
        videoSames = CrVideo.objects.filter(upload_id=upload_id)
        for v in videoSames:
            video_id = v.id

            try:
                studyVideo = SsStudyLog.objects.filter(user_id=user_id).get(video_id=video_id)
                studyVideo.finish_flag = 1
            except SsStudyLog.DoesNotExist:
                studyVideo = SsStudyLog(user_id=user_id, video_id=video_id, watch_time=v.video_time, finish_flag=1)
            studyVideo.save()

            courses = CrVideo.objects.filter(id=video_id)
            for course in courses:
                courseId = course.course_id
                videos = CrVideo.objects.filter(course_id=courseId)
                ifAllFinished = True
                video_order_no = 0
                next_video_url = ""
                for video in videos:
                    try:
                        studyVideo = SsStudyLog.objects.filter(user_id=user_id).get(video_id=video.id)
                    except SsStudyLog.DoesNotExist:
                        ifAllFinished = False
                        # break
                    if studyVideo.finish_flag == 0:
                        ifAllFinished = False
                        # break
                    if video.id == int(video_id):
                        if video_order_no < videos.count() - 1:
                            next_video_url = "/video/" + str(videos[video_order_no + 1].id) + "?autoplay=true"
                    video_order_no = video_order_no + 1
                if ifAllFinished:
                    studyStatus = 2
                else:
                    studyStatus = 0
                try:
                    studyCourse = SsMycourse.objects.get(course_id=courseId)
                    studyCourse.study_status = studyStatus
                except SsMycourse.DoesNotExist:
                    studyCourse = SsMycourse(user_id=user_id, course_id=courseId, study_status=studyStatus, study_time=0)
                studyCourse.save()

        return HttpResponse(json.dumps({'result': True, 'nextVideoUrl': next_video_url}), content_type='application/json')


def set_video_time(request, video_id, video_time):
    user_id = request.session.get('user_id', '')
    if user_id == '':
        return HttpResponse(json.dumps({'result': False}), content_type='application/json')
    else:
        try:
            video = SsStudyLog.objects.filter(video_id=video_id).get(user_id=user_id)
            video.watch_time = video_time
        except SsStudyLog.DoesNotExist:
            video = SsStudyLog(user_id=user_id, video_id=video_id, watch_time=video_time, finish_flag=0)
        video.save()

        videoPlaying = CrVideo.objects.get(id=video_id)
        upload_id = videoPlaying.upload_id
        videoSames = CrVideo.objects.filter(upload_id=upload_id)
        for v in videoSames:
            try:
                video = SsStudyLog.objects.filter(video_id=v.id).get(user_id=user_id)
                video.watch_time = video_time
            except SsStudyLog.DoesNotExist:
                video = SsStudyLog(user_id=user_id, video_id=v.id, watch_time=video_time, finish_flag=0)
            video.save()

        return HttpResponse(json.dumps({'result': True}), content_type='application/json')
