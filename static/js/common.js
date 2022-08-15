$(function () {

    //$('#topAvatar').attr('src', '/static/' + $.session.get('avatar'));

    var searchResultIndex = 0;

    $(".course-header li:eq(1)").click(function () {
        window.location.href = "/";
    })

    $(".course-header li:eq(2)").click(function () {
        window.location.href = "/article/";
    })

    $(".course-header li:eq(3)").click(function () {
        window.location.href = "/search/video/?keyword=";
    })

    function doSearch() {
        window.location.href = "/search/video/?keyword=" + $("#txtKeyword").val();
    }

    $("#btnSearch").click(function () {
        doSearch();
    });

    $("#txtKeyword").keypress(function (e) {
        if (e.which == 13) {
            if (searchResultIndex == 0) {
                doSearch();
            } else {
                var url = $("#lstSearchResult li").eq(searchResultIndex).find("a").attr("href");
                window.location.href = url;
            }
            return;
        }
    });

    $("#txtKeyword").keyup(function (e) {
        if ($("#lstSearchResult").css("display") != "none") {
            if (e.which == 38) {
                searchResultIndex--;
                if (searchResultIndex == -1) {
                    searchResultIndex = $("#lstSearchResult li").length - 1;
                }
            }
            if (e.which == 40) {
                searchResultIndex++;
                if (searchResultIndex == $("#lstSearchResult li").length) {
                    searchResultIndex = 0;
                }
            }
            var $li = $("#lstSearchResult li").eq(searchResultIndex);
            $li.css("background", "#dddddd").siblings().css("background", "#ffffff");
        }
        if (e.which == 38 || e.which == 40) return;
        if ($(this).val().length > 2) {
            $("#lstSearchResult").slideDown("fast");
            var keyword = $(this).val();
            $.get("/search/tips/", {'keyword': keyword}, function (data) {
                var $dom = $("#lstSearchResult");
                $dom.find("li").remove();
                console.log('html:' + $dom.html());
                for (var i = 0; i < data.length; i++) {
                    $(data[i]).appendTo($dom);
                }
                var $li = $("#lstSearchResult li").eq(0);
                $li.css("background", "#dddddd").siblings().css("background", "#ffffff");
            })
        } else {
            $("#lstSearchResult").slideUp("fast");
        }
        searchResultIndex = 0; // try again
    })

    $('#weixin-qr').mouseover(function () {
        var $wxPic = $('.weixinpop');
        //alert($("#weixin-qr").offset().left);
        //alert($("#weixin-qr").offset().top);
        $wxPic.css("left", $("#weixin-qr").offset().left - 78);
	var bottomPos = $("#bottomPos");
	if (bottomPos.css("position") == "static") {
		$wxPic.css("top", $("#weixin-qr").offset().top - 178);
	}
        $('.weixinpop').show();
    });

    $('#weixin-qr').mouseout(function () {
        $('.weixinpop').hide();
    });

    //open login form
    $('.hdLoginOn').click(function () {
        openLoginForm();
        $("#mail").focus().select();
        return false;
    });

    //open register form
    $('.hdLoginRe').click(function () {
        openRegisterForm();
        $("#mail").focus().select();
        return false;
    });

    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    var csrftoken = getCookie('csrftoken');
    console.log(csrftoken);

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    $.ajaxSetup({
        crossDomain: false, // obviates need for sameOrigin test
        beforeSend: function (xhr, settings) {
            if (!csrfSafeMethod(settings.type)) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
            console.log('ajax before send');
        }
    });

    $('.nameTitle span').mouseover(function () {
        $('.nameTitle ul').show();
    });
    $('.nameTitle').mouseleave(function () {
        $('.nameTitle ul').hide();
    });
    //$(document).on('click', '.addTreeCheck', function () {
    //    alert('tree check')
    //    $(this).siblings('.checkboxAfter').toggleClass('checkboxAfterDb');
    //})
    $('#btnLogout').click(function () {
        window.location.href = '/logout';
    });

    $('#btnNewTree').click(function () {
        window.location.href = '/newTree';
    })

    $('#btnOptions').click(function () {
        window.location.href = '/userOptions';
    });

    $('#btnVideos').click(function () {
        window.location.href = '/videos';
    });

    $("#btnAddArticle").click(function(){
        window.location.href = '/knowledge/list';
    });

    // install menu script by sunny
     new function(){
        var path = location.href;
        var target;
        var url_sev = {
            "article/list": 0,
            "article/add": 1,
            "article/edit": 1,
            "knowledge/list": 2,
            "knowledge/add": 3,
            "knowledge/edit": 3,
            "videos/upload/": 5,
            "videos/": 4
        };
        for (var k in url_sev) {
            var reg = new RegExp(k);
            if (reg.test(path)) {
                target = $($(".menu a")[url_sev[k]]);
                break;
            }
        }
        if (target) {
            target.addClass("on");
            target.attr("src", "javascript:void(0);");
        }
        $(".cols").css("visibility", "visible");
    };

    $(window).scroll(function(){
        var h = $(window).height() || $(document).height();
        if(h-$(window).scrollTop()<=100){
            $('.step').css("top",0);
        }else{
            $('.step').css("top",105);
        }
    });
})
