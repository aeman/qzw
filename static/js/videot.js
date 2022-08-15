window.onload = function(){
	var oV = document.getElementById('v1');
	var oPlay=document.getElementById('videoPlay');
	var aInput = oPlay.getElementsByTagName('input');
	
	var oDiv1 = document.getElementById('div1');
	var oDiv2 = document.getElementById('div2');
	var oDiv3 = document.getElementById('div3');
	var oDiv4 = document.getElementById('div4');
	
	var disX = 0;
	var disX2 = 0;
	
	var timer = null;
	
	aInput[0].onclick = function(){
		
		if( oV.paused ){
			
			oV.play();
			
			this.value = '暂停';
			
			nowTime();
			timer = setInterval(nowTime,1000);
			
		}
		else{
			
			oV.pause();
			
			this.value = '播放';
			
			clearInterval(timer);
			
		}
		
	};
	
	
	aInput[2].value = changeTime(oV.duration);
	
	aInput[3].onclick = function(){
		
		
		if( oV.muted ){
			
			oV.volume = 1;
			
			this.value = '静音';
			
			oV.muted = false;
			
		}
		else{
			
			oV.volume = 0;
			
			this.value = '取消静音';
			
			oV.muted = true;
			
		}
		
	};
	
	aInput[4].onclick = function(){
		oV.mozRequestFullScreen();
	};
	
	
	function nowTime(){
		
		aInput[1].value = changeTime(oV.currentTime);
		
		var scale = oV.currentTime/oV.duration;
		
		oDiv2.style.left = scale * 240 + 'px';
		
	}
	
	
	function changeTime(iNum){
		
		iNum = parseInt( iNum );
		
		var iH = toZero(Math.floor(iNum/3600));
		var iM = toZero(Math.floor(iNum%3600/60));
		var iS = toZero(Math.floor(iNum%60));
		
		return iH + ':' +iM + ':' + iS;
		
	}
	
	function toZero(num){
		if(num<=9){
			return '0' + num;
		}
		else{
			return '' + num;
		}
	}
	
	
	oDiv2.onmousedown = function(ev){
		var ev = ev || window.event;
		disX = ev.clientX - oDiv2.offsetLeft;
		
		document.onmousemove = function(ev){
			var ev = ev || window.event;
			
			var L = ev.clientX - disX;
			
			if(L<0){
				L = 0;
			}
			else if(L>oDiv1.offsetWidth - oDiv2.offsetWidth){
				L = oDiv1.offsetWidth - oDiv2.offsetWidth;
			}
			
			oDiv2.style.left = L + 'px';
			
			
			var scale = L/(oDiv1.offsetWidth - oDiv2.offsetWidth);
			
			oV.currentTime = scale * oV.duration;
			
			nowTime();
			
		};
		document.onmouseup = function(){
			document.onmousemove = null;
		};
		return false;
	};
	
	
	oDiv4.onmousedown = function(ev){
		var ev = ev || window.event;
		disX2 = ev.clientX - oDiv4.offsetLeft;
		
		document.onmousemove = function(ev){
			var ev = ev || window.event;
			
			var L = ev.clientX - disX2;
			
			if(L<0){
				L = 0;
			}
			else if(L>oDiv3.offsetWidth - oDiv4.offsetWidth){
				L = oDiv3.offsetWidth - oDiv4.offsetWidth;
			}
			
			oDiv4.style.left = L + 'px';
			
			var scale = L/(oDiv3.offsetWidth - oDiv4.offsetWidth);
			oV.volume = scale;
			
		};
		document.onmouseup = function(){
			document.onmousemove = null;
		};
		return false;
	};
	
};