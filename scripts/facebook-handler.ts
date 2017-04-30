/// <reference path="../node_modules/@types/facebook-js-sdk/index.d.ts" />

module Game {

    export class FacebookHandler {

        public loginStatus: string;
        private appId: string = '127428917793107';
        private username: string;
        private imageUrl: string;
        private score: IFacebookGameScore;

        constructor() {
            $.ajaxSetup({
                cache: true
            });
            $.getScript("//connect.facebook.net/lt_LT/sdk.js", () => this.initFB());
        }

        private initFB(): void {
            FB.init({
                appId: this.appId,
                version: 'v2.9',
                status: true,
                cookie: true,
                xfbml: true
            });
            this.checkLoginStatus();
        }

        public login(): void {
            FB.login(
                (response) => {
                    this.loginStatus = response.status;
                    if (response.authResponse)
                        eventManager.publish(EventNames.FacebookUserLoggedIn);
                    else
                        console.log('User cancelled login or did not fully authorize.');
                },
                {scope: 'public_profile,email,publish_actions'}
            );
        }

        public checkLoginStatus(): void {
            FB.getLoginStatus(response => this.loginStatus = response.status);
        }

        public openShareDialog(href: string): void {
            FB.ui({
                method: 'share',
                href: href
            }, (response: any) => {});
        }

        public loadUserData(): void {
            if (this.loginStatus !== 'connected') {
                console.log('Can\'t load user data, because user is not logged in.');
                return;
            }
            FB.api('/me?fields=first_name,scores,picture', (response: any) => {
                if (!response || response.error) {
                    console.log('Error getting user data');
                    return;
                }

                this.username = response.first_name;
                this.imageUrl = response.picture.data.url;
                this.score = response.scores.data[0];

                eventManager.publish(EventNames.FacebookUserDataReady);
            });
        }

        public getUserData(): IFacebookUser {
            return {
                name: this.username,
                imageUrl: this.imageUrl,
                score: this.score
            };
        }

        public updateScore(score: number): void {
            FB.api(
                '/me/scores',
                'post',
                { score: score },
                (response: any) => {}
            );
        }

        // public sendTest(): void {
        //     FB.api('/me/feed', (response: any) => {
        //         console.log('Response for /me/feed', response);
        //     });
        // }

    }

    export interface IFacebookUser {
        name: string;
        imageUrl: string;
        score: IFacebookGameScore;
    }

    export interface IFacebookGameScore {
        score: number;
    }

}

var facebookHandler: Game.FacebookHandler = new Game.FacebookHandler();