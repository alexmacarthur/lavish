var Hours = {

    clientId : '122433030124-1djhacg129qakh5021jlk0u0anipkls4.apps.googleusercontent.com',
    apiKey : 'AIzaSyDcSD_2cks7H1ybobhl5ac_sJxgVmk31OA',
    calendarIDHours : 'b4gv0ttqhjojjuioopc9n9jr18@group.calendar.google.com',
    calendarIDServiceSpecials : 'vj9gu8ijet2fcgbll94de6gd6k@group.calendar.google.com',
    calendarIDProductSpecials : 'pkt69je4oqfn0orvn3sblnbtgg@group.calendar.google.com',
    userTimeZone : 'Chicago',
    scopes : 'https://www.googleapis.com/auth/calendar',

    handleClientLoad : function() {
        gapi.client.setApiKey(this.apiKey);
        gapi.auth.authorize({client_id: this.clientId, scope: this.scopes, immediate: true}, this.handleAuthResult);
    },

    handleAuthResult : function(authResult) {
        if (authResult) {
            Hours.makeAPICall();
        }
    }, 

    makeAPICall : function() {
        var today = new Date(); 
        var mostRecentSunday = (function() {
            var d = new Date(today);
            d.setDate(d.getDate() - d.getDay());
            return d;
        })();
        var upcomingSaturday = (function() {
            var d = new Date(today.getTime());
            d.setDate(today.getDate() + (13 - today.getDay()) % 7);
            return d;
        })();

        gapi.client.load('calendar', 'v3', function () {
            var $productSpecials = $('#productSpecials');
            var $serviceSpecials = $('#serviceSpecials');
            var $productSpecialsList = $productSpecials.find('ul');
            var $serviceSpecialsList = $serviceSpecials.find('ul');
            var todayBeginning = new Date();
            todayBeginning.setHours(0,0,0,0);
            var todayEnding = new Date();
            todayEnding.setHours(23,59,59,999);

            var request = gapi.client.calendar.events.list({
                'calendarId' : Hours.calendarIDHours,
                'timeZone' : Hours.userTimeZone, 
                'singleEvents': true, 
                'timeMin': mostRecentSunday.toISOString(),
                'timeMax': upcomingSaturday.toISOString(),
                'maxResults': 20, 
                'orderBy': 'startTime'});

            request.execute(function (resp) {
                var $hoursList = $('#hoursList');
                $hoursList.html('');

                var now = new Date();
                var nowUTC = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
                var thisDay = now.getDay();
                var previousDayString = '';

                for(var i = 0; i < resp.items.length; i++) {

                    var startDate = new Date(resp.items[i].start.dateTime);
                    var closeDate = new Date(resp.items[i].end.dateTime);
                    var dayString = Hours.getDayString(startDate.toString().split(' ')[0]);
                    var sameDay = previousDayString === dayString;
                    previousDayString = dayString;

                    var openTime = startDate.getHours();
                    var openTimeSuffix = openTime >= 12 ? 'pm' : 'am';
                    openTime = openTime > 12 ? openTime - 12 : openTime;

                    var closeTime = closeDate.getHours();
                    var closeTimeSuffix = closeTime >= 12 ? 'pm' : 'am';
                    closeTime = closeTime > 12 ? closeTime - 12 : closeTime;

                    if(sameDay) {
                        $hoursList.find('li').last().append(', ' + openTime + openTimeSuffix + ' - ' + closeTime + closeTimeSuffix);
                    } else {
                        $hoursList.append('<li><strong>' + dayString + ':</strong>' + openTime + openTimeSuffix + ' - ' + closeTime + closeTimeSuffix + '</li>');
                    }

                    if(startDate.getDay() === thisDay) {
                        var $topBarHours = $('#topBarHours');
                        var offset = nowUTC.getTimezoneOffset() / 60;
                        var NOW = nowUTC.setHours(nowUTC.getHours() - offset);
                        var OPEN = Math.floor(startDate);
                        var CLOSE = Math.floor(closeDate);

                        $('header').addClass('is-open');
                        $('.TopBar').addClass('is-open');

                        if(NOW > OPEN && NOW < CLOSE) {
                            $topBarHours.html('Open \'til <span>' + closeTime + closeTimeSuffix + '</span>.');
                        } else {
                            $topBarHours.html('Closed Now &mdash; <span>View Hours</span>');
                        }
                    }
                }

            });

            var requestServiceProducts = gapi.client.calendar.events.list({
                'calendarId' : Hours.calendarIDProductSpecials,
                'timeZone' : Hours.userTimeZone, 
                'singleEvents': true, 
                'timeMin': todayBeginning.toISOString(),
                'timeMax': todayEnding.toISOString(),
                'maxResults': 20, 
                'orderBy': 'startTime'});

            requestServiceProducts.execute(function (resp) {
                for(var i = 0; i < resp.items.length; i++) {
                    $productSpecialsList.append('<li>' + resp.items[i].summary + '</li>');
                }
                if(resp.items.length) {
                    $productSpecials.addClass('is-open');
                }
            });

            var requestProductSpecials = gapi.client.calendar.events.list({
                'calendarId' : Hours.calendarIDServiceSpecials,
                'timeZone' : Hours.userTimeZone, 
                'singleEvents': true, 
                'timeMin': todayBeginning.toISOString(),
                'timeMax': todayEnding.toISOString(),
                'maxResults': 20, 
                'orderBy': 'startTime'});

            requestProductSpecials.execute(function (resp) {
                for(var i = 0; i < resp.items.length; i++) {
                    $serviceSpecialsList.append('<li>' + resp.items[i].summary + '</li>');
                }
                if(resp.items.length) {
                    $serviceSpecials.addClass('is-open');
                }
            });
        });
    }, 

    getDayString : function(int) {
        switch(int) {
            case 'Sun':
                return 'Sunday'
                break;
            case 'Mon':
                return 'Monday'
                break;
            case 'Tue':
                return 'Tuesday'
                break;
            case 'Wed':
                return 'Wednesday'
                break;
            case 'Thu':
                return 'Thursday'
                break;
            case 'Fri':
                return 'Friday'
                break;
            case 'Sat':
                return 'Saturday'
                break;
        }
    }
}

var initHours = function() {
    Hours.handleClientLoad();
}