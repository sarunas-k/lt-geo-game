/// <reference path="../node_modules/@types/jquery/index.d.ts" />
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
        }
    
        public openModalStart(): void {
            this.setStartButtonHandler();
            this.addBackdrop();
            this.modalStart.show();
        }
    
        private closeModalStart(): void {
            this.removeBackdrop();
            this.modalStart.hide();
        }
        
        public openModalMidGame(content: string): void {
            this.setNextButtonHandler();
            this.setQuestionResult(content);
            this.addBackdrop();
            this.modalMidGame.show();
        }
        
        private closeModalMidGame(): void {
            this.removeBackdrop();
            this.modalMidGame.hide();
        }

        public openModalGameOver(content: string): void {
            this.setPlayAgainButtonHandler();
            this.setGameResult(content);
            this.addBackdrop();
            this.modalGameOver.show();
        }

        public closeModalGameOver(): void {
            this.removeBackdrop();
            this.modalGameOver.hide();
        }
    
        private setNextButtonHandler(): void {
            this.nextButton.one('click', (event: JQueryEventObject) => {
                this.closeModalMidGame();
                eventManager.publish(EventNames.ModalNextLevelClicked);
                event.preventDefault();
                return false;
            });
        }
    
        private setStartButtonHandler(): void {
            this.startButton.one('click', (event: JQueryEventObject) => {
                this.closeModalStart();
                eventManager.publish(EventNames.ModalStartGame);
                event.preventDefault();
                return false;
            });
        }

        private setPlayAgainButtonHandler(): void {
            this.playAgainButton.one('click', (event: JQueryEventObject) => {
                this.closeModalGameOver();
                eventManager.publish(EventNames.ModalStartGame);
                event.preventDefault();
                return false;
            });
        }
    
        private setQuestionResult(html: string): void {
            this.questionDetails.html(html);
        }

        private setGameResult(html: string): void {
            this.gameResults.html(html);
        }

        private addBackdrop(): void {
            this.mapBackDrop.css('opacity', '1');
        }

        private removeBackdrop(): void {
            this.mapBackDrop.css('opacity', '0');
        }

    }

    

}

var modalManager: Game.ModalManager = new Game.ModalManager();

