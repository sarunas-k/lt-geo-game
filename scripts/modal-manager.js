var Game;
(function (Game) {
    var ModalManager = (function () {
        function ModalManager() {
            this.container = $('.map-game-wrapper .map-content');
            this.mapBackDrop = this.container.find('.map-backdrop');
            this.modalStart = this.container.find('.modal-start');
            this.startButton = this.modalStart.find('.start-button');
            this.modalMidGame = this.container.find('.modal-mid-game');
            this.questionDetails = this.modalMidGame.find('.question-details');
            this.nextButton = this.modalMidGame.find('.next-button');
            this.modalGameOver = this.container.find('.modal-gameover');
            this.gameResults = this.modalGameOver.find('.game-results');
            this.playAgainButton = this.modalGameOver.find('.play-again-button');
        }
        ModalManager.prototype.openModalStart = function () {
            this.setStartButtonHandler();
            this.addBackdrop();
            this.modalStart.show();
        };
        ModalManager.prototype.closeModalStart = function () {
            this.removeBackdrop();
            this.modalStart.hide();
        };
        ModalManager.prototype.openModalMidGame = function (content) {
            this.setNextButtonHandler();
            this.setQuestionResult(content);
            this.addBackdrop();
            this.modalMidGame.show();
        };
        ModalManager.prototype.closeModalMidGame = function () {
            this.removeBackdrop();
            this.modalMidGame.hide();
        };
        ModalManager.prototype.openModalGameOver = function (content) {
            this.setPlayAgainButtonHandler();
            this.setGameResult(content);
            this.addBackdrop();
            this.modalGameOver.show();
        };
        ModalManager.prototype.closeModalGameOver = function () {
            this.removeBackdrop();
            this.modalGameOver.hide();
        };
        ModalManager.prototype.setNextButtonHandler = function () {
            var _this = this;
            this.nextButton.one('click', function (event) {
                _this.closeModalMidGame();
                eventManager.publish(Game.EventNames.ModalNextLevelClicked);
                event.preventDefault();
                return false;
            });
        };
        ModalManager.prototype.setStartButtonHandler = function () {
            var _this = this;
            this.startButton.one('click', function (event) {
                _this.closeModalStart();
                eventManager.publish(Game.EventNames.ModalStartGame);
                event.preventDefault();
                return false;
            });
        };
        ModalManager.prototype.setPlayAgainButtonHandler = function () {
            var _this = this;
            this.playAgainButton.one('click', function (event) {
                _this.closeModalGameOver();
                eventManager.publish(Game.EventNames.ModalStartGame);
                event.preventDefault();
                return false;
            });
        };
        ModalManager.prototype.setQuestionResult = function (html) {
            this.questionDetails.html(html);
        };
        ModalManager.prototype.setGameResult = function (html) {
            this.gameResults.html(html);
        };
        ModalManager.prototype.addBackdrop = function () {
            this.mapBackDrop.css('opacity', '1');
        };
        ModalManager.prototype.removeBackdrop = function () {
            this.mapBackDrop.css('opacity', '0');
        };
        return ModalManager;
    }());
    Game.ModalManager = ModalManager;
})(Game || (Game = {}));
var modalManager = new Game.ModalManager();
