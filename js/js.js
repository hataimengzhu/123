var speed = 2;//速度
var count = 0;
var clock = null;
var timer = null;
var state = 0;//0:初始化,1:暂停,2:结束
var onOff = false;
var classBase = {
    cGet:function(cid){
        return document.getElementById(cid);
    },
    cCreate:function(celement){
        return document.createElement(celement);
    },
    cTagname:function(tagname){
        return document.getElementsByTagName(tagname);
    }
}
function $(cid){
    return document.getElementById(cid);
}
function cdiv(className){//创建div+类名
    var div = classBase.cCreate('div');
    div.className = className;
    return div;
}
function caname(){//随机黑块
    var arr = ['cell','cell','cell','cell'];
    var i = Math.floor(Math.random()*4);
    arr[i] = 'cell black';    
    return arr;
}
function crow(){//绘制方块
        var row = cdiv('row');
        var className = caname();
        for(var j=0;j<4;j++){
            // row.appendChild(cdiv(arr[j]));//'cell'/'cell black'
            row.appendChild(cdiv(className[j]));//'cell'/'cell black'
        }
        var con = $('container');
        if(con.firstChild==null){//确保child插在con的第一个而不是最后一个
            con.appendChild(row);           
        }else{
            con.insertBefore(row,con.firstChild);
        }
}

function removeRow(){
    var con = $('container');
    con.removeChild(con.lastChild);
}

function move(){
    var con = $('container');
    // var top = parseInt(window.getComputedStyle(con,null)['top']);
    var top = con.offsetTop;
    if((top+speed)>0){//判断如果top+speed>0即top!=0,则不执行if(top==0){}语句
        top = 0;
    }else{
        top += speed;
    }
    con.style.top = top+'px';  
    document.title = 'top='+top+'/speed='+speed+'/state'+state;  
    if(top == 0){ 
        crow();
        con.style.top = '-102px';         
        removeRow();
    }else if(top > -102){
        var rows = con.children;
        // document.title = rows[[rows.length-1].pass;
        if(rows[rows.length-1].pass!==1){
            fail();
        }
    }

}
function init(){//初始化
    count=0;
    speed=2;
    window.clearInterval(clock);
    clock=null;
    $('score').innerText = '分数:'+count;
    var rows = $('container').children;
    for(var i=rows.length-1;i>-1;i--){
        $('container').removeChild(rows[i]);
    }
    $('container').style.top = '-306px';  

    for(var i=0;i<5;i++){
        crow();
    }
    $('main').onclick = function(ev){
        var ev = ev||window.event;
        judge(ev);
        // console.log(ev.target);
    }
}
function accelerate(){       
    if(speed==2){
        speed=4;
    }else if(speed==4){
        speed=8;
    }else if(speed ==8){
        speed=10;
    }
}
function judge(ev){
    if(state!=2&&state!=3){
        if(ev.target.className=='cell black'){//ev.target.className.indexOf('black')==0; //如果要检索的字符串值没有出现，则该方法返回 -1
            ev.target.className = 'cell';
            count++;
            if(count>=20){
                accelerate();
            }
            $('score').innerText = '分数:'+count;
            music();
            ev.target.parentNode.pass = 1;//pass:自设属性
        }else if(ev.target.className=='cell'){
            fail();
            ev.target.className = 'cell red';
            // var i = 0;
            // ev.target.style.display = i++%2?'none':'block';
            // console.log(ev.target.style.display);
            // document.removeEventListener("click", judge, false);
        } 
    }else{
        alert('false');
        // return;
    }  

}
function fail(){
    state = 2;
    music();
    $('restart').innerHTML = '重新开始';
    window.clearInterval(clock);
}
function music(){
    var au = document.createElement('audio');
    au.preload = 'auto';
    if(state==0){
        au.src = 'music/4133.wav';  
        au.volume = 0.1;     
        au.play();//破碎声       
    }else if(state==2){
        au.src = 'music/false.wav';
        au.volume = 0.6;     
        au.play();//声 
    }
       
}
$('restart').onclick=function(){
    if(state==0){       
        init();
        start();
        $('restart').innerHTML = '重新开始';
    }else if(state==2){
        state=0;
        // while(div.hasChildNodes()) //当div下还存在子节点时 循环继续  
        // {  
        //     div.removeChild(div.firstChild);  
        // }         
        init();
        start();        
    }
}
$('end').onclick=function(){
    if(clock!=null){
        $('container').style.top = '-306px';     
        var rows = $('container').children;
        for(var i=rows.length-1;i>-1;i--){
            $('container').removeChild(rows[i]);
        }
        window.clearInterval(clock);        
        clock = null;
        state=2;
    }

}
$('pause').onclick=function(){
    if(onOff==false&&state==0){
        speed=0;
        state=3;//3:暂停状态
        $('pause').innerHTML='继续';
        onOff=true;        
    }else if(onOff&&state!=2){
        state = 0;
        speed=2;
        $('pause').innerHTML='暂停';
        onOff = false;
    }
}
function start(){
    clock = window.setInterval('move()',30);

}