var Lavish = {

	init : function() {
		this.slider();
		this.contactForm();
	},

	svgDividers : {
		0 : {
			name : 'Mirror',
			beenDrawn : false
		}, 

		1 : {
			name : 'Scissors',
			beenDrawn : false
		}, 

		2 : {
			name: 'Shampoo',
			beenDrawn : false
		}

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

	drawSVG : function(el, side) {
  		new Vivus(el, {duration: 50, file: 'assets/img/svg-swirl-' + side + '.svg'}, null);
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
	},

	parallax : function($el){
	  	var scrolled = $(window).scrollTop();
	  	$('.Background').css('top',-(scrolled*0.1)+'px');
	}, 

	_isVisible: function($el) {
      var win = $(window);

      var viewport = {
        top: win.scrollTop(),
        left: win.scrollLeft()
      };

      viewport.right = viewport.left + win.width();
      viewport.bottom = viewport.top + win.height();

      var height = $el.outerHeight();
      var width = $el.outerWidth();

      if (!width || !height) {
        return false;
      }

      var bounds = $el.offset();
      bounds.right = bounds.left + width;
      bounds.bottom = bounds.top + height;

      var visible = (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));

      if (!visible) {
        return false;
      }

      var deltas = {
        top: Math.min(1, (bounds.bottom - viewport.top) / height),
        bottom: Math.min(1, (viewport.bottom - bounds.top) / height),
        left: Math.min(1, (bounds.right - viewport.left) / width),
        right: Math.min(1, (viewport.right - bounds.left) / width)
      };

      return (deltas.left * deltas.right) >= 1 && (deltas.top * deltas.bottom) >= 1;
    },

    svgChecks : function() {
    	Object.keys(Lavish.svgDividers).forEach(function(key) {
			if(Lavish._isVisible($('#divider' + Lavish.svgDividers[key]['name'])) && !Lavish.svgDividers[key]['beenDrawn']) {
				var element = 'svg' + Lavish.svgDividers[key]['name'];
				
				Lavish.svgDividers[key]['beenDrawn'] = true;
				Lavish.drawSVG(element + 'Left', 'left');
				Lavish.drawSVG(element + 'Right', 'right');

				$('#' + element + 'Left').addClass('is-faded-in');
				$('#' + element + 'Right').addClass('is-faded-in');
			}	
	    });
    }
};

$(document).ready(function() {
	Lavish.init();

	$(window).scroll(function(e){
	 	Lavish.parallax();
	 	Lavish.svgChecks();
	});

	Lavish.svgChecks();

});