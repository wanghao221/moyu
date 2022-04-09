// 卡片数组包含所有卡片
let card = document.getElementsByClassName("card");
let cards = [...card];

// 游戏中所有卡片
const deck = document.getElementById("card-deck");

// 声明 moves 变量
let moves = 0;
let counter = document.querySelector(".moves");

// 声明星形图标的变量
const stars = document.querySelectorAll(".fa-star");

// 声明 matchedCard 的变量
let matchedCard = document.getElementsByClassName("match");

 // 星级列表
 let starsList = document.querySelectorAll(".stars li");

 // 模板中的关闭图标
 let closeicon = document.querySelector(".close");

 // 声明 modal
 let modal = document.getElementById("popup1")

 // 打开卡片的数组
var openedCards = [];


// 洗牌功能
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};


// 页面刷新/加载时洗牌
document.body.onload = startGame();

// 开始新游戏的功能
function startGame(){
 
    // 清空 openCards 数组
    openedCards = [];

    // 洗牌
    cards = shuffle(cards);
    // 从每张卡片中删除所有现有的类
    for (var i = 0; i < cards.length; i++){
        deck.innerHTML = "";
        [].forEach.call(cards, function(item) {
            deck.appendChild(item);
        });
        cards[i].classList.remove("show", "open", "match", "disabled");
    }
    // 重置 moves
    moves = 0;
    counter.innerHTML = moves;
    // 重置 rating
    for (var i= 0; i < stars.length; i++){
        stars[i].style.color = "#FFD700";
        stars[i].style.visibility = "visible";
    }
    // 重置 timer
    second = 0;
    minute = 0; 
    hour = 0;
    var timer = document.querySelector(".timer");
    timer.innerHTML = "0 分 0 秒";
    clearInterval(interval);
}


// 显示卡片的功能
var displayCard = function (){
    this.classList.toggle("open");
    this.classList.toggle("show");
    this.classList.toggle("disabled");
};


// 将打开的卡片添加到 OpenedCards 列表并检查卡片是否匹配
function cardOpen() {
    openedCards.push(this);
    var len = openedCards.length;
    if(len === 2){
        moveCounter();
        if(openedCards[0].type === openedCards[1].type){
            matched();
        } else {
            unmatched();
        }
    }
};


// 当卡片匹配时的功能
function matched(){
    openedCards[0].classList.add("match", "disabled");
    openedCards[1].classList.add("match", "disabled");
    openedCards[0].classList.remove("show", "open", "no-event");
    openedCards[1].classList.remove("show", "open", "no-event");
    openedCards = [];
}


// 当卡片不匹配时的功能
function unmatched(){
    openedCards[0].classList.add("unmatched");
    openedCards[1].classList.add("unmatched");
    disable();
    setTimeout(function(){
        openedCards[0].classList.remove("show", "open", "no-event","unmatched");
        openedCards[1].classList.remove("show", "open", "no-event","unmatched");
        enable();
        openedCards = [];
    },1100);
}


// 暂时禁用卡片的功能
function disable(){
    Array.prototype.filter.call(cards, function(card){
        card.classList.add('disabled');
    });
}


// 启用卡片并禁用匹配的卡片的功能
function enable(){
    Array.prototype.filter.call(cards, function(card){
        card.classList.remove('disabled');
        for(var i = 0; i < matchedCard.length; i++){
            matchedCard[i].classList.add("disabled");
        }
    });
}


// 计算玩家的动作的功能
function moveCounter(){
    moves++;
    counter.innerHTML = moves;
    // 第一次点击时启动计时器
    if(moves == 1){
        second = 0;
        minute = 0; 
        hour = 0;
        startTimer();
    }
    // 根据移动次数设置星级
    if (moves > 8 && moves < 12){
        for( i= 0; i < 3; i++){
            if(i > 1){
                stars[i].style.visibility = "collapse";
            }
        }
    }
    else if (moves > 13){
        for( i= 0; i < 3; i++){
            if(i > 0){
                stars[i].style.visibility = "collapse";
            }
        }
    }
}


// 显示游戏的时间
var second = 0, minute = 0; hour = 0;
var timer = document.querySelector(".timer");
var interval;
function startTimer(){
    interval = setInterval(function(){
        timer.innerHTML = minute+" 分"+second+" 秒";
        second++;
        if(second == 60){
            minute++;
            second=0;
        }
        if(minute == 60){
            hour++;
            minute = 0;
        }
    },1000);
}


// 所有卡片匹配匹配时展示恭喜界面，显示移动次数时间和等级
function congratulations(){
    if (matchedCard.length == 16){
        clearInterval(interval);
        finalTime = timer.innerHTML;

        // 显示祝贺模板
        modal.classList.add("show");

        // 声明星级变量
        var starRating = document.querySelector(".stars").innerHTML;

        // 显示移动、评级、时间
        document.getElementById("finalMove").innerHTML = moves;
        document.getElementById("starRating").innerHTML = starRating;
        document.getElementById("totalTime").innerHTML = finalTime;

        //模板上的关闭图标
        closeModal();
    };
}


// 界面上的关闭图标
function closeModal(){
    closeicon.addEventListener("click", function(e){
        modal.classList.remove("show");
        startGame();
    });
}


// 再次游戏功能
function playAgain(){
    modal.classList.remove("show");
    startGame();
}


// 循环以将事件侦听器添加到每张卡片
for (var i = 0; i < cards.length; i++){
    card = cards[i];
    card.addEventListener("click", displayCard);
    card.addEventListener("click", cardOpen);
    card.addEventListener("click",congratulations);
};
