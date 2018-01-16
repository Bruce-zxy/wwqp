var products = function (name, link, imgSrc, createTime) {
    var docfrag = document.createDocumentFragment();
    var LI = document.createElement('li');
    LI.className = 'col-md-4';
    LI.setAttribute('data-time', createTime);
    var A = document.createElement('a');
    A.href = link;
    var IMG = document.createElement('img');
    IMG.setAttribute('src', imgSrc);
    IMG.setAttribute('alt', 'product');
    var P = document.createElement('p');
    P.textContent = name;
    A.appendChild(IMG);
    LI.appendChild(A);
    LI.appendChild(P);
    docfrag.appendChild(LI);
    return docfrag;
}

var forInProducts = function (data) {
    for (i in data) {
        if (data.hasOwnProperty(i)) {
            $('.products-content .row').prepend(products(data[i].name, data[i].publish_uri, data[i].img_src, data[i].create_time));
        }
    }
}

var mySwiper = new Swiper ('.swiper-container', {
	direction: 'horizontal',
    autoplay: 3000,
    loop: true,
    effect : 'fade',
    
    // 如果需要分页器
    pagination: '.swiper-pagination',
    
    // 如果需要前进后退按钮
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev'
})
$(".panel-heading").click(function (e){
    /*切换折叠指示图标*/
    $(this).find("span").toggleClass("glyphicon-chevron-down");
    $(this).find("span").toggleClass("glyphicon-chevron-up");
});


$("#divAd1, #divAd2").click(function (e) {
    this.style.display = "none";
})

$.ajax({
    type: "post",
    url: "./edit/getAll.php",
    success: function(data) {
        forInProducts(data);
    },
    error: function(a, b) {
        alert('向服务器请求数据失败！');
    }
})
