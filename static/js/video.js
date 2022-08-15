$(function () {

    $('.shareTo').mouseleave(function () {
        $(this).removeClass('shareToDb');
    })

    $(document).on('mousemove', '.tree-list > label', function () {
        $('.checkboxAfter').removeClass('checkboxAfterDb');
        $(this).children('.checkboxAfter').addClass('checkboxAfterDb');
    });

    $(document).on('mouseleave', '.checkboxAfter', function () {

        $(this).removeClass('checkboxAfterDb');
    });

    $(document).on('click', '.course-item', function () {
        //alert($(this).data('id'));
        //alert($(this).is(':checked'));
        var course_id = $(this).data('id');
        var video_id = $("#videoId").val();
        var node = this;
        if ($(this).is(':checked')) {
            $.post('/addVideoToCourse/' + course_id + '/' + video_id + '/', function (data) {
                if (data.result) {

                } else {
                    alert("添加视频到知识点失败.");
                    $(node).attr('checked', false);
                }
            });
        } else {
            $.post('/deleteVideoFromCourse/' + course_id + '/' + video_id + '/', function (data) {
                if (data.result) {

                } else {
                    alert("从知识点中删除视频失败.");
                    $(node).attr('checked', true);
                }
            });
        }
    });

    $("#goNewTree").click(function () {
        window.location.href = "/newTree/";
    });

    $(document).on('click', ".btnCancel", function () {
        $(".course-edit").hide();
        $(".course-new").show();
    });

    $(document).on('click', ".course-new", function () {
        //alert('new click');
        $(this).hide();
        $(".course-edit").show();
        $(this).parent().find(".txtCourse").focus();
    });

    $(document).on('click', ".btnNewCourse", function () {
        var class_id = $("label").has(this).find(".addTreeCheck").data("id");
        var course_name = $(this).parent().find(".txtCourse").val();
        var node = this;
        if ($.trim(course_name) == "") {
            alert("知识点名称不能为空.");
            return;
        }
        $.post('/addCourse/' + class_id + '/' + course_name + '/', function (data) {
            if (data.result) {
                var html = '<li><input type="checkbox" name="" class="course-item" id="course' + data.id + '" data-id="' + data.id + '"><label for="course' + data.id + '" class="inner">' + course_name + ' </label></li>';
                $(node).parent().parent().find("ul").append(html);
                $(".btnCancel").click();
            }
        });
    })

    $(".column .btn").click(function () {
        if ($('#userId').text() == '') {
            $('.hdLoginOn').click();
            return;
        }

        if ($(this).hasClass('focused')) {
            closeSkill();
            $('.attentionOver').click(function () {
                $.post('/course/cancelFollow/' + $("#classId").val(), function (data) {
                    if (data.result) {
                        $(".column .btn").html('关注该课程');
                        $(".column .btn").removeClass('focused');
                        window.location.reload();
                    }
                });
            });
        } else {
            //openSkill();
            //$('.attentionAlso').click(function () {
            $.post('/course/follow/' + $("#classId").val(), function (data) {
                if (data.result) {
                    $(".column .btn").html('取消关注该课程');
                    $(".column .btn").addClass('focused');
                    window.location.reload();
                }
            });
            //});
        }
    })

    $('.nice').click(function () {
        $(this).toggleClass('niceover');
    });
    $('.message').click(function () {
        $(this).parents('.firstAnswer').next().toggleClass('f-db');
    });
    $('.messageother').click(function () {
        $(this).parents('.secondAnswer').next().toggleClass('f-db');
    });
    $('.first').click(function () {
        $('.videoTestBox').addClass('f-db');
        $('.videoTestBox').removeClass('f-dn');
        $('.testBox').addClass('f-dn');
        $('.testBox').removeClass('f-db');
        $(this).css('color', '#48cfae');
        $('.second').css('color', '#333');
    });
    $('.second').click(function () {
        $('.videoTestBox').addClass('f-dn');
        $('.videoTestBox').removeClass('f-db');
        $('.testBox').addClass('f-db');
        $('.testBox').removeClass('f-dn');
        $(this).css('color', '#48cfae');
        $('.first').css('color', '#333');
    });
    $('.column').click(function () {
        $('.columnBox').addClass('f-db');
        $('.columnBox').removeClass('f-dn');
        $('.BarrageBox').addClass('f-dn');
        $('.BarrageBox').removeClass('f-db');
        $(this).addClass('on');
        $('.barrage').removeClass('on');
    });
    $('.barrage').click(function () {
        $('.BarrageBox').addClass('f-db');
        $('.BarrageBox').removeClass('f-dn');
        $('.columnBox').addClass('f-dn');
        $('.columnBox').removeClass('f-db');
        $(this).addClass('on');
        $('.column').removeClass('on');
    });


    $('.collectionTree').click(function () {
        if ($('#userId').text() == '') {
            $('.hdLoginOn a').click();
            return;
        }
        $(this).toggleClass('collectionTreeOver');
    });

    $('.studyOff').click(function () {
        if ($('#userId').text() == '') {
            $('.hdLoginOn a').click();
            return;
        }
        $(this).toggleClass('studyOffOver');
    });

    $('.nameTitle div').mouseover(function () {
        if ($(".nameTitle ul").is(":hidden")) {
            $('.nameTitle ul').slideDown('400');
        }
    });
    $('.nameTitle').mouseleave(function () {
        $('.nameTitle ul').slideUp('400');
    });
    $(document).on('click', '.addTreeCheck', function () {
        //alert('tree check')
        $(this).siblings('.checkboxAfter').toggleClass('checkboxAfterDb');
    });
    $('#attention').click(function () {
        if ($('#userId').text() == '') {
            $('.hdLoginOn a').click();
            return;
        }
        if ($(this).text() == '关注') {
            $(this).text('已关注');
            $.post('/course/follow/' + $("#classId").val(), function (data) {
                if (data.result) {
                    $('#follow_count').text(Number($('#follow_count').text()) + 1);
                }
            });
        } else {
            $(this).text('关注');
            $.post('/course/cancelFollow/' + $("#classId").val(), function (data) {
                if (data.result) {
                    $('#follow_count').text(Number($('#follow_count').text()) - 1);
                }
            });
        }
    });
});