const express = require('express');
const router = express.Router();
// 引入公共的方法
const mysqlObj = require('../model/mysql_class.js');
const { Msg, pathS } = require('../tools/publicMsg.js');


// 通过一级标题id获取二级标题
router.get('/firstId', async (req, res)=>{
    // 接收参数
    let first_id = req.query.fir ? req.query.fir : '';
    // 判断传入的参数
    if(!/^\d{1,4}$/.exec(first_id)){
        return res.send(Msg(true,null));
    }
    let strSql = `select second_id,second_name from category_second where first_id='${first_id}'`;
    let [err,arr] = await mysqlObj.exec(strSql);
    res.send(Msg(err,arr));
}); 

// 通过二级标题id获取三级标题
router.get('/secondId', async (req, res)=>{
    // 接收参数
    let second_id = req.query.sec ? req.query.sec : '';
    // 判断传入的参数
    if(!/^\d{1,4}$/.exec(second_id)){
        return res.send(Msg(111,null));
    }
    let strSql = `select thired_id,thired_name from category_thired where second_id='${second_id}'`;
    let [err,arr] = await mysqlObj.exec(strSql);
    res.send(Msg(err,arr));
}); 

// 根据三级类别获取分页的主体内容
router.get('/goodsList', async (req, res)=>{
    // 解构出来传递的参数 page(页数)limits(每页放多少商品)order(以什么排序)ascDesc(升序还是降序)
    let { thiredid, page = 1, limits = 10,order = 'price', ascDesc = 'desc' } = req.query;
    // 首先判断三级类别id的参数
    if(!/^\d{1,4}$/.test(thiredid)) {
        return res.send(Msg(true,null));
    }
    // 判断以什么排序（销量还是价格）
    if(order != 'price' && order != 'id') {
        return res.send(Msg(true,null))
    }
    // 判断排序的参数
    if (ascDesc != 'asc' && ascDesc != 'desc') {
        return res.send(Msg(true,null));
    }

    // 判断以什么排序
    let field = 'goods_price';
    if(order == 'id') field = 'goods_id';

    // 计算游标的位置
    let starts = (page - 1) * limits;

    // 查询某个三级类别下的商品数据：
    let sqlStr = `select goods_id,goods_name,concat('${pathS}',image_url)as image_url,goods_price 
    from goods_list where thired_id='${thiredid}' order by ${field} ${ascDesc} limit ${starts},${limits}`;

    let [err, arr] = await mysqlObj.exec(sqlStr);
    res.send(Msg(err,arr))

});

// 根据某个三级类别id查询商品总数：
router.get('/totalGoods',async (req, res)=>{

    // 接参（三级类别id）
    let thired_id = req.query.thired ? req.query.thired : '';
    // 判断三级id参数
    if(!/^\d{1,4}$/.test(thired_id)) {
       return res.send(Msg(true,null));
    }
    // 根据某个三级类别id查询商品总数
    let sqlStr = `select count(goods_id) as total from goods_list where thired_id=${thired_id}`;
    let [err,arr] = await mysqlObj.exec(sqlStr);
    res.send(Msg(err,arr));
})
// 暴露出去
module.exports = router;