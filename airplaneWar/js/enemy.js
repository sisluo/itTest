// 敌方飞机的数据
let enemy = [{
    img: "./images/enemy1.png",
    dieImg: "./images/enemy1b.gif",
    width: 34,
    height: 24,
    blood: 1
}, {
    img: "./images/enemy2.png",
    dieImg: "./images/enemy2b.gif",
    width: 46,
    height: 60,
    blood: 5
}, {
    img: "./images/enemy3.png",
    dieImg: "./images/enemy3b.gif",
    width: 110,
    height: 164,
    blood: 10
}]


// 敌机类
class EnemyPlane {
    // 构造函数, 在new对象的时候会执行里面的代码
    constructor() {
        // 敌机数据
        let emy_data; // { }
        //生成一个随机数 范围是 [0,1)
        let random = Math.random();

        if (random < 0.5) {
            // 0 - 0.5    生成小飞机
            emy_data = enemy[0]
        } else if (random < 0.9) {
            // 0.5 - 0.9  生成中飞机
            emy_data = enemy[1]
        } else {
            // 0.9 - 1    生成大飞机
            emy_data = enemy[2]
        }

        // 根据随机出来的敌机数据，构建敌机对象的属性:

        // 敌机尺寸
        this.enemyWidth = emy_data.width;
        this.enemyHeight = emy_data.height;

        // 敌机的位置和移动轨迹
        this.enemyX = 0
        this.enemyY = 0

        // 敌机的血量
        this.enemyBlood = emy_data.blood;
        // 敌机的图片路径
        this.enemySrc = emy_data.img;
        // 敌机爆炸的图片路径
        this.enemyDieSrc = emy_data.dieImg;
        // 敌机的DOM节点
        this.currentEnemy = null;
    }

    // 绘制敌机到页面上的原型方法
    drawEnemy() {
        // 创建敌机的DOM节点
        this.currentEnemy = $("<img>");
        // 添加敌机的图片路径
        this.currentEnemy[0].src = this.enemySrc;

        // 敌机所能出现的最大left值
        let enemyMaxLeft = game_width - this.enemyWidth;

        // 计算敌机出现的坐标
        this.enemyX = Math.floor(Math.random() * (enemyMaxLeft + 1));
        this.enemyY = -this.enemyHeight;

        // 设置敌机的样式
        this.currentEnemy.css({
            width: this.enemyWidth + "px",
            height: this.enemyHeight + "px",
            position: "absolute",
            left: this.enemyX + "px",
            top: this.enemyY + "px",
            zIndex: 3
        })

        // 把敌机元素插入到页面上
        game.append(this.currentEnemy);
    }

    // 移动敌机的原型方法
    moveEnemy() {
        // this 指向每一个调用 moveEnemy 方法的敌机
        this.enemyY++;
        // 如果飞机超出屏幕之外
        if (this.enemyY > game_height) {
            // 循环到屏幕上面重新出现
            this.enemyY = -this.enemyHeight;
        }
        // 重新设置敌机的位置
        this.currentEnemy.css({
            top: this.enemyY + "px"
        })

        // 获取最新的我方飞机的坐标
        var playerLeft = player.position().left;
        var playerTop = player.position().top;

        // 看当前移动的敌机， 是否碰撞我方飞机
        var isPlayerLeftCollision = this.enemyX + this.enemyWidth >= playerLeft;
        var isPlayerRightCollision = this.enemyX <= playerLeft + player_width;
        var isPlayerTopCollision = this.enemyY + this.enemyHeight >= playerTop
        var isPlayerBottomCollision = this.enemyY <= playerTop + player_height;

        if (isPlayerLeftCollision && isPlayerRightCollision && isPlayerTopCollision && isPlayerBottomCollision) {

            // 关闭移动背景的定时器
            clearInterval(moveBgTimer)
            // 关闭创建子弹的定时器
            clearInterval(bulletTimer)
            // 关闭移动子弹的定时器
            clearInterval(moveBulletTimer)
            // 关闭创建敌机的定时器
            clearInterval(enemyTimer)
            // 关闭移动敌机的定时器
            clearInterval(moveEnemyTimer)

            // 释放内存
            moveBgTimer = null;
            bulletTimer = null;
            moveBulletTimer = null;
            enemyTimer = null;
            moveEnemyTimer = null;

            // 移除鼠标移动事件
            game.off();

            // 让我方飞机 切换爆炸图片
            player.css("background-image","url(./images/planeb.gif)");

            // 过两秒， 回到主页面
            setInterval(function(){
                player.css({
                    //切换正常的背景
                    backgroundImage:"url(../images/plane.gif)",
                    //
                    left:" calc(50% - 30px)",
                    top:" 580px",                    
                });
                game.html(`
                <div class="player"></div>
                <div class="mask"></div>              
                `);
                game.hide();
                start.show();
                
                // history.go(0)

            },2000)
        }
    }
}


// 存储每一个敌机实例对象的数组
let enemys = [];

// 创建每一架 敌机的方法
function drawEveryEnemy() {
    enemyTimer = setInterval(function () {
        // new 一个敌方飞机的实例对象
        let enemyOjb = new EnemyPlane();
        // 用实例对象调用 绘制敌机的方法
        enemyOjb.drawEnemy();

        // 把敌机实例 推到数组里面
        enemys.push(enemyOjb)
    }, 1000)
}

// 移动每一架敌机
function moveEveryEnemy() {
    // 每四毫秒
    moveEnemyTimer = setInterval(function () {
        // 遍历所有的敌机
        for (let i = 0; i < enemys.length; i++) {
            // 移动每一架敌机
            enemys[i].moveEnemy();
        }
    }, 8)
}