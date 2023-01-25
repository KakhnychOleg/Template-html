$(document).ready(function() {
  // Menu
  $('.menu__burger').click(function(event) {
    $('.menu__burger, .menu').toggleClass('active');
    $('body').toggleClass('lock');
  })
  
  // Slider
  $('.slider__list').slick({
    dots: true,
    infinite: true,
    // nextArrow: '.slick-next-slide',
    // prevArrow: '.slick-prev-slide',
    // appendDots: '.slider__dots',
    autoplay: true,
    speed: 500,
    pauseOnHover: true,
    slidesToShow: 1,
    slidesToScroll: 1
  });

  // Accordion one
  $('.accordion__title').click(function(event) {
    if($('.accordion').hasClass('one')){
      $('.accordion__title').not($(this)).removeClass('active');
      $('.accordion__title-second').not($(this)).removeClass('active');
      $('.accordion__text').not($(this).next()).slideUp(300);
    }
    $(this).toggleClass('active').next().slideToggle(300)
  });
});