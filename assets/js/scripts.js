var Lavish = {

	init : function() {
		this.slider();
	},

	slider : function() {
		$('#testimonialSlider').slick({
			centerMode: true,
			slidesToShow: 3
		});
	}
}

Lavish.init();