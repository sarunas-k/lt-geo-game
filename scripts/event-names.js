var Game;
(function (Game) {
    var EventNames = (function () {
        function EventNames() {
        }
        return EventNames;
    }());
    EventNames.ModalStartGame = 'modal.startGame';
    EventNames.ModalNextLevelClicked = 'modal.nextLevel';
    Game.EventNames = EventNames;
})(Game || (Game = {}));
