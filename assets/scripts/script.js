$(document).ready(function () {
	var links = $('.m-navigation').find('a'),
		slide = $('.w-slide'),
		htmlbody = $('html,body');
	$(window).stellar();		

	slide.waypoint(function (event, direction) {

		dataslide = $(this).attr('data-slide');

		if (direction === 'down') {
			$('.navigation li[data-slide="' + dataslide + '"]').addClass('active').prev().removeClass('active');
		}
		else {
			$('.navigation li[data-slide="' + dataslide + '"]').addClass('active').next().removeClass('active');
		}

	});
 
	$(window).scroll(function () {
		if ($(window).scrollTop() == 0) {
			$('.navigation li[data-slide="1"]').addClass('active');
			$('.navigation li[data-slide="2"]').removeClass('active');
		}
	});

	function goToByScroll(dataslide) {
		htmlbody.animate({
			scrollTop: $('.w-slide[data-slide="' + dataslide + '"]').offset().top
		}, 2000, 'easeInOutQuint');
	}

	links.click(function (e) {
		e.preventDefault();
		dataslide = $(this).attr('data-slide');
		goToByScroll(dataslide);
	});
});