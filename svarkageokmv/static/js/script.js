$(function() {
    $('header').css('height', screen.height - parseInt($('nav').css('height')));

    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 500, 'easeInOutExpo');
        event.preventDefault();
    });

    let script;

    if (screen.width > 600) {
        script = '<p style="text-align:center;"><a rel="noreferrer" href="https://yandex.ru/maps/?um=constructor%3Af25d356623a5661a04544d6699da2b22d6cf18890f3cf7f3b214b9de2614f354&amp;source=constructorStatic" target="_blank"><img src="https://api-maps.yandex.ru/services/constructor/1.0/static/?um=constructor%3Af25d356623a5661a04544d6699da2b22d6cf18890f3cf7f3b214b9de2614f354&amp;width=600&amp;height=450&amp;lang=ru_RU" alt="" style="border: 0;"/></a></p>';
    } else {
        var widthmap = screen.width - 30;
        script = '<p style="text-align:center;"><a rel="noreferrer" href="https://yandex.ru/maps/?um=constructor%3Af25d356623a5661a04544d6699da2b22d6cf18890f3cf7f3b214b9de2614f354&amp;source=constructorStatic" target="_blank"><img src="https://api-maps.yandex.ru/services/constructor/1.0/static/?um=constructor%3Af25d356623a5661a04544d6699da2b22d6cf18890f3cf7f3b214b9de2614f354&amp;width=' + widthmap + '&amp;height=450&amp;lang=ru_RU" alt="" style="border: 0;"/></a></p>';
    }

    $('#map').append(script);

    $(window).on('load', function() {
        $('ymaps:first').addClass("yandexmaps");
    });
});

// Highlight the top nav as scrolling occurs
$('body').scrollspy({
    target: '.navbar-fixed-top'
});

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function(e) {
    if (e.toElement.id != 'dropdownMenu1') {
        $('.navbar-toggle:visible').click();
    }
});