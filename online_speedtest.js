(function () {
    'use strict';

    var tpl;
    var xhr;
    var graph = [];
    var prevCtrl;
    var tout;
    var running = false;

    function proxyLink(link, proxy, proxy_enc, enc) {
        if (link && proxy) {
            if (proxy_enc == null) proxy_enc = '';
            if (enc == null) enc = 'enc';
            if (enc === 'enc') {
                var pos = link.indexOf('/');
                if (pos !== -1 && link.charAt(pos + 1) === '/') pos++;
                var part1 = pos !== -1 ? link.substring(0, pos + 1) : '';
                var part2 = pos !== -1 ? link.substring(pos + 1) : link;
                return proxy + 'enc/' + encodeURIComponent(btoa(proxy_enc + part1)) + '/' + part2;
            }
            if (enc === 'enc1') {
                var _pos = link.lastIndexOf('/');
                var _part = _pos !== -1 ? link.substring(0, _pos + 1) : '';
                var _part2 = _pos !== -1 ? link.substring(_pos + 1) : link;
                return proxy + 'enc1/' + encodeURIComponent(btoa(proxy_enc + _part)) + '/' + _part2;
            }
            if (enc === 'enc2') {
                var posEnd = link.lastIndexOf('?');
                var posStart = link.lastIndexOf('://');
                if (posEnd === -1 || posEnd <= posStart) posEnd = link.length;
                if (posStart === -1) posStart = -3;
                var name = link.substring(posStart + 3, posEnd);
                posStart = name.lastIndexOf('/');
                name = posStart !== -1 ? name.substring(posStart + 1) : '';
                return proxy + 'enc2/' + encodeURIComponent(btoa(proxy_enc + link)) + '/' + name;
            }
            return proxy + proxy_enc + link;
        }
        return link;
    }

    function proxy(name) {
        var param_ip = '';
        var proxy1 = new Date().getHours() % 2 ? 'https://cors.nb557.workers.dev:8443/' : 'https://cors.fx666.workers.dev:8443/';
        var proxy2 = (window.location.protocol === 'https:' ? 'https://' : 'http://') + 'iqslgbok.deploy.cx/';
        var proxy3 = 'https://cors557.deno.dev/';
        var proxy_other = Lampa.Storage.field('online_mod_proxy_other') === true;
        var proxy_other_url = proxy_other ? Lampa.Storage.field('online_mod_proxy_other_url') + '' : '';
        var user_proxy1 = (proxy_other_url || proxy1) + param_ip;
        var user_proxy2 = (proxy_other_url || proxy2) + param_ip;
        var user_proxy3 = (proxy_other_url || proxy3) + param_ip;

        if (name === 'filmix_site') return user_proxy1;
        if (name === 'filmix_abuse') return window.location.protocol === 'https:' ? 'https://cors.apn.monster/' : 'http://cors.cfhttp.top/';
        if (name === 'zetflix') return user_proxy1;
        if (name === 'allohacdn') return user_proxy1;
        if (name === 'cookie') return user_proxy1;
        if (name === 'cookie2') return user_proxy2;
        if (name === 'cookie3') return user_proxy3;
        if (name === 'ip') return proxy2;

        if (Lampa.Storage.field('online_mod_proxy_' + name) === true) {
            if (name === 'iframe') return user_proxy2;
            if (name === 'lumex') return user_proxy1;
            if (name === 'rezka') return user_proxy2;
            if (name === 'rezka2') return user_proxy2;
            if (name === 'kinobase') return user_proxy1;
            if (name === 'collaps') return user_proxy1;
            if (name === 'cdnmovies') return user_proxy1;
            if (name === 'filmix') return user_proxy1;
            if (name === 'videodb') return user_proxy2;
            if (name === 'fancdn') return user_proxy3;
            if (name === 'fancdn2') return user_proxy3;
            if (name === 'fanserials') return user_proxy2;
            if (name === 'videoseed') return user_proxy1;
            if (name === 'vibix') return user_proxy2;
            if (name === 'redheadsound') return user_proxy2;
            if (name === 'anilibria') return user_proxy2;
            if (name === 'anilibria2') return user_proxy2;
            if (name === 'animelib') return user_proxy1;
            if (name === 'kodik') return user_proxy2;
            if (name === 'kinopub') return user_proxy2;
        }

        return '';
    }
    function speed2deg(v) {
        v = parseFloat(v);
        return v >= 1000 ? 200 : v < 20 ? v * 4 : v < 30 ? (v - 20) * 2 + 80 : v < 60 ? (v - 30) / 1.5 + 100 : v < 100 ? (v - 60) / 2 + 120 : v < 200 ? (v - 100) / 5 + 140 : v < 500 ? (v - 200) / 15 + 160 : (v - 500) / 25 + 180;
    }

    function hslToRgb(hue, sat, light) {
        hue = hue % 360, hue += hue < 0 ? hue += 360 : 0, sat /= 100, light /= 100;
        function f(n) {
            var k = (n + hue / 30) % 12;
            var a = sat * Math.min(light, 1 - light);
            return parseInt((light - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))) * 255);
        }
        return "#" + ((1 << 24) + (f(0) << 16) + (f(8) << 8) + f(4)).toString(16).slice(1);
    }

    function setSpeed(v) {
        v = parseFloat(v);
        tpl.find('#speedtest_num').innerHTML = v < 1 ? v.toFixed(3) : v < 10 ? v.toFixed(2) : v < 100 ? v.toFixed(1) : Math.round(v);
        var r = speed2deg(v);
        var b = tpl.find('#speedtest_progress');
        var l = 1256.8;
        b.style['stroke-dasharray'] = l * r / 360 + ',' + l;
        b.style.stroke = hslToRgb(330 + r, 80, 45);
        tpl.find('#speedtest_graph').setAttribute('points', graph.map(function (pt) {
            return pt.join(',');
        }).join(' '));
    }

    function close() {
        if (xhr) xhr.abort();
        clearTimeout(tout);
        if (tpl) tpl.remove();
        tpl = false;
        xhr = false;
        graph = [];
        if (prevCtrl) Lampa.Controller.toggle(prevCtrl);
    }

    function toggle() {
        Lampa.Controller.add('drxaos_speedtest', {
            toggle: function toggle() {
                Lampa.Controller.clear();
            },
            back: close
        });
        Lampa.Controller.toggle('drxaos_speedtest');
    }

    function buildTestUrl(data) {
        if (data && data.url) return data.url;
        var base = 'https://speed.cloudflare.com/__down?bytes=20000000';
        try {
            var prox = proxy(data && data.balancer);
            if (data && data.component && data.component.proxyLink) {
                var viaComponent = data.component.proxyLink(base, prox, '', 'enc2');
                if (viaComponent) return viaComponent;
            }
            if (prox) return proxyLink(base, prox, '', 'enc2');
        } catch (e) {}
        return base;
    }

    function run(url, onEnd, startedAt) {
        startedAt = startedAt || Date.now();
        var status = tpl.find('#speedtest_status');
        var time;
        var speedMbps = 0;
        if (!graph.length) graph = [[-250, -250]];
        setSpeed(speedMbps);
        status.innerHTML = Lampa.Lang.translate('speedtest_connect');
        xhr = new XMLHttpRequest();
        xhr.open('GET', Lampa.Utils.addUrlComponent(url, 'vr=' + Date.now()), true);
        xhr.responseType = 'arraybuffer';
        xhr.onprogress = function (e) {
            if (!time || time === true) return;
            var load = e.timeStamp - time;
            var speed = Math.ceil(e.loaded * 8000 / load);
            speedMbps = speed / 1000 / 1000;
            var x = Math.max(Math.min(load, 1e4) * 500 / 1e4, Math.min(e.loaded, 3e8) * 500 / 3e8) - 250;
            var y = -(speed2deg(speedMbps) / 4 + 250);
            graph.push([x.toFixed(1), y.toFixed(1)]);
            setSpeed(speedMbps);
            if (e.loaded > 3e8) xhr.abort();
        };
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState === 2) {
                time = e.timeStamp;
                status.innerHTML = Lampa.Lang.translate('speedtest_test');
                tout = setTimeout(function () {
                    xhr.abort();
                }, 15e3);
            }
        };
        var endTest = function endTest() {
            clearTimeout(tout);
            setSpeed(speedMbps);
            var elapsed = Date.now() - startedAt;
            if (elapsed < 10000) {
                status.innerHTML = Lampa.Lang.translate('speedtest_test');
                run(url, onEnd, startedAt);
                return;
            }
            status.innerHTML = Lampa.Lang.translate('speedtest_ready');
            time = false;
            if (onEnd) onEnd(speedMbps);
        };
        xhr.onload = endTest;
        xhr.onabort = endTest;
        xhr.onerror = endTest;
        xhr.send();
    }

    function buildBack() {
        if (typeof HeadBackward === 'function') return HeadBackward('', true);
        var back = document.createElement('div');
        back.className = 'head-backward selector';
        back.innerHTML = '<div class="head-backward__button"><svg><use xlink:href="#sprite-backward"></use></svg></div><div class="head-backward__title"></div>';
        back.addEventListener('click', close);
        return back;
    }

    function start(data) {
        if (running) {
            return Lampa && Lampa.Noty ? Lampa.Noty.show('Speedtest already running') : null;
        }
        try {
            if (tpl) tpl.remove();
            prevCtrl = Lampa.Controller.enabled().name;
            tpl = Lampa.Template.js('speedtest');
            if (!tpl) {
                running = false;
                if (Lampa && Lampa.Noty) Lampa.Noty.show('Speedtest template missing');
                return;
            }
            tpl.append(buildBack());
            document.body.append(tpl);
            Array.from(tpl.querySelectorAll('textpath')).forEach(function (element) {
                element.html(element.getAttribute('data-text'));
            });
            tpl.find('#speedtest_num-text').html('Mbps');
            toggle();
            running = true;
            run(buildTestUrl(data), function (speed) {
                Lampa.Noty.show((speed || 0).toFixed(1) + ' Mbps');
                running = false;
            });
        } catch (e) {
            console.log('Speedtest', e);
            if (tpl) tpl.remove();
            running = false;
        }
    }

    function injectIntoSelect() {
        if (!window.Lampa || !Lampa.Select || Lampa.__drxaos_speedtest_patched) return;
        Lampa.__drxaos_speedtest_patched = true;
        var originalShow = Lampa.Select.show;

        function showTargets(resolveStreamUrl) {
            return new Promise(function (resolve) {
                var items = [{
                    title: 'Текущий поток (балансер)',
                    target: 'stream'
                }, {
                    title: 'Cloudflare 20MB',
                    url: 'https://speed.cloudflare.com/__down?bytes=20000000'
                }, {
                    title: 'Hetzner 100MB (DE)',
                    url: 'https://speed.hetzner.de/100MB.bin'
                }, {
                    title: 'Leaseweb 100MB (NL)',
                    url: 'http://mirror.nl.leaseweb.net/speedtest/100mb.bin'
                }, {
                    title: 'Online.net 100MB (FR)',
                    url: 'http://speedtest.online.net/100M.iso'
                }];

                Lampa.Select.show({
                    title: 'Speed Test Endpoint',
                    items: items,
                    onBack: function onBack() {
                        resolve(null);
                    },
                    onSelect: function onSelect(item) {
                        if (item && item.target === 'stream') {
                            resolveStreamUrl().then(function (url) {
                                resolve(url || null);
                            });
                        } else if (item && item.url) {
                            resolve(item.url);
                        } else {
                            resolve(null);
                        }
                    }
                });
            });
        }
        Lampa.Select.show = function (params) {
            try {
                if (params && params.title && params.title === Lampa.Lang.translate('title_action')) {
                    params.items = params.items || [];
                    var already = params.items.some(function (i) {
                        return i && i.speedtest;
                    });
                    if (!already) {
                        params.items.unshift({
                            title: 'SPEED TEST',
                            speedtest: true
                        });
                    }
                    var origSelect = params.onSelect;

                    function resolveStreamUrl() {
                        return new Promise(function (resolve) {
                            var restored = false;
                            var captured;
                            var originalCopy = Lampa.Utils.copyTextToClipboard;
                            var originalSelect = Lampa.Select.show;

                            function restore() {
                                if (restored) return;
                                restored = true;
                                Lampa.Utils.copyTextToClipboard = originalCopy;
                                Lampa.Select.show = originalSelect;
                            }

                            Lampa.Utils.copyTextToClipboard = function (text, ok, fail) {
                                captured = text;
                                if (ok) ok();
                                resolve(captured);
                                restore();
                                return true;
                            };

                            Lampa.Select.show = function (opt) {
                                try {
                                    if (opt && opt.items && opt.items.length && opt.onSelect) {
                                        opt.onSelect(opt.items[0]);
                                        resolve(captured || (opt.items[0] && (opt.items[0].file || opt.items[0].url || opt.items[0].link)));
                                        restore();
                                        return;
                                    }
                                } catch (e) {
                                    console.log('Speedtest quality pick error', e);
                                }
                                return originalSelect.call(Lampa.Select, opt);
                            };

                            try {
                                if (origSelect) origSelect({
                                    copylink: true
                                });
                            } catch (e) {
                                console.log('Speedtest copylink error', e);
                                resolve(captured);
                                restore();
                            }

                            setTimeout(function () {
                                resolve(captured);
                                restore();
                            }, 1500);
                        });
                    }

                    params.onSelect = function (a) {
                        if (a && a.speedtest) {
                            try {
                                var balancer = (Lampa.Storage.get('online_mod_balanser') || Lampa.Storage.get('online_balanser') || 'vibix') + '';
                                showTargets(resolveStreamUrl).then(function (targetUrl) {
                                    start({
                                        balancer: balancer,
                                        url: targetUrl
                                    });
                                });
                            } catch (e) {
                                if (Lampa && Lampa.Noty) Lampa.Noty.show('Speedtest error');
                                console.log('Speedtest run error', e);
                            }
                            return;
                        }
                        if (origSelect) origSelect(a);
                    };
                }
            } catch (e) {
                console.log('Speedtest Select patch error', e);
            }
            return originalShow.call(Lampa.Select, params);
        };
    }

    function waitAndPatch() {
        injectIntoSelect();
        if (!Lampa.__drxaos_speedtest_patched) {
            setTimeout(waitAndPatch, 500);
        }
    }

    waitAndPatch();

    window.DRXAOS_SPEEDTEST_START = start;
})();

