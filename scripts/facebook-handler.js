var Game;
(function (Game) {
    var FacebookHandler = (function () {
        function FacebookHandler() {
            var _this = this;
            this.appId = '127428917793107';
            $.ajaxSetup({
                cache: true
            });
            $.getScript("//connect.facebook.net/lt_LT/sdk.js", function () { return _this.initFB(); });
        }
        FacebookHandler.prototype.initFB = function () {
            FB.init({
                appId: this.appId,
                version: 'v2.9',
                status: true,
                cookie: true,
                xfbml: true
            });
            this.checkLoginStatus();
        };
        FacebookHandler.prototype.login = function () {
            var _this = this;
            FB.login(function (response) {
                _this.loginStatus = response.status;
                if (response.authResponse)
                    eventManager.publish(Game.EventNames.FacebookUserLoggedIn);
                else
                    console.log('User cancelled login or did not fully authorize.');
            }, { scope: 'public_profile,email,publish_actions' });
        };
        FacebookHandler.prototype.checkLoginStatus = function () {
            var _this = this;
            FB.getLoginStatus(function (response) { return _this.loginStatus = response.status; });
        };
        FacebookHandler.prototype.openShareDialog = function (href) {
            FB.ui({
                method: 'share',
                href: href
            }, function (response) { });
        };
        FacebookHandler.prototype.loadUserData = function () {
            var _this = this;
            if (this.loginStatus !== 'connected') {
                console.log('Can\'t load user data, because user is not logged in.');
                return;
            }
            FB.api('/me?fields=first_name,scores,picture', function (response) {
                if (!response || response.error) {
                    console.log('Error getting user data');
                    return;
                }
                _this.username = response.first_name;
                _this.imageUrl = response.picture.data.url;
                _this.score = response.scores.data[0];
                eventManager.publish(Game.EventNames.FacebookUserDataReady);
            });
        };
        FacebookHandler.prototype.getUserData = function () {
            return {
                name: this.username,
                imageUrl: this.imageUrl,
                score: this.score
            };
        };
        FacebookHandler.prototype.updateScore = function (score) {
            FB.api('/me/scores', 'post', { score: score }, function (response) { });
        };
        return FacebookHandler;
    }());
    Game.FacebookHandler = FacebookHandler;
})(Game || (Game = {}));
var facebookHandler = new Game.FacebookHandler();
