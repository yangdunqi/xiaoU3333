// 定义发送ajax请求函数
function sendAjax(url,data={},type='get',datatype='json') {
    // 将url更改
    // url = `http://localhost:2222${url}`;
    url = `http://188.131.139.224:2222${url}`;
    return new Promise((resolve,reject)=>{
        $.ajax({
            url,
            type,
            data,
            headers: {
                Authorization: localStorage['tockens']
            },
            datatype,
            success(d){
                resolve([null,d]);
            },
            error(e){
                resolve([e,null]);
            }
        });
    });
};
//获取url地址中的参数 
function getSearchArg(argName) {
    // 去掉锚点连接
    let theHref = window.location.href;
    let searchStr;
    if (theHref.indexOf("#") > -1) {
        searchStr = theHref.substr(0, theHref.indexOf("#"));
    } else {
        searchStr = theHref.substr(0);
    }
    let [, arr = ""] = searchStr.split("?");
    let argArr = arr.split("&");
    for (let i = 0; i < argArr.length; i++) {
        let smallArgArr = argArr[i].split("=");
        if (smallArgArr[0] === argName) {
            // console.log(smallArgArr[1], 996);
            return decodeURIComponent(smallArgArr[1]); // decodeURIComponent方法: URL编码转换成中文的
        }
    }
    return "";
};
// 每个图片设置点击跳转
function toShow(obj){
    location.href = `./show.html?show=${$(obj).attr('goods_id')}`
}


