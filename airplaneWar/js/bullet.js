// 子弹实例的对象数组 （目的是 存储每一个子弹对象）
let bullets = [];

// 子弹类 
class Bullet {
    // 子弹类的尺寸
    bulletWidth = 6;
    bulletHeight = 14;

    // 子弹位置和移动的坐标
    bulletX = 0;
    bulletY = 0;

    // 子弹的DOM元素
    currentBullet = null;

    // 子弹的图片路径
    bulletSrc = "./images/bullet.png";

    // 绘制子弹到页面上的原型方法
    drawBullet() {
        // 创建子弹的img标签
        this.currentBullet = $(`<img>`);
        // 添加子弹的图片路径
        this.currentBullet[0].src = this.bulletSrc;

        // 计算子弹出现的坐标
        this.bulletX = player.position().left + player_width / 2 - this.bulletWidth / 2;
        this.bulletY = player.position().top - this.bulletHeight;

        // 设置子弹的css样式
        this.currentBullet.css({
            width: this.bulletWidth + "px",
            height: this.bulletHeight + "px",
            position: "absolute",
            left: this.bulletX + "px",
            top: this.bulletY + "px",
            zIndex: 2,
        })

        // 把子弹元素插入到页面上
        game.append(this.currentBullet);
    }

    // 移动子弹的方法  (idx: 当前子弹在数组中的下标)
    movebullet(idx) {
        /*  this 谁调用这个方法，this就指向谁
            每一个子弹是一个对象, this就是每一个子弹对象 */

        // 获取到当前子弹的y坐标, 并且往上移动
        this.bulletY--;

        // 判断: 当前子弹是否超出屏幕之外
        if (this.bulletY < -this.bulletHeight) {
            // 先删除页面中的子弹节点
            this.currentBullet.remove();
            // 在数组中, 用当前溢出屏幕的子弹下标, 删除当前子弹
            bullets.splice(idx, 1);
            // 阻止函数向下执行
            return;
        }

        // 重新设置子弹的位置 (给子弹的DOM节点设置样式)
        this.currentBullet.css({
            top: this.bulletY + "px"
        })
    }

    // 击中敌机的方法
    hitEnemy(idx) {
        // this 指向当前的子弹对象

        // 每一架敌机
        for (let i = 0; i < enemys.length; i++) {
            // 敌机的四条边界 碰撞检测
            var isLeftCollision = this.bulletX + this.bulletWidth >= enemys[i].enemyX;
            var isRightCollision = this.bulletX <= enemys[i].enemyX + enemys[i].enemyWidth;
            var isTopCollision = this.bulletY + this.bulletHeight >= enemys[i].enemyY;
            var isBottomCollision = this.bulletY <= enemys[i].enemyY + enemys[i].enemyHeight;

            // 同时满足4个条件， 才是碰撞
            if (isLeftCollision && isRightCollision && isTopCollision && isBottomCollision) {

                // 移除击中敌机的子弹DOM节点
                this.currentBullet.remove();
                // 移除击中敌机的子弹对象
                bullets.splice(idx, 1);

                // 让当前被碰撞的敌机扣血
                enemys[i].enemyBlood--;

                // 如果血量为0，血量为0的敌机被移除
                if (enemys[i].enemyBlood <= 0) {

                    // 创建敌机爆炸的页面节点
                    var boomEnemy = $("<img>");
                    // 敌机爆炸图片
                    boomEnemy[0].src = enemys[i].enemyDieSrc;
                    // 设置敌机的样式
                    boomEnemy.css({
                        width: enemys[i].enemyWidth + "px",
                        height: enemys[i].enemyHeight + "px",
                        position: "absolute",
                        left: enemys[i].enemyX,
                        top: enemys[i].enemyY,
                        zIndex: 0
                    })
                    // 把敌机爆炸的页面节点插入到页面上
                    game.append(boomEnemy);

                    // 移除血量为0 的敌机DOM节点
                    enemys[i].currentEnemy.remove();
                    // 移除数组中 血量为0 的敌机对象
                    enemys.splice(i, 1);

                    // 两秒后，移除爆炸的敌机
                    setTimeout(function () {
                        boomEnemy.remove();
                    }, 400)

                }
            }
        }
    }

}

// 创建子弹实例的方法 （new 子弹类）
function createEveryBullet() {
    bulletTimer = setInterval(function () {
        // 创建子弹实例
        let bullet = new Bullet();
        // 用子弹类实例 调用绘制子弹的方法
        bullet.drawBullet();
        // 把每一个子弹实例, 推到子弹数组中
        bullets.push(bullet);
    }, 4)
}

// 移动每一个子弹的方法
function moveEveryBullet() {
    // 定时器（4毫秒）
    moveBulletTimer = setInterval(function () {
        // 每四毫秒 遍历一次所有子弹
        for (let i = 0; i < bullets.length; i++) {
            // 让所有子弹移动一次
            bullets[i].movebullet(i);

            // 避免子弹超出屏幕被移除 造成数组下标越界，导致undefine调用函数的问题
            if (bullets[i]) {
                // 检测子弹碰撞敌机的方法
                bullets[i].hitEnemy(i);
            }
        }
    }, 4)
}