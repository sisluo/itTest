// 游戏定时器

// 移动背景定时器
var moveBgTimer;
// 创建子弹定时器
var bulletTimer;
// 移动子弹定时器
var moveBulletTimer;
// 创建敌机的定时器
var enemyTimer;
// 移动敌机的定时器
var moveEnemyTimer;


// 获取元素
// 开始游戏按钮
let begin = $(".begin");
// 开始界面
let start = $(".start");
// 游戏界面
let game = $(".game");
// 游戏界面的尺寸
let game_width = game.width();
let game_height = game.height();

// 玩家飞机
let player = $(".player");
// 玩家飞机的尺寸
let player_width = player.width();
let player_height = player.height();

// 开始游戏按钮 点击事件
begin.click(function () {
    // 开始界面隐藏
    start.fadeOut();
    // 游戏界面显示
    game.fadeIn();

    // 移动背景
    moveBackground();
    // 创建子弹
    createEveryBullet();
    // 移动子弹
    moveEveryBullet();

    // 创建敌机
    drawEveryEnemy();
    // 移动敌机
    moveEveryEnemy();
})

// 背景移动的函数
function moveBackground() {
    // 定时器
    moveBgTimer = setInterval(function () {
        // 获取当前背景的坐标   parseInt() 去除掉px字符，只保留数字
        var offsetY = parseInt(game.css("background-position-y"));
        // 移动背景
        offsetY++;

        // 超过屏幕之外， 开始下一次循环
        if (offsetY >= 740) {
            offsetY = 0
        }
        // 设置背景
        game.css("background-position-y", offsetY + "px");
    }, 4)
}

// 操作飞机的函数
game.on("mousemove", function (evt) {
    // 拿到鼠标的坐标 （鼠标在事件源的坐标）
    // console.log(evt.offsetX, evt.offsetY);

    // 鼠标移动的坐标
    let left = evt.offsetX - player_width / 2;
    let top = evt.offsetY - player_height / 2;

    // 飞机右、下的最大边界
    let MAX_LEFT = game_width - player_width;
    let MAX_TOP = game_height - player_height;

    // 边界控制
    left = left < 0 ? 0 : left > MAX_LEFT ? MAX_LEFT : left;
    top = top < 0 ? 0 : top > MAX_TOP ? MAX_TOP : top;

    // 移动飞机
    player.css({
        left: left + "px",
        top: top + "px"
    })
})

