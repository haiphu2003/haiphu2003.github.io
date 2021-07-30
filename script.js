$(function() {
    var playerTrack = $("#player-track");
    var bgArtwork = $('#bg-artwork');
    var bgArtworkUrl;
    var albumName = $('#album-name');
    var trackName = $('#track-name');
    var albumArt = $('#album-art'),
        sArea = $('#s-area'),
        seekBar = $('#seek-bar'),
        trackTime = $('#track-time'),
        insTime = $('#ins-time'),
        sHover = $('#s-hover'),
        playPauseButton = $("#play-pause-button"),
        i = playPauseButton.find('i'),
        tProgress = $('#current-time'),
        tTime = $('#track-length'),
        seekT, seekLoc, seekBarPos, cM, ctMinutes, ctSeconds, curMinutes, curSeconds, durMinutes, durSeconds, playProgress, bTime, nTime = 0,
        buffInterval = null,
        tFlag = false;

    var playPreviousTrackButton = $('#play-previous'),
        playNextTrackButton = $('#play-next'),
        currIndex = -1;

    var songs = [{
            artist: "TheFatRat",
            name: "Hiding In The Blue",
            url: "Musics/HidingInTheBlue.mp3",
        },
        {
            artist: "Maggie 麦吉 / 盖盖 Nyan",
            name: "summertime",
            url: "Musics/summertime.mp3",
        },
        {
            artist: "deadman 死人",
            name: "Tiny Little Adiantum Remix",
            url: "Musics/omae.mp3",
        },
        {
            artist: "Tương Tuyết Nhi",
            name: "Yến Vô Hiết",
            url: "Musics/yenvohiet.mp3",
        },
        {
            artist: "PIKASONIC",
            name: "Miss You",
            url: "Musics/missyou.mp3",
        },
        {
            artist: "Kamishiraishi Mone",
            name: "Nandemonaiya",
            url: "Musics/nandemonaiya.mp3",
        },
        {
            artist: "BEAUZ",
            name: "Memories",
            url: "Musics/memories.mp3",

        },
        {
            artist: "Justin Bieber",
            name: "Love Yourself",
            url: "Musics/luvself.mp3",

        },
        {
            artist: "Chihiro",
            name: "Zurui Yo",
            url: "Musics/zuruiyo.mp3",
        },
        {
            artist: "NCS Release",
            name: "Lost Sky",
            url: "Musics/lostsky.mp3",
        },
        {
            artist: "OnePepublic",
            name: "Counting Stars",
            url: "Musics/CountingStars.mp3",
        },
        {
            artist: "Vexento",
            name: "Lonely Dance",
            url: "Musics/lonelydance.mp3",
        },
        {
            artist: "DEAMN",
            name: "SAVE ME",
            url: "Musics/saveme.mp3",
        },
        {
            artist: "Lemon Tree remix",
            name: "DJ DESA Remix",
            url: "Musics/lemontree.mp3"
        },
        {
            artist: "Jai Waetford",
            name: "Shy",
            url: "Musics/shy.mp3"

        },
        {
            artist: "DEAMN",
            name: "Summer Love",
            url: "Musics/summerlove.mp3"

        },
        {
            artist: "FRAD",
            name: "First Date",
            url: "Musics/firstdate.mp3"
        },
        {
            artist: "RSP",
            name: "Sakura Anata ni Deaete Yokatta",
            url: "Musics/Sakura.mp3"
        },
        {
            artist: "Dick x Tofu x PC",
            name: "Ghé Qua",
            url: "Musics/ghequa.mp3"
        },
    ];

    function shuffle(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }
    songs = shuffle(songs);

    function playPause() {
        setTimeout(function() {
            if (audio.paused) {
                playerTrack.addClass('active');
                albumArt.addClass('active');
                checkBuffering();
                i.attr('class', 'fas fa-pause');
                audio.play();
            } else {
                playerTrack.removeClass('active');
                albumArt.removeClass('active');
                clearInterval(buffInterval);
                albumArt.removeClass('buffering');
                i.attr('class', 'fas fa-play');
                audio.pause();
            }
        }, 300);
    }


    function showHover(event) {
        seekBarPos = sArea.offset();
        seekT = event.clientX - seekBarPos.left;
        seekLoc = audio.duration * (seekT / sArea.outerWidth());

        sHover.width(seekT);

        cM = seekLoc / 60;

        ctMinutes = Math.floor(cM);
        ctSeconds = Math.floor(seekLoc - ctMinutes * 60);

        if ((ctMinutes < 0) || (ctSeconds < 0))
            return;

        if ((ctMinutes < 0) || (ctSeconds < 0))
            return;

        if (ctMinutes < 10)
            ctMinutes = '0' + ctMinutes;
        if (ctSeconds < 10)
            ctSeconds = '0' + ctSeconds;

        if (isNaN(ctMinutes) || isNaN(ctSeconds))
            insTime.text('--:--');
        else
            insTime.text(ctMinutes + ':' + ctSeconds);

        insTime.css({ 'left': seekT, 'margin-left': '-21px' }).fadeIn(0);

    }

    function hideHover() {
        sHover.width(0);
        insTime.text('00:00').css({ 'left': '0px', 'margin-left': '0px' }).fadeOut(0);
    }

    function playFromClickedPos() {
        audio.currentTime = seekLoc;
        seekBar.width(seekT);
        hideHover();
    }

    function updateCurrTime() {
        nTime = new Date();
        nTime = nTime.getTime();

        if (!tFlag) {
            tFlag = true;
            trackTime.addClass('active');
        }

        curMinutes = Math.floor(audio.currentTime / 60);
        curSeconds = Math.floor(audio.currentTime - curMinutes * 60);

        durMinutes = Math.floor(audio.duration / 60);
        durSeconds = Math.floor(audio.duration - durMinutes * 60);

        playProgress = (audio.currentTime / audio.duration) * 100;

        if (curMinutes < 10)
            curMinutes = '0' + curMinutes;
        if (curSeconds < 10)
            curSeconds = '0' + curSeconds;

        if (durMinutes < 10)
            durMinutes = '0' + durMinutes;
        if (durSeconds < 10)
            durSeconds = '0' + durSeconds;

        if (isNaN(curMinutes) || isNaN(curSeconds))
            tProgress.text('00:00');
        else
            tProgress.text(curMinutes + ':' + curSeconds);

        if (isNaN(durMinutes) || isNaN(durSeconds))
            tTime.text('00:00');
        else
            tTime.text(durMinutes + ':' + durSeconds);

        if (isNaN(curMinutes) || isNaN(curSeconds) || isNaN(durMinutes) || isNaN(durSeconds))
            trackTime.removeClass('active');
        else
            trackTime.addClass('active');


        seekBar.width(playProgress + '%');

        if (playProgress == 100) {
            i.attr('class', 'fa fa-play');
            seekBar.width(0);
            tProgress.text('00:00');
            albumArt.removeClass('buffering').removeClass('active');
            clearInterval(buffInterval);
            selectTrack(1);
        }
    }

    function checkBuffering() {
        clearInterval(buffInterval);
        buffInterval = setInterval(function() {
            if ((nTime == 0) || (bTime - nTime) > 1000)
                albumArt.addClass('buffering');
            else
                albumArt.removeClass('buffering');

            bTime = new Date();
            bTime = bTime.getTime();

        }, 100);
    }

    function selectTrack(flag) {
        if (flag == 0 || flag == 1)
            ++currIndex;
        else
            --currIndex;

        if ((currIndex > -1) && (currIndex < songs.length)) {
            if (flag == 0)
                i.attr('class', 'fa fa-play');
            else {
                albumArt.removeClass('buffering');
                i.attr('class', 'fa fa-pause');
            }

            seekBar.width(0);
            trackTime.removeClass('active');
            tProgress.text('00:00');
            tTime.text('00:00');

            currAlbum = songs[currIndex].name;
            currTrackName = songs[currIndex].artist;
            currArtwork = songs[currIndex].picture;

            audio.src = songs[currIndex].url;

            nTime = 0;
            bTime = new Date();
            bTime = bTime.getTime();

            if (flag != 0) {
                audio.play();
                playerTrack.addClass('active');
                albumArt.addClass('active');

                clearInterval(buffInterval);
                checkBuffering();
            }

            albumName.text(currAlbum);
            trackName.text(currTrackName);
            $('#album-art img').prop('src', bgArtworkUrl);
        } else {
            if (flag == 0 || flag == 1)
                --currIndex;
            else
                ++currIndex;
        }
    }

    function initPlayer() {
        audio = new Audio();

        selectTrack(0);

        audio.loop = false;

        playPauseButton.on('click', playPause);

        sArea.mousemove(function(event) { showHover(event); });

        sArea.mouseout(hideHover);

        sArea.on('click', playFromClickedPos);

        $(audio).on('timeupdate', updateCurrTime);

        playPreviousTrackButton.on('click', function() { selectTrack(-1); });
        playNextTrackButton.on('click', function() { selectTrack(1); });
    }

    initPlayer();
});


Date.now || (Date.now = function() { return (new Date).getTime() }),
    function() {
        "use strict";
        for (var t = ["webkit", "moz"], e = 0; e < t.length && !window.requestAnimationFrame; ++e) {
            var i = t[e];
            window.requestAnimationFrame = window[i + "RequestAnimationFrame"], window.cancelAnimationFrame = window[i + "CancelAnimationFrame"] || window[i + "CancelRequestAnimationFrame"]
        }
        if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
            var s = 0;
            window.requestAnimationFrame = function(t) {
                var e = Date.now(),
                    i = Math.max(s + 16, e);
                return setTimeout(function() { t(s = i) }, i - e)
            }, window.cancelAnimationFrame = clearTimeout
        }
    }(),
    function(t) {
        t.snowfall = function(e, i) {
            function s(s, n, a, r) {
                this.x = s, this.y = n, this.size = a, this.speed = r, this.step = 0, this.stepSize = h(1, 10) / 100, i.collection && (this.target = m[h(0, m.length - 1)]);
                var p = null;
                i.image ? (p = document.createElement("img"), p.src = i.image) : (p = document.createElement("div"), t(p).css({ background: i.flakeColor })), t(p).attr({ "class": "snowfall-flakes" }).css({ width: this.size, height: this.size, position: i.flakePosition, top: this.y, left: this.x, fontSize: 0, zIndex: i.flakeIndex }), t(e).get(0).tagName === t(document).get(0).tagName ? (t("body").append(t(p)), e = t("body")) : t(e).append(t(p)), this.element = p, this.update = function() {
                    if (this.y += this.speed, this.y > l - (this.size + 6) && this.reset(), this.element.style.top = this.y + "px", this.element.style.left = this.x + "px", this.step += this.stepSize, y === !1 ? this.x += Math.cos(this.step) : this.x += y + Math.cos(this.step), i.collection && this.x > this.target.x && this.x < this.target.width + this.target.x && this.y > this.target.y && this.y < this.target.height + this.target.y) {
                        var t = this.target.element.getContext("2d"),
                            e = this.x - this.target.x,
                            s = this.y - this.target.y,
                            n = this.target.colData;
                        if (void 0 !== n[parseInt(e)][parseInt(s + this.speed + this.size)] || s + this.speed + this.size > this.target.height)
                            if (s + this.speed + this.size > this.target.height) {
                                for (; s + this.speed + this.size > this.target.height && this.speed > 0;) this.speed *= .5;
                                t.fillStyle = o.flakeColor, void 0 == n[parseInt(e)][parseInt(s + this.speed + this.size)] ? (n[parseInt(e)][parseInt(s + this.speed + this.size)] = 1, t.fillRect(e, s + this.speed + this.size, this.size, this.size)) : (n[parseInt(e)][parseInt(s + this.speed)] = 1, t.fillRect(e, s + this.speed, this.size, this.size)), this.reset()
                            } else this.speed = 1, this.stepSize = 0, parseInt(e) + 1 < this.target.width && void 0 == n[parseInt(e) + 1][parseInt(s) + 1] ? this.x++ : parseInt(e) - 1 > 0 && void 0 == n[parseInt(e) - 1][parseInt(s) + 1] ? this.x-- : (t.fillStyle = o.flakeColor, t.fillRect(e, s, this.size, this.size), n[parseInt(e)][parseInt(s)] = 1, this.reset())
                    }(this.x + this.size > d - c || this.x < c) && this.reset()
                }, this.reset = function() { this.y = 0, this.x = h(c, d - c), this.stepSize = h(1, 10) / 100, this.size = h(100 * i.minSize, 100 * i.maxSize) / 100, this.element.style.width = this.size + "px", this.element.style.height = this.size + "px", this.speed = h(i.minSpeed, i.maxSpeed) }
            }

            function n() {
                for (r = 0; r < a.length; r += 1) a[r].update();
                p = requestAnimationFrame(function() { n() })
            }
            var a = [],
                o = { flakeCount: 35, flakeColor: "#ffffff", flakePosition: "absolute", flakeIndex: 999999, minSize: 1, maxSize: 2, minSpeed: 1, maxSpeed: 5, round: !1, shadow: !1, collection: !1, collectionHeight: 40, deviceorientation: !1 },
                i = t.extend(o, i),
                h = function(t, e) { return Math.round(t + Math.random() * (e - t)) };
            t(e).data("snowfall", this);
            var r = 0,
                l = t(e).height(),
                d = t(e).width(),
                c = 0,
                p = 0;
            if (i.collection !== !1) {
                var f = document.createElement("canvas");
                if (f.getContext && f.getContext("2d"))
                    for (var m = [], w = t(i.collection), g = i.collectionHeight, r = 0; r < w.length; r++) {
                        var u = w[r].getBoundingClientRect(),
                            x = t("<canvas/>", { "class": "snowfall-canvas" }),
                            z = [];
                        if (u.top - g > 0) {
                            t("body").append(x), x.css({ position: i.flakePosition, left: u.left + "px", top: u.top - g + "px" }).prop({ width: u.width, height: g });
                            for (var v = 0; v < u.width; v++) z[v] = [];
                            m.push({ element: x.get(0), x: u.left, y: u.top - g, width: u.width, height: g, colData: z })
                        }
                    } else i.collection = !1
            }
            for (t(e).get(0).tagName === t(document).get(0).tagName && (c = 25), t(window).bind("resize", function() { l = t(e)[0].clientHeight, d = t(e)[0].offsetWidth }), r = 0; r < i.flakeCount; r += 1) a.push(new s(h(c, d - c), h(0, l), h(100 * i.minSize, 100 * i.maxSize) / 100, h(i.minSpeed, i.maxSpeed)));
            i.round && t(".snowfall-flakes").css({ "-moz-border-radius": i.maxSize, "-webkit-border-radius": i.maxSize, "border-radius": i.maxSize }), i.shadow && t(".snowfall-flakes").css({ "-moz-box-shadow": "1px 1px 1px #555", "-webkit-box-shadow": "1px 1px 1px #555", "box-shadow": "1px 1px 1px #555" });
            var y = !1;
            i.deviceorientation && t(window).bind("deviceorientation", function(t) { y = .1 * t.originalEvent.gamma }), n(), this.clear = function() { t(".snowfall-canvas").remove(), t(e).children(".snowfall-flakes").remove(), cancelAnimationFrame(p) }
        }, t.fn.snowfall = function(e) {
            return "object" == typeof e || void 0 == e ? this.each(function(i) { new t.snowfall(this, e) }) : "string" == typeof e ? this.each(function(e) {
                var i = t(this).data("snowfall");
                i && i.clear()
            }) : void 0
        }
    }(jQuery);


$(document).ready(function() {
    $(document).snowfall({ image: "https://2.bp.blogspot.com/-APGNG1iE4ZQ/WIw352vHmDI/AAAAAAAAFD0/8NQixpHrraMiAYLe8K6rl6xIDM8KMK_FQCLcB/s1600/hoamaiir1.png", minSize: 10, maxSize: 32, flakeCount: 25 });
    $(document).snowfall({ image: "https://2.bp.blogspot.com/-AeGFS_LrCY4/WIw356deH_I/AAAAAAAAFD4/sZdVVqzycOYebdNZpayY8vnDdttQ_XOPgCLcB/s1600/hoamaiir2.png", minSize: 10, maxSize: 32, flakeCount: 20 });
    $(document).snowfall({ image: "https://1.bp.blogspot.com/-lJHsO_E8EvE/WIw3535QpwI/AAAAAAAAFDw/iVQg750gw2wsGx80dXV9J9Ej8G4Xu47WwCLcB/s1600/hoamaiir3.png", minSize: 10, maxSize: 32, flakeCount: 20 });
});