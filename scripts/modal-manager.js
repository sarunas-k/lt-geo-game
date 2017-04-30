var Game;
(function (Game) {
    var ModalManager = (function () {
        function ModalManager() {
            this.container = $('.map-game-wrapper .map-content');
            this.mapBackDrop = this.container.find('.map-backdrop');
            this.modalStart = this.container.find('.modal-start');
            this.startButton = this.modalStart.find('.start-button');
            this.loginButton = this.modalStart.find('.fb-button');
            this.modalBetweenQuestions = this.container.find('.modal-between-questions');
            this.nextQuestionButton = this.modalBetweenQuestions.find('.next-button');
            this.modalBetweenLevels = this.container.find('.modal-between-levels');
            this.nextLevelButton = this.modalBetweenLevels.find('.next-button');
            this.modalGameOver = this.container.find('.modal-gameover');
            this.gameResults = this.modalGameOver.find('.game-results');
            this.playAgainButton = this.modalGameOver.find('.play-again-button');
            this.shareButton = this.modalGameOver.find('.share-button');
            this.shareUrl = 'https://www.ltgame.lt';
            this.subscribeEvents();
        }
        ModalManager.prototype.openModal = function (modalType, modalData) {
            var modal;
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
        };
        ModalManager.prototype.subscribeEvents = function () {
            var _this = this;
            eventManager.subscribe(Game.EventNames.FacebookUserLoggedIn, function () {
                _this.loginButton.remove();
                _this.startButton.text('Pradėti');
            });
        };
        ModalManager.prototype.initModal = function (modal, modalData) {
            this.insertData(modal, modalData);
            this.bindModalEventHandlers(modal);
        };
        ModalManager.prototype.closeModal = function (modalType) {
            var modal;
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
        };
        ModalManager.prototype.bindModalEventHandlers = function (modal) {
            var _this = this;
            if (modal.is('.modal-start')) {
                this.startButton.one('click', function (event) {
                    event.preventDefault();
                    _this.closeModal(ModalType.START);
                    eventManager.publish(Game.EventNames.ModalStartGame);
                    return false;
                });
                this.loginButton.on('click', function () { return facebookHandler.login(); });
            }
            else if (modal.is('.modal-between-questions')) {
                this.nextQuestionButton.one('click', function (event) {
                    event.preventDefault();
                    _this.closeModal(ModalType.BETWEEN_QUESTIONS);
                    eventManager.publish(Game.EventNames.ModalNextQuestionClicked);
                    return false;
                });
            }
            else if (modal.is('.modal-between-levels')) {
                this.nextLevelButton.one('click', function (event) {
                    event.preventDefault();
                    _this.closeModal(ModalType.BETWEEN_LEVELS);
                    eventManager.publish(Game.EventNames.ModalStartGame);
                    return false;
                });
            }
            else if (modal.is('.modal-gameover')) {
                this.playAgainButton.one('click', function (event) {
                    event.preventDefault();
                    _this.closeModal(ModalType.END);
                    eventManager.publish(Game.EventNames.ModalStartGame);
                    return false;
                });
                this.shareButton.on('click', function () { return facebookHandler.openShareDialog(_this.shareUrl); });
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
        ModalType[ModalType["BETWEEN_QUESTIONS"] = 1] = "BETWEEN_QUESTIONS";
        ModalType[ModalType["BETWEEN_LEVELS"] = 2] = "BETWEEN_LEVELS";
        ModalType[ModalType["END"] = 3] = "END";
    })(ModalType = Game.ModalType || (Game.ModalType = {}));
})(Game || (Game = {}));
var modalManager = new Game.ModalManager();
