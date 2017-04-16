var Game;
(function (Game) {
    var EventNames = (function () {
        function EventNames() {
        }
        return EventNames;
    }());
    EventNames.ModalStartGame = 'modal.startGame';
    EventNames.ModalNextQuestionClicked = 'modal.nextQuestion';
    Game.EventNames = EventNames;
})(Game || (Game = {}));
