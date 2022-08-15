window.onload = function () {

    waterfall('falls', 'pin');

    //var dataInt = {'data': [{'src': 'u0.jpg'}, {'src': 'u4.jpg'}, {'src': 'u29.jpg'}, {'src': 'u2.jpg'}]}; //后台返回数据，不同的数据制定不同的循环。
    var obottomPos=document.getElementById('bottomPos');
    var canLoad = true;
    $(".main").css("height", $(".main .pin").last().position().top + $(".main .pin").last().height());

    window.onscroll = function () {
        if (checkscrollside()) {
            if (!canLoad)
                return;
            canLoad = false;
            obottomPos.style.display='none';
            console.log('on scroll');
            var classCount = $("#falls .pin").length;
            $.get("/getMoreCourses/" + classCount, function (dataInt) {
                //alert("JSON Data: " + json.length + json[0].fields.course_desc);
                var oParent = document.getElementById('falls');// 父级对象
                for (var i = 0; i < dataInt.length; i++) {
                    var oPin = document.createElement('div'); //添加 元素节点
                    oPin.className = 'pin';                   //添加 类名 name属性
                    oParent.appendChild(oPin);              //添加 子节点
                    var oBox = document.createElement('div');
                    oBox.className = 'box';
                    oPin.appendChild(oBox);
                    var oImg = document.createElement('img');
                    oImg.className = 'boxImg';
                    oImg.src = '/static/' + dataInt[i].course_pic;
                    oBox.appendChild(oImg);
                    var oBox2 = document.createElement('div');
                    oBox2.className = 'imgBottom';
                    oBox.appendChild(oBox2);
                    var oH = document.createElement('h4');
                    oH.innerHTML = dataInt[i].course_name;
                    oBox2.appendChild(oH);
                    oBox2.innerHTML = '<a href="/class/'+dataInt[i].course_id+'">' + oBox2.innerHTML + '</a>'
                    var oP = document.createElement('p');
                    oP.innerHTML = dataInt[i].course_desc;
                    oBox2.appendChild(oP);
                    //$(oP).wrap('<a href="/class/'+dataInt[i].course_id+'"></a>');
                    var oBox3 = document.createElement('div');
                    oBox3.className = 'imgBottomBox';
                    oBox2.appendChild(oBox3);

                    var oDiv=document.createElement('div');
                    oDiv.className='collectionSpan';
                    oBox3.appendChild(oDiv);
                    var oDiv1=document.createElement('div');
                    oDiv1.className='allAttention';
                    oDiv.appendChild(oDiv1);
                    var oSpan1=document.createElement('span');
                    oSpan1.innerHTML=dataInt[i].follow_count;
                    oDiv.appendChild(oSpan1);
                    var oDiv2=document.createElement('div');
                    oDiv2.className='allCollection';
                    oDiv.appendChild(oDiv2);
                    var oSpan2=document.createElement('span');
                    oSpan2.innerHTML=dataInt[i].fav_count;
                    oDiv.appendChild(oSpan2);

                    //var oImg1 = document.createElement('img');
                    //oImg1.src = '/static/images/guanzhu.png';
                    //oBox3.appendChild(oImg1);
                    //var oSpan1 = document.createElement('span');
                    //oSpan1.innerHTML = dataInt[i].follow_count;
                    //oBox3.appendChild(oSpan1);
                    //var oImg2 = document.createElement('img');
                    //oImg2.src = '/static/images/sc.png';
                    //oBox3.appendChild(oImg2);
                    //var oSpan2 = document.createElement('span');
                    //oSpan2.innerHTML = dataInt[i].fav_count;
                    //oBox3.appendChild(oSpan2);
                    oBox4 = document.createElement('div');
                    oBox4.className = 'imgContainer f-cb';
                    oBox3.appendChild(oBox4);
                    var oImg3 = document.createElement('img');
                    oImg3.src = '/static/' + dataInt[i].teacher_pic;
                    oBox4.appendChild(oImg3);
                    var oUl = document.createElement('ul');
                    oBox4.appendChild(oUl);
                    var oLi1 = document.createElement('li');
                    oLi1.innerHTML = dataInt[i].teacher_name;
                    oUl.appendChild(oLi1);
                    var oLi2 = document.createElement('li');
                    oLi2.innerHTML = dataInt[i].tree_class;
                    oUl.appendChild(oLi2);


                }
                waterfall('falls', 'pin');
                var oParent = document.getElementById('falls');
                var oBody = document.body
                var oMain = getClassObj(oBody, 'main');
                var aPin = getClassObj(oParent, 'pin');
                var lastPinH = aPin[aPin.length - 1].offsetTop + Math.floor(aPin[aPin.length - 1].offsetHeight);
                oMain[0].style.height = lastPinH + 80 + 'px' ;
                obottomPos.style.display='block';
                canLoad = true;
            });
            //var oParent = document.getElementById('falls');// 父级对象
            //for (var i = 0; i < dataInt.data.length; i++) {
            //    var oPin = document.createElement('div'); //添加 元素节点
            //    oPin.className = 'pin';                   //添加 类名 name属性
            //    oParent.appendChild(oPin);              //添加 子节点
            //    var oBox = document.createElement('div');
            //    oBox.className = 'box';
            //    oPin.appendChild(oBox);
            //    var oImg = document.createElement('img');
            //    oImg.className = 'boxImg';
            //    oImg.src = './images/' + dataInt.data[i].src;
            //    oBox.appendChild(oImg);
            //    var oBox2 = document.createElement('div');
            //    oBox2.className = 'imgBottom';
            //    oBox.appendChild(oBox2);
            //    var oH = document.createElement('h4');
            //    oH.innerHTML = '解开心理学的面啥';
            //    oBox2.appendChild(oH);
            //    var oP = document.createElement('p');
            //    oP.innerHTML = '学习心理学，可以加深人们对自身的了解。通过学习心理学，你可以知道自己为什么会';
            //    oBox2.appendChild(oP);
            //    var oBox3 = document.createElement('div');
            //    oBox3.className = 'imgBottomBox';
            //    oBox2.appendChild(oBox3);
            //    var oImg1 = document.createElement('img');
            //    oImg1.src = 'images/guanzhu.png';
            //    oBox3.appendChild(oImg1);
            //    var oSpan1 = document.createElement('span');
            //    oSpan1.innerHTML = '12';
            //    oBox3.appendChild(oSpan1);
            //    var oImg2 = document.createElement('img');
            //    oImg2.src = 'images/sc.png';
            //    oBox3.appendChild(oImg2);
            //    var oSpan2 = document.createElement('span');
            //    oSpan2.innerHTML = '56';
            //    oBox3.appendChild(oSpan2);
            //    oBox4 = document.createElement('div');
            //    oBox4.className = 'imgContainer f-cb';
            //    oBox3.appendChild(oBox4);
            //    var oImg3 = document.createElement('img');
            //    oImg3.src = 'images/u47.png';
            //    oBox4.appendChild(oImg3);
            //    var oUl = document.createElement('ul');
            //    oBox4.appendChild(oUl);
            //    var oLi1 = document.createElement('li');
            //    oLi1.innerHTML = '小谢';
            //    oUl.appendChild(oLi1);
            //    var oLi2 = document.createElement('li');
            //    oLi2.innerHTML = '应用心理学';
            //    oUl.appendChild(oLi2);
            //
            //
            //}
            //waterfall('falls', 'pin');
        }
        ;
    }
}

/*
 parend 父级id
 pin 元素id
 */
function waterfall(parent, pin) {
    var oParent = document.getElementById(parent);// 父级对象
    var aPin = getClassObj(oParent, pin);// 获取存储块框pin的数组aPin
    var iPinW = aPin[0].offsetWidth;// 一个块框pin的宽
    var num = Math.floor(1056 / iPinW);//每行中能容纳的pin个数【窗口宽度除以一个块框宽度】
    oParent.style.cssText = 'width:' + iPinW * num + 'px;ma rgin:0 auto;';//设置父级居中样式：定宽+自动水平外边距

    var pinHArr = [];//用于存储 每列中的所有块框相加的高度。
    for (var i = 0; i < aPin.length; i++) {//遍历数组aPin的每个块框元素
        var pinH = aPin[i].offsetHeight;
        if (i < num) {
            pinHArr[i] = pinH; //第一行中的num个块框pin 先添加进数组pinHArr
        } else {
            var minH = Math.min.apply(null, pinHArr);//数组pinHArr中的最小值minH
            var minHIndex = getminHIndex(pinHArr, minH);
            aPin[i].style.position = 'absolute';//设置绝对位移
            aPin[i].style.top = minH + 'px';
            aPin[i].style.left = aPin[minHIndex].offsetLeft + 'px';
            //数组 最小高元素的高 + 添加上的aPin[i]块框高
            pinHArr[minHIndex] += aPin[i].offsetHeight;//更新添加了块框后的列高
        }
    }
}

/****
 *通过父级和子元素的class类 获取该同类子元素的数组
 */
function getClassObj(parent, className) {
    var obj = parent.getElementsByTagName('*');//获取 父级的所有子集
    var pinS = [];//创建一个数组 用于收集子元素
    for (var i = 0; i < obj.length; i++) {//遍历子元素、判断类别、压入数组
        if (obj[i].className == className) {
            pinS.push(obj[i]);
        }
    }
    ;
    return pinS;
}
/****
 *获取 pin高度 最小值的索引index
 */
function getminHIndex(arr, minH) {
    for (var i in arr) {
        if (arr[i] == minH) {
            return i;
        }
    }
}


function checkscrollside() {
    var oParent = document.getElementById('falls');
    var aPin = getClassObj(oParent, 'pin');
    var lastPinH = aPin[aPin.length - 1].offsetTop + Math.floor(aPin[aPin.length - 1].offsetHeight / 2);//创建【触发添加块框函数waterfall()】的高度：最后一个块框的距离网页顶部+自身高的一半(实现未滚到底就开始加载)
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;//注意解决兼容性
    var documentH = document.documentElement.clientHeight;//页面高度
    return (lastPinH < scrollTop + documentH) ? true : false;//到达指定高度后 返回true，触发waterfall()函数
}