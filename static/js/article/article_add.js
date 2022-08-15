require.config({
    baseUrl: "/static/js",
    paths: {
        jquery: "jquery-1.11.2.min",
        avalon: "avalon.min",
        common: "common",
        semantic: "../semantic",
        course: "course",
        kindeditor: "ke/kindeditor-min",
        kezhCN: "ke/ke.zh_CN",
        jform: "jquery.form",
        article: "article/article_add"
    },
    shim: {
        jquery: {
            exports: "jQuery"
        },
       kindeditor: {
            exports: "KindEditor"
        },
        kezhCN: {
            exports: "KindEditor"
        },
        common: {
            deps:["jquery"]
        },
        course: {
            deps: ["jquery"]
        },
        semantic : {
            exports: "jQuery",
            deps: ["jquery"]
        },
        jform: {
            exports: "jQuery",
            deps: ["jquery", "common"]
        }
    }
});

avalon.config({debug: false, interpolate: ["{-", "-}"]});
var vm = avalon.define({
    $id: "articleedit",
    content: "",
    editor: null,
    action: "新增",
    categories: [],
    categoryText: "文章分类",
    tags: [],
    isCover: true,
    isUpload: false,
    all_tags: [],
    category: 0,
    article_id: 0,

    submit: function() {
        vm.editor.sync("#editor"); // 同步ke到textarea控件
        if ($.trim($("#title").val()) == "" || $("#editor").val() == "")
            return alert("请将必填项填写完整！");
        var tags = [];
        $(".com-block span").each(function(){
            tags.push($(this).text());
        });
        vm.category = $(".selected").attr("value");
        $("#tagInput").val(tags.join(","));
        jQuery("#article_add").submit();
    },
    getCategories: function() {
        var self = this;
        jQuery.get("/article/get_categories", function(data) {
            self.categories = data;
            for (var i = 0, j = data.length; i < j; i++) {
              var item = data[i];
              if (item.id == self.category) {
                self.categoryText = item.class_name;
                return;
              }
            }
        });
    },
    getTags: function() {
        var self = this;
        jQuery.get("/article/get_tags/" + vm.article_id, function(data) {
            self.tags = data;
        });
    },
    deleteTag: function(el) {
        if (!confirm("您真的要删除标签:" + el.name + "?")) return;
        vm.tags.removeAt(vm.tags.indexOf(el));
    },
    getContent: function() {
        var content = jQuery("#editor").text();
        vm.editor.html("#editor", content); // ke赋值
    },
    getCourses: function() {
        $.get("/article/get_courses", function(data){
            window.kps = data;
        });
    },
    rchange: function(type) {
        vm.isCover = !vm.isCover;
        vm.isUpload = !vm.isUpload;
    },
    $init: function() {
        this.getCategories();
        this.getCourses();
        this.getTags();
        this.getContent();
    }
});

window.vm = vm;

require(["jquery", "kindeditor", "common", "jform", "domReady!"], function($, ke) {
    require(["kezhCN"], function() {
       vm.editor = ke;
       ke.ready(function(K) {
               ke.create('#editor', {
                resizeType : 1,
                allowImageUpload : true,
                allowPreviewEmoticons : false,
                height: 400,
                uploadJson : '/upload_class_picture_article/',
                cssPath: '/static/css/mgr.css',
                items : [
                    'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
                    'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
                    'insertunorderedlist', '|', 'emoticons', 'image', 'link', 'source', '|', 'knowledge']
            });
        });
        $('#btnSelTreePic').click(function () {
            $('input[type=file]').trigger('click');
        });
        $('#picTree').change(function () {
            $("#classPicForm").ajaxSubmit({
                dataType: 'json',
                success: function (data) { //成功
                    if (vm.isCover) {
                        $("#picClass").attr("src", "/static/images/" + data.result);
                        $("#picFileName").val(data.result);
                    } else {
                        $("#picClass2").attr("src", "/static/images/" + data.result);
                        $("#picFileName").val("");
                        $("#pic_path").text("http://" + location.host + "/static/images/" + data.result);
                    }
                }
            });
        });
        vm.$init();
        require(["course", "semantic"], function(){
             $('.ui.dropdown').dropdown();
             window.choiceKP = function(id) {
                if (!window.kps_maps) {
                    window.kps_maps = {};
                    for (var i = 0, j = window.kps.length; i < j; i++) {
                        var item = window.kps[i];
                        window.kps_maps[item.id] = item;
                    }
                }
                var current = window.kps_maps[id];
                if (!current) return;
                current.checked = !current.checked;
                if (current.checked) {
                    $(".kp_class_" + id).removeClass("unselected");
                    $(".kp_class_" + id).addClass("selected");
                    $(".kp_class_" + id + " a").addClass("a_selected");
                 } else {
                    $(".kp_class_" + id).removeClass("selected");
                    $(".kp_class_" + id).addClass("unselected");
                    $(".kp_class_" + id + " a").removeClass("a_selected");
                 }
            };

            window.knowledgeBindSearch = function(id) {
                $("#" + id).keyup(function(){
                    var text = $.trim($("#" + id).val());
                    for (var i = 0, j = window.kps.length; i < j; i++) {
                        var item = window.kps[i];
                        var itemText = item.name;
                        var itemId = item.id;
                        if (itemText.indexOf(text) >= 0) {
                            $(".kp_class_" + itemId).show();
                        } else {
                            $(".kp_class_" + itemId).hide();
                        }
                    }
                });
            };
        });
    });
});