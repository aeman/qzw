import json

from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.template import RequestContext

from course.models import CrKnowtree, CrClass
from users.models import SsUser


def index(request):
    if request.user.is_authenticated():
        if not request.session.has_key('avatar'):
            s_user = SsUser.objects.get(mail=request.user.get_username())
            request.session['user_id'] = s_user.id
            request.session['avatar'] = s_user.avatar

    courses = get_trees(0, 12)
    return render_to_response('AllTree.html', {'courses': courses, 'url': 'home'}, context_instance=RequestContext(request))


def get_trees(start, count):
    # cnt = CrClass.objects.filter(parent_id=1).count()
    start = int(start)
    trees = CrKnowtree.objects.order_by('-create_time')[start:start+count]
    try:
        for tree in trees:
            # tree.class_desc = CrClass.objects.get(id=tree.class_id).tree_name
            user = SsUser.objects.get(id=tree.user_id)
            tree.teacher_name = user.name
            tree.teacher_pic = user.avatar
            tree.tree_class = CrClass.objects.get(id=tree.class_id).class_name
    except Exception:
        trees = None
    return trees


def get_more_courses(request, start):
    if request.method == 'GET':
        courses = get_trees(start, 8)
        ret = []
        for course in courses:
            data = {'course_pic': course.tree_pic,
                    'course_id': course.id,
                    'course_name': course.tree_name,
                    'course_desc': course.tree_desc,
                    'follow_count': course.follow_count,
                    'fav_count': course.fav_count,
                    'teacher_name': course.teacher_name,
                    'teacher_pic': course.teacher_pic,
                    'class_desc': course.tree_desc,
                    'tree_class': course.tree_class, }
            ret.append(data)
        return HttpResponse(json.dumps(ret), content_type='application/json')
