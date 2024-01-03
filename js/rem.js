var fit = 750;
var fitSize = 10;

// 适配
var fitInit = function () {
    function setRem() {
        var w = document.body.clientWidth;
        var h = document.body.clientHeight;

        let fit_w = w > fit ? 1920 : 375;
        let fit_h = h > 1448 ? 1080 : 724;

        let size_w = (w / fit_w) * 10;
        let size_h = (h / fit_h) * 10;

        // document.documentElement.style.fontSize = Math.min(size_w, size_h) + 'px';
        document.documentElement.style.fontSize = size_w + 'px';

        fitSize = size_w;
        // zoomhtml();
        openPage();
    }
    window.addEventListener('pageshow', setRem);
    window.addEventListener('resize', setRem);
    setRem();
}

// 适配
function zoomhtml() {
    var w = document.body.clientWidth;
    var h = document.body.clientHeight;

    $(".bgU").map((i, n) => {
        var wU = $(n).innerWidth();
        var hU = $(n).innerHeight();

        var wP = w / wU;
        var hP = h / hU;

        $(n).css({
            transform: `translate(-50%, -50%) scaleX(${wP}) scaleY(${hP})`
        });
    });
}

function openPage() {
    let name = innerWidth > fit ? 'index_pc' : 'index_h5';

    if (location.href.indexOf(name) != -1) return;

    let hrefs = location.href.split('/');
    hrefs[hrefs.length - 1] = name + '.html';
    window.location.replace(hrefs.join('/'));
}

// 初始化
$(document).ready(fitInit);

