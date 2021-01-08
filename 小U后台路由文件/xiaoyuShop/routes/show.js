const express = require('express');
// 引入公共的方法
const mysqlObj = require('../model/mysql_class.js');
const { Msg, pathS } = require('../tools/publicMsg.js');
const router = express.Router();

// 根据商品id查询商品相关信息：
router.get('/shows', async (req, res) => {
    // 接收传入的参数返回 接收商品的id
    let goods_id = req.query.show ? req.query.show : '';
    // console.log(goods_id.length);
    // 判断参数是否符合规则
    if (!/^\d{19}$/.test(goods_id)) { 
        return res.send(Msg(true, null)); 
    };
    // 返回的数据
    let dataS = {};
    // 根据商品id查询商品相关信息：
    let sqlStr = `select thired_name,second_name,first_name, g.goods_id,goods_name,goods_introduce,goods_price from goods_list as g
    left join category_first as c 
    on g.first_id=c.first_id 
    left join category_second as s 
    on g.second_id=s.second_id
    left join category_thired as t
    on g.thired_id=t.thired_id
    where g.goods_id='${goods_id}'`;
    let [err,arr] = await mysqlObj.exec(sqlStr);
    dataS.goods_info = arr;

    // 根据商品id查询商品图片：concat('${pathS}',image_url) as image_url
    sqlStr = `select concat('${pathS}',file_name) as goods_image from goods_image where goods_id='${goods_id}'`;
    [err, arr] = await mysqlObj.exec(sqlStr);
    dataS.goods_image = arr;

    //根据商品id查询商品规格：
    sqlStr = `select * from goods_style where goods_id='${goods_id}'`;
    [err, arr] = await mysqlObj.exec(sqlStr);
    dataS.goods_style = arr;

    // /根据商品id查询商品的评论数据：
    sqlStr = `select eval_text,create_time,username from goods_eval as g left join member as m on g.uid=m.uid where goods_id='${goods_id}'`;
    [err, arr] = await mysqlObj.exec(sqlStr);
    dataS.goods_eval = arr;

    res.send(Msg(err, dataS));

});

// 设置商品推荐的数据的路由
router.get('/recommend',async (req,res)=>{
    let sqlStr = `select w.goods_id,concat('${pathS}',image_url) as image_url,goods_name,goods_price from win_location as w left join goods_list as g on w.goods_id=g.goods_id`;
    let [err,arr] = await mysqlObj.exec(sqlStr);
    res.send(Msg(err,arr));
});

// 暴露出去
module.exports = router;