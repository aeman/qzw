# ^_^ coding: UTF-8 ^_^
__author__ = 'sunny'

# 全局函数单元

import json
import django.shortcuts
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseServerError

JSON_STATUS_SUCCESS = {"status": "ok"}
JSON_STATUS_FAILED = {"status": "failed"}

# 渲染json
def render(request, *args, **kwargs):
    return django.shortcuts.render(request, *args, **kwargs)


# 渲染json
def render_json(json_data):
    return HttpResponse(json.dumps(json_data), content_type="application/json")


# 重定向
def redirect(url):
    return HttpResponseRedirect(url)


# 内部错误
def error(msg):
    return HttpResponseServerError(msg)


# 获取session信息
def get_session(request, key, default_value=None):
    return request.session.get(key, default_value)
