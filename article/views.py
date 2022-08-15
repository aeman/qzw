# ^_^ coding:utf-8 ^_^

import re
import datetime

from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.contrib.auth.decorators import permission_required, login_required
from django.db.models.fields import *
from django.db import connection
from django.views.decorators.http import require_POST

import public.consts as consts
from public.utils import *
from article.models import *
from course.models import *


# Create your views here.


# 删除文章
@login_required(login_url='/')
@permission_required('article.can_edit_article', raise_exception=True)
def delete_article(request, article_id):
    article = ArArticle.objects.get(id=article_id)
    article.delete()
    return redirect("/article/list")


# 文章首页
def index(request):
    articles = get_articles(0, consts.waterfall_count)
    return render(request, 'article/index.html', {'articles': articles, 'url': 'article'})


# 获取文章列表
@login_required(login_url='/')
@permission_required('article.can_edit_article', raise_exception=True)
def article_list(request, page_no, search_text):
    page_no = page_no or 1
    if not search_text:
        paginator = Paginator(ArArticle.objects.all().order_by('-id'), consts.page_limit)
    else:
        paginator = Paginator(ArArticle.objects.filter(article_title__contains=search_text).order_by('-id'), consts.page_limit)
    context = dict()
    context["searchText"] = search_text or ""
    try:
        current_page = paginator.page(page_no)
    except PageNotAnInteger, e:
        return redirect("/article/list")
    except EmptyPage, e:
        page_no = paginator.num_pages
        return redirect("/article/list/" + str(page_no))
    context["items"] = current_page.object_list
    context["page"] = current_page
    current_page.has_previous()
    current_page.has_next()
    current_page.start_index()
    return render(request, "article/article_list.html", context)


# 新增文章
@login_required(login_url='/')
@permission_required('article.can_edit_article', raise_exception=True)
def article_add(request):
    return render(request, "article/article_add.html")


# 处理标签
def process_tags(article, request):
    cursor = connection.cursor()
    cursor.execute('delete from cr_tag where id in (select tag_id from ar_article_tag where article_id=%s)',
                   [article.id])
    cursor.execute('delete from ar_article_tag where article_id=%s', [article.id])

    tags = request.POST["tags"] or ""
    if tags:
        tags = tags.split(",")
        for tag in tags:
            t = CrTag()
            t.tag_name = tag
            t.save()
            new_tag = ArArticleTag()
            new_tag.article = article
            new_tag.tag_id = t.id
            new_tag.save()


# 文章Form处理
def fetch_from(article, request):
    article.article_author = request.POST["author"]
    article.article_title = request.POST["title"]
    article.article_content = request.POST["content"]
    pic_file_name = request.POST["picFileName"]
    if pic_file_name != "":
        article.pic_file = pic_file_name
    article.publish_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    article.class_id = request.POST["class_id"] or 3
    return article


# 获取分类列表
def get_categories(request):
    cats = CrClass.get_all_types()
    result = []
    for rec in cats:
        tmp = dict()
        tmp["id"] = rec.id
        tmp["class_name"] = rec.class_name
        result.append(tmp)
    return render_json(result)


# 获取指定文章的标签
def get_tags(request, article_id):
    if not article_id:
        return render_json([])
    tags = CrTag.objects.raw(r'''select * from cr_tag where id in
        (select tag_id from ar_article_tag where article_id=%s)''', [int(article_id)])
    result = []
    for item in tags:
        tag = dict()
        tag["id"] = item.id
        tag["tag_name"] = item.tag_name
        result.append(tag)
    return render_json(result)


# 新增文章/编辑文章
@login_required(login_url='/')
@permission_required('article.can_edit_article', raise_exception=True)
def article_update(request):
    try:
        author_id = get_session(request, "user_id")
        if not author_id:
            raise Exception("Your operation in not allowed.")
        article_id = request.POST["id"] or None
        if not article_id:
            article_item = ArArticle()
            fetch_from(article_item, request).save()
            process_tags(article_item, request)
            return redirect("/article/list")
        else:
            article_edit_post(request, article_id)
            return redirect("/article/edit/" + article_id)
    except Exception, e:
        return error(e.message)


# 编辑文章 - 页面
@login_required(login_url='/')
@permission_required('article.can_edit_article', raise_exception=True)
def article_edit(request, article_id):
    articles = ArArticle.objects.filter(id=article_id)
    if not articles or len(articles) == 0:
        return error("article not found")
    return render(request, "article/article_add.html", {"article": articles[0], "action": "编辑"})


# 编辑文章 - 执行更新入库
@login_required(login_url='/')
@permission_required('article.can_edit_article', raise_exception=True)
@require_POST
def article_edit_post(request, article_id):
    articles = ArArticle.objects.filter(id=article_id)
    if not articles or len(articles) == 0:
        return error("Article not found")
    fetch_from(articles[0], request).save()
    process_tags(articles[0], request)


# 獲取所有知識點列表
def get_courses(request):
    courses = CrCourse.objects.all()
    results = []
    for course in courses:
        item = dict()
        item["id"] = course.id
        item["name"] = course.course_name
        item["href"] = course.knowtree_id
        results.append(item)
    return render_json(results)


# 更新文章阅读数量
def update_read_times(article_id):
    cursor = connection.cursor()
    cursor.execute('update ar_article set read_times=(read_times+1) where id=%s', [article_id])


# 获取文章
def article(request, article_id):
    articles = ArArticle.objects.filter(id=article_id)
    if not articles or len(articles) == 0:
        return error("article not found")
    class_id = articles[0].class_id
    categories = CrClass.objects.filter(id=class_id)
    category = ""
    if categories is not None:
        category = categories[0].class_name
    islogin = not get_session(request, "user_id") is None
    update_read_times(article_id)

    return render(request, "article/article.html", {"article": articles[0], "category": category, "islogin": islogin})


def article_wrapper(artc):
    obj = dict()
    obj["article_title"] = artc.article_title
    obj["article_author"] = artc.article_author
    obj["article_content"] = artc.article_content
    obj["pic_file"] = artc.pic_file
    obj["read_times"] = artc.read_times
    obj["id"] = artc.id
    return obj


# 获取文章列表（瀑布流方式展示）后续页面
def get_more_articles(request, start):
    tag_name = request.GET["tag"]
    articles = get_articles(start, consts.waterfall_per_count, tag_name)
    json_objs = []
    for artc in articles:
        json_objs.append(article_wrapper(artc))
    return render_json(json_objs)


def get_articles(start, limit, tag_name=None):
    start = int(start)
    if tag_name is None:
        articles = ArArticle.objects.order_by('-id')[start:start+limit]
    else:
        sql = r'''SELECT * FROM ar_article where id in(select distinct article_id from ar_article_tag a left join cr_tag b on a.tag_id=b.id where trim(tag_name) like %s) order by id desc'''
        articles = ArArticle.objects.raw(sql, [tag_name])[start:start+limit]
    for article in articles:
        article.article_content = get_plan_text(article.article_content, consts.article_word_count)
    return articles


# 去除html标签，返回纯文本
def get_plan_text(src, limit):
    return re.sub("<.*?>", "", src)[0:limit]


# 获取文章阅读次数排序
def analysis(request, limit):
    cnt = limit or "5"
    articles = ArArticle.objects.order_by('-read_times')[0: int(cnt)]
    json_objs = []
    for artc in articles:
        json_objs.append(article_wrapper(artc))
    return render_json(json_objs)


# 获取文件列表 - 标签
def article_tags(request, tag_name):
    articles = get_articles(0, consts.waterfall_count, tag_name)
    return render(request, 'article/index.html', {'articles': articles, 'tag': tag_name})


# 获取知识点信息
def get_knowledge_info(request):
    author_id = get_session(request, "user_id") or 0
    ids = (request.GET["ids"] or "").split(",")
    objs = []
    for _id in ids:
        cursor = connection.cursor()
        cursor.execute("select * from (select a.id, a.course_name, a.course_desc, b.id as vido_id from (SELECT * FROM qianziwen.cr_course where id=%s) a left join (select * from cr_video where course_id=%s order by id limit 1) b on a.id=b.course_id) c left join (select study_status, course_id from ss_mycourse where user_id=%s) d on c.id=d.course_id", [int(_id), int(_id), int(author_id)])
        row = cursor.fetchone()
        obj = dict()
        obj["course_id"] = row[0]
        obj["course_name"] = row[1]
        obj["course_desc"] = row[2]
        obj["video_id"] = row[3]
        obj["study_status"] = row[4] or 0
        objs.append(obj)
    return render_json(objs)

