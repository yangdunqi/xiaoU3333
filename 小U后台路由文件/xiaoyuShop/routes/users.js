const express = require('express');
// 引入公共的方法
const mysqlObj = require('../model/mysql_class.js');
const { Msg, pathS } = require('../tools/publicMsg.js');
const authObj = require('../tools/auth.js');
const { v4: uuidv4 } = require('uuid');
const svgCaptcha = require('svg-captcha');
const router = express.Router();

// 创建验证码
router.get('/createcode', (req, res) => {
    let captcha = svgCaptcha.create({ size: 4, background: '#ccffff', color: true, noise: 1, width: 90, height: 38 });
    //  res.setHeader('content-type', 'image/svg+xml');
    //  console.log(captcha.text, captcha.data);
    //  res.send(captcha.data);
    res.send(Msg(null, { img: captcha.data, txt: captcha.text }));
});

//使用JWT数据：
router.get('/testjst', (req, res) => {
    //获取JWT数据：
    // let jwtdata = req.headers.authorization;
    // let userinfo = authObj.useJwtData(req);
    let rtn = authObj.useJwtData(req);
    // console.log(req.UID, req.UNAME, 667);
    //已登录的用户id
    let uid = req.UID ? req.UID : '';
    if (uid == '' || !rtn) {
        res.send(Msg(true, null));
        return;
    }
    

    //添加订单
    //insert into orders(uid,gid,num)values(req.UID,'商品id','商品数量 ')

    res.send(Msg(null,{uname: req.UNAME,uid:req.UID}));

})

// 设计注册页路由
router.post('/register', async (req, res) => {
    let { user, pwd, inputCode } = req.body;
    let sqlStr = `select * from member where username='${user}'`;
    let [err, arr] = await mysqlObj.exec(sqlStr);
    // 判断
    if (err) {   // 失败
        res.send(Msg(11, null));
    } else { // 用户名已注册
        if (arr.length == 1) {
            return res.send(Msg(11, null));
        } else {   // 未注册  
            sql = `insert into member(uid,username,password,head_photo_url,createdate)values('${uuidv4()}','${user}','${pwd}','image_source/head_photo/girl_head_03.png','${new Date().getTime()}')`;
            [err, arr] = await mysqlObj.exec(sql);
            res.send(Msg(err, arr));
        }
    }
});


// 搭建登录页路由
router.post('/loginCont', async (req, res) => {
    let { user, pwd, inputCode } = req.body;
    let sqlStr = `select * from member where username='${user}'`;
    let [err, arr] = await mysqlObj.exec(sqlStr);
    // console.log(err,arr);
    // 判断
    if (err) {   // 失败
        res.send(Msg(true, null));
    } else { // 用户名正确
        if (arr.length == 1) {
            //创建JWT数据
            let tocken = authObj.createJwtData(user, arr[0].uid);
            // console.log(tocken, 888);
            res.send(Msg(null, { tocken,arr }));
            return res.send(Msg(err, arr));
        } else {   // 用户名不正确
            res.send(Msg(true, null));
        }
    }
});


// 暴露
module.exports = router;
