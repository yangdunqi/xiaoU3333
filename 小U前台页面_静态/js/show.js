
(function () {
    let theHref = window.location.href;
    let tarUrl = getSearchArg('show');
    // 如果没有show这个参数名就返回
    if(tarUrl == '')  return;
    // console.log(tarUrl);
    (async function () {
        let [err, arr] = await sendAjax("/shows", { show: tarUrl });
        arr = arr.data;
        let str = '';
        arr.goods_image.forEach((item, index) => {
            classCont = `class=""`;
            if (index == 0) classCont = 'class="active"';
            str += `<li ${classCont}><img src="${item.goods_image}" alt=""></li>`;
        });
        // 将小图片渲染到页面
        $('#shoops').html(str);
        // 渲染大图片
        $('#first_img').attr('src', arr.goods_image[0].goods_image);
        // 渲染商品基本信息
        $('#goods_name').html(arr.goods_info[0].goods_name);        // 标题
        $('#goods_text').html(arr.goods_info[0].goods_introduce);        // 描述
        $('#goods_price').html(`&yen;${arr.goods_info[0].goods_price}`);        // 价钱
        // 商品规格数据
        $('#attr_list li').eq(0).html(arr.goods_style[0].style_name_id);
        $('#attr_list li').eq(1).html(arr.goods_style[0].style_value);
        $('#attr_list li').eq(2).html(arr.goods_style[0].style_value_id);
        // 标题导航
        $('#layout_list li a').eq(1).html(arr.goods_info[0].first_name);
        $('#layout_list li a').eq(2).html(arr.goods_info[0].second_name);
        $('#layout_list li a').eq(3).html(arr.goods_info[0].thired_name);
        let eval = "";
        // 循环遍历展现评价
        arr.goods_eval.forEach((item, index) => {
            eval += `<div><i>${item.username}：</i>${item.eval_text}</div>`;
        });
        $('#pingjia').html(eval);
        $('#ping_title').click(function () {
            $("#pingjia").show();
        });

        // 点击商品介绍时隐藏评价
        $('#shoopJS').click(function () {
            $("#pingjia").hide();
        });
        // 给图片增加点击事件
        $('#shoops li').click(function () {
            $('#first_img').attr('src', $(this).children().attr('src'));
            $(this).addClass('active').siblings().removeClass();
        });

    })();
})();

// 渲染商品 推荐的数据
(async function(){
    let [err,arr] = await sendAjax('/recommend');
    if(arr.code == 200){
        // 将数据和模板绑定到一起
        let tem = template('show_temp',arr);
        // 将数据渲染到页面上
        $('#showCont_temp').html(tem);
    }
})();
$(function () {
    // 点击搜索框之后跳转到商品搜索页
    $("#show_submit").click(function () {
        // 判断是否输入商品名称
        if ($('#index_ipt').val() == '') {
            return;
        } else {
            location.href = `./search.html?text=${$('#index_ipt').val()}`;
        }
    });

});