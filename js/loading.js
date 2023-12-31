function loading(imgs, cb) {
    const len = imgs.length;
    let num = 0;
    let numLoaded = 0;
    
    const intv = setInterval(() => {
        if (numLoaded >= len) {
            if (cb) {
                cb(100, true);
            }
            clearInterval(intv);
            return;
        }

        if (numLoaded <= num) {
            numLoaded += 1;
            const percent = Math.floor(numLoaded * 100 / len);
            if (cb) {
                cb(percent, false);
            }
        }
    }, 50);

    imgs.forEach((item) => {
        const img = new Image();
        img.onload = () => {
            num += 1;
        };
        img.src = item;
    });
}