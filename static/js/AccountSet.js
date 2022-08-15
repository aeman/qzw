$(function () {
    var tmpSchool = "";
    var tmpMajor = "";
    var tmpNo = "";
    var tmpCity = "";
    var tmpJob = "";

    $('.myMessage').click(function () {
        $(this).addClass('on');
        $('.safe').removeClass('on');
        $('.infor').css('display', 'block');
        $('.inforSafe').css('display', 'none');
    });

    $('.safe').click(function () {
        $(this).addClass('on');
        $('.myMessage').removeClass('on');
        $('.infor').css('display', 'none');
        $('.inforSafe').css('display', 'block');
    });

    $('.infoRadio').change(function () {
        if (this.value == '0') {
            $('#school').text('学校');
            $('#major').text('专业');
            $('#no').css("display", "block");
            tmpCity = $('#txtSchool').val();
            tmpJob = $('#txtMajor').val();
            $('#txtSchool').val(tmpSchool);
            $('#txtMajor').val(tmpMajor);
            $('#txtNo').val(tmpNo);

        } else if (this.value == '1') {
            $('#school').text('城市');
            $('#major').text('职业');
            $('#no').css("display", "none");
            tmpSchool = $('#txtSchool').val();
            tmpMajor = $('#txtMajor').val();
            tmpNo = $('#txtNo').val();
            $('#txtSchool').val(tmpCity);
            $('#txtMajor').val(tmpJob);
            //$('#txtNo').val('');
        }
        //$('#txtSchool').val('');
        //$('#txtMajor').val('');
        //$('#txtNo').val('');
    });

    //$("#save").click(function () {
    //  alert('submit');
    //$("#avatarForm").submit();
    //$('input[type="file"]').ajaxfileupload({
    //    'action': '/uploadAvatar/',
    //    'params': {
    //        'extra': 'info'
    //    },
    //    'onComplete': function (response) {
    //        console.log('custom handler for file:');
    //        alert(JSON.stringify(response));
    //    },
    //    'onStart': function () {
    //        //if (weWantedTo) return false; // cancels upload
    //        console.log('start upload');
    //    },
    //    'onCancel': function () {
    //        console.log('no file selected');
    //    }
    //});
    //});

    $("#avatarFile").change(function () {
        //alert($("#avatarFile").val());
        var patt = new RegExp("[\\.jpg|\\.png]$", "i");
        if (!patt.test($("#avatarFile").val())) {
            alert('上图的图片格式必须为jpg或者png格式');
            return;
        }
        if (this.files[0].size / (1024 * 1024) > 2) {
            alert("上传的图片大小不能大小2M");
            return;
        }
        $("#avatarForm").ajaxSubmit({
            dataType: 'json',
            success: function (data) { //成功
                //获得后台返回的json数据，显示文件名，大小，以及删除按钮
                //files.html("<b>"+data.name+"("+data.size+"k)</b>
                //<span class='delimg' rel='"+data.pic+"'>删除</span>");
                ////显示上传后的图片
                //var img = "http://demo.helloweba.com/upload/files/"+data.pic;
                //showimg.html("<img src='"+img+"'>");
                //btn.html("添加附件"); //上传按钮还原
                //alert(data.result);
                $("#avatarImage").attr("src", "/static/images/" + data.result);
                $("#picFileName").val(data.result);
            }
        });
    });

    $("#save").click(function () {
        var data = {};
        data.nickName = $('#txtNickName').val();
        data.fullName = $('#txtFullName').val();
        data.school = $('#txtSchool').val();
        data.sex = $('input[name="sex"]:checked').val();
        data.type = $('input[name="profession"]:checked').val();
        data.major = $('#txtMajor').val();
        data.no = $('#txtNo').val();
        data.picFile = $('#picFileName').val();
        $.post("/userOptions/", JSON.stringify(data), function (data) {
            //alert("Data Loaded: " + data.result);
            if (data.result == false) {
                alert('保存出错。');
                return;
            } else {
                alert('保存成功。')
                location.href = '/userOptions/';
            }
        });
    });

    $("#btnChangePassword").click(function () {
        var data = {};
        data.password = $("#password").val();
        data.newPassword = $("#newPassword").val();
        data.newPasswordRetype = $("#newPasswordRetype").val();
        $.post("/changePassword/", JSON.stringify(data), function (data) {
            if (data.result == false) {
                alert('保存出错:' + data.error);
                return;
            } else {
                alert('保存成功。')
                location.href = '/';
            }
        });
    });
});