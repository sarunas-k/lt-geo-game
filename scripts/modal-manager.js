var Game;
(function (Game) {
    var ModalManager = (function () {
        function ModalManager() {
            this.container = $('.map-game-wrapper .map-content');
            this.mapBackDrop = this.container.find('.map-backdrop');
            this.modalStart = this.container.find('.modal-start');
            this.startButton = this.modalStart.find('.start-button');
            this.modalBetweenQuestions = this.container.find('.modal-between-questions');
            this.nextQuestionButton = this.modalBetweenQuestions.find('.next-button');
            this.modalBetweenLevels = this.container.find('.modal-between-levels');
            this.nextLevelButton = this.modalBetweenLevels.find('.next-button');
            this.modalGameOver = this.container.find('.modal-gameover');
            this.gameResults = this.modalGameOver.find('.game-results');
            this.playAgainButton = this.modalGameOver.find('.play-again-button');
            this.shareButton = this.modalGameOver.find('.share-button');
            this.shareUrl = 'https://www.ltgame.lt';
            this.initFBSharing();
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
        ModalManager.prototype.initModal = function (modal, modalData) {
            this.insertData(modal, modalData);
            this.bindEventHandlers(modal);
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
        ModalManager.prototype.initFBSharing = function () {
            $.ajaxSetup({
                cache: true
            });
            $.getScript("//connect.facebook.net/lt_LT/sdk.js", function () {
                FB.init({
                    appId: '127428917793107',
                    version: 'v2.7',
                    status: true,
                    cookie: true,
                    xfbml: true
                });
            });
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
            else if (modal.is('.modal-between-questions')) {
                this.nextQuestionButton.one('click', function (event) {
                    _this.closeModal(ModalType.BETWEEN_QUESTIONS);
                    eventManager.publish(Game.EventNames.ModalNextQuestionClicked);
                    event.preventDefault();
                    return false;
                });
            }
            else if (modal.is('.modal-between-levels')) {
                this.nextLevelButton.one('click', function (event) {
                    _this.closeModal(ModalType.BETWEEN_LEVELS);
                    eventManager.publish(Game.EventNames.ModalStartGame);
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
                this.shareButton.on('click', function (event) {
                    var title = modal.find('.modal-body .modal-body-inner').text();
                    FB.ui({
                        method: 'share',
                        href: _this.shareUrl,
                        title: title.length ? title : 'LT Geo Game'
                    }, function (response) { });
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
        ModalType[ModalType["BETWEEN_QUESTIONS"] = 1] = "BETWEEN_QUESTIONS";
        ModalType[ModalType["BETWEEN_LEVELS"] = 2] = "BETWEEN_LEVELS";
        ModalType[ModalType["END"] = 3] = "END";
    })(ModalType = Game.ModalType || (Game.ModalType = {}));
})(Game || (Game = {}));
var modalManager = new Game.ModalManager();
