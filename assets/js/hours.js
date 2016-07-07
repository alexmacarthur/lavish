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
        var tomorrow = new Date();
        tomorrow.setTime(tomorrow.getTime() + (24*60*60*1000));

        gapi.client.load('calendar', 'v3', function () {
            var request = gapi.client.calendar.events.list({
                'calendarId' : Hours.calendarID,
                'timeZone' : Hours.userTimeZone, 
                'singleEvents': true, 
                'timeMin': today.toISOString(),
                'timeMax': tomorrow.toISOString(),
                'maxResults': 10, 
                'orderBy': 'startTime'});

            request.execute(function (resp) {
                for(var i = 0; i < resp.items.length; i++) {
                    console.log(resp.items[i].start);
                    console.log(resp.items[i].end);
                    console.log('---');
                }
            });
        });
    }
}

var initHours = function() {
    Hours.handleClientLoad();
}