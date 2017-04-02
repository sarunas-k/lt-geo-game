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
        private districts: IDistrict[];
        private questionListCities: IQuestion[];
        private questionListFamousPlaces: IQuestion[];


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
            this.addDistricts();
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

        private addDistricts(): void {
            this.districts = [{
                    name: 'Alytaus apskritis'
                },
                {
                    name: 'Kauno apskritis'
                },
                {
                    name: 'Klaipėdos apskritis'
                },
                {
                    name: 'Marijampolės apskritis'
                },
                {
                    name: 'Panevėžio apskritis'
                },
                {
                    name: 'Šiaulių apskritis'
                },
                {
                    name: 'Tauragės apskritis'
                },
                {
                    name: 'Telšių apskritis'
                },
                {
                    name: 'Utenos apskritis'
                },
                {
                    name: 'Vilniaus apskritis'
                }
            ];
        }

        private addLocations(): void {
            this.locations = [{
                    name: 'Vilnius',
                    district: this.districts[9],
                    x: 503,
                    y: 342
                },
                {
                    name: 'Kaunas',
                    district: this.districts[1],
                    x: 352,
                    y: 302
                },
                {
                    name: 'Klaipėda',
                    district: this.districts[2],
                    x: 50,
                    y: 148
                },
                {
                    name: 'Šiauliai',
                    district: this.districts[5],
                    x: 288,
                    y: 104
                },
                {
                    name: 'Panevėžys',
                    district: this.districts[4],
                    x: 402,
                    y: 142
                },
                {
                    name: 'Alytus',
                    district: this.districts[0],
                    x: 368,
                    y: 398
                },
                {
                    name: 'Marijampolė',
                    district: this.districts[3],
                    x: 293,
                    y: 368
                },
                {
                    name: 'Mažeikiai',
                    district: this.districts[7],
                    x: 182,
                    y: 30
                },
                {
                    name: 'Jonava',
                    district: this.districts[1],
                    x: 394,
                    y: 270
                },
                {
                    name: 'Utena',
                    district: this.districts[8],
                    x: 539,
                    y: 187
                },
                {
                    name: 'Kėdainiai',
                    district: this.districts[1],
                    x: 359,
                    y: 228
                },
                {
                    name: 'Telšiai',
                    district: this.districts[7],
                    x: 172,
                    y: 93
                },
                {
                    name: 'Visaginas',
                    district: this.districts[8],
                    x: 629,
                    y: 168
                },
                {
                    name: 'Tauragė',
                    district: this.districts[6],
                    x: 176,
                    y: 236
                },
                {
                    name: 'Ukmergė',
                    district: this.districts[9],
                    x: 448,
                    y: 236
                },
                {
                    name: 'Plungė',
                    district: this.districts[7],
                    x: 127,
                    y: 108
                },
                {
                    name: 'Kretinga',
                    district: this.districts[2],
                    x: 60,
                    y: 113
                },
                {
                    name: 'Šilutė',
                    district: this.districts[2],
                    x: 86,
                    y: 216
                },
                {
                    name: 'Radviliškis',
                    district: this.districts[5],
                    x: 313,
                    y: 128
                },
                {
                    name: 'Palanga',
                    district: this.districts[2],
                    x: 42,
                    y: 106
                },
                {
                    name: 'Gargždai',
                    district: this.districts[2],
                    x: 76,
                    y: 148
                },
                {
                    name: 'Druskininkai',
                    district: this.districts[0],
                    x: 362,
                    y: 471
                },
                {
                    name: 'Rokiškis',
                    district: this.districts[4],
                    x: 537,
                    y: 99
                },
                {
                    name: 'Biržai',
                    district: this.districts[4],
                    x: 446,
                    y: 50
                },
                {
                    name: 'Elektrėnai',
                    district: this.districts[9],
                    x: 436,
                    y: 324
                },
                {
                    name: 'Garliava',
                    district: this.districts[1],
                    x: 349,
                    y: 316
                },
                {
                    name: 'Kuršėnai',
                    district: this.districts[5],
                    x: 247,
                    y: 90
                },
                {
                    name: 'Jurbarkas',
                    district: this.districts[6],
                    x: 226,
                    y: 268
                },
                {
                    name: 'Vilkaviškis',
                    district: this.districts[3],
                    x: 258,
                    y: 350
                },
                {
                    name: 'Raseiniai',
                    district: this.districts[1],
                    x: 266,
                    y: 210
                },
                {
                    name: 'Anykščiai',
                    district: this.districts[8],
                    x: 485,
                    y: 182
                },
                {
                    name: 'Lentvaris',
                    district: this.districts[9],
                    x: 477,
                    y: 350
                },
                {
                    name: 'Grigiškės',
                    district: this.districts[9],
                    x: 484,
                    y: 344
                },
                {
                    name: 'Naujoji Akmenė',
                    district: this.districts[5],
                    x: 243,
                    y: 28
                },
                {
                    name: 'Prienai',
                    district: this.districts[1],
                    x: 358,
                    y: 352
                },
                {
                    name: 'Joniškis',
                    district: this.districts[5],
                    x: 321,
                    y: 44
                },
                {
                    name: 'Kelmė',
                    district: this.districts[5],
                    x: 247,
                    y: 162
                },
                {
                    name: 'Varėna',
                    district: this.districts[0],
                    x: 427,
                    y: 430
                },
                {
                    name: 'Kaišiadorys',
                    district: this.districts[1],
                    x: 410,
                    y: 310
                },
                {
                    name: 'Pasvalys',
                    district: this.districts[4],
                    x: 406,
                    y: 78
                },
                {
                    name: 'Kupiškis',
                    district: this.districts[4],
                    x: 470,
                    y: 122
                },
                {
                    name: 'Zarasai',
                    district: this.districts[8],
                    x: 609,
                    y: 143
                },
                {
                    name: 'Skuodas',
                    district: this.districts[2],
                    x: 92,
                    y: 38
                },
                {
                    name: 'Molėtai',
                    district: this.districts[8],
                    x: 518,
                    y: 240
                },
                {
                    name: 'Kazlų rūda',
                    district: this.districts[3],
                    x: 308,
                    y: 331
                },
                {
                    name: 'Širvintos',
                    district: this.districts[9],
                    x: 468,
                    y: 274
                },
                {
                    name: 'Šalčininkai',
                    district: this.districts[9],
                    x: 515,
                    y: 414
                },
                {
                    name: 'Šakiai',
                    district: this.districts[3],
                    x: 259,
                    y: 293
                },
                {
                    name: 'Pabradė',
                    district: this.districts[9],
                    x: 556,
                    y: 287
                },
                {
                    name: 'Švenčionėliai',
                    district: this.districts[9],
                    x: 582,
                    y: 252
                },
                {
                    name: 'Šilalė',
                    district: this.districts[6],
                    x: 164,
                    y: 189
                },
                {
                    name: 'Ignalina',
                    district: this.districts[8],
                    x: 600,
                    y: 219
                },
                {
                    name: 'Nemenčinė',
                    district: this.districts[9],
                    x: 524,
                    y: 313
                },
                {
                    name: 'Kybartai',
                    district: this.districts[3],
                    x: 228,
                    y: 352
                },
                {
                    name: 'Švenčionys',
                    district: this.districts[9],
                    x: 600,
                    y: 257
                },
                {
                    name: 'Pakruojis',
                    district: this.districts[5],
                    x: 340,
                    y: 94
                },
                {
                    name: 'Trakai',
                    district: this.districts[9],
                    x: 466,
                    y: 352
                }
            ];
        }

        private addQuestions(): void {
            this.questionListCities = [{
                    text: 'Vilnius',
                    location: this.locations[0]
                },
                {
                    text: 'Kaunas',
                    location: this.locations[1]
                },
                {
                    text: 'Klaipėda',
                    location: this.locations[2]
                },
                {
                    text: 'Šiauliai',
                    location: this.locations[3]
                },
                {
                    text: 'Panevėžys',
                    location: this.locations[4]
                },
                {
                    text: 'Alytus',
                    location: this.locations[5]
                },
                {
                    text: 'Marijampolė',
                    location: this.locations[6]
                },
                {
                    text: 'Mažeikiai',
                    location: this.locations[7]
                },
                {
                    text: 'Jonava',
                    location: this.locations[8]
                },
                {
                    text: 'Utena',
                    location: this.locations[9]
                },
                {
                    text: 'Kėdainiai',
                    location: this.locations[10]
                },
                {
                    text: 'Telšiai',
                    location: this.locations[11]
                },
                {
                    text: 'Visaginas',
                    location: this.locations[12]
                },
                {
                    text: 'Tauragė',
                    location: this.locations[13]
                },
                {
                    text: 'Ukmergė',
                    location: this.locations[14]
                },
                {
                    text: 'Plungė',
                    location: this.locations[15]
                },
                {
                    text: 'Kretinga',
                    location: this.locations[16]
                },
                {
                    text: 'Šilutė',
                    location: this.locations[17]
                },
                {
                    text: 'Radviliškis',
                    location: this.locations[18]
                },
                {
                    text: 'Palanga',
                    location: this.locations[19]
                },
                {
                    text: 'Gargždai',
                    location: this.locations[20]
                },
                {
                    text: 'Druskininkai',
                    location: this.locations[21]
                },
                {
                    text: 'Rokiškis',
                    location: this.locations[22]
                },
                {
                    text: 'Biržai',
                    location: this.locations[23]
                },
                {
                    text: 'Elektrėnai',
                    location: this.locations[24]
                },
                {
                    text: 'Garliava',
                    location: this.locations[25]
                },
                {
                    text: 'Kuršėnai',
                    location: this.locations[26]
                },
                {
                    text: 'Jurbarkas',
                    location: this.locations[27]
                },
                {
                    text: 'Vilkaviškis',
                    location: this.locations[28]
                },
                {
                    text: 'Raseiniai',
                    location: this.locations[29]
                },
                {
                    text: 'Anykščiai',
                    location: this.locations[30]
                },
                {
                    text: 'Lentvaris',
                    location: this.locations[31]
                },
                {
                    text: 'Grigiškės',
                    location: this.locations[32]
                },
                {
                    text: 'Naujoji Akmenė',
                    location: this.locations[33]
                },
                {
                    text: 'Prienai',
                    location: this.locations[34]
                },
                {
                    text: 'Joniškis',
                    location: this.locations[35]
                },
                {
                    text: 'Kelmė',
                    location: this.locations[36]
                },
                {
                    text: 'Varėna',
                    location: this.locations[37]
                },
                {
                    text: 'Kaišiadorys',
                    location: this.locations[38]
                },
                {
                    text: 'Pasvalys',
                    location: this.locations[39]
                },
                {
                    text: 'Kupiškis',
                    location: this.locations[40]
                },
                {
                    text: 'Zarasai',
                    location: this.locations[41]
                },
                {
                    text: 'Skuodas',
                    location: this.locations[42]
                },
                {
                    text: 'Molėtai',
                    location: this.locations[43]
                },
                {
                    text: 'Kazlų rūda',
                    location: this.locations[44]
                },
                {
                    text: 'Širvintos',
                    location: this.locations[45]
                },
                {
                    text: 'Šalčininkai',
                    location: this.locations[46]
                },
                {
                    text: 'Šakiai',
                    location: this.locations[47]
                },
                {
                    text: 'Pabradė',
                    location: this.locations[48]
                },
                {
                    text: 'Švenčionėliai',
                    location: this.locations[49]
                },
                {
                    text: 'Šilalė',
                    location: this.locations[50]
                },
                {
                    text: 'Ignalina',
                    location: this.locations[51]
                },
                {
                    text: 'Nemenčinė',
                    location: this.locations[52]
                },
                {
                    text: 'Kybartai',
                    location: this.locations[53]
                },
                {
                    text: 'Švenčionys',
                    location: this.locations[54]
                },
                {
                    text: 'Trakai',
                    location: this.locations[55]
                }
            ];

            this.questionListFamousPlaces = [{
                text: '',
                location: this.locations[0]
            }];
        }

        private enableDeveloperMode(): void {
            this.map.on('click', (event: JQueryEventObject) => {
                this.clickCoordinates = this.getCoordinatesRelativeToImage(event.pageX, event.pageY);
                this.coordinatesText.text('X=' + this.clickCoordinates.x + ' Y=' + this.clickCoordinates.y);
            });
            var editor: JQuery = $('.editor').show();
            var menuTabs: JQuery = editor.find('.menu-tab');
            var tabLocations: JQuery = editor.find('.locations-editor');
            var tabQuestions: JQuery = editor.find('.questions-editor');
            var menuItems: JQuery = editor.find('.nav li');

            menuItems.on('click', (event: JQueryEventObject) => {
                var element: JQuery = $(event.currentTarget);
                var isActive: boolean = element.is('.active');
                if (isActive)
                    return;

                menuTabs.hide();
                if (element.is('.item-locations')) {
                    tabLocations.show();
                } else if (element.is('.item-questions')) {
                    tabQuestions.show();
                }

                menuItems.each((i: number, e: HTMLElement) => {
                    var element: JQuery = $(e);
                    if (element.is('.active'))
                        element.removeClass('active');
                });

                element.addClass('active');
            });

            tabLocations.show();

            // TAB 1
            var formLocation: JQuery = tabLocations.find('form');
            var selectDistrict: JQuery = formLocation.find('select');
            var inputName: JQuery = formLocation.find('.name');
            var inputX: JQuery = formLocation.find('.coordx');
            var inputY: JQuery = formLocation.find('.coordy');
            var outputLocation: JQuery = tabLocations.find('.output');

            $.each(this.districts, (index: number, district: IDistrict) => {
                selectDistrict.append('<option value="' + index + '" ' + (index == 0 ? 'selected' : '') + '>' + district.name + '</option>');
            });

            formLocation.submit((event: JQueryEventObject) => {
                event.preventDefault();
                outputLocation.html('{ name: \'' + inputName.val() + '\', district: this.districts[' + selectDistrict.val() + '], x: ' + inputX.val() + ', y: ' + inputY.val() + ' }');
            });

            // TAB 2
            var formQuestion: JQuery = tabQuestions.find('form');
            var selectLocations: JQuery = formQuestion.find('select');
            var inputQuestion: JQuery = formQuestion.find('.question-text');
            var outputQuestion: JQuery = tabQuestions.find('.output');

            $.each(this.locations, (index: number, location: ILocation) => {
                selectLocations.append('<option value="' + index + '" ' + (index == 0 ? 'selected' : '') + '>' + location.name + '</option>');
            });

            formQuestion.submit((event: JQueryEventObject) => {
                event.preventDefault();
                outputQuestion.html('{ text: \'' + inputQuestion.val() + '\', location: this.locations[' + selectLocations.val() + '] }');
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
            var length: number = question.text.length;
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
                .text(question.text);

            this.questionTextSecondary.text(question.location.district.name);
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
                this.questionSet = this.getRandomElements(this.questionListCities, this.gameLevelsCount);
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
                content: '<h3>Tavo rezultatas ' + this.totalPoints + ' tašk' + this.correctEnding() + '.</h3>'
            });
        }

        private correctEnding(number = this.totalPoints): string {
            var ending: string = '';
            var pointsString: string = number.toString();
            var length: number = pointsString.length;
            var lastDigit: string = pointsString[length - 1];
            var lastTwoString: string;
            var lastTwoNumber: number;
            if (length > 1) {
                lastTwoString = pointsString.slice(length - 2);
                lastTwoNumber = Number(lastTwoString);
            }

            if ((length == 1 && lastDigit == '1') || (length > 1 && lastDigit == '1' && lastTwoString != '11'))
                ending = 'as';
            else if (lastDigit == '0' || (length > 1 && (lastTwoNumber > 10 && lastTwoNumber < 20)))
                ending = 'ų';
            else
                ending = 'ai';

            return ending;
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