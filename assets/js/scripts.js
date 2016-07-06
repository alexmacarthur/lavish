var Lavish = {

	init : function() {
		this.slider();
		this.contactForm();
		this.svgChecks();
		this.mobileMenu();
		this.smoothScroll();
		this.mobileMenuMargin();
		this.checkHours();
	},

	elements : {
		$nav : $('nav'),
		$navList : $('nav').find('ul')
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

	hours : {
		0 : {
			open: false,
			close: false
		}, 

		1 : {
			open: 16, 
			close: 20
		},

		2 :  {
			open: 12, 
			close: 20
		},

		3 : {
			open: 9, 
			close: 18
		},

		4 : {
			open: 9, 
			close: 18
		},

		5 : {
			open: 9, 
			close: 18
		},

		6 : {
			open: 9,
			close: 14
		},

		7 : {
			open: 9, 
			close: 12
		}
	}, 

	checkHours : function() {
		var $hours = $('#hours');

		var now = new Date();
		var nowUTC = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
		var day = now.getDay();

		var offset = nowUTC.getTimezoneOffset() / 60;
		var NOW = nowUTC.setHours(nowUTC.getHours() - offset);
		var todayOpen = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  Lavish.hours[day].open, 0, 0);
		var todayClose = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  Lavish.hours[day].close, 0, 0);
		var OPEN = Math.floor(todayOpen);
		var CLOSE = Math.floor(todayClose);

		if(NOW > OPEN && NOW < CLOSE) {
			$hours.html('Open \'til <span>' + Lavish._getNonMilitaryTime(Lavish.hours[day].close) + '</span>.');
		}
	},

	_getNonMilitaryTime : function(hours) {
		return (hours > 12) ? hours - 12 + 'pm' : hours + 'am'; 
	},

	mobileMenu : function(){

		$('#menuToggle').on('click', function(e) {
			e.preventDefault();
			this.elements.$nav.addClass('is-open');
		}.bind(this));

		$('#menuClose').on('click', function(e) {
			this.elements.$nav.removeClass('is-open');
		}.bind(this));

		this.elements.$navList.find('a').on('click', function(e) {
			this.elements.$nav.removeClass('is-open');
		}.bind(this));
	},

	mobileMenuMargin : function() {
		if($(window).outerWidth() < 768) {
			var newMargin = ($(window).outerHeight() - this.elements.$navList.outerHeight()) / 2;
			this.elements.$navList.css('margin-top', newMargin);
		} else {
			this.elements.$navList.css('margin-top', '');
		}
	},

	slider : function() {
		$('#testimonialSlider').slick({
			infinite: true,
			slidesToShow: 3,
			slidesToScroll: 3, 
			prevArrow: $('#slickPrev'),
			nextArrow: $('#slickNext'),
			responsive: [
			    {
			      breakpoint: 992,
			      settings: {
			        slidesToShow: 2,
			        slidesToScroll: 2
			      }
			    },
			    {
			      breakpoint: 768,
			      settings: {
			        slidesToShow: 1,
			        slidesToScroll: 1
			      }
			    }
		  	]
		});
	}, 

	contactForm : function() {
		$('#contactForm').on('submit', function(e){
			e.preventDefault();

			var $formName = $('#formName');
			var $formEmail = $('#formEmail');
			var $formMessage = $('#formMessage');
			var $statusMessages = $('#statusMessages');

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
				$statusMessages.html('Your message was successfully sent! Thanks.').removeClass('form-failure').addClass('form-success');
			}).fail(function(data) {
				$statusMessages.html('Sorry, an something\'s messed up. Refresh the page to try again, or just send an email to alex@macarthur.me.').removeClass('form-success').addClass('form-failure');
			});
		});
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
    	dividers = $('.Section--divider');

    	for(var i = 0; i < dividers.length; i++) {
    		$divider = $(dividers[i]);
    		if(Lavish._isVisible($divider)) {
				$divider.addClass('is-visible');
			}
    	}
    }, 

    smoothScroll : function() {
	    $("a[href*='#']:not([href='#'])").on('click', function() {
	      if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
	        var target = $(this.hash);
	        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
	        if (target.length) {
	          $('html,body').animate({
	            scrollTop: target.offset().top - 55
	          }, 500, function() {
	            history.pushState("", document.title, window.location.pathname);
	          });
	          return false;
	        }
	      }
	    });
    }
};

$(document).ready(function() {

	Lavish.init();

	$(window).scroll(function(e){
	 	Lavish.svgChecks();
	 	Lavish.mobileMenuMargin();
	});

});