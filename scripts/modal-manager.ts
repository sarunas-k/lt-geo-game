/// <reference path="../node_modules/@types/jquery/index.d.ts" />
/// <reference path="../node_modules/@types/facebook-js-sdk/index.d.ts" />
/// <reference path="typings/event-manager.d.ts" />
/// <reference path="event-names.ts" />

module Game {

    export class ModalManager {

        private container: JQuery;
        private mapBackDrop: JQuery;
        private modalStart: JQuery;
        private startButton: JQuery;
        private modalMidGame: JQuery;
        private questionDetails: JQuery;
        private nextButton: JQuery;
        private modalGameOver: JQuery;
        private gameResults: JQuery;
        private playAgainButton: JQuery;
        private shareButton: JQuery;

        constructor() {
            this.container = $('.map-game-wrapper .map-content');
            this.mapBackDrop = this.container.find('.map-backdrop');
            // Modal - Start
            this.modalStart = this.container.find('.modal-start');
            this.startButton = this.modalStart.find('.start-button');
            // Modal - Mid game (between questions)
            this.modalMidGame = this.container.find('.modal-mid-game');
            this.questionDetails = this.modalMidGame.find('.question-details');
            this.nextButton = this.modalMidGame.find('.next-button');
            // Modal - Game over
            this.modalGameOver = this.container.find('.modal-gameover');
            this.gameResults = this.modalGameOver.find('.game-results');
            this.playAgainButton = this.modalGameOver.find('.play-again-button');
            this.shareButton = this.modalGameOver.find('.share-button');
            this.initShareButton();
        }

        public openModal(modalType: ModalType, modalData: IModalData): void {
            var modal: JQuery;
            switch (modalType) {
                case ModalType.START:
                    modal = this.modalStart;
                    break;
                case ModalType.MIDGAME:
                    modal = this.modalMidGame;
                    break;
                case ModalType.END:
                    modal = this.modalGameOver;
                    break;
                default:
                    break;
            }

            this.bindEventHandlers(modal);
            this.insertData(modal, modalData);
            this.setVisibility(modal, true);
            this.addBackdrop();
        }

        public closeModal(modalType: ModalType): void {
            var modal: JQuery;
            switch (modalType) {
                case ModalType.START:
                    modal = this.modalStart;
                    break;
                case ModalType.MIDGAME:
                    modal = this.modalMidGame;
                    break;
                case ModalType.END:
                    modal = this.modalGameOver;
                    break;
                default:
                    break;
            }
            this.setVisibility(modal, false);
            this.removeBackdrop();
        }

        private initShareButton(): void {
            $.ajaxSetup({
                cache: true
            });
            $.getScript("//connect.facebook.net/lt_LT/sdk.js", () => {
                FB.init({
                    appId: '127428917793107',
                    version: 'v2.7',
                    status: true,
                    cookie: true,
                    xfbml: true
                });
            });

            this.shareButton.on('click', (event: JQueryEventObject) => {
                FB.ui({
                    method: 'share',
                    href: '//developers.facebook.com/docs/',
                }, function (response) {});
            });
        }

        private bindEventHandlers(modal: JQuery): void {
            if (modal.is('.modal-start')) {
                this.startButton.one('click', (event: JQueryEventObject) => {
                    this.closeModal(ModalType.START);
                    eventManager.publish(EventNames.ModalStartGame);
                    event.preventDefault();
                    return false;
                });
            } else if (modal.is('.modal-mid-game')) {
                this.nextButton.one('click', (event: JQueryEventObject) => {
                    this.closeModal(ModalType.MIDGAME);
                    eventManager.publish(EventNames.ModalNextLevelClicked);
                    event.preventDefault();
                    return false;
                });
            } else if (modal.is('.modal-gameover')) {
                this.playAgainButton.one('click', (event: JQueryEventObject) => {
                    this.closeModal(ModalType.END);
                    eventManager.publish(EventNames.ModalStartGame);
                    event.preventDefault();
                    return false;
                });
            }
        }

        private insertData(modal: JQuery, modalData: IModalData): void {
            if (!modal.length)
                return;

            this.setTitle(modal, modalData.title);
            this.setContent(modal, modalData.content);
        }

        private setTitle(modal: JQuery, title: string): void {
            if (!modal.length)
                return;
            modal.find('.modal-header .modal-title').html(title);
        }

        private setContent(modal: JQuery, content: string): void {
            if (!modal.length)
                return;

            var target: JQuery = modal.find('.modal-body .modal-body-inner');
            if (!content) {
                target.parent().hide();
                return;
            }

            target.html(content).show();
        }

        private setVisibility(target: JQuery, visible: boolean): void {
            visible ? target.addClass('modal-visible') : target.removeClass('modal-visible');
        }

        private addBackdrop(): void {
            this.mapBackDrop.css('opacity', '1');
        }

        private removeBackdrop(): void {
            this.mapBackDrop.css('opacity', '0');
        }

    }

    export enum ModalType {
        START,
        MIDGAME,
        END
    }

}
var modalManager: Game.ModalManager = new Game.ModalManager();