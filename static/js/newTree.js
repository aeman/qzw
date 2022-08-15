$(function() {
	var onOff=true;
	var oTreePos=$('#treePos').get(0);
	var odragBoxId=$('#dragBoxId').get(0);
	$('.addDialogkno').click(function () {
		var _html='';
			_html+='<div class="dragBox">'
			_html+=		'<h3>你们这样吧<div class="editDialog"></div></h3>'
			_html+=		'<ul class="f-dn"></ul>'
			_html+='</div>'		
		$(this).parents('.dragBoxAdd').before(_html);
		drag($('.dragBox:last').get(0))
	})

	$('.dragBox').each(function() {
			var _this=$(this).get(0);
			drag(_this);
	});

	$('body').delegate('.delectDialog','click',function  () {
		var parentL=$(this).parents('.dragBox');
		parentL.removeProp('style');
		parentL.removeClass('dragBoxOn');
		parentL.find('div').removeClass('delectDialog').addClass('editDialog');
		parentL.get(0).onmouseover=null;


		if (parentL.css({'left' : '70px', 'top' : '80px'})) {
			$('.leaf0').css('background','url(/static/images/leafGray.png) no-repeat -29px 0')
		}
		if (parentL.css({'left' : '60px', 'top' : '168px'})) {
			$('.leaf4').css('background','url(/static/images/leafGray.png) no-repeat -341px 0')
		} 
		if (parentL.css({'left' : '90px', 'top' : '213px'})) {
			$('.leaf8').css('background','url(/static/images/leafGray.png) no-repeat -159px -26px')
		} 
		if (parentL.css({'left' : '130px', 'top' : '270px'})) {
			$('.leaf10').css('background','url(/static/images/leafGray.png) no-repeat -211px -26px')
		} 
		if (parentL.css({'left' : '20px', 'top' : '308px'})) {
			$('.leaf17').css('background','url(/static/images/leafGray.png) no-repeat -237px -26px')
		} 
		if (parentL.css({'left' : '-20px', 'top' : '367px'})) {
			$('.leaf18').css('background','url(/static/images/leafGray.png) no-repeat -289px -26px')
		} 
		if (parentL.css({'left' : '120px', 'top' : '410px'})) {
			$('.leaf23').css('background','url(/static/images/leafGray.png) no-repeat -315px 0')
		} 
		if (parentL.css({'left' : '384px', 'top' : '80px'})) {
			$('.leaf3').css('background','url(/static/images/leafGray.png) no-repeat -55px -26px')
		} 
		if (parentL.css({'left' : '410px', 'top' : '170px'})) {
			$('.leaf7').css('background','url(/static/images/leafGray.png) no-repeat -107px -26px')
		} 
		if (parentL.css({'left' : '510px', 'top' : '190px'})) {
			$('.leaf14').css('background','url(/static/images/leafGray.png) no-repeat -29px 0')
		} 
		if (parentL.css({'left' : '483px', 'top' : '237px'})) {
			$('.leaf15').css('background','url(/static/images/leafGray.png) no-repeat -211px 0')
		} 
		if (parentL.css({'left' : '460px', 'top' : '301px'})) {
			$('.leaf16').css('background','url(/static/images/leafGray.png) no-repeat -237px 0')
		}
		if (parentL.css({'left' : '493px', 'top' : '386px'})) {
			$('.leaf26').css('background','url(/static/images/leafGray.png) no-repeat -159px 0')
		}
		if (parentL.css({'left' : '413px', 'top' : '429px'})) {
			$('.leaf25').css('background','url(/static/images/leafGray.png) no-repeat -263px -26px')
		}
	})



	$('body').delegate('.editDialog','click',function() {
			$('body').css('overflow','hidden')	
			var _str='';
			_str+='<div class="addTreeDialog">'
				_str+=	'<div id="close"></div>'
				_str+=	'<div class="addTreeHead">'
				_str+=		'添加知识树'
				_str+=	'</div>'
				_str+=	'<div class="addDialogName">'
				_str+=		'<input type="text" value="添加知识树">'
				_str+=	'</div>'
				_str+=	'<ul>'
				_str+=		'<li>'

				_str+=			'<img src="/static/images/videoPng.png" alt="" class="addVideo f-fl">'
				_str+=			'<span class="f-fl">01-健康心理知识（12:23）</span>'
				_str+=			'<img src="/static/images/125.png" alt="" class="addDelect f-fr">'
				_str+=			'<img src="/static/images/124.png" alt="" class="addbottom f-fr">'
				_str+=			'<img src="/static/images/123.png" alt="" class="addTop f-fr">'
				_str+=		'</li>'
				_str+=		'<li>'
				_str+=			'<img src="/static/images/videoPng.png" alt="" class="addVideo f-fl">'
				_str+=			'<span class="f-fl">01-健康心理知识（12:23）</span>'
				_str+=			'<img src="/static/images/125.png" alt="" class="addDelect f-fr">'
				_str+=			'<img src="/static/images/124.png" alt="" class="addbottom f-fr">'
				_str+=			'<img src="/static/images/123.png" alt="" class="addTop f-fr">'
				_str+=		'</li>'
				_str+=		'<li>'
				_str+=			'<img src="/static/images/videoPng.png" alt="" class="addVideo f-fl">'
				_str+=			'<span class="f-fl">01-健康心理知识（12:23）</span>'
				_str+=			'<img src="/static/images/125.png" alt="" class="addDelect f-fr">'
				_str+=			'<img src="/static/images/124.png" alt="" class="addbottom f-fr">'
				_str+=			'<img src="/static/images/123.png" alt="" class="addTop f-fr">'
				_str+=		'</li>'
				_str+=	'</ul>'
				_str+=	'<div class="dialogTab f-cb">'
				_str+=		'<div class="tabHead f-cb">'
				_str+=			'<span class="on tabVideo">视频添加</span>'
				_str+=			'<span class="tabClass">课程知识点</span>'
				_str+=		'</div>'
				_str+=		'<div class="tabVideoBox">'
				_str+=			'<div>'
				_str+=				'<span>视频链接</span>'
				_str+=				'<input type="text" value="http://">'
				_str+=			'</div>'
				_str+=			'<div>'
				_str+=				'<span>标题</span>'
				_str+=				'<input type="text" value="健康心理学">'
				_str+=			'</div>'
				_str+=		'</div>'
				_str+=		'<div class="tabClassBox">'
				_str+=			'<div>可以添加千字文教育的知识点，一切课程为我所用</div>'
				_str+=			'<div class="tabClassSearch"><input type="text"><input type="button" value="搜索" class="searchBtn"></div>'
				_str+=			'<div class="searchContent">'
				_str+=				'<h4>搜索到以下内容</h4>'
				_str+=				'<ul>'
				_str+=					'<li><label for="tabCheck1"><input type="checkbox" name="" id="tabCheck1">心理学概论</label></li>'
				_str+=					'<li><label for="tabCheck2"><input type="checkbox" name="" id="tabCheck2">什么是心理学</label></li>'
				_str+=					'<li><label for="tabCheck3"><input type="checkbox" name="" id="tabCheck3">心理学包含什么</label></li>'
				_str+=				'</ul>'
				_str+=			'</div>'
				_str+=		'</div>'
				_str+=		'<span class="addTreeBtn">添加到知识树</span>'
				_str+=	'</div>'
				_str+=	'<div class="changeButton">'
				_str+=		'<input type="button" value="确定" class="ensure on">'
				_str+=		'<input type="button" value="取消" class="Cancel">'
				_str+=	'</div>'
				_str+= '</div>'
			openNew2(_str);
			$('body').delegate('.tabClass','click',function  () {
				$('.tabVideoBox').css('display','none');
				$('.tabClassBox').css('display','block');
				$(this).addClass('on');
				$('.tabVideo').removeClass('on');
			})
			$('body').delegate('.tabVideo','click',function  () {
				$('.tabClassBox').css('display','none');
				$('.tabVideoBox').css('display','block');
				$(this).addClass('on');
				$('.tabClass').removeClass('on');
			})
			return false;
	});


	



 	function drag(obj) {
		var oH=obj.getElementsByTagName('h3')[0];
		var oDiv=oH.getElementsByTagName('div')[0];
		var oUl=obj.getElementsByTagName('ul')[0]
		
		
		obj.onmousedown = function(ev) {

			
			
			var ev = ev || event;
			
			var disX = ev.clientX - this.offsetLeft;
			var disY = ev.clientY - this.offsetTop;
			
			if ( obj.setCapture ) {
				obj.setCapture();
			}
			
			document.onmousemove = function(ev) {
				var aDragBox=getClassObj(odragBoxId,'dragBox dragBoxOn');
				var aDiv=oTreePos.getElementsByTagName('div');
				obj.className='dragBox dragBoxOn';
				oUl.className='dn';
				var oLeaf4=getClassObj(oTreePos,'leaf4');
					oLeaf4[0].style.background='url(/static/images/leafGray.png) no-repeat -341px 0';
				var oLeaf0=getClassObj(oTreePos,'leaf0');
					oLeaf0[0].style.background='url(/static/images/leafGray.png) no-repeat -29px 0';
				var oLeaf3=getClassObj(oTreePos,'leaf3');
					oLeaf3[0].style.background='url(/static/images/leafGray.png) no-repeat -55px -26px';
				var oLeaf7=getClassObj(oTreePos,'leaf7');
					oLeaf7[0].style.background='url(/static/images/leafGray.png) no-repeat -107px -26px';
				var oLeaf8=getClassObj(oTreePos,'leaf8');
					oLeaf8[0].style.background='url(/static/images/leafGray.png) no-repeat -159px -26px';
				var oLeaf10=getClassObj(oTreePos,'leaf10');
					oLeaf10[0].style.background='url(/static/images/leafGray.png) no-repeat -211px -26px';
				var oLeaf14=getClassObj(oTreePos,'leaf14');
					oLeaf14[0].style.background='url(/static/images/leafGray.png) no-repeat -29px 0';
				var oLeaf15=getClassObj(oTreePos,'leaf15');
					oLeaf15[0].style.background='url(/static/images/leafGray.png) no-repeat -211px 0';
				var oLeaf16=getClassObj(oTreePos,'leaf16');
					oLeaf16[0].style.background='url(/static/images/leafGray.png) no-repeat -237px 0';
				var oLeaf17=getClassObj(oTreePos,'leaf17');
					oLeaf17[0].style.background='url(/static/images/leafGray.png) no-repeat -237px -26px';
				var oLeaf18=getClassObj(oTreePos,'leaf18');
					oLeaf18[0].style.background='url(/static/images/leafGray.png) no-repeat -289px -26px';
				var oLeaf23=getClassObj(oTreePos,'leaf23');
					oLeaf23[0].style.background='url(/static/images/leafGray.png) no-repeat -315px 0px';
				var oLeaf25=getClassObj(oTreePos,'leaf25');
					oLeaf25[0].style.background='url(/static/images/leafGray.png) no-repeat -263px -26px';
				var oLeaf26=getClassObj(oTreePos,'leaf26');
					oLeaf26[0].style.background='url(/static/images/leafGray.png) no-repeat -159px 0px';
						
				for (var i = 0; i < aDragBox.length; i++) {
					
					if (parseInt(aDragBox[i].style.left)==70 && parseInt(aDragBox[i].style.top)==80) {
						var oLeaf0=getClassObj(oTreePos,'leaf0');
						oLeaf0[0].style.background='url(/static/images/leaf.png) no-repeat -29px 0';						
					}else if(parseInt(aDragBox[i].style.left)==60 && parseInt(aDragBox[i].style.top)==168){
						var oLeaf4=getClassObj(oTreePos,'leaf4');
						oLeaf4[0].style.background='url(/static/images/leaf.png) no-repeat -341px 0';
					}else if(parseInt(aDragBox[i].style.left)==90 && parseInt(aDragBox[i].style.top)==213){
						var oLeaf8=getClassObj(oTreePos,'leaf8');
						oLeaf8[0].style.background='url(/static/images/leaf.png) no-repeat -159px -26px';
					}else if(parseInt(aDragBox[i].style.left)==130 && parseInt(aDragBox[i].style.top)==270){
						var oLeaf10=getClassObj(oTreePos,'leaf10');
						oLeaf10[0].style.background='url(/static/images/leaf.png) no-repeat -211px -26px';
					}else if(parseInt(aDragBox[i].style.left)==20 && parseInt(aDragBox[i].style.top)==308){
						var oLeaf17=getClassObj(oTreePos,'leaf17');
						oLeaf17[0].style.background='url(/static/images/leaf.png) no-repeat -237px -26px';
					}else if(parseInt(aDragBox[i].style.left)==-20 && parseInt(aDragBox[i].style.top)==367){
						var oLeaf18=getClassObj(oTreePos,'leaf18');
						oLeaf18[0].style.background='url(/static/images/leaf.png) no-repeat -289px -26px';
					}else if(parseInt(aDragBox[i].style.left)==120 && parseInt(aDragBox[i].style.top)==410){
						var oLeaf23=getClassObj(oTreePos,'leaf23');
						oLeaf23[0].style.background='url(/static/images/leaf.png) no-repeat -315px 0px';
					}else if(parseInt(aDragBox[i].style.left)==384 && parseInt(aDragBox[i].style.top)==80){
						var oLeaf3=getClassObj(oTreePos,'leaf3');
						oLeaf3[0].style.background='url(/static/images/leaf.png) no-repeat -55px -26px';
					}else if(parseInt(aDragBox[i].style.left)==410 && parseInt(aDragBox[i].style.top)==170){
						var oLeaf7=getClassObj(oTreePos,'leaf7');
						oLeaf7[0].style.background='url(/static/images/leaf.png) no-repeat -107px -26px';
					}else if(parseInt(aDragBox[i].style.left)==510 && parseInt(aDragBox[i].style.top)==190){
						var oLeaf14=getClassObj(oTreePos,'leaf14');
						oLeaf14[0].style.background='url(/static/images/leaf.png) no-repeat -29px 0';
					}else if(parseInt(aDragBox[i].style.left)==483 && parseInt(aDragBox[i].style.top)==237){
						var oLeaf15=getClassObj(oTreePos,'leaf15');
						oLeaf15[0].style.background='url(/static/images/leaf.png) no-repeat -211px 0';
					}else if(parseInt(aDragBox[i].style.left)==460 && parseInt(aDragBox[i].style.top)==301){
						var oLeaf16=getClassObj(oTreePos,'leaf16');
						oLeaf16[0].style.background='url(/static/images/leaf.png) no-repeat -237px 0';
					}else if(parseInt(aDragBox[i].style.left)==493 && parseInt(aDragBox[i].style.top)==386){
						var oLeaf26=getClassObj(oTreePos,'leaf26');
						oLeaf26[0].style.background='url(/static/images/leaf.png) no-repeat -159px 0px';
					}else if(parseInt(aDragBox[i].style.left)==413 && parseInt(aDragBox[i].style.top)==429){
						var oLeaf25=getClassObj(oTreePos,'leaf25');
						oLeaf25[0].style.background='url(/static/images/leaf.png) no-repeat -263px -26px';
					}
				};				
				var ev = ev || event;				
				var L = ev.clientX - disX;
				var T = ev.clientY - disY;				
				if ( L < -20 ) {
					L = -20;
				} else if ( L > 851 ) {
					L = 851;
				}				
				if ( T < 0 ) {
					T = 0;
				} else if ( T > 704 ) {
					T = 704;
				}
				if (L<520) {
					oDiv.className='delectDialog';
						obj.onmouseover=function  () {
						
								oUl.className='db';
						
						}
						obj.onmouseout=function  () {
								oUl.className='dn';
						}
				}else{
					oDiv.className='editDialog';
				};				
				obj.style.left = L + 'px';
				obj.style.top = T + 'px';
				if (L<84 && L>60 && T>60 && T<90) {
					obj.style.left = 70 + 'px';
					obj.style.top = 80 + 'px';
					obj.style.zIndex=100;
					
				}
				if (L<65 && L>40 && T>147 && T<180) {
					
					obj.style.left = 60 + 'px';
					obj.style.top = 168 + 'px';
					obj.style.zIndex=99;
					
				}
				if (L<94 && L>60 && T>200 && T<230) {

					obj.style.left = 90 + 'px';
					obj.style.top = 213 + 'px';
					obj.style.zIndex=98;
				};
				if (L<136 && L>110 && T>254 && T<283) {

					obj.style.left = 130 + 'px';
					obj.style.top = 270 + 'px';
					obj.style.zIndex=97;
				};
				if (L<30 && L>0 && T>290 && T<315) {

					obj.style.left = 20 + 'px';
					obj.style.top = 308 + 'px';
					obj.style.zIndex=96;
				};
				if (L<0 && L>-20 && T>343 && T<387) {

					obj.style.left = -20 + 'px';
					obj.style.top = 367 + 'px';
					obj.style.zIndex=95;
				};
				if (L<0 && L>-20 && T>343 && T<387) {

					obj.style.left = -20 + 'px';
					obj.style.top = 367 + 'px';
					obj.style.zIndex=94;
				};
				if (L<146 && L>90 && T>400 && T<430) {

					obj.style.left = 120 + 'px';
					obj.style.top = 410 + 'px';
					obj.style.zIndex=93;
				};
				if (L<410 && L>363 && T>60 && T<95) {

					obj.style.left = 384 + 'px';
					obj.style.top = 80 + 'px';
					obj.style.zIndex=92;
				};
				if (L<420 && L>383 && T>160 && T<187) {

					obj.style.left = 410 + 'px';
					obj.style.top = 170 + 'px';
					obj.style.zIndex=91;
				};
				if (L<530 && L>486 && T>173 && T<210) {

					obj.style.left = 510 + 'px';
					obj.style.top = 190 + 'px';
					obj.style.zIndex=90;
				};
				if (L<500 && L>457 && T>224 && T<253) {

					obj.style.left = 483 + 'px';
					obj.style.top = 237 + 'px';
					obj.style.zIndex=89;
				};
				if (L<483 && L>434 && T>285 && T<312) {

					obj.style.left = 460 + 'px';
					obj.style.top = 301 + 'px';
					obj.style.zIndex=88;
				};
				if (L<511 && L>466 && T>376 && T<400) {

					obj.style.left = 493 + 'px';
					obj.style.top = 386 + 'px';
					obj.style.zIndex=87;
				};
				if (L<427 && L>383 && T>414 && T<440) {

					obj.style.left = 413 + 'px';
					obj.style.top = 429 + 'px';
					obj.style.zIndex=86;
				};
			}
			
			document.onmouseup = function() {
                if (parseInt(obj.style.left)>520) {
					obj.className='dragBox';
                    obj.onmouseover=null;
				};
				document.onmousemove = document.onmouseup = null;
				if ( obj.releaseCapture ) {
					obj.releaseCapture();
				}
			}
			
			return false;
			
		}		
	}
	function getClassObj(parent,className){
	    var obj=parent.getElementsByTagName('*');//获取 父级的所有子集
	    var pinS=[];//创建一个数组 用于收集子元素
	    for (var i=0;i<obj.length;i++) {//遍历子元素、判断类别、压入数组
	        if (obj[i].className==className){
	            pinS.push(obj[i]);
	        }
	    };
	    return pinS;
	}
});
	

	
	
