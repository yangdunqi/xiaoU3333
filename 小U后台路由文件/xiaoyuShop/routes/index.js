// 设置主页的路由
// 引入获取数据库方法
const mySql = require('../model/mysql_class.js');
const express = require('express');
// 引入公共的方法
const { Msg, pathS } = require('../tools/publicMsg.js');
// const { mysqlObj } = require('../model/mysql_class.js');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

// 获取轮播图数据
router.get('/banner', async (req, res) => {
  // 定义sql语句
  let sqlStr = `select concat('${pathS}',coverimg) as coverimg from banner`;
  // 调用方法获取数据
  let [err, data] = await mySql.exec(sqlStr);

  res.send(Msg(err, data));
});

// 获取一级列表
router.get('/cateFirst', async (req, res) => {
  // 定义sql语句
  let sqlStr = 'select * from category_first';
  // 一级列表数据
  let [err, data] = await mySql.exec(sqlStr);

  res.send(Msg(err, data));
});


// 抢购活动
router.get('/flash_sale', async (req, res) => {
  // 定义sql语句
  let sqlStr = 'select * from flash_sale';
  // 获取抢购场次
  let [err, data] = await mySql.exec(sqlStr);
  if (data) {
    await Promise.all(
      data.map(async (item) => {
        // 取出每场抢购的商品内容
        sqlStr = `select f.goods_id,goods_name,concat('${pathS}',image_url) as image_url,goods_price,assem_price from flash_product as f left join goods_list as g on f.goods_id=g.goods_id where f.flash_id='${item.flash_id}' order by rand() limit 4`;
        [e, arr] = await mySql.exec(sqlStr);

        item.first_qg = arr;
      })
    );
    res.send(data);

  } else {
    res.send(Msg(err, data));
  }
});

// 排行榜
router.get('/ranking', async (req, res) => {
  // 定义sql语句  取出随机四个三级类别
  let sqlStr = 'select  second_id,second_name from category_second order by rand() limit 4';
  // 获取抢购场次
  let [err, data] = await mySql.exec(sqlStr);
  if (data) {
    await Promise.all(
      data.map(async (item) => {
        // 取出在四个三级类别中分别选出3个商品
        sqlStr = `select goods_id,goods_name,concat('${pathS}',image_url) as image_url,goods_price from goods_list where second_id='${item.second_id}' limit 3`;
        [e, arr] = await mySql.exec(sqlStr);
        item.data = arr;
      })
    );
    res.send(data);

  } else {
    res.send(Msg(err, data));
  }
});

// 人气好货
router.get('/goods_eval', async (req, res) => {
  // 定义sql语句  取出随机四个三级类别
  let sqlStr = `select x.goods_id,goods_introduce,goods_name,concat('${pathS}',image_url) as image_url,goods_price,assem_price from goods_eval as x left join goods_list as y on x.goods_id=y.goods_id
  group by x.goods_id order by sum(eval_start) desc limit 8`;
  // 获取抢购场次
  let [err, data] = await mySql.exec(sqlStr);
  res.send(Msg(err, data));

});

// 随机查询四个二级类别：
router.get('/cateGoods',async(req, res)=>{
  // 随机查询四个二级类别
  let sqlStr = "select second_id,second_name from category_second order by rand() limit 4 ";
  let [err, arr] = await mySql.exec(sqlStr);

  await Promise.all(
      arr.map(async (item)=>{
        // 随机查询属于某个二级类别下的四个三级类别
        sqlStr = `select * from category_thired where second_id='${item.second_id}' order by rand()  limit 4`;
        let [e,data] = await mySql.exec(sqlStr);
        item.cate_thired = data;
        // 随机查询属于某个二级类别下的四个商品数据
        sqlStr = `select goods_id,concat('${pathS}',image_url) as image_url,goods_name,goods_price from goods_list where second_id='${item.second_id}'  order by rand() limit 4`;
        [e,data] = await mySql.exec(sqlStr);
        item.goods_list = data;
      })
  );
  res.send(Msg(err,arr));
});

// 首页发现好货路由
router.get('/fxGoods',async (req,res)=>{
  // 随机获取四个商品
  let sqlStr = `select goods_id,concat("${pathS}",image_url) as image_url,goods_name from goods_list order by  rand()  limit 4`;
  let [err,arr] = await mySql.exec(sqlStr);
  res.send(Msg(err,arr));
});

// 首页猜你喜欢
router.get('/guessGoods',async (req, res)=>{
  // 随机查询十五个商品数据：
  let sqlStr = `select goods_id,concat('${pathS}',image_url) as image_url,goods_name,goods_price from goods_list order by rand() limit 15`;
  let [err,arr] = await mySql.exec(sqlStr);
  res.send(Msg(err,arr));
})

module.exports = router;
