var Lavish = {

	init : function() {
		this.slider();
	},

	slider : function() {
		$('#testimonialSlider').slick({
			infinite: true,
			slidesToShow: 3,
			slidesToScroll: 3
		});
	}
}

Lavish.init();