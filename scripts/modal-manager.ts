/// <reference path="../node_modules/@types/jquery/index.d.ts" />
/// <reference path="../node_modules/@types/facebook-js-sdk/index.d.ts" />
/// <reference path="typings/event-manager.d.ts" />
/// <reference path="event-names.ts" />
/// <reference path="facebook-handler.ts" />

module Game {

    export class ModalManager {

        private container: JQuery;
        private mapBackDrop: JQuery;
        private modalStart: JQuery;
        private startButton: JQuery;
        private loginButton: JQuery;
        private modalBetweenQuestions: JQuery;
        private nextQuestionButton: JQuery;
        private modalBetweenLevels: JQuery;
        private nextLevelButton: JQuery;
        private modalGameOver: JQuery;
        private gameResults: JQuery;
        private playAgainButton: JQuery;
        private shareButton: JQuery;
        private shareUrl: string;

        constructor() {
            this.container = $('.map-game-wrapper .map-content');
            this.mapBackDrop = this.container.find('.map-backdrop');
            // Modal - Start
            this.modalStart = this.container.find('.modal-start');
            this.startButton = this.modalStart.find('.start-button');
            this.loginButton = this.modalStart.find('.fb-button');
            // Modal - Between questions
            this.modalBetweenQuestions = this.container.find('.modal-between-questions');
            this.nextQuestionButton = this.modalBetweenQuestions.find('.next-button');
            // Modal - Between levels
            this.modalBetweenLevels = this.container.find('.modal-between-levels');
            this.nextLevelButton = this.modalBetweenLevels.find('.next-button');
            // Modal - Game over
            this.modalGameOver = this.container.find('.modal-gameover');
            this.gameResults = this.modalGameOver.find('.game-results');
            this.playAgainButton = this.modalGameOver.find('.play-again-button');
            this.shareButton = this.modalGameOver.find('.share-button');
            this.shareUrl = 'https://www.ltgame.lt';
            this.subscribeEvents();
        }

        public openModal(modalType: ModalType, modalData: IModalData): void {
            var modal: JQuery;
            switch (modalType) {
                case ModalType.START:
                    modal = this.modalStart;
                    break;
                case ModalType.BETWEEN_QUESTIONS:
                    modal = this.modalBetweenQuestions;
                    break;
                case ModalType.BETWEEN_LEVELS:
                    modal = this.modalBetweenLevels;
                    break;
                case ModalType.END:
                    modal = this.modalGameOver;
                    break;
                default:
                    break;
            }
            this.initModal(modal, modalData);
            this.setVisibility(modal, true);
            this.addBackdrop();
        }

        private subscribeEvents(): void {
            eventManager.subscribe(EventNames.FacebookUserLoggedIn, () => {
                this.loginButton.remove();
                this.startButton.text('Pradėti');
            });
        }

        private initModal(modal: JQuery, modalData: IModalData): void {
            this.insertData(modal, modalData);
            this.bindModalEventHandlers(modal);
        }

        public closeModal(modalType: ModalType): void {
            var modal: JQuery;
            switch (modalType) {
                case ModalType.START:
                    modal = this.modalStart;
                    break;
                case ModalType.BETWEEN_QUESTIONS:
                    modal = this.modalBetweenQuestions;
                    break;
                case ModalType.BETWEEN_LEVELS:
                    modal = this.modalBetweenLevels;
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

        private bindModalEventHandlers(modal: JQuery): void {
            if (modal.is('.modal-start')) {
                this.startButton.one('click', (event: JQueryEventObject) => {
                    event.preventDefault();
                    this.closeModal(ModalType.START);
                    eventManager.publish(EventNames.ModalStartGame);
                    return false;
                });
                this.loginButton.on('click', () => facebookHandler.login());
                
            } else if (modal.is('.modal-between-questions')) {
                this.nextQuestionButton.one('click', (event: JQueryEventObject) => {
                    event.preventDefault();
                    this.closeModal(ModalType.BETWEEN_QUESTIONS);
                    eventManager.publish(EventNames.ModalNextQuestionClicked);
                    return false;
                });
            } else if (modal.is('.modal-between-levels')) {
                this.nextLevelButton.one('click', (event: JQueryEventObject) => {
                    event.preventDefault();
                    this.closeModal(ModalType.BETWEEN_LEVELS);
                    eventManager.publish(EventNames.ModalStartGame);
                    return false;
                });
            } else if (modal.is('.modal-gameover')) {
                this.playAgainButton.one('click', (event: JQueryEventObject) => {
                    event.preventDefault();
                    this.closeModal(ModalType.END);
                    eventManager.publish(EventNames.ModalStartGame);
                    return false;
                });

                this.shareButton.on('click', () => facebookHandler.openShareDialog(this.shareUrl));
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
        BETWEEN_QUESTIONS,
        BETWEEN_LEVELS,
        END
    }

}
var modalManager: Game.ModalManager = new Game.ModalManager();