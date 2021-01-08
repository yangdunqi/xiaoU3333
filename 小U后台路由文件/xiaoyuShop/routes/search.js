const express = require('express');
// 引入公共的方法
const mysqlObj = require('../model/mysql_class.js');
const { Msg, pathS } = require('../tools/publicMsg.js');
const router = express.Router();

//搜索商品： 
router.get('/search', async (req, res) => {

    //接参(用户输入的关键词)
    let { keyword, page = 1, limits = 4, order = 'price', ascDesc = 'desc' } = req.query;
    // console.log(keyword);
    if (keyword == '') {
        res.send(Msg(true, null));
        return;
    }

    //按什么字段排序
    if (order != 'price' && order != 'id') {
        return (Msg(true, null));
    }
    //按什么排序：
    let field = 'goods_price';
    if (order == 'id') {
        field = 'goods_id';
    }

    //排序方式：asc升序  desc降序
    if (ascDesc != 'asc' && ascDesc != 'desc') {
        return (Msg(true, null));
    }

    //计算游标位置：
    //page：第几页
    let starts = (page - 1) * limits;

    //查询当前关键词是否搜索过:
    let sql = `select * from search where search_text='${keyword}'`;
    let [err, arr] = await mysqlObj.exec(sql);
    if (arr.length == 0) { //该关键词未搜索过
        sql = `insert into search(search_text,count)values('${keyword}',1)`;
    } else { //该关键词搜索过
        sql = `update search set count=count+1 where search_text='${keyword}'`;

    }
    mysqlObj.exec(sql);


    //查询某个三级类别下的商品数据：
    sql = `select goods_id,goods_name,concat('${pathS}',image_url)as image_url,goods_price 
  from goods_list where goods_name like '%${keyword}%' order by ${field} ${ascDesc} limit ${starts},${limits}`;
    [err, arr] = await mysqlObj.exec(sql);


    //根据关键词查询总的商品个数：
    sql = `select count(goods_id) as n from goods_list where goods_name like '%${keyword}%'`;
    let [e, data] = await mysqlObj.exec(sql);
    arr.unshift(data[0].n);

    res.send(Msg(err, arr));

});


//查询9个热门关键词
router.get('/hotkeyword', async (req, res) => {

    //查询9个热门关键词：
    let sql = `select search_text from search order by count desc limit 9`;
    let [err, arr] = await mysqlObj.exec(sql);
    res.send(Msg(err, arr));
});


module.exports = router;