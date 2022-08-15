$(function () {
    $('.attention').click(function () {
        if ($('#userId').text() == '') {
            $('.hdLoginOn').click();
            return;
        }

        if ($(this).hasClass('attentionAl')) {
            closeSkill();
            $('.attentionOver').click(function () {
                $.post('/course/cancelFollow/' + $("#classId").val(), function (data) {
                    if (data.result) {
                        $('.attention').html('关注该课程');
                        $('.attention').removeClass('attentionAl');
                        window.location.reload();
                    }
                });
            });
        } else {
            //openSkill();
            //$('.attentionAlso').click(function () {
            $.post('/course/follow/' + $("#classId").val(), function (data) {
                if (data.result) {
                    $('.attention').html('<b>已关注</b> 取消');
                    $('.attention').addClass('attentionAl');
                    window.location.reload();
                }
            });
            //});
        }
    });

    $('.edit').click(function () {
        window.location.href = '/editTree/' + $("#classId").val();
    });

    $('.collection').click(function () {
        if ($('#userId').text() == '') {
            $('.hdLoginOn a').click();
            return;
        }
        $(this).toggleClass('collectionAl')
        if (!$(this).hasClass('collectionAl')) {
            $.post("/course/cancelFav/" + $("#classId").val() + "/", {}, function (data) {
                if (data.result == false) {
                    // alert('取消收藏失败。');
                } else {
                    // alert('取消收藏成功。');
                }
            });
        } else {
            $.post("/course/fav/" + $("#classId").val() + "/", {}, function (data) {
                if (data.result == false) {
                    // alert('收藏失败。');
                } else {
                    // alert('收藏成功。');
                }
            });
        }
    });

    $('.wrapT').mouseover(function () {
        $(this).children('ul').css('display', 'block')
    });

    $('.wrapT').mouseout(function () {
        $(this).children('ul').css('display', 'none')
    });

    $('.share').click(function () {
        $('.shareTo').toggleClass('shareToDb');
    });

    try {
        var oLength = $('.graphTop a').get(0).innerHTML;
        var oLengthTotal = $('.graphTop a').get(1).innerHTML;
        $('#bar a').css('width', oLength / oLengthTotal * 100 + '%');
    }
    catch (err) {

    }


    var aDiv = $('.markOver div')
    var iNow = -1;

    for (var i = 0; i < aDiv.length; i++) {
        aDiv[i].index = i;
        aDiv[i].onmouseover = function () {

            fnClear();

            for (var i = 0; i <= this.index; i++) {

                aDiv[i].style.backgroundImage = 'url(/static/images/pointright.png)';

            }
        };
        aDiv[i].onmouseout = function () {
            fnClear();

            for (var i = 0; i <= iNow; i++) {


                aDiv[i].style.backgroundImage = 'url(/static/images/pointright.png)';

            }
        };
        aDiv[i].onclick = function () {
            if ($('#userId').text() == '') {
                $('.hdLoginOn a').click();
                return;
            }
            iNow = this.index;
            //alert(iNow + 1);
            var data = {};
            data.classId = $("#classId").val();
            data.markValue = iNow + 1;
            $.post("/setMark/", JSON.stringify(data), function (data) {
                if (data.result == false) {
                    //alert('评分失败。');
                } else {
                    //alert('评分成功。');
                }
            });
        };
    }

    function fnClear() {
        for (var i = 0; i < aDiv.length; i++) {
            aDiv[i].style.background = '';
        }
    }

});


