
(function () {
    let theHref = window.location.href;
    let tarUrl = getSearchArg('show');
    // 如果没有show这个参数名就返回
    if (tarUrl == '') return;
    // console.log(tarUrl);
    (async function () {
        let [err, arr] = await sendAjax("/shows", { show: tarUrl });
        arr = arr.data;
        console.log(arr);
        let tem = template('shoops_temp',arr);
        // 将小图片渲染到页面
        $('#shoops').html(tem);

        $('#imgCont1').attr('src',arr.goods_image[1].goods_image);
        $('#imgCont2').attr('src',arr.goods_image[2].goods_image);
        $('#imgCont3').attr('src',arr.goods_image[3].goods_image);
        $('#imgCont4').attr('src',arr.goods_image[4].goods_image);



        // 让第一张默认选中
        $("#shoops>div").eq(1).addClass('active');
        // 渲染大图片
        $('#first_img').attr('src', arr.goods_image[0].goods_image);
        // 渲染商品基本信息
        $('#goods_name').html(arr.goods_info[0].goods_name);        // 标题
        $('#goods_text').html(arr.goods_info[0].goods_introduce+'<a href="#">点击查看活动详情!</a>');        // 描述
        $('#goods_price').html(`&yen;${arr.goods_info[0].goods_price}`);        // 价钱

        // 商品规格数据
        $('#attr_list>div').eq(0).html(arr.goods_style[0].style_name_id).addClass('active');
        $('#attr_list>div').eq(1).html(arr.goods_style[0].style_value);
        $('#attr_list>div').eq(2).html(arr.goods_style[0].style_value_id);
        // 标题导航
        $('#layout_list>i').eq(1).html(arr.goods_info[0].first_name);
        $('#layout_list>i').eq(2).html(arr.goods_info[0].second_name);
        $('#layout_list>i').eq(3).html(arr.goods_info[0].thired_name);
        let eval = "";
        // 循环遍历展现评价
        arr.goods_eval.forEach((item, index) => {
            eval += `<p><i>${item.username}：</i>${item.eval_text}</p>`;
        });
        $('#pingjia').html(eval);
        // 点击评价
        $('#ping_title').click(function () {
            $(this).addClass('active').siblings().removeClass('active');
            $("#pingjia").show();
        });

        // 点击商品介绍时隐藏评价
        $('#shoopJS').click(function () {
            $(this).addClass('active').siblings().removeClass('active');
            $("#pingjia").hide();
        });
        // 给图片增加点击事件
        $('#shoops>div>img').click(function () {
            $('#first_img').attr('src', $(this).attr('src'));
            $(this).parent().addClass('active').siblings().removeClass('active');
        });
        // 给规格增加点击事件
        $('#attr_list>div').click(function () {
            $(this).addClass('active').siblings().removeClass('active');
        });

    })();
})();

// 渲染商品 推荐的数据
(async function () {
    let [err, arr] = await sendAjax('/recommend');
    if (arr.code == 200) {
        // 将数据和模板绑定到一起
        let tem = template('show_temp', arr);
        // 将数据渲染到页面上
        $('#showCont_temp').html(tem);
    }
})();
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
    // 搜索框下面商品
    (async function () {
        // console.log(sec);
        let [err, arr] = await sendAjax('/hotkeyword');
        // 渲染数据
        // console.log(arr);
        let str = '';
        arr.data.forEach((item, index) => {
            str += ` <li class="header_box" onclick="search_list(this)">${item.search_text}</li>`;
        });
        $("#daohang").html(str);
        

    })();

    

});
function search_list(obj) {
    location.href = `./search.html?text=${$(obj).html()}`;
}
