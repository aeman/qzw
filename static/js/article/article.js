define("article", ["domReady!"], function(){
    avalon.config({debug: false, interpolate: ["{-", "-}"]});

    var title_trim = function(v) {
        var nv = v.replace(/^\s+/, "");
        nv = nv.replace(/\s+$/, "");
        return nv;
    };

    avalon.filters.fmt_show = function(v) {
        var i = parseInt(v) || 0;
        if (i > 1000) {
            return (i / 1000).toFixed(2) + "K";
        } else return v + "";
    };

    var vm = avalon.define("article", function($scope){
		$scope.tags = [];
		$scope.serv_articles = [];
		$scope.serv_knowledges = [];
		$scope.getTags = function(article_id) {
			$.get("/article/get_tags/" + article_id, function(data){
				$scope.tags = data;
				for (var i = 0, j = $scope.tags.length; i < j; i++) {
                    var item = $scope.tags[i];
                    item.tag_name = title_trim(item.tag_name);
				}
			});
		};

		$scope.service = function() {
            $.get("/article/analysis/5", function(data){
                vm.serv_articles = data;
            });
            $.get("/knowledge/analysis/5", function(data){
                vm.serv_knowledges = data;
            });
		};
    });

    var know_maps = {};

    var vm_knowledges = avalon.define("article_knowledge", function($scope) {
		$scope.knowledges = [];
        $scope.buildKnowledges = function() {
		    var stepIndex = 0;
		    var know_list = [];
		    $(".kpc_stub").each(function(){
		        var dv = $(this).attr("class");
                if (/kpc_(\d+)/.test(dv)) {
                    know_list.push(RegExp.$1);
                }
		    });
		    if (know_list.length == 0) return;
		     $.get("/article/get_knowledge_info?ids=" + know_list.join(","), function(data){
                for (var i = 0, j = data.length; i < j; i++) {
                    var itm = data[i];
                    know_maps[itm.course_id + ""] = {"video": itm.video_id, "desc": itm.course_desc, "study_status": itm.study_status};
                }
			    $(".article-conts p").each(function(){
                    var html_lis = [];
                    $(this).find(".kpc_stub").each(function(){
                        var dv = $(this).attr("class");
                        if (/kpc_(\d+)/.test(dv)) {
                            dv = RegExp.$1;
                            var item = know_maps[dv];
                            var video_id = item.video;
                            var status = item.study_status;
                            if (video_id == null) {
                            	html_lis.push('<li><a ' + (status==0?"":(status==2?'class="finished"':'class="study"')) + ' href="javascript:alert(\'当前视频无效!\')"><span>' + $(this).html() + '</span></a></li>');
                            } else {
                            	html_lis.push('<li><a ' + (status==0?"":(status==2?'class="finished"':'class="study"')) + ' href="/video/' + know_maps[dv].video + '"><span' + (status==0?"":(status==1?' style="color:#ccc;background:#369"':'')) + '>' + $(this).html() + '</span></a></li>');
                            }
                        }
                    });

                    if (html_lis.length == 0)
                        return;
                    $scope.knowledges.push(stepIndex);
                    stepIndex++;
                    var htmls = ['<div class="tips-list fix"><h3>知识点</h3><ul>'];
                    htmls.push(html_lis.join(""));
                    htmls.push('</ul></div>');
                    $(this).append(htmls.join(""));
                });
			});
		};

		$scope.go2Knowledge = function(index, self) {
		    $(".step ul li").each(function() {
		        $(this).removeClass("on");
		    });
		    $(self).addClass("on");
			var item = $($(".tips-list")[index]);
            $('html, body').animate({
                scrollTop: item.offset().top - 50
            }, 500);
		};

		$scope.go2Knowledge2 = function(index) {
		    var self = $($(".step ul li")[index]);
		    if (self) {
		        if ($(".step ul li").length == 1)
		            return $(self).addClass("on");
		        $(".step ul li").each(function() {
		            $(this).removeClass("on");
                });
                $(self).addClass("on");
		    }
		};
    });

	var article = {};

	article.start = function(article_id){
        avalon.scan();
        vm.getTags(article_id);
        vm.service();
        vm_knowledges.buildKnowledges();

        var tipDialog = function(obj, text, url){
            var top = $(obj).position().top + 20;
            var left = $(obj).position().left + 10;
		    obj.append('<span class="tips-box" style="position:absloute;left:'+left+'px;top:'+top+'px;"><span class="tips-inner" style="font-size:12px;"><strong>名词解释：</strong>'+text+'<a href="'+url+'" class="i-more"></a></span><i>&nbsp;</i></span>')
	    };

		$('.kpc_stub').mouseenter(function(){
			if($(this).find('.tips-box').length){
				return;
			}
			var dv = $(this).attr("class");
            if (/kpc_(\d+)/.test(dv)) {
                dv = RegExp.$1;
                var desc = "";
                if (know_maps[dv]) {
			        desc = know_maps[dv].desc;
			        if (!desc) {
			            desc = $(this).html();
			        }
			    }
			    var _this = this;
                new tipDialog($(this), desc, "/video/" + know_maps[dv].video);
			}
		});

		$('.kpc_stub').mouseleave(function(){
			var _this = $(this);
			if($(this).find('.tips-box').length){
				setTimeout(function(){
					_this.find('.tips-box').remove();
				}, 500);
			}
		});

		$(window).scroll(function(){
		    var active_index = 0;
		    var v_height = 0;
		    $(".tips-list").each(function(){
		        var c_top = $(window).scrollTop();
		        var d_top = $(this).offset().top;
		        v_height = c_top - d_top;
		        if (v_height < 100) {
		            return;
		        }
		        active_index++;
		    });
            avalon.vmodels["article_knowledge"].go2Knowledge2(active_index);
		});

		$(".article-conts p").each(function(){
		    $(this).removeAttr("style");
		});
    };

	return article;
});