var galleryTop = new Swiper('.gallery-top', {
  initialSlide: 0, // Start at the far left slide
  spaceBetween: 2,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  loop: true,
  autoplay: {
    delay: 7500,
    disableOnInteraction: false,
  },
  loopedSlides: 2
});

var galleryThumbs = new Swiper('.gallery-thumbs', {
  spaceBetween: 5,
  centeredSlides: true,
  slidesPerView: 'auto',
  touchRatio: 0.8,
  slideToClickedSlide: true,
  loop: true,
  loopedSlides: 2
});

galleryTop.controller.control = galleryThumbs;
galleryThumbs.controller.control = galleryTop;