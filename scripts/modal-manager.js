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
        ModalManager.prototype.openModal = function (modalType, modalData) {
            var modal;
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
        };
        ModalManager.prototype.closeModal = function (modalType) {
            var modal;
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
        };
        ModalManager.prototype.bindEventHandlers = function (modal) {
            var _this = this;
            if (modal.is('.modal-start')) {
                this.startButton.one('click', function (event) {
                    _this.closeModal(ModalType.START);
                    eventManager.publish(Game.EventNames.ModalStartGame);
                    event.preventDefault();
                    return false;
                });
            }
            else if (modal.is('.modal-mid-game')) {
                this.nextButton.one('click', function (event) {
                    _this.closeModal(ModalType.MIDGAME);
                    eventManager.publish(Game.EventNames.ModalNextLevelClicked);
                    event.preventDefault();
                    return false;
                });
            }
            else if (modal.is('.modal-gameover')) {
                this.playAgainButton.one('click', function (event) {
                    _this.closeModal(ModalType.END);
                    eventManager.publish(Game.EventNames.ModalStartGame);
                    event.preventDefault();
                    return false;
                });
            }
        };
        ModalManager.prototype.insertData = function (modal, modalData) {
            if (!modal.length)
                return;
            this.setTitle(modal, modalData.title);
            this.setContent(modal, modalData.content);
        };
        ModalManager.prototype.setTitle = function (modal, title) {
            if (!modal.length)
                return;
            modal.find('.modal-header .modal-title').html(title);
        };
        ModalManager.prototype.setContent = function (modal, content) {
            if (!modal.length)
                return;
            var target = modal.find('.modal-body .modal-body-inner');
            if (!content) {
                target.parent().hide();
                return;
            }
            target.html(content).show();
        };
        ModalManager.prototype.setVisibility = function (target, visible) {
            visible ? target.addClass('modal-visible') : target.removeClass('modal-visible');
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
    var ModalType;
    (function (ModalType) {
        ModalType[ModalType["START"] = 0] = "START";
        ModalType[ModalType["MIDGAME"] = 1] = "MIDGAME";
        ModalType[ModalType["END"] = 2] = "END";
    })(ModalType = Game.ModalType || (Game.ModalType = {}));
})(Game || (Game = {}));
var modalManager = new Game.ModalManager();
