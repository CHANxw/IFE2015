var btn=$("#btn-hobby");
$.click(btn,function () {
    var content= $("#text-hobby").value;
    //console.log(content);
    var txtArr= uniqArray(content.split(/\s+|\n|,|，|;|；|、|。|\./));
    console.log(txtArr);
    var txtArr2= [];
    for (var i=0; i<txtArr.length; i++) {
        if (txtArr[i] != " " && txtArr[i] != "") {
            txtArr2.push(trim(txtArr[i]));
        }
    }
    //console.log(txtArr2);
    var text= "";
    if (txtArr2.length<1) {
        text= "你输入的信息有误，请正确填写你的兴趣爱好";
    }else if (txtArr2.length>10){
        text= "你输入的兴趣大于10个，请减少输入";
    }
    else {
        for (var key in txtArr2) {
            text += '<br><input type="checkbox"><label>' + txtArr2[key] + '</label>'
        }
    }
    //console.log(text);
    $("#hobby").innerHTML= text;
});


