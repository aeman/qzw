avalon.config({debug: false, interpolate: ["{-", "-}"]});
    require.config({
        baseUrl: "/static/js",
        paths: {
            jquery: "jquery-1.11.2.min",
            avalon: "avalon.min",
            common: "common",
            semantic: "../semantic",
            course: "course"
        },
        shim: {
            jquery: {
                exports: "jquery"
            },
            common: {
                deps:["jquery"]
            },
            course: {
                deps: ["jquery"]
            }
        }
    });

    var vm = avalon.define({
        $id: "articlelist",
		categories: {},
		$init: function() {
		    var self = this;
		    var url = "./get_categories";
		    var hrefs = location.href.split("/");
		    if (hrefs.length == 7) url = "." + url;
            jQuery.get(url, function(data) {
                for (var i = 0, j = data.length; i < j; i++) {
                    var item = data[i];
                    $("#td" + [item.id]).text(item.class_name);
                }
            });
		},
		searchText: "",
		search: function() {
            if (vm.searchText == "") {
                location.href="/article/list";
                return;
            }
//           // vm.searchText = vm.searchText.replace(/【.*?】/g, "");
            location.href = "/article/list/1/" + vm.searchText;// + encodeURI(vm.searchText);
		},
		deleteItem: function(id){
		    $('.del-layer').css({
			    'display':'block',
		    });
		    $(".layer-red-btn").click(function(){
                location.href = "/article/delete/" + id;
		    });
		}
    });

    window.vm = vm;

    require(["jquery", "avalon", "common", "course", "domReady!"], function($, avalon){
    	avalon.scan();
    	vm.$init();
    	$(".cancel").click(function(){
    	    $('.del-layer').css({
			    'display':'none',
		    });
    	});
    });