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
            str += ` <li class="header_box"><a href="">${item.search_text}</a></li><li class="spacer">
         |
     </li>`;
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

        arr = arr[0].first_qg;
        arr.forEach(item => {
            $('#xsqgCont').append(`<li class="aicao" goods_id="${item.goods_id}" onclick="toShow(this)">
                <a href="">
                    <div>
                        <div class="aicaobao"><img src="${item.image_url}" alt="#"></div>
                        <p>${item.goods_name}</p>
                        <span class="jiage">¥${item.assem_price}</span> <del>¥${item.goods_price}</del>

                    </div>
                </a>
            </li>`);
        });
    })();

    // 排行榜 
    (async () => {
        let [err, data] = await sendAjax('/ranking');
        data = {
            data
        };

        // 数据和模板绑定生成HTML片段
        var tem = template('temp', data);
        $('.phb_top').after(tem);
        $('.phb_zhong ul li a').eq(0).addClass('jingxuan');
        // 添加事件
        $.each($('.phb_zhong ul li a'), function (index, item) {
            $(item).mouseenter(function () {
                $(item).addClass('jingxuan').siblings().removeClass('jingxuan');
                $('.phb .phbfoot ul').eq(index).show().siblings().hide();
            });
        });

    })();

    // 人气好货
    (async () => {
        let [err, arr] = await sendAjax('/goods_eval');
        arr.data.forEach(item => {
            $('#goods_eval').append(` <li>
        <a href="#">
            <div goods_id="${item.goods_id}" onclick="toShow(this)">
                <div class="zhentou"> <img src="${item.image_url}" alt=""></div>
                <h3>${item.goods_name}</h3>
                <p>${item.goods_introduce}</p>
            </div>
        </a>
    </li>`);
        });
        $("#goods_eval li").eq(0).addClass('renqitu1');
        $("#goods_eval li").eq(4).addClass('renqitu2').nextAll().addClass('renqitu3');
    })();

    // 发现好货
    (async ()=>{
        let [err,arr] = await sendAjax('/fxGoods');
        // 将数据和模板绑定生成html片段
        let tem = template('good_temp',arr);
        // 渲染到页面
        $('#fx_goods').html(tem);
    })();

    // 服装配饰
    (async () => {
        let [err, arr] = await sendAjax('/cateGoods');
        arr.imgs = ["img/首页_07.jpg", "img/首页_08.jpg", "img/首页_09.jpg", "img/首页_10.jpg"];
        // 数据和模板绑定生成HTML片段
        var tem = template('fs_temp', arr);
        $("#fuzhuang4").append(tem);
        $("#fyjy li").eq(0).addClass('jyjy2');
        $("#fyjy li").eq(2).addClass('jyjy2 jyjy4');
        $("#fyjy li").eq(3).addClass('jyjy4');
        // console.log(tem);
    })();

    // 猜你喜欢
    (async () => {
        let [err, arr] = await sendAjax('/guessGoods');
        // console.log(arr);
        // 数据和模板绑定生成HTML片段
        var tem = template('end_temp', arr);
        $("#guessGoods").append(tem);
        $("#guessGoods li").eq(0).addClass('cnxhdi1');
        $("#guessGoods li").eq(5).addClass('cnxhdi1');
        $("#guessGoods li").eq(10).addClass('cnxhdi1 cnxhdi2').nextAll().addClass("cnxhdi2");

        // console.log(tem);
    })();
})