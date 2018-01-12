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