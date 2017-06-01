(function(window, document, undefined) {

    var c = document.getElementById('canv');
    var $ = c.getContext('2d');

    var body = document.body,
        html = document.documentElement;


    c.width = Math.max(document.getElementById('emotions').scrollWidth, document.getElementById('emotions').offsetWidth, document.getElementById('emotions').clientWidth, document.getElementById('emotions').scrollWidth, document.getElementById('emotions').offsetWidth);
    c.height = Math.max(document.getElementById('emotions').scrollHeight, document.getElementById('emotions').offsetHeight, document.getElementById('emotions').clientHeight, document.getElementById('emotions').scrollHeight, document.getElementById('emotions').offsetHeight);


    var arr = [];
    var fin = 0;
    var stheta = -1.0;
    var t = 0;

    function text() {
        var txt = 'Pride & Prejudice'.split('').join(String.fromCharCode(0x2004));
        $.font = '6vw PT Sans Narrow';
        $.fillStyle = 'hsla(0, 5%, 35%, 1)';
        $.fillText(txt, (c.width - $.measureText(txt).width) * 0.5, c.height * 0.9);
        return txt;
    }

    function obj() {
        this.x = 0;
        this.y = 0;
    }

    function twirl() {
        this.px = 0.0;
        this.py = 0.0;
        this.vel = new obj();
        this.vel.x = 3.5;
        this.vel.y = 3.5;
        this.dv = 0.98;
        this.dt = 0.095;
        this.time = 0;
        this.len = 12;
        this.nxt = this.time + this.len;
        this.prime = 0;
        this.a = 0;
        this.b = 0.95;
        this._c = 0;
        this.subs = 0;
    }

    function rot(obj, cos, sin) {
        var _mv = obj.x * cos - obj.y * sin;
        obj.y = obj.x * sin + obj.y * cos;
        obj.x = _mv;
    }

    function mv(obj, theta) {
        var cos = Math.cos(theta);
        var sin = Math.sin(theta);
        rot(obj, cos, sin);
    }

    function add() {
        var twl = new twirl();
        arr[fin] = twl;
        fin += 1;
        return twl;
    }

    function build(prime) {
        var sub = add();
        sub.px = prime.px;
        sub.py = prime.py;
        sub.vel.x = prime.vel.x * 0.95;
        sub.vel.y = prime.vel.y * 0.95;
        sub.dv = prime.dv * 0.998;
        sub.dt = prime.dt * stheta;
        sub.prime = prime;
        sub.a = 0.0;
        sub._c = prime._c + 1;
        prime.subs += 1;
        prime.nxt = prime.time + prime.len;
    }

    function draw(twl) {
        $.beginPath();
        $.moveTo(twl.px, twl.py);
        var minSp = 0.8;
        var _minSp = minSp * minSp;
        while ((twl.vel.x * twl.vel.x) +
            (twl.vel.y * twl.vel.y) > _minSp) {
            if (twl.time >= twl.nxt) {
                if (twl._c < 8) {
                    build(twl);
                }
            }
            twl.px += twl.vel.x;
            twl.py += twl.vel.y;
            $.lineTo(twl.px, twl.py);
            var dt = twl.dt;
            var dv = twl.dv;
            if (twl.prime !== 0) {
                var pfInv = 1 - twl.a;
                twl.vel.x = twl.prime.vel.x * twl.a +
                    twl.vel.x * pfInv;
                twl.vel.y = twl.prime.vel.y * twl.a +
                    twl.vel.y * pfInv;
                twl.a *= twl.b;
            }
            twl.vel.x *= dv;
            twl.vel.y *= dv;
            mv(twl.vel, -dt);
            twl.time += 1;
        }
        $.stroke();
    }

    var tmin = -0.12;
    var tmax = 0.18;
    var _theta = tmin;

    function go() {
        t += 1;
        $.fillStyle = 'hsla(0, 5%, 95%, .5)';
        $.fillRect(0, 0, c.width, c.height);
        $.strokeStyle = 'hsla(0, 5%, 35%, 1)';

        fin = 0;
        swirl();
        stheta = rng(Math.cos(t / 100 + 0.2), -2, -0.6);
        _theta = rng(Math.cos(t / 83), tmax, tmin);
        for (var n = 0; n < fin; ++n) {
            var twl = arr[n];
            draw(twl);
        }
    }

    function swirl() {
        var twl = add();
        twl.px = c.width / 2;
        twl.py = c.height / 2;

        twl.vel.x = 0;
        twl.vel.y = -6.5;

        mv(twl.vel, t / -200);

        twl.dt = _theta;

        var sub2 = add();
        sub2.px = twl.px;
        sub2.py = twl.py;
        sub2.vel.x = twl.vel.x * -1;
        sub2.vel.y = twl.vel.y * -1;
        sub2.dt = twl.dt;
    }

    function rng(n, min, max) {
        return (n * 0.65 + 0.65) * (max - min) + min;
    }

    window.addEventListener('resize', function() {
        var body = document.body,
            html = document.documentElement;

        c.width = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);
        c.height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    }, false);

    function run() {
        window.requestAnimationFrame(run);
        go();
        text();
    }
    run();

})(window, document);