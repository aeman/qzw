avalon.config({debug: false, interpolate: ["{-", "-}"] });
require.config({
    baseUrl: "/static/js",
    paths: {
        jquery: "jquery-1.11.2.min",
        avalon: "avalon.min",
        common: "common",
        waterfall: "article/waterfall"
    },
    shim: {
        jquery: {
            exports: "jQuery"
        },
        common: {
            deps:["jquery"]
        },
        waterfall: {
            deps:["jquery"]
        }
    }
});

require(["jquery", "avalon", "waterfall", "domReady!"], function($, avalon, waterfall){
    $("body").delegate(".allCollection", "click", function(){
        $(this).toggleClass('allCollectionOver');
    });

    $("body").delegate(".allAttention", "click", function(){
        $(this).toggleClass('allAttentionOver');
    });
});