// 定义全局变量
let page = 1, limits = 4, order = 'price', ascDesc = 'desc';

// 点击搜索框之后跳转到商品搜索页
$("#list_submit").click(function () {
    // 判断是否输入商品名称
    if ($('#index_ipt').val() == '') {
        return;
    } else {
        location.href = `./search.html?text=${$('#index_ipt').val()}`;
    }
});

// 获取一级列表
async function firstId() {
    let [err, arr] = await sendAjax('/cateFirst');
    // 渲染数据
    arr = arr.data;
    let str = '';
    arr.forEach((item, index) => {
        classCont = `class=""`;
        if (index == 0) classCont = `class="active_first"`;
        str += `<li first_id="${item.first_id}" onclick="clickFirst(this)" ${classCont} >${item.first_name}</li>`;
    });
    $("#first_list").html(str);

    // 根据第一个一级列表id获取二级列表
    secondId($(".active_first").attr('first_id'));
    // console.log(arr);
};
firstId();

// 点击一级列表函数
function clickFirst(obj) {
    page = 1;
    $(obj).addClass('active_first').siblings().removeClass();
    secondId($(obj).attr('first_id'));
}


// 根据一级列表的id获取二级列表
async function secondId(fir) {
    let [err, arr] = await sendAjax('/firstId', { fir });
    // 渲染数据
    let str = '';
    arr.data.forEach((item, index) => {
        classCont = `class=""`;
        if (index == 0) classCont = `class="active_second"`;
        str += `<li second_id="${item.second_id}"  onclick="clickSecond(this)" ${classCont}>${item.second_name}</li>`;
    });
    $("#second_list").html(str);

    // 根据第一个二级列表id获取三级级列表
    thiredId($(".active_second").attr('second_id'));

};

// 二级列表点击事件
function clickSecond(obj) {
    page = 1;
    $(obj).addClass('active_second').siblings().removeClass();
    thiredId($(obj).attr('second_id'));

}



// 根据二级列表id获取三级列表
async function thiredId(sec) {
    // console.log(sec);
    let [err, arr] = await sendAjax('/secondId', { sec });
    // 渲染数据
    let str = '';
    arr.data.forEach((item, index) => {
        classCont = `class=""`;
        if (index == 0) classCont = `class="active_third"`;
        str += `<li third_id="${item.thired_id}"  onclick="clickThird(this)" ${classCont}>${item.thired_name}</li>`;
    });
    $("#thired_list").html(str);
    // 初始化数据
    goodList($(".active_third").attr('third_id'));

};

// // 三级列表点击事件
function clickThird(obj) {
    page = 1;
    $(obj).addClass('active_third').siblings().removeClass();
    goodList($(obj).attr('third_id'));
}

// 根据三级列表第一id获取对应商品列表
async function goodList(thiredid) {
    let [err, arr] = await sendAjax('/goodsList', { thiredid, page, limits, order, ascDesc });
    let str = '';
    // console.log(arr);
    // 渲染数据
    arr.data.forEach(item => {
        str += `<li class="goods_item" onclick="toShow(this)" goods_id="${item.goods_id}">
        <div class="goods_pic">
            <img src="${item.image_url}" alt="">
        </div>
        <div class="goods_intro">
            <span class="goods_price">
                &yen;${item.goods_price}
            </span>
            <p class="goods_info">${item.goods_name}</p>
        </div>
    </li>`;
    });
    $("#goods_item").html(str);
    // console.log(str);
    addGoods(thiredid);



};


// 根据某个三级类别查询商品总数和页数
async function addGoods(thired) {

    let [err, arr] = await sendAjax('/totalGoods', { thired });
    // 总数商品
    let cont = arr.data[0].total;
    $("#zongshu").html(`共${cont}件商品`);
    $("#left_num").html(page);
    let btnPage = Math.ceil(cont / limits);
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
// 每个图片设置点击跳转
function toShow(obj){
    location.href = `./show.html?show=${$(obj).attr('goods_id')}`
}
$('.sel_options li').click(function(){
    $(this).addClass('active').siblings().removeClass('active');
});
// 给销量添加事件
$('#newShop').click(function(){
    page = 1;
    if($(this).attr('index') == 1){
        order = 'id';
        $(this).attr('index',"2");
    }else {
        order = 'price';
        $(this).attr('index',"1");
    }
    goodList($(".active_third").attr('third_id'));
});

// 给新品添加事件
$('#sales').click(function(){
    order = 'id';
    page = 1;
    if($(this).attr('index') == 1){
        ascDesc = 'asc';
        $(this).attr('index',"2");
    }else {
        ascDesc = 'desc';
        $(this).attr('index',"1");
    }
    goodList($(".active_third").attr('third_id'));
});


// 给价格添加事件
$('#newPrice').click(function(){
    order = 'price';
    page = 1;
    if($(this).attr('index') == 1){
        ascDesc = 'asc';
        $(this).attr('index',"2");
    }else {
        ascDesc = 'desc';
        $(this).attr('index',"1");
    }
    goodList($(".active_third").attr('third_id'));
});

// 给页数怎增加事件
function btnPage(obj) {
    page = $(obj).attr('pageNum');
    goodList($(".active_third").attr('third_id'));

};

// 给上一页或者下一页添加事件
$(".prev_left").on('click', function () {
    prev();
    goodList($(".active_third").attr('third_id'));

});
$(".next_right").on('click', function () {
    next();
    goodList($(".active_third").attr('third_id'));
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
};

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
