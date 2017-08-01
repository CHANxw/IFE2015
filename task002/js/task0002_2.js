/**
 * Created by Administrator on 2017/1/19 0019.
 */
var clock;
var btn= $('#btn-time');
var timeText= $('#time') ;
$.click(btn,function () {
    clearInterval(clock);
    var text= $('#text-time').value;
    var setTime= new Date(text.replace('-',',')).getTime();
    console.log(setTime);
    clock=setInterval(count,900);
    function count() {
        var curTime= new Date().getTime();
        var date= setTime -curTime;
        var day = Math.floor(date/ 1000 / 3600 / 24);
        var hour = Math.floor(date % (1000 * 3600 * 24) / (3600 * 1000));
        var minute = Math.floor(date % (1000 * 3600 * 24) % (3600 * 1000) / (60 * 1000));
        var second = Math.floor(date % (1000 * 3600 * 24) % (3600 * 1000) % (60 * 1000) / 1000);
        console.log(day + "  " + hour + "   " + minute + "   " + second);
        timeText.innerHTML= day + "天" + hour + "小时" + minute + "分" + second + "秒"
    }
});
