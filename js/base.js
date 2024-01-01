let pcFit = innerWidth > fit;
let tween = gsap.timeline({ defaults: { duration: .8, ease: "ease" } });
let tweenLogo1 = gsap.timeline({ defaults: { duration: .8, ease: "ease" }, repeat: -1 });
let tweenLogo2 = gsap.timeline({ defaults: { duration: .8, ease: "ease" }, repeat: -1 });

function initGsap() {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    ScrollTrigger.normalizeScroll(true)
    return ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        normalizeScroll: true,
        smoothTouch: true
    });
}

function debounceTool(fn, wait) {
    var timeout = null;
    return function () {
        if (timeout !== null)
            clearTimeout(timeout);
        timeout = setTimeout(fn, wait);
    }
}

function throttleTool(func, delay) {
    var prev = Date.now();
    return function () {
        var context = this;
        var args = arguments;
        var now = Date.now();
        if (now - prev >= delay) {
            func.apply(context, args);
            prev = Date.now();
        }
    }
}

function checkSideBtnFn(page, name, idx) {

    page.find('.btnU').removeClass('active');
    page.find('.btnU').attr('data-idx', idx);

    let n = page.find(name).children().eq(idx);

    if (!n.next().length) {
        page.find('.nextB').addClass('active');
    }

    if (!n.prev().length) {
        page.find('.lastB').addClass('active');
    }

    // let i = idx == 2 ? 1 : idx;

    page.find('[click-idx=' + idx + ']').siblings().removeClass('active');
    page.find('[click-idx=' + idx + ']').addClass('active');
}

function getTarget(n, name) {
    if ($(n).parents(name).length) {
        return $(n).parents(name);
    } else if ($(n).parent().find(name).length) {
        return $(n).parent().find(name);
    }

    return false;
}

function evtTab(e) {
    $(e.target).siblings().removeClass('active');
    $(e.target).addClass('active');

    let wrap = $(e.target).attr('data-wrap');
    $(wrap).siblings().removeClass('active');
    $(wrap).addClass('active');
}

function gsapScreen3Opacity() {
    let heightScreen3Side3item = $('.screen3 .side3 .item').height();

    $('.screen3 .side3 .item').each((i, n) => {
        if ($(n).position().top < 0 || $(n).position().top > heightScreen3Side3item * 2.8) {
            gsap.to(n, { opacity: .3 });
        } else {
            gsap.to(n, { opacity: 1 });
        }
    })
}

function gsapHeader() {
    gsap.set('.headerU .navU1', { x: '49.8rem', opacity: 0 });
    gsap.set('.headerU .logo', { opacity: 0 });
    gsap.set('.headerU .navU2', { x: '-49.8rem', opacity: 0 });

    let tween = gsap.timeline({ defaults: { duration: .8, ease: "ease" }, delay: 1.6 });

    tween.to(".headerU .logo", { opacity: 1 })
        .to(".headerU .navU1", { x: 0, opacity: 1 })
        .to(".headerU .navU2", { x: 0, opacity: 1 }, '<');
}

function gsapScreen0() {
    $('body').css('pointer-events', 'none');

    gsap.set('.screen0 .logo', { height: 0 });

    // let tween = gsap.timeline({ defaults: { duration: .8, ease: "ease" } });

    document.documentElement.scrollTop = 0;
    tween.to(".screen0 .logo", { height: 'auto' });
    tween.to(".screen0", {
        opacity: 0, onComplete() {
            $('body').css('pointer-events', 'auto');
            $('.screen0').hide();
        }
    });
}

function gsapScreen1() {
    tween.to(".screen1 .title", { y: 0, opacity: 1 })
        .to(".screen1 .subtitle", { y: 0, opacity: 1 }, '<')
        .to(".screen1 .content", { y: 0, opacity: 1 }, '<')
        .to(".screen1 .boxR", { y: 0, opacity: 1 }, '<')
        .to(".screen1 .gif", { y: 0, opacity: 1 }, '<')
        .to(".screen1 .bgU .dotTL", { y: 0, opacity: 1 }, '<')
        .to(".screen1 .bgU .dotTR", { y: 0, opacity: 1 }, '<')
        .to(".screen1 .bgU .dotB", { y: 0, opacity: 1 }, '<')
        .to(".screen1 .bgU .bg1", { y: 0, opacity: 1 }, '<')
        .to(".screen1 .bgU .trim", { y: 0, opacity: 1 }, '<')
        .to(".screen1 .mouse", { y: 0, opacity: 1 }, '<')
        .to(".screen1 .mouse", { y: '2rem', opacity: .2, duration: 1, repeat: -1, yoyo: true, ease: 'none' });
}

function gsapScreen2() {
    let tween = gsap.timeline({
        defaults: { duration: .8, ease: "ease" },
        scrollTrigger: {
            trigger: ".screen2",
            start: "top bottom",
            end: "top top",
            scrub: 1,
            // markers: true
        }
    });

    tween.to('.screen2 .bgU', { opacity: 1 })
        .to('.screen2 .title', { y: 0, opacity: 1 }, '<')
        .to('.screen2 .title .icon', { y: 0, opacity: 1 }, '<')
        .to('.screen2 .item1', { y: 0, opacity: 1 }, '<')
        .to('.screen2 .item2', { y: 0, opacity: 1 }, '<')
        .to('.screen2 .item3', { y: 0, opacity: 1 }, '<')
        .to('.screen2 .item4', { y: 0, opacity: 1 }, '<');
}

function gsapScreen5() {

    let tween = gsap.timeline({
        defaults: { duration: .8, ease: "ease" },
        scrollTrigger: {
            trigger: ".screen5",
            start: "top bottom",
            end: "top top",
            scrub: 1,
            // markers: true
        }
    });

    tween.to('.screen5 .bgU', { opacity: 1 })
        .to('.screen5 .boxL', { opacity: 1 }, '<')
        .to('.screen5 .title', { y: 0, opacity: 1 }, '<')
        .to('.screen5 .line', { y: 0, opacity: 1 }, '<')
        .to('.screen5 .subtitle', { y: 0, opacity: 1 }, '<')
        .to('.screen5 .gsap1', { y: 0, opacity: 1 }, '<')
        .to('.screen5 .side1', { y: 0, opacity: 1 }, '<')
        .to('.screen5 .side2', { y: 0, opacity: 1 }, '<')
        .to('.screen5 .side3', { y: 0, opacity: 1 }, '<')
        .to('.screen5 .side4', { y: 0, opacity: 1 }, '<')
        .to('.screen5 .side5', { y: 0, opacity: 1 }, '<');
}

function gsapScreen6() {
    let tween = gsap.timeline({
        defaults: { duration: .8, ease: "ease" },
        scrollTrigger: {
            trigger: ".screen6",
            start: "top bottom",
            end: "top top",
            scrub: 1,
            // markers: true
        }
    });

    tween.to('.screen6 .bgU', { opacity: 1 }, '<')
        .to('.screen6 .lineB', { opacity: 1 }, '<')
        .to('.screen6 .gsap1', { y: 0, opacity: 1 }, '<')
        .to('.screen6 .content', { y: 0, opacity: 1 }, '<');

    // let second = 10;
    // gsap.to(".screen6 .side1 img", { x: '100vw', duration: 1, repeat: -1, ease: 'none', yoyo: true, duration: second })
    // gsap.to(".screen6 .side2 img", { x: '-100vw', duration: 1, repeat: -1, ease: 'none', yoyo: true, duration: second }, '<')
    // gsap.to(".screen6 .side3 img", { x: '100vw', duration: 1, repeat: -1, ease: 'none', yoyo: true, duration: second }, '<');
}

function gsapScreen7() {
    let tween = gsap.timeline({
        defaults: { duration: .8, ease: "ease" },
        scrollTrigger: {
            trigger: ".screen7",
            start: "top bottom",
            end: "top top",
            scrub: 1,
            // markers: true
        }
    });

    tween.to('.screen7 .bgU', { opacity: 1 }, '<')
        .to('.screen7 .gsap1', { y: 0, opacity: 1 }, '<')
        .to('.screen7 .title', { y: 0, opacity: 1 }, '<')
        .to('.screen7 .subtitle', { y: 0, opacity: 1 }, '<')
        .to('.screen7 .gsap2', { y: 0, opacity: 1 }, '<')
        .to('.screen7 .boxR', { y: 0, opacity: 1 }, '<')
        .to('.screen7 .boxB', { y: 0, opacity: 1 }, '<');
}

function nextEvent(e) {
    let name = $(this).attr('data-name');
    let idx = parseInt($(this).attr('data-idx')) || 0;

    gsap.to($(name).children().eq(idx), { opacity: 0, zIndex: 0 });

    idx += 1;

    gsap.fromTo($(name).children().eq(idx), { y: 10 + 'rem', opacity: 0 }, { y: 0, opacity: 1, zIndex: 1 });

    checkSideBtnFn($(e.target).parents('.page'), name, idx);
}

function lastEvent(e) {
    let name = $(this).attr('data-name');
    let idx = parseInt($(this).attr('data-idx')) || 0;

    gsap.to($(name).children().eq(idx), { opacity: 0, zIndex: 0 });

    idx -= 1;

    gsap.fromTo($(name).children().eq(idx), { y: 10 + 'rem', opacity: 0 }, { y: 0, opacity: 1, zIndex: 1 });

    checkSideBtnFn($(e.target).parents('.page'), name, idx);
}

function gsapInit() {

    // if (pcFit) {
        gsap.set('.screen2 .bgU', { opacity: 0 });
        gsap.set('.screen5 .bgU', { opacity: 0 });
        gsap.set('.screen6 .bgU', { opacity: 0 });
        gsap.set('.screen7 .bgU', { opacity: 0 });
    // }

    gsap.set('.screen1 .title', { y: '34rem', opacity: 0 });
    gsap.set('.screen1 .subtitle', { y: '38.4rem', opacity: 0 });
    gsap.set('.screen1 .content', { y: '47.6rem', opacity: 0 });
    gsap.set('.screen1 .boxR', { y: '36.7rem', opacity: 0 });
    gsap.set('.screen1 .mouse', { y: '22.8rem', opacity: 0 });
    gsap.set('.screen1 .gif', { y: '29.8rem', opacity: 0 });
    gsap.set('.screen1 .bgU .dotTL', { y: '22rem', opacity: 0 });
    gsap.set('.screen1 .bgU .dotTR', { y: '22rem', opacity: 0 });
    gsap.set('.screen1 .bgU .dotB', { y: '23.85', opacity: 0 });
    gsap.set('.screen1 .bgU .bg1', { y: '43.4rem', opacity: 0 });
    gsap.set('.screen1 .bgU .trim', { y: '21.6rem', opacity: 0 });

    gsap.set('.screen2 .title', { y: '8rem', opacity: 0 });
    gsap.set('.screen2 .title .icon', { y: '25rem', opacity: 0 });
    gsap.set('.screen2 .item1', { y: '30rem', opacity: 0 });
    gsap.set('.screen2 .item2', { y: '59rem', opacity: 0 });
    gsap.set('.screen2 .item3', { y: '46.5rem', opacity: 0 });
    gsap.set('.screen2 .item4', { y: '68.5rem', opacity: 0 });


    gsap.set('.screen5 .boxL', { opacity: 0 });
    gsap.set('.screen5 .title', { y: '8rem', opacity: 0 });
    gsap.set('.screen5 .line', { y: '12rem', opacity: 0 });
    gsap.set('.screen5 .subtitle', { y: '16rem', opacity: 0 });
    gsap.set('.screen5 .gsap1', { y: '20rem', opacity: 0 });
    gsap.set('.screen5 .icon path', { drawSVG: '0% 0%' });
    gsap.set('.screen5 .side1', { y: '8rem', opacity: 0 });
    gsap.set('.screen5 .side2', { y: '24rem', opacity: 0 });
    gsap.set('.screen5 .side3', { y: '24rem', opacity: 0 });
    gsap.set('.screen5 .side4', { y: '40rem', opacity: 0 });
    gsap.set('.screen5 .side5', { y: '24rem', opacity: 0 });

    gsap.set('.screen6 .lineB', { opacity: 0 });
    gsap.set('.screen6 .gsap1', { y: '7.6rem', opacity: 0 });
    gsap.set('.screen6 .content', { y: '10rem', opacity: 0 });

    // gsap.set(".screen6 .side1 img", { x: '-100vw' })
    // gsap.set(".screen6 .side2 img", { x: '100vw' })
    // gsap.set(".screen6 .side3 img", { x: '-100vw' })

    gsap.set('.screen7 .gsap1', { y: '21.8rem', opacity: 0 })
    gsap.set('.screen7 .title', { y: '21.8rem', opacity: 0 })
    gsap.set('.screen7 .subtitle', { y: '21.8rem', opacity: 0 })
    gsap.set('.screen7 .gsap2', { y: '37.3rem', opacity: 0 })
    gsap.set('.screen7 .boxR', { y: '21.8rem', opacity: 0 })
    gsap.set('.screen7 .boxB', { y: '37.3rem', opacity: 0 });

}

function logoInit() {
    tweenLogo1.fromTo('.screen3 .side1 .logo1 .icon1-2', { x: 0, y: 0 }, { x: '15rem', y: '-15.5rem' }, '<')
        .fromTo('.screen3 .side1 .logo1 .icon2-1', { x: 0, y: 0 }, { x: '-15.2rem', y: '15.2rem' }, '<')
        .fromTo('.screen3 .side1 .logo1 .icon2-4', { x: 0, y: 0 }, { x: '35.3rem', y: '5.9rem' }, '<')
        .fromTo('.screen3 .side1 .logo1 .icon3-4', { x: 0, y: 0 }, { x: '21.3rem', y: '-12.6rem' }, '<')
        .fromTo('.screen3 .side1 .logo1 .icon4-2', { x: 0, y: 0 }, { x: '-35.5rem', y: '-6.3rem' }, '<')
        .fromTo('.screen3 .side1 .logo1 .icon4-3', { x: 0, y: 0 }, { x: '-17.1rem', y: '9.9rem' }, '<')
        .fromTo('.screen3 .side1 .logo1 .icon-o', { opacity: .1 }, { opacity: 1 })
        .fromTo('.screen3 .side1 .logo1 .icon1-4', { x: 0, y: 0 }, { x: '58.9rem', y: '-15.5rem' })
        .fromTo('.screen3 .side1 .logo1 .icon2-3-1', { x: 0, y: 0 }, { x: '12.2rem', y: '22rem' }, '<')
        .fromTo('.screen3 .side1 .logo1 .icon2-3-2', { x: 0, y: 0 }, { x: '12.4rem', y: '21.5rem' }, '<')
        .fromTo('.screen3 .side1 .logo1 .icon3-2', { x: 0, y: 0 }, { x: '-13.4rem', y: '-22.8rem' }, '<')
        .fromTo('.screen3 .side1 .logo1 .icon4-1', { x: 0, y: 0 }, { x: '-60.1rem', y: '16.1rem' }, '<');

    tweenLogo2.fromTo('.screen3 .side1 .logo2 .icon1-2', { x: 0, y: 0 }, { x: '16.5rem', y: '-16.5rem' })
        .fromTo('.screen3 .side1 .logo2 .icon1-3', { x: 0, y: 0 }, { x: '23rem', y: '6rem' }, '<')
        .fromTo('.screen3 .side1 .logo2 .icon1-4', { x: 0, y: 0 }, { x: '55.5rem', y: '-15.3rem' }, '<')
        .fromTo('.screen3 .side1 .logo2 .icon2-1', { x: 0, y: 0 }, { x: '-16.5rem', y: '16.5rem' }, '<')
        .fromTo('.screen3 .side1 .logo2 .icon3-1-1', { x: 0, y: 0 }, { x: '-20.5rem', y: '-5.5rem' }, '<')
        .fromTo('.screen3 .side1 .logo2 .icon3-1-2', { x: 0, y: 0 }, { x: '-20.5rem', y: '-5.5rem' }, '<')
        .fromTo('.screen3 .side1 .logo2 .icon4-1', { x: 0, y: 0 }, { x: '-55.5rem', y: '15.3rem' }, '<');
}

function initPc() {

    $('.lastB').on('click', lastEvent);
    $('.nextB').on('click', nextEvent);

    $('.screen3 .side3 .list').scroll(gsapScreen3Opacity);
    $('.screen3 .side2 .tabU').on('click', evtTab);
    $('.headerU .navU a').on('click', function () {
        $('.headerU .navU a').removeClass('active');
        $(this).addClass('active');
    });

    $('.screen3 .opts .opt').on('click', function () {
        let idx = $(this).attr('click-idx');

        gsap.to($('#touch-screen3').children(), { opacity: 0, zIndex: 0 });

        gsap.fromTo($('#touch-screen3').children().eq(idx), { y: 10 + 'rem', opacity: 0 }, { y: 0, opacity: 1, zIndex: 1 });

        checkSideBtnFn($('.screen3'), '#touch-screen3', idx);
    });

    new Swiper('#swiper-screen5', {
        slidesPerView: 3,
        spaceBetween: 0,
        slidesPerGroup: 3,
        loop: true,
        loopFillGroupWithBlank: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    gsapScreen3Opacity();
    logoInit();
    gsapInit();
    gsapHeader();
    gsapScreen0();
    gsapScreen1();
    gsapScreen2();
    gsapScreen5();
    gsapScreen6();
    gsapScreen7();
}

function initH5() {
    $('.lastB').on('click', lastEvent);
    $('.nextB').on('click', nextEvent);

    $('#showNavU').on('click', function () { $('#navU').show(); });
    $('#hideNavU').on('click', function () { $('#navU').hide(); });
    $('#navU .nav a').on('click', function () {
        $('#navU').hide();
        let id = $(this).attr('data-id');
        $(document).scrollTop($(id).offset().top);
    });

    $('.screen3 .side3 .list').scroll(gsapScreen3Opacity);

    new Swiper('#swiper-screen3', {
        speed: 500,
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        loop: true,
        pagination: {
            el: '#swiper-screen3 .swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '#swiper-screen3 .swiper-button-next',
            prevEl: '#swiper-screen3 .swiper-button-prev',
        },
    });

    new Swiper('#swiper-screen5', {
        slidesPerView: 1,
        loop: true,
        pagination: {
            el: '#swiper-screen5 .swiper-pagination',
            clickable: true,
        },
    });

    gsapScreen3Opacity();

    analogscroll('#touch-screen7', {
        direction: 'x',
        scrollbar: '#nScrollbar',
        forward: '#nBottomBtn',
        back: '#nTopBtn'
    });

    logoInit();
    gsapInit();
    gsapScreen0();
    gsapScreen1();
    gsapScreen2();
    gsapScreen5();
    gsapScreen6();
    gsapScreen7();
}

function init() {
    if (pcFit) {
        initPc();
    } else {
        initH5();
    }
}

$(document).ready(function () {
    setTimeout(init, 100);
});