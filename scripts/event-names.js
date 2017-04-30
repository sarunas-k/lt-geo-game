var Game;
(function (Game) {
    var EventNames = (function () {
        function EventNames() {
        }
        return EventNames;
    }());
    EventNames.ModalStartGame = 'modal.startGame';
    EventNames.ModalNextQuestionClicked = 'modal.nextQuestion';
    EventNames.FacebookUserDataReady = 'fb.userDataReady';
    EventNames.FacebookUserLoggedIn = 'fb.userLoggedIn';
    Game.EventNames = EventNames;
})(Game || (Game = {}));
