$(function () {
    // 点击搜索框之后跳转到商品搜索页
    $("#index_submit").click(function () {
        // 判断是否输入商品名称
        if ($('#index_ipt').val() == '') {
            return;
        } else {
            location.href = `./search.html?text=${$('#index_ipt').val()}`;
        }
    });
    // 搜索框下面商品列表
    (async function () {
        // console.log(sec);
        let [err, arr] = await sendAjax('/hotkeyword');
        // 渲染数据
        // console.log(arr);
        let str = '';
        arr.data.forEach((item, index) => {
            str += ` <li class="header_box"><a href="">${item.search_text}</a></li>`;
        });
        $("#daohang").html(str);
    })();

    // 获取轮播资源
    async function demo() {
        let [err, data] = await sendAjax('/banner');

        data.data.forEach(item => {
            $('.swiper-wrapper').append(
                `<div class="swiper-slide"><img src="${item.coverimg}" alt=""></div>`);
        });


        var mySwiper = new Swiper('.swiper-container', {
            direction: 'horizontal',
            loop: true, // 循环模式选项
            autoplay: true, // 自动切换
            effect: 'coverflow',
            cubeEffect: {
                slideShadows: true,
                shadow: true,
                shadowOffset: 100,
                shadowScale: 0.6
            },
            // 如果需要分页器

            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                bulletActiveClass: 'my-bullet-active',
            },

            // 如果需要前进后退按钮
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },

        });
    }
    demo();

    // 限时抢购
    (async () => {
        let [err, arr] = await sendAjax('/flash_sale');
        arr = arr[0];
        let tem = template('xsqg_temp',arr);
        // 将模板数据渲染到页面上
        $('#xsqgCont').html(tem);
    })();

    // 排行榜 
    (async () => {
        let [err, data] = await sendAjax('/ranking');
        data = {
            data
        };
        // 数据和模板绑定生成HTML片段
        var tem = template('phb_temp', data);
        $('#phb_Cont').html(tem);
        $('#phb_Cont>ul>li').eq(0).addClass('active');
        $('.listMain .listBox').eq(0).show();
        // 添加事件
        $.each($('#phb_Cont>ul>li'), function (index, item) {
            $(item).click(function () {
                $(item).addClass('active').siblings().removeClass('active');
                $('.listMain .listBox').eq(index).show().siblings().hide();
            });
        });

    })();

    // 人气好货
    (async () => {
        let [err, arr] = await sendAjax('/goods_eval');
        const tem = template('rqhh_temp',arr);
        $('#rqhh_menu').html(tem);
        $('#rqhh_menu li').eq(3).addClass('last').nextAll().addClass('end');
        $('#rqhh_menu li').eq(7).addClass('last');
    })();

    // 发现好货
    // (async ()=>{
    //     let [err,arr] = await sendAjax('/fxGoods');
    //     // 将数据和模板绑定生成html片段
    //     let tem = template('good_temp',arr);
    //     // 渲染到页面
    //     $('#fx_goods').html(tem);
    // })();

    // 服装配饰
    (async () => {
        let [err, arr] = await sendAjax('/cateGoods');
        // 数据和模板绑定生成HTML片段
        var tem = template('four_temp', arr);
        $("#four").html(tem);
        $("#four>div").eq(1).addClass('right-pulic');
        $("#four>div").eq(3).addClass('right-pulic');
        // console.log(tem);
    })();

    // 猜你喜欢
    (async () => {
        let [err, arr] = await sendAjax('/guessGoods');
        // 数据和模板绑定生成HTML片段
        var tem = template('goods_temp', arr);
        $("#goods_menu").html(tem);
        $("#goods_menu>li").eq(9).addClass('last').nextAll().addClass('end');
        $("#goods_menu>li").eq(4).addClass('last');
        $("#goods_menu>li").eq(14).addClass('last');

    })();
})