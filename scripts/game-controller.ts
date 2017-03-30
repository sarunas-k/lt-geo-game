/// <reference path="typings/game-controller.d.ts" />

module Game {

    export class GameController {
        private container: JQuery = $('.map-game-wrapper');
        private mapProgressBar: JQuery = this.container.find('.map-progress-bar');
        private progressBar: JQuery = this.mapProgressBar.find('.progress-bar');
        private timerText: JQuery = this.mapProgressBar.find('.timer');
        private map: JQuery = this.container.find('.map-content');
        private mapFooter: JQuery = this.container.find('.map-footer');
        private coordinatesText: JQuery = this.map.find('.coords');
        private distanceText: JQuery = this.mapFooter.find('.distance');
        private markerCorrect: JQuery = this.map.find('.marker-answer');
        private markerGuess: JQuery = this.map.find('.marker-guess');
        private mapOffset = this.map.offset();
        private scoreContainer: JQuery = this.mapFooter.find('.game-score');
        private scoreElement: JQuery = this.scoreContainer.find('.game-score-text');
        private questionInnerContainer: JQuery = this.mapFooter.find('.question-container .question');
        private questionTextMain: JQuery = this.questionInnerContainer.find('.question-main-field');
        private questionTextSecondary: JQuery = this.questionInnerContainer.find('.question-secondary-field');
        private questionCounter: JQuery = this.map.find('.question-counter');

        private level: number;
        private question: IQuestion;
        private questionSet: Array < IQuestion > ;
        private clickCoordinates: ICoordinates;

        /* TIMER */
        private progressBarUpdateRate: number = 100; // progress bar update rate during countdown in ms
        private progressInterval: number = 0;
        private questionTime: number = 10000; // time in milliseconds given for a single question
        private progressYellowTime: number = this.questionTime * 0.35;
        private progressRedTime: number = this.questionTime * 0.15;
        private progressBarWidthIncreasePerInterval = 100 / (this.questionTime / this.progressBarUpdateRate);
        private timeLeft: number;

        private locations: ILocation[];
        private questions: IQuestion[];

        private totalPoints: number = 0;

        /* GAME SETTINGS */
        private maxScoreForDistance: number = 50;
        private distanceScoreCutoff: number = 50; //km
        private gameLevelsCount: number = 10;
        private delayAfterQuestion: number = 3000; //ms
        private scaleFactor = 1.735; // scale for converting distance from pixels to km
        private colors = {
            red: '#e83a35',
            green: '#5cb85c',
            yellow: '#ffae22'
        };

        constructor() {
            this.addLocations();
            this.addQuestions();
            this.subscribeEvents();
            modalManager.openModal(
                ModalType.START, {
                    title: 'Lietuvos pažintinis žaidimas'
                });
            //this.enableDeveloperMode();
        }

        private subscribeEvents(): void {
            eventManager.subscribe(EventNames.ModalStartGame, () => {
                this.begin();
            });
            eventManager.subscribe(EventNames.ModalNextLevelClicked, () => {
                this.begin(++this.level);
            });
        }

        private addLocations(): void {
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
        }

        private addQuestions(): void {
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
        }

        private enableDeveloperMode(): void {
            this.map.on('click', (event: JQueryEventObject) => {
                this.clickCoordinates = this.getCoordinatesRelativeToImage(event.pageX, event.pageY);
                this.coordinatesText.text('X=' + this.clickCoordinates.x + ' Y=' + this.clickCoordinates.y);
            });
        }

        private calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
            if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2))
                return;

            return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
        }

        private convertDistanceToKm(value: number): number {
            if (typeof value == 'undefined')
                return;
            return Math.round(value / this.scaleFactor);
        }

        private getCoordinatesRelativeToImage(pageX: number, pageY: number): ICoordinates {
            return {
                x: pageX - this.mapOffset.left,
                y: pageY - this.mapOffset.top
            };
        }

        private bindClickForQuestion(question: IQuestion): void {
            this.map.one('click', (event: JQueryEventObject) => {
                this.handleAnswerClick(event.pageX, event.pageY, question);
            });
        }

        private handleAnswerClick(pageX: number, pageY: number, question: IQuestion): void {
            this.stopTimer();
            var coordinates: ICoordinates = this.getCoordinatesRelativeToImage(pageX, pageY);
            this.setMarker(this.markerGuess, coordinates.x, coordinates.y);
            // add small delay after answer was given
            setTimeout(() => {
                this.setMarker(this.markerCorrect, question.location.x, question.location.y);
                this.drawLineBetweenPoints(coordinates.x, coordinates.y, question.location.x, question.location.y);

                /*
                 * Score calculation after question:
                 *    Distance (max points can be changed as maxPointsForDistance):
                 *             If you missed by more than [distanceScoreCuttof] km, you get 0 points for distance.
                 *             If you clicked inside allowed limits, your score increases proportionally to the precision of your guess.
                 *         
                 *    Time (max points equal to seconds given for single question (questionTime))
                 *             You get +1 point for every second saved on the clock.
                 */
                var pointsScored: number = 0;
                var distanceInKm: number = this.convertDistanceToKm(this.calculateDistance(coordinates.x, coordinates.y, question.location.x, question.location.y));
                if (distanceInKm < this.distanceScoreCutoff)
                    pointsScored += Math.round(this.maxScoreForDistance * (1 - (distanceInKm / this.distanceScoreCutoff)));
                var timeSaved: number = Math.round(this.timeLeft / 1000);
                if (timeSaved > 0)
                    pointsScored += timeSaved;
                this.addToScore(pointsScored);

                // add small delay before modal is shown
                setTimeout(() => {
                    if (this.level == this.gameLevelsCount) {
                        this.endGame();
                        return;
                    }

                    var title: string;
                    if (distanceInKm < 15)
                        title = 'Puiku!';
                    else if (distanceInKm > 15 && distanceInKm < this.distanceScoreCutoff)
                        title = 'Neblogai! Galėtum dar geriau?';
                    else
                        title = 'Tu gali ir geriau.';

                    modalManager.openModal(ModalType.MIDGAME, {
                        title: title,
                        content: 'Tiksli vieta buvo už <h3>' + distanceInKm + 'km</h3>'
                    });
                }, this.delayAfterQuestion);
            }, 700);
        }

        private addToScore(number: number): void {
            this.totalPoints += number;
            this.scoreElement.css('opacity', '0');
            // delay 300ms for fadeout animation
            setTimeout(() => {
                this.scoreElement.text(this.totalPoints);
                this.scoreElement.css('opacity', '1');
            }, 300);
            // delay 300ms for fadein animation
            setTimeout(() => {
                this.scoreElement.addClass('bump-animate');
            }, 300);
            setTimeout(() => {
                this.scoreElement.removeClass('bump-animate');
            }, 600);
        }

        private clearScore(): void {
            this.totalPoints = 0;
            this.scoreElement.text(0);
        }

        private drawLineBetweenPoints(x1: number, y1: number, x2: number, y2: number): void {
            this.map.line(x1, y1, x2, y2, {
                color: '#3e3e3e',
                stroke: 2,
                style: 'dotted'
            });
        }

        private removeDistanceLine(): void {
            $('.line').remove();
        }

        private setMarker(marker: JQuery, x: number, y: number): void {
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
        }

        private hideMapMarkers(): void {
            this.markerGuess.hide();
            this.markerCorrect.hide();
            this.map.find('.shadow').remove();
        }

        private setQuestionText(question: IQuestion): void {
            var length: number = question.textMain.length;
            var fontSize: number;
            if (length <= 16) {
                fontSize = 50;
            } else if (length > 16 && length <= 20) {
                fontSize = 40;
            } else if (length > 20 && length <= 34) {
                fontSize = 35;
            } else {
                fontSize = 30;
            }


            this.questionTextMain
                .css('font-size', fontSize)
                .text(question.textMain);

            if (question.textSecondary)
                this.questionTextSecondary.text(question.textSecondary);
        }

        private clearQuestionDetails(): void {
            this.questionTextMain.empty();
            this.questionTextSecondary.empty();
            this.hideMapMarkers();
            this.removeDistanceLine();
        }

        private begin(level ? : number): void {
            if (!level) {
                this.level = 1;
                this.clearScore();
                this.questionSet = this.getRandomElements(this.questions, this.gameLevelsCount);
                this.questionInnerContainer.removeClass('hidden');
            }
            this.startQuestionProcedure();
        }

        private startQuestionProcedure(): void {
            this.clearQuestionDetails();
            this.question = this.questionSet[this.level - 1];
            this.setQuestionText(this.question);
            this.updateQuestionCounter();
            this.questionInnerContainer.removeClass('show-below');
            setTimeout(() => {
                this.questionInnerContainer.addClass('show-below');
                this.bindClickForQuestion(this.question);
                this.startTimer();
            }, 1500);
        }

        private setTimerTo(seconds: number): void {
            this.timerText.text(this.roundToTenths(seconds).toFixed(1) + 's');
        }

        private roundToTenths(number: number): number {
            return Math.round(10 * number) / 10;
        }

        private startTimer(): void {
            this.resetProgressBar();
            var currentWidth = 0;
            this.timeLeft = this.questionTime;
            this.setTimerTo(0);
            this.progressInterval = setInterval(() => {
                this.timeLeft -= this.progressBarUpdateRate;
                if (this.timeLeft > 0) {
                    currentWidth += this.progressBarWidthIncreasePerInterval;
                    this.setProgressBarWidth(currentWidth + '%');
                    if (this.timeLeft == this.progressYellowTime)
                        this.setProgressBarColor(this.colors.yellow);
                    if (this.timeLeft == this.progressRedTime)
                        this.setProgressBarColor(this.colors.red);
                    this.setTimerTo(this.timeLeft / 1000);
                } else {
                    this.stopTimer();
                    this.map.unbind();
                    if (this.level == this.gameLevelsCount)
                        this.endGame();
                    else
                        modalManager.openModal(ModalType.MIDGAME, {
                            title: 'Per lėtai...',
                            content: 'Kitą kartą paskubėk atsakyti.'
                        });
                }
            }, this.progressBarUpdateRate);
        }

        // remove transitions when progressbar is reset, because we want to start from 0 instantly
        // instead of slow transition backwards.
        // timeout needed because transitions are turned on again too quickly and are still showing.
        private resetProgressBar(): void {
            this.setProgressBarColor(this.colors.green);
            this.progressBar.addClass('no-transitions');
            this.setProgressBarWidth('0');
            setTimeout(() => {
                this.progressBar.removeClass('no-transitions');
            }, 100);
        }

        private setProgressBarWidth(width: string): void {
            this.progressBar.width(width);
        }

        private setProgressBarColor(color: string): void {
            this.progressBar.css('background-color', color);
        }

        private stopTimer(): void {
            clearInterval(this.progressInterval);
            this.progressInterval = 0;
            this.setTimerTo(0);
            this.setProgressBarWidth('100%');
        }

        private endGame(): void {
            modalManager.openModal(ModalType.END, {
                title: 'Sveikinam!',
                content: '<h3>Tavo rezultatas ' + this.totalPoints + ' taškai.</h3>'
            });

        }

        private shuffle(array: IQuestion[]): IQuestion[] {
            let counter = array.length;

            // While there are elements in the array
            while (counter > 0) {
                // Pick a random index
                let index = Math.floor(Math.random() * counter);

                // Decrease counter by 1
                counter--;

                // And swap the last element with it
                let temp = array[counter];
                array[counter] = array[index];
                array[index] = temp;
            }

            return array;
        }

        private getRandomElements(array: IQuestion[], numberOfQuestions: number): IQuestion[] {
            return this.shuffle(array).slice(0, numberOfQuestions);
        }

        private updateQuestionCounter(): void {
            this.questionCounter.text('Klausimas ' + this.level + ' iš ' + this.gameLevelsCount);
        }


    }
}

new Game.GameController();