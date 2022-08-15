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
            exports: "jQuery"
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
    $id: "knowledgeedit",
    action: "新建",
    videos: [],
    search_results: [],
    showit: false,
    searchText: '',
    currentPg: 1,
    links: [],
    nametips: "0/20",
    desctips: "0/30",
    knowledge_id: 0,
    deleteVideo: function(el) {
        if (!confirm("您真的要删除当前视频吗？")) return;
        vm.videos.remove(el);
    },
    keypress1: function() {
        vm.nametips = ("" + $("#title").val()).length + "/20";
    },
    keypress2: function() {
        vm.desctips = ("" + $("#desc").val()).length + "/20";
    },
    inlineSearch: function(pg){
        vm.search_results.clear();
        vm.currentPg = parseInt(pg);
        $.get("/videos/search2/" + encodeURI(vm.searchText) + "/" + vm.currentPg, function(data){
            for (var i = 1, j = data.length; i < j; i++) {
                var item = {}, org_item = data[i];
                item.id = org_item.pk;
                item.name = org_item.fields.video_name;
                item.video_time = org_item.fields.video_time;
                item.checked = false;
                vm.search_results.push(item);
            }
            vm.links.clear();
            var obj = {};
            var objStr = data[0];
            if (/pageList.*?\[(.*?)\].*?canNext.*?:.*?"(.*?)".*?canPrev.*?:.*?"(.*?)"/.test(objStr)) {
                obj.pageList = RegExp.$1.split(",");
                console.log(RegExp.$3);
                obj.canPrev = RegExp.$3 == "True";
                obj.canNext = RegExp.$2 == "True";
            }
            if (obj["canPrev"]){
                vm.links.push({"lable": "上一页", "pg": vm.currentPg - 1});
            }
            if (obj["pageList"]) {
                for (var i = 0; i < obj.pageList.length; i++) {
                    if (vm.currentPg == parseInt(obj.pageList[i])) {
                        vm.links.push({"lable": obj.pageList[i], "pg": obj.pageList[i], "active": true});
                    } else {
                        vm.links.push({"lable": obj.pageList[i], "pg": obj.pageList[i], "active": false});
                    }
                }
            }
            if (obj["canNext"]){
                vm.links.push({"lable": "下一页", "pg": vm.currentPg + 1});
            }
        });
    },
    search: function() {
        vm.searchText = $.trim($("#searchText").val());
        //if (vm.searchText == "") return;
        vm.inlineSearch(1);
    },
    gopg: function(pg) {
        vm.inlineSearch(pg);
    },
    find: function(id, src) {
        for (var i = 0, j = src.length; i < j; i++) {
            var item = src[i];
            if (item.id == id) return item;
        }
        return null;
    },
    add: function() {
        $(".check_result").each(function(){
            var self = $(this);
            if (self.is(':checked')) {
                var id = self.val();
                var item = vm.find(id, vm.videos);
                if (item) return;
                item = vm.find(id, vm.search_results);
                if (item)
                    vm.videos.push(item);
            }
        });
    },
    clone: function(src) {
        var result = {};
        for (k in src) {
            if (src.hasOwnProperty(k)){
                result[k] = src[k];
            }
        }
        return result;
    },
    up: function(el) {
        var i = vm.videos.indexOf(el);
        if (i > 0) {
            var ls = vm.videos[i - 1];
            var tmp = vm.clone(ls);
            vm.videos.set(i - 1, el);
            vm.videos.set(i, tmp);
        }
    },
    down: function(el) {
        var i = vm.videos.indexOf(el);
        if (i < vm.videos.size() - 1) {
            var ls = vm.videos[i + 1];
            var tmp = vm.clone(ls);
            vm.videos.set(i + 1, el);
            vm.videos.set(i, tmp);
        }
    },
    submit: function() {
        if ($.trim($("#title").val()) == "") {
            return alert("请输入知识点名称");
        }
        var ids = [];
        for (var i = 0; i < vm.videos.length; i++) {
            ids.push(vm.videos[i].id);
        }
        if (ids.length == 0) {
            return alert("知识点应该包含至少一个视频");
        }
        $("#videos").val(ids.join(","));
        $("#knowledgeform").submit();
    },
    key_down: function(event) {
        if (event.key == 13) vm.search();
    },
    $init: function() {
        if (/\/edit/.test(location.href)) {
            this.action = "编辑";
        }
        if (this.action == "编辑") {
            $.get("/knowledge/get_course_videos/" + vm.knowledge_id, function(data){
                vm.videos.pushArray(data);
                vm.showit = true;
            });
        } else {
            vm.showit = true;
        }
    }
});

window.vm = vm;

require(["jquery", "common", "domReady!"], function($) {
    avalon.filters.timefilter = function(src) {
        var secs = parseInt(src);
        var min = secs / 60;
        var sec = secs % 60;
        return (min == 0 ? "0:" : "" + Math.round(min) + ":") + (sec < 10? "0" + sec : sec);
    };
    avalon.scan();
    vm.$init();
});