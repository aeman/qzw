$(window).scrollTop(200);
$(document).ready(function(){
// 鼠标悬停变色
	$( ".mycourse-blocks .mycourse-block" ).mouseover( function(){
		$(this).addClass( 'mycourse-hover' );
	} );
	$( ".mycourse-blocks .mycourse-block" ).mouseleave( function(){
		$(this).removeClass( 'mycourse-hover' );
	} );

	$( '.mycouse-tab-change .ing' ).click( function(){
		$(this).css( 'background-color','#fff' );
		$( '.mycouse-tab-change .finished' ).css( 'background-color','#DCDCDC' );
		$( '.mycouse-stu-con .mycouse-in' ).css( 'display','block' );
		$( '.mycouse-stu-con .mycouse-finish' ).css( 'display','none' );
	} );
	$( '.mycouse-tab-change .finished' ).click( function(){
		$(this).css( 'background-color','#fff' );
		$( '.mycouse-tab-change .ing' ).css( 'background-color','#DCDCDC' );
		$( '.mycouse-stu-con .mycouse-in' ).css( 'display','none' );
		$( '.mycouse-stu-con .mycouse-finish' ).css( 'display','block' );
	} );
// 删除第二次确认弹框

	$( '.course-tab .del' ).click( function()
	{

		$( '.del-layer' ).css({
			'display':'block',
			
		});

	});

	$( '.new-know' ).click( function()
	{

		$( '.select-dialog' ).css({
			'display':'block',
			
		});
 
	});

// 鼠标点击向下滑动
	var indexLine1;
	var indexLine2;
	var timeInterval = 800;
	var arrowInterval = 350;

	function slideDownBlock( obj ){
		obj.parent().find( '.block-arrow' ).slideDown( arrowInterval,function(){
			$stuRate.slideDown( timeInterval );
		});
	}

	function slideUpBlock( obj ){
		$stuRate.slideUp( timeInterval, function(){
			obj.parents( '.mycourse-stu-rate' ).find( '.block-arrow' ).slideUp( arrowInterval );
		});
	}

	function slideUpDownBlock( obj ){
		$stuRate.slideUp( timeInterval, function(){
			obj.parents( '.mycourse-stu-rate' ).find( '.block-arrow' ).slideUp( arrowInterval );
			slideDownBlock( obj );
		});
	}


	$( '.course-logined .mycourse-block' ).click(function(){

	$( 'html,body' ).animate({scrollTop:$(this).offset().top},2000);

	$stuRate = $(this).parents( '.mycourse-stu-rate' ).find( '.stu-rate' );

	$(this).addClass( 'mycourse-click' );

	if( $(this).parents( 'ul' ).hasClass( 'mycourse-blocks1' ))
	{

		if( $( '.stu-rate:eq(1)' ).css( 'display' ) == 'block' )
	{
		$( '.course-logined .mycourse-block' ).removeClass('mycourse-click' );
		$(this).addClass( 'mycourse-click' );

		$( '.stu-rate:eq(1)' ).slideUp( timeInterval , function(){

			$( '.stu-rate:eq(1)' ).parents( '.mycourse-stu-rate' ).find( '.block-arrow' ).slideUp( arrowInterval );
			
		});
	}

		var indexChange1 = $(this).parent().index();

		if( indexLine1 == "undefine" ){
			
			slideDownBlock( $(this) );
		}

		if( indexChange1 === indexLine1 ){

			if( $( '.stu-rate:eq(0)' ).css( 'display' ) == 'none' ){
			
				slideDownBlock( $(this) );
			}
			else{
				$(this).removeClass( 'mycourse-click' );
				slideUpBlock( $(this) );
			}
			
		}
	 	if( indexChange1 != indexLine1 && indexLine1 != "undefine" ){
	 		if( $( '.stu-rate:eq(0)' ).css( 'display' ) == 'block' ){

	 			$( '.course-logined .mycourse-block' ).removeClass('mycourse-click' );
	 			$(this).addClass( 'mycourse-click' );

	 			slideUpDownBlock( $(this) );
	 		}
	 		if( $( '.stu-rate:eq(0)' ).css( 'display' ) == 'none' ){

	 			slideDownBlock( $(this) );

	 		}
	 	}
		indexLine1 = indexChange1;
	}

	if( $(this).parents( 'ul' ).hasClass( 'mycourse-blocks2' ))
	{
		if( $( '.stu-rate:eq(0)' ).css( 'display' ) == 'block' )
	{
		$( '.course-logined .mycourse-block' ).removeClass('mycourse-click' );
		$(this).addClass( 'mycourse-click' );

		$( '.stu-rate:eq(0)' ).slideUp( timeInterval , function(){

			$( '.stu-rate:eq(0)' ).parents( '.mycourse-stu-rate' ).find( '.block-arrow' ).slideUp( arrowInterval );
		});
	}
		var indexChange2 = $(this).parent().index();

		if( indexLine2 == "undefine" ){
			
			slideDownBlock( $(this) );
		}

		if( indexChange2 === indexLine2 ){

			if( $( '.stu-rate:eq(1)' ).css( 'display' ) == 'none' ){
				
				slideDownBlock( $(this) );
			}
			else{

				$(this).removeClass( 'mycourse-click' );

				slideUpBlock( $(this) );
			}
			
		}
	 	if( indexChange2 !== indexLine2 && indexLine2 != "undefine" ){
	 		if( $( '.stu-rate:eq(1)' ).css( 'display' ) == 'block' ){

	 			$( '.course-logined .mycourse-block' ).removeClass('mycourse-click' );
	 			$(this).addClass( 'mycourse-click' );

	 			slideUpDownBlock( $(this) );
	 		}
	 		if( $( '.stu-rate:eq(1)' ).css( 'display' ) == 'none' ){

	 			slideDownBlock( $(this) );
	 		}
	 	}
		indexLine2 = indexChange2;
	}

	});
//输入框功能

	$( '.course-know-notes .com-block i' ).click( function()
	{

		$(this).closest( 'li' ).remove();

	} );

	$( '.show-blocks input' ).keypress( function(e){

		var e = e || window.event;
console.log(e.keyCode);
		if( e.keyCode == 32 ){
		console.log("---------------");	
			try{
			var val = $(this)[0].value;
			console.log( val );

			if( $.trim(val) != '' ){
			
				$(this).attr( 'value','' ); //bufixed by sunny
				$(this).val(''); //bufixed by sunny

				var length = $( '.key-blocks .com-block' ).length;
				console.log( length );

				if( length < 10 ){

					$( '.key-blocks' ).append( "<div class='com-block'><span></span><i>x</i></div>" );
					$( '.key-blocks .com-block span' ).eq( length ).html( val );
				}
				else{
					$(this).attr( 'readOnly',true );
				}
			}
			} catch (e) {
				console.log(e.message);
			}
		}

	});

	$( document ).on( 'click','.key-blocks .com-block i',function(){

		$(this).closest( '.com-block' ).remove();
		$( '.show-blocks input' ).attr( 'readOnly',false );
	} );

});
