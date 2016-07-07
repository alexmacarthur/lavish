var Hours = {

    clientId : '122433030124-1djhacg129qakh5021jlk0u0anipkls4.apps.googleusercontent.com',
    apiKey : 'AIzaSyDcSD_2cks7H1ybobhl5ac_sJxgVmk31OA',
    calendarID : 'b4gv0ttqhjojjuioopc9n9jr18@group.calendar.google.com',
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
            var request = gapi.client.calendar.events.list({
                'calendarId' : Hours.calendarID,
                'timeZone' : Hours.userTimeZone, 
                'singleEvents': true, 
                'timeMin': mostRecentSunday.toISOString(),
                'timeMax': upcomingSaturday.toISOString(),
                'maxResults': 10, 
                'orderBy': 'startTime'});

            request.execute(function (resp) {
                var $hoursList = $('#hoursList');
                $hoursList.html('');

                var now = new Date();
                var nowUTC = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
                var day = now.getDay();

                for(var i = 0; i < resp.items.length; i++) {
                    var startDate = new Date(resp.items[i].start.dateTime);
                    var closeDate = new Date(resp.items[i].end.dateTime);
                    var dayString = Hours.getDayString(startDate.getUTCDay());

                    var openTime = startDate.getHours();
                    var openTimeSuffix = openTime >= 12 ? 'pm' : 'am';
                    openTime = openTime > 12 ? openTime - 12 : openTime;

                    var closeTime = closeDate.getHours();
                    var closeTimeSuffix = closeTime >= 12 ? 'pm' : 'am';
                    closeTime = closeTime > 12 ? closeTime - 12 : openTime;

                    $hoursList.append('<li><strong>' + dayString + ':</strong>' + openTime + openTimeSuffix + ' - ' + closeTime + closeTimeSuffix + '</li>');

                    if(startDate.getDay() === day) {
                        var $topBarHours = $('#hours');
                        var offset = nowUTC.getTimezoneOffset() / 60;
                        var NOW = nowUTC.setHours(nowUTC.getHours() - offset);
                        var OPEN = Math.floor(startDate);
                        var CLOSE = Math.floor(closeDate);

                        if(NOW > OPEN && NOW < CLOSE) {
                            $topBarHours.html('Open \'til <span>' + closeTime + closeTimeSuffix + '</span>.');
                        } else {
                            $topBarHours.html('Closed Now &mdash; <span>View Hours</span>');
                        }
                    }

                }

            });
        });
    }, 

     getNonMilitaryTime : function(hours) {
        return (hours > 12) ? hours - 12 + 'pm' : hours + 'am'; 
    },

    getDayString : function(int) {
        switch(int) {
            case 0:
                return 'Sunday'
                break;
            case 1:
                return 'Monday'
                break;
            case 2:
                return 'Tuesday'
                break;
            case 3:
                return 'Wednesday'
                break;
            case 4:
                return 'Thursday'
                break;
            case 5:
                return 'Friday'
                break;
            case 6:
                return 'Saturday'
                break;
        }
    },

    updateHours : function() {

        // var $hours = $('#hours');

        // var now = new Date();
        // var nowUTC = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
        // var day = now.getDay();

        // var offset = nowUTC.getTimezoneOffset() / 60;
        // var NOW = nowUTC.setHours(nowUTC.getHours() - offset);
        // var todayOpen = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  Lavish.hours[day].open, 0, 0);
        // var todayClose = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  Lavish.hours[day].close, 0, 0);
        // var OPEN = Math.floor(todayOpen);
        // var CLOSE = Math.floor(todayClose);

        // if(NOW > OPEN && NOW < CLOSE) {
        //     $hours.html('Open \'til <span>' + Lavish._getNonMilitaryTime(Lavish.hours[day].close) + '</span>.');
        // }
    },
}

var initHours = function() {
    Hours.handleClientLoad();
}