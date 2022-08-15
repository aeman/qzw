function registerUser() {
    var data = {};
    data.name = $("#name").val();
    data.mail = $("#mail").val();
    data.pass = $("#pass").val();

    $.post("/register/", data, function (data) {
            //alert("Data Loaded: " + data.result);
            if (data.result == false) {
                $(".error").html(data.error);
                return;
            } else {
                $("#login").remove();
                $("#mask").remove();
                //openInfoDialog();
                location.reload(true);
            }
        }
    );
}

function clearError() {
    $(".error").html('');
}

function hideDlg() {
    $("#login").remove();
    $("#mask").remove();
}

function login() {
    var data = {};
    data.mail = $("#mail").val();
    data.password = $("#password").val();
    $.post("/login/", data, function (data) {
        //alert("Data Loaded: " + data.result);
        if (data.result == false) {
            $(".error").html(data.error);
            return;
        } else {
            location.reload(true);
        }
    });
}

function finishUserInfo() {
    var data = {};
    data.student_name = $("#studentName").val();
    data.user_type = 0;
    data.school_id = $("#studentSchool").val();
    data.student_no = $("#studentNo").val();

    $.post("/finishRegister/", data, function (data) {
        if (data.result == false) {
            $(".error").html(data.error);
            return;
        } else {
            $("#login").remove();
            $("#mask").remove();
            location.reload(true);
        }
    });
}

function openRegisterForm() {

    //获取页面的高度和宽度
    var sWidth = document.body.scrollWidth;
    var sHeight = document.body.scrollHeight;
    //获取页面的可视区域高度和宽度
    var wHeight = document.documentElement.clientHeight;

    var oMask = document.createElement("div");
    oMask.id = "mask";
    oMask.style.height = sHeight + "px";
    oMask.style.width = sWidth + "px";
    document.body.appendChild(oMask);
    var oLogin = document.createElement("div");
    oLogin.id = "login";
    var _str = '';
    _str += '<div class="loginCon">'
    _str += '<div id="close"></div>'
    _str += '<div class="register">注册</div>'
    _str += '<div class="inputBox">'
    _str += '<input type="text" placeholder="邮箱" id="mail" onkeyup="clearError()"/>'
    _str += '<input type="password" placeholder="密码" id="pass"/>'
    _str += '<input type="text" placeholder="昵称" class="dgname" id="name" onkeyup="clearError()"/>'
    _str += '<div class="error"></div>'
    _str += '<input type="button" value="注册" class="registerBtn" onclick="registerUser();" id="btnRegister"/>'
    _str += '<p>'
    _str += '已有账号?<a href="javascript:hideDlg();openLoginForm();" id="rightNowLogin">立即登录</a>'
    _str += '</p>'
    _str += '</div>'
    //_str += '<div class="fastGet f-cb">'
    //_str += '<span>快速登录</span>'
    //_str += '<div class="weibo"></div>'
    //_str += '<div class="weixin"></div>'
    //_str += '</div>'
    _str += '</div>'
    oLogin.innerHTML = _str;
    document.body.appendChild(oLogin);

    //获取登陆框的宽和高
    var dHeight = oLogin.offsetHeight;
    var dWidth = oLogin.offsetWidth;
    //设置登陆框的left和top
    oLogin.style.left = sWidth / 2 - dWidth / 2 + "px";
    oLogin.style.top = wHeight / 2 - dHeight / 2 + "px";
    //点击关闭按钮
    var oClose = document.getElementById("close");
    $("#mail").focus().select();
    //点击登陆框以外的区域也可以关闭登陆框
    oClose.onclick = oMask.onclick = function () {
        document.body.removeChild(oLogin);
        document.body.removeChild(oMask);
    }
    document.onkeydown = function(e){
        if(!e) e = window.event;//火狐中是 window.event
        if((e.keyCode || e.which) == 13){
            document.getElementById("btnRegister").click();
        }
    }
}

function openLoginForm() {

    //获取页面的高度和宽度
    var sWidth = document.body.scrollWidth;
    var sHeight = document.body.scrollHeight;
    //获取页面的可视区域高度和宽度
    var wHeight = document.documentElement.clientHeight;

    var oMask = document.createElement("div");
    oMask.id = "mask";
    oMask.style.height = sHeight + "px";
    oMask.style.width = sWidth + "px";
    document.body.appendChild(oMask);
    var oLogin = document.createElement("div");
    oLogin.id = "login";
    var _str = '';
    _str += '<div class="loginCon">'
    _str += '<div id="close"></div>'
    _str += '<div class="register">登录</div>'
    _str += '<div class="inputBox">'
    _str += '<input type="text" placeholder="邮箱" id="mail" onkeyup="clearError()"/>'
    _str += '<input type="password" placeholder="密码" id="password" onkeyup="clearError()"/>'
    _str += '<div class="error"></div>'
    _str += '<div id="checkBoxLogin" class="f-cb"><label for="freeLogin"><input type="checkbox" name="" id="freeLogin" />七天内免费登录</label><span><a href="/retakePassword/">忘记密码</a></span></div>'
    _str += '<input type="button" value="登录" class="registerBtn" id="btnLogin" onclick="login();"/>'
    _str += '<p>'
    _str += '还没有账号?<a href="javascript:hideDlg();openRegisterForm();" id="rightNow">立即注册</a>'
    _str += '</p>'
    _str += '</div>'
    //_str += '<div class="fastGet f-cb">'
    //_str += '<span>快速登录</span>'
    //_str += '<div class="weibo"></div>'
    //_str += '<div class="weixin"></div>'
    //_str += '</div>'
    _str += '</div>'
    oLogin.innerHTML = _str;
    document.body.appendChild(oLogin);

    //获取登陆框的宽和高
    var dHeight = oLogin.offsetHeight;
    var dWidth = oLogin.offsetWidth;
    //设置登陆框的left和top
    oLogin.style.left = sWidth / 2 - dWidth / 2 + "px";
    oLogin.style.top = wHeight / 2 - dHeight / 2 + "px";
    //点击关闭按钮
    var oClose = document.getElementById("close");
    $("#mail").focus().select();
    //点击登陆框以外的区域也可以关闭登陆框
    oClose.onclick = oMask.onclick = function () {
        document.body.removeChild(oLogin);
        document.body.removeChild(oMask);
    }
    document.onkeydown = function(e){
        if(!e) e = window.event;//火狐中是 window.event
        if((e.keyCode || e.which) == 13){
            document.getElementById("btnLogin").click();
        }
    }
}


function openInfoDialog() {

    //获取页面的高度和宽度
    var sWidth = document.body.scrollWidth;
    var sHeight = document.body.scrollHeight;
    //获取页面的可视区域高度和宽度
    var wHeight = document.documentElement.clientHeight;

    var oMask = document.createElement("div");
    oMask.id = "mask";
    oMask.style.height = sHeight + "px";
    oMask.style.width = sWidth + "px";
    document.body.appendChild(oMask);
    var oLogin = document.createElement("div");
    oLogin.id = "login";
    var _str = '';
    _str += '<div class="loginCon">'
    _str += '<div id="close"></div>'
    _str += '<div class="register">补充一点资料</div>'
    _str += '<div class="inputBox">'
    _str += '<input type="text" placeholder="姓名" id="studentName"/>'
    _str += '<div class="inputBoxRadio">'
    _str += '<label for="studentInp"><input type="radio" name="type" value="0" id="studentInp" checked="checked" />&nbsp;学生</label> '
    _str += '<label for="JobIn"><input type="radio" name="type" value="1" id="JobIn"  />&nbsp;在职</label>'
    _str += '</div>'
    _str += '<input type="text" placeholder="学校"id="studentSchool"/>'
    _str += '<input type="text" placeholder="学号" id="studentNo"/>'
    _str += '<div class="error"></div>'
    _str += '<input type="button" value="开始学习之旅" class="registerBtn" id="btnInfo" onclick="finishUserInfo();"/>'
    _str += '<a href="" style="padding-left: 59px;">暂时不填写</a>'
    _str += '</div>'
    _str += '</div>'
    oLogin.innerHTML = _str;
    document.body.appendChild(oLogin);

    //获取登陆框的宽和高
    var dHeight = oLogin.offsetHeight;
    var dWidth = oLogin.offsetWidth;
    //设置登陆框的left和top
    oLogin.style.left = sWidth / 2 - dWidth / 2 + "px";
    oLogin.style.top = wHeight / 2 - dHeight / 2 + "px";
    //点击关闭按钮
    var oClose = document.getElementById("close");

    //点击登陆框以外的区域也可以关闭登陆框
    oClose.onclick = oMask.onclick = function () {
        alert('请完成补充信息');
    }
}

function openNew2(_str) {
    //获取页面的高度和宽度
    var sWidth = document.body.scrollWidth;
    var sHeight = document.body.scrollHeight;
    //获取页面的可视区域高度和宽度
    var wHeight = document.documentElement.clientHeight;
    var oMask = document.createElement("div");
    oMask.id = "mask";
    oMask.style.height = sHeight + "px";
    oMask.style.width = sWidth + "px";
    document.body.appendChild(oMask);
    var oLogin = document.createElement("div");
    oLogin.id = "login";
    oLogin.innerHTML = _str;
    document.body.appendChild(oLogin);
    //获取登陆框的宽和高
    var dHeight = oLogin.offsetHeight;
    var dWidth = oLogin.offsetWidth;
    //设置登陆框的left和top
    oLogin.style.left = sWidth / 2 - dWidth / 2 + "px";
    oLogin.style.top = wHeight / 2 - dHeight / 2 + "px";
    //点击关闭按钮
    var oClose = document.getElementById("close");
    //点击登陆框以外的区域也可以关闭登陆框
    oClose.onclick = oMask.onclick = function () {
        document.body.removeChild(oLogin);
        document.body.removeChild(oMask);
        document.body.style.overflow = "auto";
    }
}

function openCancelDlg() {
    var str = "";
    str += '<div class="attentionTree">'
    str += '<div class="attentionTreeTop">'
    str += '关注技能书，可以记录学习进度，获取更多积分。'
    str += '</div>'
    str += '<div class="attentionTreeBottom">'
    str += '<input type="button" value="关注" class="attentionAlso">'
    str += '<input type="button" value="看看再说" class="attentionOver" style="color: #fff;">'
    str += '</div>'
    str += '</div>'
    alert(str);
}

function closeSkill() {

    //获取页面的高度和宽度
    var sWidth = document.body.scrollWidth;
    var sHeight = document.body.scrollHeight;
    //获取页面的可视区域高度和宽度
    var wHeight = document.documentElement.clientHeight;

    var oMask = document.createElement("div");
    oMask.id = "mask";
    oMask.style.height = sHeight + "px";
    oMask.style.width = sWidth + "px";
    document.body.appendChild(oMask);
    var oLogin = document.createElement("div");
    oLogin.id = "login";
    var _str = '';
    _str += '<div class="noAttention">'
    _str += '<div id="close"></div>'
    _str += '<div class="noAttentionTop">'
    _str += '<h3>能告诉我为什么不想继续关注这门课程了吗？</h3>'
    _str += '<ul>'
    _str += '<li>'
    _str += '<label for="noAttention1">'
    _str += '<input type="checkbox" name="" id="noAttention1">老师讲的太烂了'
    _str += '</label>'
    _str += '</li>'
    _str += '<li>'
    _str += '<label for="noAttention2">'
    _str += '<input type="checkbox" name="" id="noAttention2">误选了，这门课程不是我想学习的'
    _str += '</label>'
    _str += '</li>'
    _str += '<li>'
    _str += '<label for="noAttention3">'
    _str += '<input type="checkbox" name="" id="noAttention3">之前已经学习过了'
    _str += '</label>'
    _str += '</li>'
    _str += '</ul>'
    _str += '</div>'
    _str += '<div class="noAttentionBottom">'
    _str += '<p>放弃学习后，学习进度都会清空的哦</p>'
    _str += '<div>'
    _str += '<input id="bYes" type="button" value="还是继续关注吧" class="attentionAlso">'
    _str += '<input id="bNo" type="button" value="还是不继续了" class="attentionOver" style="color: #fff;">'
    _str += '</div>'
    _str += '</div>'
    _str += '</div>'
    oLogin.innerHTML = _str;
    document.body.appendChild(oLogin);

    //获取登陆框的宽和高
    var dHeight = oLogin.offsetHeight;
    var dWidth = oLogin.offsetWidth;
    //设置登陆框的left和top
    oLogin.style.left = sWidth / 2 - dWidth / 2 + "px";
    oLogin.style.top = wHeight / 2 - dHeight / 2 + "px";
    //点击关闭按钮
    var oClose = document.getElementById("close");
    var oYes = document.getElementById("bYes");
    //点击登陆框以外的区域也可以关闭登陆框
    oClose.onclick = oMask.onclick = oYes.onclick = function () {
        document.body.removeChild(oLogin);
        document.body.removeChild(oMask);
    }
}

function openSkill() {

    //获取页面的高度和宽度
    var sWidth = document.body.scrollWidth;
    var sHeight = document.body.scrollHeight;
    //获取页面的可视区域高度和宽度
    var wHeight = document.documentElement.clientHeight;

    var oMask = document.createElement("div");
    oMask.id = "mask";
    oMask.style.height = sHeight + "px";
    oMask.style.width = sWidth + "px";
    document.body.appendChild(oMask);
    var oLogin = document.createElement("div");
    oLogin.id = "login";
    var _str = '';
    _str += '<div class="attentionTree">'
    _str += '<div id="close"></div>'
    _str += '<div class="attentionTreeTop">'
    _str += '关注技能树，可以记录学习进度，获取更多积分。'
    _str += '</div>'
    _str += '<div class="attentionTreeBottom">'
    _str += '<input id="bYes" type="button" value="关注" class="attentionAlso">'
    _str += '<input id="bNo" type="button" value="看看再说" class="attentionOver">'
    _str += '</div>'
    _str += '</div>'
    oLogin.innerHTML = _str;
    document.body.appendChild(oLogin);

    //获取登陆框的宽和高
    var dHeight = oLogin.offsetHeight;
    var dWidth = oLogin.offsetWidth;
    //设置登陆框的left和top
    oLogin.style.left = sWidth / 2 - dWidth / 2 + "px";
    oLogin.style.top = wHeight / 2 - dHeight / 2 + "px";
    //点击关闭按钮

    var oClose = document.getElementById("close");
    var oNo = document.getElementById("bNo");
    //点击登陆框以外的区域也可以关闭登陆框
    oClose.onclick = oMask.onclick = oNo.onclick = function () {
        document.body.removeChild(oLogin);
        document.body.removeChild(oMask);
    }
}
					

				
