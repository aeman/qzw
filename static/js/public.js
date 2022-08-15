$(function() {
    $("body").delegate(".allCollection", "click", function(){
        //alert($.session.get('user_id'));
        //if (typeof $.session.get("user_id") != "undefined") {
            $(this).toggleClass('allCollectionOver');
        //} else {
        //    $('.hdLoginOn a').click();
        //}
    });

    $("body").delegate(".allAttention", "click", function(){
      $(this).toggleClass('allAttentionOver');
    });
});