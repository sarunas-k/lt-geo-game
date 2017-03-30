var Game;
(function (Game) {
    var GameController = (function () {
        function GameController() {
            this.container = $('.map-game-wrapper');
            this.mapProgressBar = this.container.find('.map-progress-bar');
            this.progressBar = this.mapProgressBar.find('.progress-bar');
            this.timerText = this.mapProgressBar.find('.timer');
            this.map = this.container.find('.map-content');
            this.mapFooter = this.container.find('.map-footer');
            this.coordinatesText = this.map.find('.coords');
            this.distanceText = this.mapFooter.find('.distance');
            this.markerCorrect = this.map.find('.marker-answer');
            this.markerGuess = this.map.find('.marker-guess');
            this.mapOffset = this.map.offset();
            this.scoreContainer = this.mapFooter.find('.game-score');
            this.scoreElement = this.scoreContainer.find('.game-score-text');
            this.questionInnerContainer = this.mapFooter.find('.question-container .question');
            this.questionTextMain = this.questionInnerContainer.find('.question-main-field');
            this.questionTextSecondary = this.questionInnerContainer.find('.question-secondary-field');
            this.questionCounter = this.map.find('.question-counter');
            this.progressBarUpdateRate = 100;
            this.progressInterval = 0;
            this.questionTime = 10000;
            this.progressYellowTime = this.questionTime * 0.35;
            this.progressRedTime = this.questionTime * 0.15;
            this.progressBarWidthIncreasePerInterval = 100 / (this.questionTime / this.progressBarUpdateRate);
            this.totalPoints = 0;
            this.maxScoreForDistance = 50;
            this.distanceScoreCutoff = 50;
            this.gameLevelsCount = 10;
            this.delayAfterQuestion = 3000;
            this.scaleFactor = 1.735;
            this.colors = {
                red: '#e83a35',
                green: '#5cb85c',
                yellow: '#ffae22'
            };
            this.addLocations();
            this.addQuestions();
            this.subscribeEvents();
            modalManager.openModal(Game.ModalType.START, {
                title: 'Lietuvos pažintinis žaidimas'
            });
        }
        GameController.prototype.subscribeEvents = function () {
            var _this = this;
            eventManager.subscribe(Game.EventNames.ModalStartGame, function () {
                _this.begin();
            });
            eventManager.subscribe(Game.EventNames.ModalNextLevelClicked, function () {
                _this.begin(++_this.level);
            });
        };
        GameController.prototype.addLocations = function () {
            this.locations = [{
                    name: 'Vilnius',
                    x: 503,
                    y: 342
                },
                {
                    name: 'Kaunas',
                    x: 352,
                    y: 302
                },
                {
                    name: 'Klaipėda',
                    x: 50,
                    y: 148
                },
                {
                    name: 'Šiauliai',
                    x: 288,
                    y: 104
                },
                {
                    name: 'Panevėžys',
                    x: 402,
                    y: 142
                },
                {
                    name: 'Alytus',
                    x: 368,
                    y: 398
                },
                {
                    name: 'Marijampolė',
                    x: 293,
                    y: 368
                },
                {
                    name: 'Mažeikiai',
                    x: 182,
                    y: 30
                },
                {
                    name: 'Jonava',
                    x: 394,
                    y: 270
                },
                {
                    name: 'Utena',
                    x: 539,
                    y: 187
                },
                {
                    name: 'Kėdainiai',
                    x: 359,
                    y: 228
                },
                {
                    name: 'Telšiai',
                    x: 172,
                    y: 93
                },
                {
                    name: 'Visaginas',
                    x: 629,
                    y: 168
                },
                {
                    name: 'Tauragė',
                    x: 176,
                    y: 236
                },
                {
                    name: 'Ukmergė',
                    x: 448,
                    y: 236
                },
                {
                    name: 'Plungė',
                    x: 127,
                    y: 108
                },
                {
                    name: 'Kretinga',
                    x: 60,
                    y: 113
                },
                {
                    name: 'Šilutė',
                    x: 86,
                    y: 216
                },
                {
                    name: 'Radviliškis',
                    x: 313,
                    y: 128
                },
                {
                    name: 'Palanga',
                    x: 42,
                    y: 106
                },
                {
                    name: 'Gargždai',
                    x: 76,
                    y: 148
                },
                {
                    name: 'Druskininkai',
                    x: 362,
                    y: 471
                },
                {
                    name: 'Rokiškis',
                    x: 537,
                    y: 99
                },
                {
                    name: 'Biržai',
                    x: 446,
                    y: 50
                },
                {
                    name: 'Elektrėnai',
                    x: 436,
                    y: 324
                },
                {
                    name: 'Garliava',
                    x: 349,
                    y: 316
                },
                {
                    name: 'Kuršėnai',
                    x: 247,
                    y: 90
                },
                {
                    name: 'Jurbarkas',
                    x: 226,
                    y: 268
                },
                {
                    name: 'Vilkaviškis',
                    x: 258,
                    y: 350
                },
                {
                    name: 'Raseiniai',
                    x: 266,
                    y: 210
                },
                {
                    name: 'Anykščiai',
                    x: 485,
                    y: 182
                },
                {
                    name: 'Lentvaris',
                    x: 477,
                    y: 350
                },
                {
                    name: 'Grigiškės',
                    x: 484,
                    y: 344
                },
                {
                    name: 'Naujoji Akmenė',
                    x: 243,
                    y: 28
                },
                {
                    name: 'Prienai',
                    x: 358,
                    y: 352
                },
                {
                    name: 'Joniškis',
                    x: 321,
                    y: 44
                },
                {
                    name: 'Kelmė',
                    x: 247,
                    y: 162
                },
                {
                    name: 'Varėna',
                    x: 427,
                    y: 430
                },
                {
                    name: 'Kaišiadorys',
                    x: 410,
                    y: 310
                },
                {
                    name: 'Pasvalys',
                    x: 406,
                    y: 78
                },
                {
                    name: 'Kupiškis',
                    x: 470,
                    y: 122
                },
                {
                    name: 'Zarasai',
                    x: 609,
                    y: 143
                },
                {
                    name: 'Skuodas',
                    x: 92,
                    y: 38
                },
                {
                    name: 'Molėtai',
                    x: 518,
                    y: 240
                },
                {
                    name: 'Kazlų rūda',
                    x: 308,
                    y: 331
                },
                {
                    name: 'Širvintos',
                    x: 468,
                    y: 274
                },
                {
                    name: 'Šalčininkai',
                    x: 515,
                    y: 414
                },
                {
                    name: 'Šakiai',
                    x: 259,
                    y: 293
                },
                {
                    name: 'Pabradė',
                    x: 556,
                    y: 287
                },
                {
                    name: 'Švenčionėliai',
                    x: 582,
                    y: 252
                },
                {
                    name: 'Šilalė',
                    x: 164,
                    y: 189
                },
                {
                    name: 'Ignalina',
                    x: 600,
                    y: 219
                },
                {
                    name: 'Nemenčinė',
                    x: 524,
                    y: 313
                },
                {
                    name: 'Kybartai',
                    x: 228,
                    y: 352
                },
                {
                    name: 'Švenčionys',
                    x: 600,
                    y: 257
                },
                {
                    name: 'Trakai',
                    x: 466,
                    y: 352
                }
            ];
        };
        GameController.prototype.addQuestions = function () {
            this.questions = [{
                    textMain: 'Vilnius',
                    location: this.locations[0]
                },
                {
                    textMain: 'Kaunas',
                    location: this.locations[1]
                },
                {
                    textMain: 'Klaipėda',
                    location: this.locations[2]
                },
                {
                    textMain: 'Šiauliai',
                    location: this.locations[3]
                },
                {
                    textMain: 'Panevėžys',
                    location: this.locations[4]
                },
                {
                    textMain: 'Alytus',
                    location: this.locations[5]
                },
                {
                    textMain: 'Marijampolė',
                    location: this.locations[6]
                },
                {
                    textMain: 'Mažeikiai',
                    location: this.locations[7]
                },
                {
                    textMain: 'Jonava',
                    location: this.locations[8]
                },
                {
                    textMain: 'Utena',
                    location: this.locations[9]
                },
                {
                    textMain: 'Kėdainiai',
                    location: this.locations[10]
                },
                {
                    textMain: 'Telšiai',
                    location: this.locations[11]
                },
                {
                    textMain: 'Visaginas',
                    location: this.locations[12]
                },
                {
                    textMain: 'Tauragė',
                    location: this.locations[13]
                },
                {
                    textMain: 'Ukmergė',
                    location: this.locations[14]
                },
                {
                    textMain: 'Plungė',
                    location: this.locations[15]
                },
                {
                    textMain: 'Kretinga',
                    location: this.locations[16]
                },
                {
                    textMain: 'Šilutė',
                    location: this.locations[17]
                },
                {
                    textMain: 'Radviliškis',
                    location: this.locations[18]
                },
                {
                    textMain: 'Palanga',
                    location: this.locations[19]
                },
                {
                    textMain: 'Gargždai',
                    location: this.locations[20]
                },
                {
                    textMain: 'Druskininkai',
                    location: this.locations[21]
                },
                {
                    textMain: 'Rokiškis',
                    location: this.locations[22]
                },
                {
                    textMain: 'Biržai',
                    location: this.locations[23]
                },
                {
                    textMain: 'Elektrėnai',
                    location: this.locations[24]
                },
                {
                    textMain: 'Garliava',
                    location: this.locations[25]
                },
                {
                    textMain: 'Kuršėnai',
                    location: this.locations[26]
                },
                {
                    textMain: 'Jurbarkas',
                    location: this.locations[27]
                },
                {
                    textMain: 'Vilkaviškis',
                    location: this.locations[28]
                },
                {
                    textMain: 'Raseiniai',
                    location: this.locations[29]
                },
                {
                    textMain: 'Anykščiai',
                    location: this.locations[30]
                },
                {
                    textMain: 'Lentvaris',
                    location: this.locations[31]
                },
                {
                    textMain: 'Grigiškės',
                    location: this.locations[32]
                },
                {
                    textMain: 'Naujoji Akmenė',
                    location: this.locations[33]
                },
                {
                    textMain: 'Prienai',
                    location: this.locations[34]
                },
                {
                    textMain: 'Joniškis',
                    location: this.locations[35]
                },
                {
                    textMain: 'Kelmė',
                    location: this.locations[36]
                },
                {
                    textMain: 'Varėna',
                    location: this.locations[37]
                },
                {
                    textMain: 'Kaišiadorys',
                    location: this.locations[38]
                },
                {
                    textMain: 'Pasvalys',
                    location: this.locations[39]
                },
                {
                    textMain: 'Kupiškis',
                    location: this.locations[40]
                },
                {
                    textMain: 'Zarasai',
                    location: this.locations[41]
                },
                {
                    textMain: 'Skuodas',
                    location: this.locations[42]
                },
                {
                    textMain: 'Molėtai',
                    location: this.locations[43]
                },
                {
                    textMain: 'Kazlų rūda',
                    location: this.locations[44]
                },
                {
                    textMain: 'Širvintos',
                    location: this.locations[45]
                },
                {
                    textMain: 'Šalčininkai',
                    location: this.locations[46]
                },
                {
                    textMain: 'Šakiai',
                    location: this.locations[47]
                },
                {
                    textMain: 'Pabradė',
                    location: this.locations[48]
                },
                {
                    textMain: 'Švenčionėliai',
                    location: this.locations[49]
                },
                {
                    textMain: 'Šilalė',
                    location: this.locations[50]
                },
                {
                    textMain: 'Ignalina',
                    location: this.locations[51]
                },
                {
                    textMain: 'Nemenčinė',
                    location: this.locations[52]
                },
                {
                    textMain: 'Kybartai',
                    location: this.locations[53]
                },
                {
                    textMain: 'Švenčionys',
                    location: this.locations[54]
                },
                {
                    textMain: 'Trakai',
                    location: this.locations[55]
                }
            ];
        };
        GameController.prototype.enableDeveloperMode = function () {
            var _this = this;
            this.map.on('click', function (event) {
                _this.clickCoordinates = _this.getCoordinatesRelativeToImage(event.pageX, event.pageY);
                _this.coordinatesText.text('X=' + _this.clickCoordinates.x + ' Y=' + _this.clickCoordinates.y);
            });
        };
        GameController.prototype.calculateDistance = function (x1, y1, x2, y2) {
            if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2))
                return;
            return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
        };
        GameController.prototype.convertDistanceToKm = function (value) {
            if (typeof value == 'undefined')
                return;
            return Math.round(value / this.scaleFactor);
        };
        GameController.prototype.getCoordinatesRelativeToImage = function (pageX, pageY) {
            return {
                x: pageX - this.mapOffset.left,
                y: pageY - this.mapOffset.top
            };
        };
        GameController.prototype.bindClickForQuestion = function (question) {
            var _this = this;
            this.map.one('click', function (event) {
                _this.handleAnswerClick(event.pageX, event.pageY, question);
            });
        };
        GameController.prototype.handleAnswerClick = function (pageX, pageY, question) {
            var _this = this;
            this.stopTimer();
            var coordinates = this.getCoordinatesRelativeToImage(pageX, pageY);
            this.setMarker(this.markerGuess, coordinates.x, coordinates.y);
            setTimeout(function () {
                _this.setMarker(_this.markerCorrect, question.location.x, question.location.y);
                _this.drawLineBetweenPoints(coordinates.x, coordinates.y, question.location.x, question.location.y);
                var pointsScored = 0;
                var distanceInKm = _this.convertDistanceToKm(_this.calculateDistance(coordinates.x, coordinates.y, question.location.x, question.location.y));
                if (distanceInKm < _this.distanceScoreCutoff)
                    pointsScored += Math.round(_this.maxScoreForDistance * (1 - (distanceInKm / _this.distanceScoreCutoff)));
                var timeSaved = Math.round(_this.timeLeft / 1000);
                if (timeSaved > 0)
                    pointsScored += timeSaved;
                _this.addToScore(pointsScored);
                setTimeout(function () {
                    if (_this.level == _this.gameLevelsCount) {
                        _this.endGame();
                        return;
                    }
                    var title;
                    if (distanceInKm < 15)
                        title = 'Puiku!';
                    else if (distanceInKm > 15 && distanceInKm < _this.distanceScoreCutoff)
                        title = 'Neblogai! Galėtum dar geriau?';
                    else
                        title = 'Tu gali ir geriau.';
                    modalManager.openModal(Game.ModalType.MIDGAME, {
                        title: title,
                        content: 'Tiksli vieta buvo už <h3>' + distanceInKm + 'km</h3>'
                    });
                }, _this.delayAfterQuestion);
            }, 700);
        };
        GameController.prototype.addToScore = function (number) {
            var _this = this;
            this.totalPoints += number;
            this.scoreElement.css('opacity', '0');
            setTimeout(function () {
                _this.scoreElement.text(_this.totalPoints);
                _this.scoreElement.css('opacity', '1');
            }, 300);
            setTimeout(function () {
                _this.scoreElement.addClass('bump-animate');
            }, 300);
            setTimeout(function () {
                _this.scoreElement.removeClass('bump-animate');
            }, 600);
        };
        GameController.prototype.clearScore = function () {
            this.totalPoints = 0;
            this.scoreElement.text(0);
        };
        GameController.prototype.drawLineBetweenPoints = function (x1, y1, x2, y2) {
            this.map.line(x1, y1, x2, y2, {
                color: '#3e3e3e',
                stroke: 2,
                style: 'dotted'
            });
        };
        GameController.prototype.removeDistanceLine = function () {
            $('.line').remove();
        };
        GameController.prototype.setMarker = function (marker, x, y) {
            marker
                .css({
                left: x + 25,
                top: y - 50
            })
                .animate({
                left: x,
                top: y
            }, {
                duration: 100
            })
                .show();
            $('<span class="shadow"></span>')
                .css({
                opacity: 0,
                left: x,
                top: y
            })
                .animate({
                opacity: 1
            }, {
                duration: 200
            })
                .appendTo(this.map)
                .show();
        };
        GameController.prototype.hideMapMarkers = function () {
            this.markerGuess.hide();
            this.markerCorrect.hide();
            this.map.find('.shadow').remove();
        };
        GameController.prototype.setQuestionText = function (question) {
            var length = question.textMain.length;
            var fontSize;
            if (length <= 16) {
                fontSize = 50;
            }
            else if (length > 16 && length <= 20) {
                fontSize = 40;
            }
            else if (length > 20 && length <= 34) {
                fontSize = 35;
            }
            else {
                fontSize = 30;
            }
            this.questionTextMain
                .css('font-size', fontSize)
                .text(question.textMain);
            if (question.textSecondary)
                this.questionTextSecondary.text(question.textSecondary);
        };
        GameController.prototype.clearQuestionDetails = function () {
            this.questionTextMain.empty();
            this.questionTextSecondary.empty();
            this.hideMapMarkers();
            this.removeDistanceLine();
        };
        GameController.prototype.begin = function (level) {
            if (!level) {
                this.level = 1;
                this.clearScore();
                this.questionSet = this.getRandomElements(this.questions, this.gameLevelsCount);
                this.questionInnerContainer.removeClass('hidden');
            }
            this.startQuestionProcedure();
        };
        GameController.prototype.startQuestionProcedure = function () {
            var _this = this;
            this.clearQuestionDetails();
            this.question = this.questionSet[this.level - 1];
            this.setQuestionText(this.question);
            this.updateQuestionCounter();
            this.questionInnerContainer.removeClass('show-below');
            setTimeout(function () {
                _this.questionInnerContainer.addClass('show-below');
                _this.bindClickForQuestion(_this.question);
                _this.startTimer();
            }, 1500);
        };
        GameController.prototype.setTimerTo = function (seconds) {
            this.timerText.text(this.roundToTenths(seconds).toFixed(1) + 's');
        };
        GameController.prototype.roundToTenths = function (number) {
            return Math.round(10 * number) / 10;
        };
        GameController.prototype.startTimer = function () {
            var _this = this;
            this.resetProgressBar();
            var currentWidth = 0;
            this.timeLeft = this.questionTime;
            this.setTimerTo(0);
            this.progressInterval = setInterval(function () {
                _this.timeLeft -= _this.progressBarUpdateRate;
                if (_this.timeLeft > 0) {
                    currentWidth += _this.progressBarWidthIncreasePerInterval;
                    _this.setProgressBarWidth(currentWidth + '%');
                    if (_this.timeLeft == _this.progressYellowTime)
                        _this.setProgressBarColor(_this.colors.yellow);
                    if (_this.timeLeft == _this.progressRedTime)
                        _this.setProgressBarColor(_this.colors.red);
                    _this.setTimerTo(_this.timeLeft / 1000);
                }
                else {
                    _this.stopTimer();
                    _this.map.unbind();
                    if (_this.level == _this.gameLevelsCount)
                        _this.endGame();
                    else
                        modalManager.openModal(Game.ModalType.MIDGAME, {
                            title: 'Per lėtai...',
                            content: 'Kitą kartą paskubėk atsakyti.'
                        });
                }
            }, this.progressBarUpdateRate);
        };
        GameController.prototype.resetProgressBar = function () {
            var _this = this;
            this.setProgressBarColor(this.colors.green);
            this.progressBar.addClass('no-transitions');
            this.setProgressBarWidth('0');
            setTimeout(function () {
                _this.progressBar.removeClass('no-transitions');
            }, 100);
        };
        GameController.prototype.setProgressBarWidth = function (width) {
            this.progressBar.width(width);
        };
        GameController.prototype.setProgressBarColor = function (color) {
            this.progressBar.css('background-color', color);
        };
        GameController.prototype.stopTimer = function () {
            clearInterval(this.progressInterval);
            this.progressInterval = 0;
            this.setTimerTo(0);
            this.setProgressBarWidth('100%');
        };
        GameController.prototype.endGame = function () {
            modalManager.openModal(Game.ModalType.END, {
                title: 'Sveikinam!',
                content: '<h3>Tavo rezultatas ' + this.totalPoints + ' taškai.</h3>'
            });
        };
        GameController.prototype.shuffle = function (array) {
            var counter = array.length;
            while (counter > 0) {
                var index = Math.floor(Math.random() * counter);
                counter--;
                var temp = array[counter];
                array[counter] = array[index];
                array[index] = temp;
            }
            return array;
        };
        GameController.prototype.getRandomElements = function (array, numberOfQuestions) {
            return this.shuffle(array).slice(0, numberOfQuestions);
        };
        GameController.prototype.updateQuestionCounter = function () {
            this.questionCounter.text('Klausimas ' + this.level + ' iš ' + this.gameLevelsCount);
        };
        return GameController;
    }());
    Game.GameController = GameController;
})(Game || (Game = {}));
new Game.GameController();
