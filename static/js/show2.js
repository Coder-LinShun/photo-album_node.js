$('.del').click(function () {
    var link = $(this).attr('link');
    var $_this = $(this)
    $.get(link, function (data) {
        if (data = 1) {
            viewSwiper.slidePrev();
            $('.swiper-wrapper:last').children().eq($_this.parent().index()).remove();
            if ($_this.parent().siblings().length == 0) {
                $_this.parent().after('<h3>该相册目前没有图片!</h3>')
            }
            $_this.parent().remove();
            viewSwiper.slides.splice($_this.parent().index())
        } else {
            alert('删除失败')
        }
    })

})

var viewSwiper = new Swiper('.view .swiper-container', {
    simulateTouch: false,
    onSlideChangeStart: function () {
        updateNavPosition()
    }
})

$('.view .arrow-left,.preview .arrow-left').on('click', function (e) {
    e.preventDefault()
    if (viewSwiper.activeIndex == 0) {
        return
    }
    viewSwiper.slidePrev()
})
$('.view .arrow-right,.preview .arrow-right').on('click', function (e) {
    e.preventDefault()
    if (viewSwiper.activeIndex == viewSwiper.slides.length - 1) {
        return
    }
    viewSwiper.slideNext()
})

var previewSwiper = new Swiper('.preview .swiper-container', {
    //visibilityFullFit: true,
    slidesPerView: 'auto',
    allowTouchMove: false,
    onTap: function () {
        viewSwiper.slideTo(previewSwiper.clickedIndex)
    }
})

function updateNavPosition() {
    $('.preview .active-nav').removeClass('active-nav')
    var activeNav = $('.preview .swiper-slide').eq(viewSwiper.activeIndex).addClass('active-nav')
    if (!activeNav.hasClass('swiper-slide-visible')) {
        if (activeNav.index() > previewSwiper.activeIndex) {
            var thumbsPerNav = Math.floor(previewSwiper.width / activeNav.width()) - 4
            previewSwiper.slideTo(activeNav.index() - thumbsPerNav)
        } else {
            previewSwiper.slideTo(activeNav.index())
        }
    }
}