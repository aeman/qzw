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

var vm = avalon.define(avalon.mix({
        $id: "knowledgelist",
        showit: false,
        search: function() {
            if (vm.searchText == "") {
                location.href="/knowledge/list";
                return;
            }
            vm.searchText = vm.searchText.replace(/【.*?】/g, "");
            location.href = "/knowledge/list/1/" + encodeURI(vm.searchText);
        },
        deleteItem: function(id) {
            if (!confirm("您真的要删除该知识点吗？")) return;
            location.href = "/knowledge/delete/" + id;
        },
    }, window.scope));

window.vm = vm;

require(["jquery", "avalon", "common", "course", "domReady!"], function($, avalon){
    avalon.scan();
    vm.$init(function(){
        $(".videos").each(function(){
            if ($(this).find("li").size() == 0) {
                $(this).css("border", "0px");
            }
        });
    });
    $(".cancel").click(function(){
        $('.del-layer').css({
            'display':'none',
        });
    });
});