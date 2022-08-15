# coding=utf-8

import json
import re
import uuid
import os.path
import random
import hashlib

import datetime
from django.http import HttpResponse, HttpResponseRedirect
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import render_to_response, render
from django.template import RequestContext
from django.core.mail import send_mail
from django.core.context_processors import csrf
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.models import Group
from django.contrib.auth.decorators import permission_required, login_required
from django.contrib import auth

from users.models import *
from course.models import *


def validateEmail(email):
    if len(email) > 7:
        if re.match("^.+\\@(\\[?)[a-zA-Z0-9\\-\\.]+\\.([a-zA-Z]{2,3}|[0-9]{1,3})(\\]?)$", email) != None:
            return 1
    return 0


def md5(value):
    m = hashlib.md5()
    m.update(value)
    return m.hexdigest()


def check_user_valid(request):
    if request.method == 'GET':
        try:
            SsUser.objects.get(name=request.GET['name'])
            json_data = {'result': True}
        except ObjectDoesNotExist:
            json_data = {'result': False}
        return HttpResponse(json.dumps(json_data), content_type='application/json')


def check_mail_valid(request):
    if request.method == 'GET':
        try:
            SsUser.objects.get(mail=request.GET['mail'])
            json_data = {'result': True}
        except ObjectDoesNotExist:
            json_data = {'result': False}
        return HttpResponse(json.dumps(json_data), content_type='application/json')


def login(request):
    c = {}
    c.update(csrf(request))
    if request.method == 'POST':
        register_email = request.POST['mail']
        user_password = request.POST['password']

        # Admin系统用户登录验证
        user = authenticate(username=register_email, password=user_password)
        if user is not None:
            if user.is_active:
                auth.login(request, user)
                can_edit = user.has_perm('course.can_edit')
                print 'can_edit = ', can_edit

                # 从ss_user表获取用户的附加信息
                s_user = SsUser.objects.get(mail=register_email)
                request.session['user_id'] = s_user.id
                request.session['avatar'] = s_user.avatar

                # 用户登录记录经验值
                s_user.exp_value += 2
                s_user.save()

                return HttpResponse(json.dumps({'result': True, 'can_edit': can_edit}), content_type='application/json')
            else:
                return HttpResponse(json.dumps({'result': False, 'error': u'帐号未激活。'}), content_type='application/json')
        else:
            return HttpResponse(json.dumps({'result': False, 'error': u'帐号或密码不正确，登录失败。'}), content_type='application/json')
    else:
        return HttpResponse('this is login page', content=c)


def logout(request):
    auth.logout(request)
    # del request.session['user_id']
    return HttpResponseRedirect('/')


def register_user(request):
    if request.method == 'POST':
        user_name = request.POST['name']
        user_mail = request.POST['mail']
        user_pass = request.POST['pass']
        if (user_name).strip() == "" or (user_mail).strip() == "" or (user_pass).strip() == "":
            return HttpResponse(json.dumps({'result': False, 'error': u'邮箱、密码、昵称均不得为空。'}), content_type='application/json')
        if not validateEmail(user_mail):
            return HttpResponse(json.dumps({'result': False, 'error': u'邮箱格式不正确。'}), content_type='application/json')
        if SsUser.objects.filter(mail = user_mail).count() > 0:
            return HttpResponse(json.dumps({'result': False, 'error': u'该邮箱已经注册，请直接登录。'}), content_type='application/json')
        if SsUser.objects.filter(name = user_name).count() > 0:
            return HttpResponse(json.dumps({'result': False, 'error': u'该昵称已经被人使用。'}), content_type='application/json')
        user_salt = str(random.randint(10000, 99999))
        user_pass1 = md5(user_pass + user_salt)
        register_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        new_user = SsUser(name=user_name, mail=user_mail, password=user_pass1, salt=user_salt,
                          register_time=register_time, exp_value=2)
        new_user.avatar = 'images/default_avatar.jpg'
        new_user.save()

        # 创建Admin系统中的用户
        user = User.objects.create_user(user_mail, user_mail, user_pass)
        user.save()
        g = Group.objects.get(name='学生')
        g.user_set.add(user)

        # 新注册用户直接登录
        user = authenticate(username=user_mail, password=user_pass)
        auth.login(request, user)

        student = ScStudent(name="", type=0, school="", no="", user=new_user.id)
        student.save()

        json_data = {'result': True}
        request.session['user_id'] = new_user.id
        request.session['avatar'] = new_user.avatar
        return HttpResponse(json.dumps(json_data), content_type='application/json')


def finish_register_user(request):
    if request.method == 'POST':
        student_name = request.POST['student_name']
        user_type = request.POST['user_type']
        school_id = request.POST['school_id']
        student_no = request.POST['student_no']
        if (student_name).strip() == "" or (school_id).strip() == "" or (student_no).strip() == "":
            return HttpResponse(json.dumps({'result': False, 'error': u'姓名、学校、学号均不得为空。'}), content_type='application/json')
        user = request.session['user_id'];
        # student = Student(name=student_name, type=user_type, school=school_id, no=student_no, user=user)
        student = ScStudent.objects.get(user=user)
        student.name = student_name
        student.type = user_type
        student.school = school_id
        student.no = student_no
        student.save()
        json_data = {'result': True}
        return HttpResponse(json.dumps(json_data), content_type='application/json')


def set_options(request):
    user_id = request.session['user_id']
    if request.method == 'POST':
        data = json.loads(request.body)
        user_info = SsUser.objects.get(id=user_id)
        user_info.name = data['nickName']
        user_info.sex = int(data['sex'])
        if data['picFile'] != "":
            user_info.avatar = 'images/' + data['picFile']
        user_info.save()
        request.session['avatar'] = user_info.avatar

        student_info = ScStudent.objects.get(user=user_id)
        student_info.name = data['fullName']
        student_info.no = data['no']
        student_info.type = int(data['type'])
        student_info.major = data['major']
        student_info.school = data['school']
        student_info.save()
        json_data = {'result': True}
        return HttpResponse(json.dumps(json_data), content_type='application/json')
    else:
        user_info = SsUser.objects.get(id=user_id)
        student_info = ScStudent.objects.get(user=user_id)
        ret = {'nick_name': user_info.name,
               'sex': user_info.sex,
               'mail': user_info.mail,
               'full_name': student_info.name,
               'type': student_info.type,
               'no': student_info.no,
               'major': student_info.major,
               'school': student_info.school,
               'pic_file': user_info.avatar}
        return render_to_response('AccountSet.html', ret, context_instance=RequestContext(request))


def reset_password(request, user_id, user_md):
    user_info = SsUser.objects.get(id=user_id)
    if user_md == md5(user_info.password):
        return render_to_response('setUpPassword.html', {'user_id': user_id, 'user_md': user_md}, context_instance=RequestContext(request))
    else:
        return HttpResponseRedirect('/')


def change_password_from_mail(request):
    data = json.loads(request.body)
    user_info = SsUser.objects.get(id=data['userId'])
    if data['userMd'] != md5(user_info.password):
        return HttpResponse(json.dumps({'result': False, 'error': u'重置链接已过期。'}), content_type='application/json')
    if data['newPassword'] != data['newPasswordRetype']:
        return HttpResponse(json.dumps({'result': False, 'error': u'两次密码输入不一致'}), content_type='application/json')
    user_info.password = md5(data['newPassword'] + user_info.salt)
    user_info.save();
    json_data = {'result': True}
    return HttpResponse(json.dumps(json_data), content_type='application/json')


def retake_password(request):
    return render_to_response('retake_password.html', {}, context_instance=RequestContext(request))


def change_password(request):
    data = json.loads(request.body)
    user_id = request.session['user_id']
    user_password = data['password']
    user_new_password = data['newPassword']
    user_new_password_retype = data['newPasswordRetype']
    if str(user_password).strip() == "":
        return HttpResponse(json.dumps({'result': False, 'error': u'帐号或密码不得为空。'}), content_type='application/json')
    user = SsUser.objects.filter(id=user_id)
    if user.count() > 0 and user[0].password != md5(user_password + user[0].salt):
        return HttpResponse(json.dumps({'result': False, 'error': u'原密码不匹配，无法设置新密码。'}), content_type='application/json')
    if user_new_password != user_new_password_retype:
        return HttpResponse(json.dumps({'result': False, 'error': u'新密码两次输入不一致。'}), content_type='application/json')

    # 修改Admin系统密码
    user = request.user
    user.set_password(user_new_password)
    user.save()
    
    user_info = SsUser.objects.get(id=user_id)
    user_info.password = md5(user_new_password + user_info.salt)
    user_info.save()

    json_data = {'result': True}
    return HttpResponse(json.dumps(json_data), content_type='application/json')


def send_password_mail(request):
    loginEmail = request.POST["loginEmail"]
    if str(loginEmail).strip() == '':
        return render_to_response('retake_password.html', {'error': u'邮箱地址不能为空。', 'mail': loginEmail}, context_instance=RequestContext(request))
    if not validateEmail(loginEmail):
        return render_to_response('retake_password.html', {'error': u'邮箱地址的格式不正确。', 'mail': loginEmail}, context_instance=RequestContext(request))
    user = SsUser.objects.filter(mail = loginEmail);
    if user.count() == 0:
        return render_to_response('retake_password.html', {'error': u'该邮箱没有在本网站注册，无法发送密码重置邮件。', 'mail': loginEmail}, context_instance=RequestContext(request))
    mail_title = '[千字文教育]密码重置通知';
    mail_content = '重置链接：http://www.icmooc.cn/resetPassword/' + str(user[0].id) + '/' + md5(user[0].password);
    send_mail(mail_title, mail_content, 'icmooc@163.com', [loginEmail], fail_silently=True)
    return render_to_response('getEmail.html', {'mail': loginEmail}, context_instance=RequestContext(request))


def upload_avatar(request):
    file_name = str(uuid.uuid1()) + '.png'
    json_data = {'result': file_name}
    f = request.FILES['avatar']
    file_name = '../static/images/' + file_name
    pf = os.path.join(os.path.dirname(__file__), file_name)
    with open(pf, 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)
    # return render_to_response('AccountSet.html', {}, context_instance=RequestContext(request))
    return HttpResponse(json.dumps(json_data), content_type='application/json')


@login_required(login_url='/')
@permission_required('course.can_edit_tree', raise_exception=True)
def new_tree(request):
    tree_class = CrClass.objects.order_by('id')
    return render_to_response('newTree.html', {'tree_class': tree_class}, context_instance=RequestContext(request))


@login_required(login_url='/')
@permission_required('course.can_edit_tree', raise_exception=True)
def edit_tree(request, tree_id):
    tree_class = CrClass.objects.all()
    all_videos = []
    count = CrKnowtree.objects.filter(id=tree_id).count()
    if count > 0:
        tree = CrKnowtree.objects.filter(id=tree_id)[0]
        tree.tree_pic = tree.tree_pic.split('/')[1]
        courses = CrCourse.objects.filter(knowtree_id=tree_id)
        for course in courses:
            videos = CrVideo.objects.filter(course_id=course.id)
            for video in videos:
                video.play_times = str(video.video_time / 60) + ":" + str(video.video_time % 60)
                all_videos.append(video)
    else:
        tree = None
        courses = None
        all_videos = None
    return render_to_response('editTree.html',
                              {'tree_id': tree_id, 'tree': tree, 'courses': courses, 'all_videos': all_videos,
                               'tree_class': tree_class}, context_instance=RequestContext(request))


def set_mark(request):
    data = json.loads(request.body)
    user_id = request.session['user_id']
    if user_id == '':
        return render(request, 'index.html', {})
    class_id = data['classId']
    mark_value = data['markValue']
    myMark = SsMymark.objects.filter(user_id=user_id).filter(class_id=class_id)
    if myMark.count() > 0:
        myMark = SsMymark.objects.get(user_id=user_id, class_id=class_id)
        myMark.mark = mark_value
        myMark.save()
    else:
        myMark = SsMymark(user_id=user_id, class_id=class_id, mark = mark_value)
        myMark.save()
    return HttpResponse(json.dumps({'result': True}), content_type='application/json')
