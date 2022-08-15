import json

from django.http import HttpResponse
from django.shortcuts import render
from qiniu import Auth

# bucket_name = "icmooc"
# access_key = "RLoh1PmlOkVujXnCCetcvaoRqLoa9H95atohflQn"
# secret_key = "GDltBNOsM_cG2bBJIvOProHzu9HEA-d67CXe1y9r"
bucket_name = "original"
access_key = "TBCggnDqnGg9ytfNu53Wd0cMSasyTLyH6l8HCvCe"
secret_key = "s2fZVWHG_s2K_syviSN_vVZlqaTMpFj_eavUsrfm"


def index(request):
    return render(request, 'video/index.html')


def uptoken(request):
    q = Auth(access_key, secret_key)
    token = q.upload_token(bucket_name)
    data = {'uptoken': token}
    return HttpResponse(json.dumps(data), content_type="application/json")

