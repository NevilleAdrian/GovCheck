$(document).ready(function(){
    $('.menu-bar').click(function(){
        $('._openMobileLink').show("slide", {direction: "right"}, 1000);
        $('._openMobileLink a').animate({opacity: "1"}, 2000);
        $('.menu-bar').fadeOut(1);
        $('.close-bar').fadeIn(1000);
        $('body').css('overflow', 'hidden');
    });

    $('.close-bar').click(function(){
        $('._openMobileLink').hide("slide", {direction: "right"}, 1000);
        $('.menu-bar').fadeIn(1000);
        $('.close-bar').fadeOut(1);
        $('body').css('overflow', 'scroll');
    })
});
