// 返回查询对象的结果
module.exports.Msg = function (err,data){
    if(err){    // 失败
        return {code: 500,msg: '数据请求失败',data};
    }else {     // 成功
        return {code: 200,msg: '数据请求成功',data}
    }
};

// 返回图片外网地址
module.exports.pathS = " http://api33.xqb.ink/";