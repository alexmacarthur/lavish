var Lavish = {

	init : function() {
		this.slider();
	},

	slider : function() {
		$('#testimonialSlider').slick({
			infinite: true,
			slidesToShow: 3,
			slidesToScroll: 3, 
			prevArrow: $('#slickPrev'),
			nextArrow: $('#slickNext')
		});
	}, 

	contactForm : function() {
		$('#ContactForm').on('submit', function(e){
			e.preventDefault();

			var $formName = $('#formName');
			var $formEmail = $('#formEmail');
			var $formMessage = $('#formMessage');
			var $statusMessages = $('#StatusMessages');

			$statusMessages.removeClass('failure success');

			$.ajax({
				url: "//formspree.io/alex@macarthur.me",
				method: "POST",
				data: {
					name: $formName.val(),
					email: $formEmail.val(),
					message: $formMessage.val(),
				},
				dataType: "json"
			}).done(function(response) {
				$formName.val('');
				$formEmail.val('');
				$formMessage.val('');
				$statusMessages.html('Your message was successfully sent! Thanks.').removeClass('failure').addClass('success');
			}).fail(function(data) {
				$statusMessages.html('Sorry, an something\'s messed up. Refresh the page to try again, or just send an email to alex@macarthur.me.').removeClass('success').addClass('failure');
			});
		});
	}
};

Lavish.init();