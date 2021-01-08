
// 定义全局变量
let page = 1, limits = 4, order = 'price', ascDesc = 'desc', text = '';
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
$("#right_num").html('1');

// 判断进入商品搜索页是有没有传递参数
if (getSearchArg('text') != '') {
    text = getSearchArg('text');
    searchText(text);
}
// console.log(getSearchArg('text'));


// 搜索框下面商品
(async function () {
    // console.log(sec);
    let [err, arr] = await sendAjax('/hotkeyword');
    // 渲染数据
    // console.log(arr);
    let str = '';
    arr.data.forEach((item, index) => {
        str += ` <li class="header_box"onclick="search_nav(this)">${item.search_text}</li><li class="spacer">
         |
     </li>`;
    });
    $("#daohang").html(str);
})();

function search_nav(obj){
    
    text = $(obj).html();
    searchText(text);
}

// 根据搜索框结果返回数据
$('#submit').click(function () {
    page = 1;
    text = $('#ipt').val();
    searchText(text);
});

// 根据输入的商品名称返回对应商品信息
async function searchText(keyword) {
    let [err, arr] = await sendAjax('/search', { keyword, page, limits, order, ascDesc });

    let str = '';
    // console.log(arr.data[0]);
    if (arr.data[0] == 0) {
        $("#goods_item").html('<h3>查无此商品</h3>');
        $("#zongshu").html(`共${arr.data[0]}件商品`);
    } else {
        // 渲染数据
        for (let i = 1; i < arr.data.length; i++) {
            str += `<li class="goods_item" onclick="toShow(this)" goods_id="${arr.data[i].goods_id}">
                <div class="goods_pic">
                    <img src="${arr.data[i].image_url}" alt="">
                </div>
                <div class="goods_intro">
                    <span class="goods_price">
                        &yen;${arr.data[i].goods_price}
                    </span>
                    <p class="goods_info">${arr.data[i].goods_name}</p>
                </div>
            </li>`;
        }
        $("#goods_item").html(str);
        addGoods(arr.data[0]);
    }
    // console.log(str);


};
// 每个图片设置点击跳转
function toShow(obj) {
    location.href = `./show.html?show=${$(obj).attr('goods_id')}`
}

// 根据某个三级类别查询商品总数和页数
async function addGoods(num) {

    // let [err, arr] = await sendAjax('/totalGoods', { thired });
    // // 总数商品
    // let cont = arr.data[0].total;
    $("#zongshu").html(`共${num}件商品`);
    $("#left_num").html(page);
    let btnPage = Math.ceil(num / limits);
    $("#right_num").html(btnPage);
    // 清空所以页数
    let str = '';
    // 动态创建页数
    for (let i = 0; i < btnPage; i++) {
        classCont = `class="list_none"`;
        if (i == 0) classCont = `class="active list_none"`;
        str += `<span pageNum="${1 + i}" onclick="btnPage(this)" ${classCont} >${1 + i}</span>`;
    };
    if (btnPage > 14) {
        $('#prev_next').html(`${str}<span class="list_end">...</span>`);
    } else {
        $('#prev_next').html(str);
    }
    $("#prev_next span").eq(page - 1).addClass('active').siblings().removeClass('active');
};
$('.sel_options li').click(function () {
    $(this).addClass('active').siblings().removeClass('active');
});
// 给新品添加事件
$('#newShop').click(function () {
    page = 1;
    if ($(this).attr('index') == 1) {
        order = 'id';
        $(this).attr('index', "2");
    } else {
        order = 'price';
        $(this).attr('index', "1");
    }
    searchText(text);
});

// 给销量添加事件
$('#sales').click(function () {
    page = 1;
    order = 'id';
    if ($(this).attr('index') == '1') {
        ascDesc = 'asc';
        $(this).attr('index', "2");
    } else {
        ascDesc = 'desc';
        $(this).attr('index', "1");
    }
    searchText(text);
});


// 给价格添加事件
$('#newPrice').click(function () {
    page = 1;
    order = 'price';
    if ($(this).attr('index') == 1) {
        ascDesc = 'asc';
        $(this).attr('index', "2");
    } else {
        ascDesc = 'desc';
        $(this).attr('index', "1");
    }
    searchText(text);
});


// 给页数怎增加事件
function btnPage(obj) {
    page = $(obj).attr('pageNum');
    searchText(text);

};

// 给上一页或者下一页添加事件
$(".prev_left").on('click', function () {
    prev();
    searchText(text);

});
$(".next_right").on('click', function () {
    next();
    searchText(text);
});

// 上一页函数
function prev() {
    if (page > 1) {
        page--;
    };
};

// 下一页函数
function next() {
    // 总页数
    let num = $("#right_num").html();
    if (page < num) {
        page++;
    };
}