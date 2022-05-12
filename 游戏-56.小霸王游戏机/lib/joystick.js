//此插件依赖nipplejs.min.js
//by https://gitee.com/lianlizhou
//https://www.cnblogs.com/OrochiZ-/p/13879679.html


function Joystick(opts){
    //默认配置
    var position = {left:"50%", top:"50%"} 
    //保存传入的配置信息
    this.el = opts && opts.el
    this.color = opts && opts.color || 'white'
    this.size = opts && opts.size || 100

    this.isFourBtn = opts && opts.isFourBtn ?  true : false //默认4键模式 否则8键模式（左上/左下/右上/右下）
    this.keyCodes = opts && opts.keyCodes || [87, 83, 65, 68]    //按顺序是上下左右 默认WSAD
    this.btn_down_fn = opts && opts.btn_down_fn //fn 按下时的回调
    this.btn_up_fn = opts && opts.btn_up_fn //fn 释放时的回调
    this.relative = opts && opts.relative || true //默认将容器设置为相对定位

    //生成配置信息 这里配置的参数将传给nipplejs.min.js
    this.opts = {
        zone: this.el, //用户设置的容器
        mode: 'static',//模式，static就是摇杆中心固定
        position:{left:'50%',top:'50%'},//让摇杆容器定位到用户设置容器的正中心
        color:this.color,//摇杆的颜色 包括back和front nipplejs默认白色，通过背景色实现
        size:this.size,//摇杆容器back元素的大小，front是他的一半,默认100
    }
    
    //记录上一次按键方向
    this.direction = null  //手势释放时重新设为null
}

Joystick.prototype.init = function(){
    var me = this;

    //创建nipplejs实例
    var manager = nipplejs.create(this.opts);

    //事件监听
    manager.on('start',function(evt,data){
    })
    manager.on('move',function(evt,data){
        //数据交给其他方法处理
        me.onMove && me.onMove(data)
    })
    manager.on('end',function(evt,data){
        me.onEnd && me.onEnd()
    })
    //阻止默认事件，防止快速点击时页面缩放
    document.querySelector(me.el).addEventListener('touchstart',function(evt){
        evt.preventDefault()
    })
}

Joystick.prototype.onMove = function(data){
    var me = this;
    //通过distance属性是否存在判断此次操作是否有效
    if(!data.distance) return

    //获取最新方向信息
    var now_direction = me.getDirection(data)
    //处理方向信息
    me.handleDirection(now_direction,me.direction) //新方向 上一个方向
    //更新按键方向
    me.direction = now_direction
}

Joystick.prototype.onEnd = function(){
    var me = this;
    //1.获取要处理的keyCode数组 并调用方法将相关按键释放
    me.handleCodeArr('up',me.getCodeArr(me.direction)) //up or down
    //2.重置方向信息
    me.direction = null
}

Joystick.prototype.getDirection = function(data){
    var me = this;
    //判断是4键模式还是8键模式
    if(me.isFourBtn){
        //4键模式 直接返回
        return data.direction.angle
    }else{
        //8键模式 根据角度值返回对应的方向
        return me.transformDirection(data.angle.degree)
    }
}

//用于8键模式 将角度转换成方向
Joystick.prototype.transformDirection = function(degree){
    //8个方向平方360度 每个方向45度
    //右上 22.5 - 76.5
    //上   76.5 - 112.5
    //左上 112.5 - 157.5
    //左   157.5 - 202.5
    //左下 202.5 - 247.5
    //右下 247.5 - 292.5
    //右   >292.5 <=22.5
    //右   >337.5 <=22.5
    if(degree > 337.5){
        //右
        return 'right'
    }else if(degree > 292.5){
        //右下
        return 'right_down'
    }else if(degree > 247.5){
        //下
        return 'down'
    }else if(degree > 202.5){
        //左下
        return 'left_down'
    }else if(degree > 157.5){
        //左
        return 'left'
    }else if(degree > 112.5){
        //左上
        return 'left_up'
    }else if(degree > 76.5){
        //上
        return 'up'
    }else if(degree > 22.5){
        //右上
        return 'right_up'
    }else{
        //右
        return 'right'
    }
}

//将相关方式信息转换为keyCode，并放入数组中
Joystick.prototype.handleDirection = function(new_direction,old_direction){
    var me = this;
    //old_direction可能为null 但new_direction绝对有值
    //当old_direction时，说明用户刚开始点击，此时需要将相应的keyCode传给btn_down_fn执行
    if(old_direction === null){
        var code_arr = me.getCodeArr(new_direction)
        me.handleCodeArr('down',code_arr) 
    }
    //当old_direction不为null，说明用户正在滑动 如果此时新旧方向不一致，则要更新按键状态
    if(old_direction !== null && new_direction !== old_direction){
        var old_arr = me.getCodeArr(old_direction)
        var new_arr = me.getCodeArr(new_direction)
        //找出已经发生改变的方向 例如 右上 -> 右下 需要将'上'取消掉，同时将'下'按下
        
        //遍历新数组的元素，对比该元素是否存在旧数组中，如果不存在，即可得到 按下的 code_arr
        var down_arr = new_arr.filter( code => {
            return !old_arr.includes(code)
        })
        me.handleCodeArr('down',down_arr) 
        //遍历旧数组的元素，对比该元素是否存在新数组中，如果不存在，即可得到 释放的 code_arr
        var up_arr = old_arr.filter( code => {
            return !new_arr.includes(code)
        })
        me.handleCodeArr('up',up_arr) 
    }
}

//将方向信息转换为keyCode后，以数组形式返回
Joystick.prototype.getCodeArr = function(direction){
    var me = this;
    switch(direction){
        case 'up':return [me.keyCodes[0]];break;
        case 'down':return [me.keyCodes[1]];break;
        case 'left':return [me.keyCodes[2]];break;
        case 'right':return [me.keyCodes[3]];break;
        case 'right_up':return [me.keyCodes[3], me.keyCodes[0]];break;
        case 'right_down':return [me.keyCodes[3], me.keyCodes[1]];break;
        case 'left_up':return [me.keyCodes[2], me.keyCodes[0]];break;
        case 'left_down':return [me.keyCodes[2], me.keyCodes[1]];break;
        default:break;
    }
}

Joystick.prototype.handleCodeArr = function(type,arr){
    //type为up or down
    //arr为需要处理的包含keyCode的数组

    var me = this;
    var fn = me.btn_down_fn //默认为按下时的回调
    if(type !== 'down'){
        //如果不是down 说明是手势释放 需要调用释放按键的回调
        fn = me.btn_up_fn
    }

    //遍历数组中的keyCode 逐个处理
    for(var i=0,len=arr.length;i<len;i++){
        //对keyCode进行包裹后
        fn && fn(me.package(arr[i]))
    }
}

//对keyCode进行封装
Joystick.prototype.package = function(keyCode){
    var evt = {}
    evt.keyCode = keyCode
    return evt
}