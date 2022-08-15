# coding: UTF-8

import re
import public.consts as consts
from django import template
from django.core.paginator import *

register = template.Library()


@register.filter
def video_time_format(value):
    time_sec = str(value % 60)
    if len(time_sec) == 1:
        time_sec = '0' + time_sec
    return str(value / 60) + ":" + time_sec


@register.filter
def course_time_format(value):
    time_minute = str(value % 3600 / 60)
    if len(time_minute) == 1:
        time_minute = '0' + time_minute
    if (value / 3600) != 0:
        return str(value / 3600) + u'时 ' + time_minute + u'分'
    else:
        return time_minute + u'分'


@register.filter
def highlight_keyword(value, keyword):
    return value.replace(keyword, '<span class="red-txt">%s</span>' % (keyword,))


@register.filter
def replace(value, replace_text):
    vs = replace_text.split(",")
    return re.sub(vs[0], vs[1], value)


@register.filter
def page_filter(value, target_uri):
    current_page = value.number
    page_count = value.paginator.num_pages
    has_prev_page = value.has_previous()
    has_next_page = value.has_next()
    page_range = consts.page_range
    first_range = range(1, consts.page_range + 1)
    last_range = range(page_count - page_range + 1, page_count + 1)
    has_first_page = current_page in first_range
    has_last_page = current_page in last_range
    pgs = None
    if has_first_page:
        if page_count < page_range:
            pgs = range(1, page_count + 1)
        else:
            pgs = first_range
    elif has_last_page:
        pgs = last_range
    else:
        split_index = consts.page_range / 2
        pg_start = current_page - split_index
        pgs = range(pg_start, pg_start + page_range)
    tpl = '''<dl class="com-pages clearfix" style="width: 750px; margin:0 auto;margin-bottom:20px; padding: 0px;">%s</dl>''';
    result_content = ""

    if not has_first_page:
        new_target = re.sub('page_index', "1", target_uri)
        result_content = "%s<dt><a class='pg_first' href='%s'>%s</a></dt>" % (result_content, new_target, u'首页')
    if has_prev_page:
        new_target = re.sub('page_index', str(current_page - 1), target_uri)
        result_content = "%s<dt><a class='pg_prev' href='%s'>%s</a></dt>" % (result_content, new_target, u'上一页')

    for pg in pgs:
        if pg == current_page:
            result_content = "%s<dd><a class='cur'>%d</a></dd>" % (result_content, pg)
        else:
            new_target = re.sub('page_index', str(pg), target_uri)
            result_content = "%s<dd><a class='pg_page' href='%s'>%d</a></dd>" % (result_content, new_target, pg)

    if has_next_page:
        new_target = re.sub('page_index', str(current_page + 1), target_uri)
        result_content = "%s<dt><a class='pg_next' href='%s'>%s</a></dt>" % (result_content, new_target, u'下一页')
    if not has_last_page:
        new_target = re.sub('page_index', str(page_count), target_uri)
        result_content = "%s<dt><a class='pg_last' href='%s'>%s</a></dd>" % (result_content, new_target, u'末页')
    return tpl % result_content


@register.filter
def aegean_splice(value, numb):
    if len(value) > numb:
        return value[0:numb] + "..."
    else:
        return value
