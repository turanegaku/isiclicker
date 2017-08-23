// phina.js をグローバル領域に展開
phina.globalize();

var ASSETS = {
    image: {
        'isi': './resources/012.png',
        'char': 'http://i0.wp.com/fate.appbako.com/wp-content/uploads/2016/04/WdO4nmp.jpg?resize=546%2C1024',
    },
    spritesheet: {
        "ss": {
            frame: {
                'width': 546/10,
                'height': 1024/11,
                'cols': 10,
                'rows': 11,
            },
            "animations": {
                "stay": {
                    frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                    next: 'stay',
                    frequency: '1000000000000',
                }
            }
        },
    },
}

// MainScene クラスを定義
phina.define('MainScene', {
    superClass: 'CanvasScene',
    init: function() {
        this.superInit();
        // 背景色を指定
        this.backgroundColor = '#444';
        var self = this;

        // var cir =  CircleShape().addChildTo(this);
        // cir.x = this.gridX.center();
        // cir.y = this.gridY.center();
        // cir.fill = '#ffaaaa'
        // cir.radius = 100;

        quartz = 0;

        var l1 = Label(quartz).addChildTo(this);
        var l2 = Label('SAINT QUARTZ').addChildTo(this);

        function updateQuartz(d) {
            quartz += d;
            l1.text = quartz;
        }


        l1.x = this.gridX.center() - 120;
        l1.y = 100;
        l1.fill = 'white';
        l1.align = 'right';
        l2.x = this.gridX.center() - 100;
        l2.y = 100;
        l2.fill = 'white';
        l2.align = 'left';

        var g = Sprite('isi').addChildTo(this);
        g.x = this.gridX.center();
        g.y = this.gridY.center();
        g.width  = 250;
        g.height = 250;
        g.t = 0;
        g.touch = false;
        g.setInteractive(true);
        g.update = () => {
            if (g.touch) {
                if (g.t > -5) {
                    g.t--;
                }
            } else {
                if (g.t < 0) {
                    g.t++;
                }
            }

            g.scaleX = 1 + g.t / 20;
            g.scaleY = 1 + g.t / 20;
        };
        g.onpointstart = (e) => {
            g.touch = true;
        };
        g.onpointend = (e) => {
            g.touch = false;

            var gg = Sprite('isi').addChildTo(this);
            gg.x = e.pointer.position.x;
            gg.y = e.pointer.position.y;
            gg.width  = 50;
            gg.height = 50;
            gg.vx = (Math.random() - 0.5) * 5;
            gg.vy = -16 + (Math.random() * 3);
            gg.update = () => {
                gg.vy += 0.98;
                gg.x += gg.vx;
                gg.y += gg.vy;

                if (gg.y > 1800) {
                    this.removeChild(gg);
                }
            };
            var ll = Label('+1').addChildTo(this);
            ll.x = e.pointer.position.x;
            ll.y = e.pointer.position.y;
            ll.fill = 'red';
            ll.fontSize = 50;
            ll.t = 0;
            ll.update = () => {
                ll.y-=3;
                if (ll.t++ > 30) {
                    this.removeChild(ll);
                }
            };

            updateQuartz(1);
        };
        {
            var r = RectangleShape().addChildTo(this);
            r.x = this.gridX.center();
            r.y = this.gridY.center() + this.gridY.width / 2 - 200;
            r.width = 200;
            var t = Label("聖晶石召喚").addChildTo(r);
            r.setInteractive(true);
            r.update = () => {
                if (quartz >= 3) {
                    r.fill = '#fedfff';
                    t.fill = '#000';
                } else {
                    r.fill = '#556677';
                    t.fill = '#555';
                }
            };
            r.onpointstart = () => {
                if (quartz >= 3) {
                    updateQuartz(-3);
                    var i = Math.ceil(Math.random() * 10);
                    var c = Sprite('char', 54, 93).addChildTo(this);
                    var a = FrameAnimation("ss").attachTo(c);
                    a.currentFrameIndex = i;
                    a.gotoAndStop('stay');
                    a.currentFrameIndex = i;
                    a._updateFrame();
                    c.x = r.x;
                    c.y = r.y;
                    c.scaleX = 2;
                    c.scaleY = 2;
                    c.vy = Math.random() * -20 - 10;
                    c.vx = (Math.random() - 0.5) * 5;
                    c.done = false;
                    c.update = () => {
                        c.x += c.vx;
                        c.y += c.vy;
                        if (c.y < -100){
                            this.removeChild(c);
                        }
                    };
                    // if (!c.done && Math.abs(self.gridX.center() - c.x) < 5 && Math.abs(self.gridY.center() - c.y)) {
                    //     updateQuartz(Math.ceil(quartz * Math.random() + 10));
                    //     l1.text = quartz;
                    //     c.done = true;
                    // }
                }
            }
        }
    },
});

// メイン処理
phina.main(function() {
    // アプリケーション生成
    var app = GameApp({
        startLabel: 'main', // メインシーンから開始する
        assets: ASSETS,
    });
    // アプリケーション実行
    app.run();
});
