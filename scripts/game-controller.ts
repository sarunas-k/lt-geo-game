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
        private levelIntro: JQuery = this.map.find('.level-intro');
        private levelIntroText: JQuery = this.levelIntro.find('h1');

        private currentLevel: number = 1;
        private currentQuestionNumber: number = 1;
        private currentQuestion: IQuestion;
        private currentQuestionsList: Array < IQuestion > ;
        private clickCoordinates: ICoordinates;

        /* TIMER */
        private progressBarUpdateRate: number = 100; // progress bar update rate during countdown in ms
        private progressInterval: number = 0;
        private questionTime: number = 10000; // time in milliseconds given for a single question
        private progressYellowTime: number = this.questionTime * 0.35;
        private progressRedTime: number = this.questionTime * 0.15;
        private progressBarWidthIncreasePerInterval = 100 / (this.questionTime / this.progressBarUpdateRate);
        private timeLeft: number;

        private locationsList: ILocation[];
        private districtsList: IDistrict[];
        private questionCitiesList: IQuestion[];
        private questionFamousPlacesList: IQuestion[];

        private totalPoints: number = 0;

        /* GAME SETTINGS */
        private maxScoreForDistance: number = 50;
        private distanceScoreCutoff: number = 50; //km
        private questionsPerLevel: number = 10;
        private levelsCount: number = 2;
        private pointsToAdvance: number = ((this.maxScoreForDistance + (this.questionTime / 1000)) * this.questionsPerLevel) * 0.4; // 40% of maximum points per level
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
                this.currentQuestionNumber++;
                this.begin();
            });
        }

        private addDistricts(): void {
            this.districtsList = [{
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
            this.locationsList = [{
                    name: 'Vilnius',
                    district: this.districtsList[9],
                    x: 503,
                    y: 342
                },
                {
                    name: 'Kaunas',
                    district: this.districtsList[1],
                    x: 352,
                    y: 302
                },
                {
                    name: 'Klaipėda',
                    district: this.districtsList[2],
                    x: 50,
                    y: 148
                },
                {
                    name: 'Šiauliai',
                    district: this.districtsList[5],
                    x: 288,
                    y: 104
                },
                {
                    name: 'Panevėžys',
                    district: this.districtsList[4],
                    x: 402,
                    y: 142
                },
                {
                    name: 'Alytus',
                    district: this.districtsList[0],
                    x: 368,
                    y: 398
                },
                {
                    name: 'Marijampolė',
                    district: this.districtsList[3],
                    x: 293,
                    y: 368
                },
                {
                    name: 'Mažeikiai',
                    district: this.districtsList[7],
                    x: 182,
                    y: 30
                },
                {
                    name: 'Jonava',
                    district: this.districtsList[1],
                    x: 394,
                    y: 270
                },
                {
                    name: 'Utena',
                    district: this.districtsList[8],
                    x: 539,
                    y: 187
                },
                {
                    name: 'Kėdainiai',
                    district: this.districtsList[1],
                    x: 359,
                    y: 228
                },
                {
                    name: 'Telšiai',
                    district: this.districtsList[7],
                    x: 172,
                    y: 93
                },
                {
                    name: 'Visaginas',
                    district: this.districtsList[8],
                    x: 629,
                    y: 168
                },
                {
                    name: 'Tauragė',
                    district: this.districtsList[6],
                    x: 176,
                    y: 236
                },
                {
                    name: 'Ukmergė',
                    district: this.districtsList[9],
                    x: 448,
                    y: 236
                },
                {
                    name: 'Plungė',
                    district: this.districtsList[7],
                    x: 127,
                    y: 108
                },
                {
                    name: 'Kretinga',
                    district: this.districtsList[2],
                    x: 60,
                    y: 113
                },
                {
                    name: 'Šilutė',
                    district: this.districtsList[2],
                    x: 86,
                    y: 216
                },
                {
                    name: 'Radviliškis',
                    district: this.districtsList[5],
                    x: 313,
                    y: 128
                },
                {
                    name: 'Palanga',
                    district: this.districtsList[2],
                    x: 42,
                    y: 106
                },
                {
                    name: 'Gargždai',
                    district: this.districtsList[2],
                    x: 76,
                    y: 148
                },
                {
                    name: 'Druskininkai',
                    district: this.districtsList[0],
                    x: 362,
                    y: 471
                },
                {
                    name: 'Rokiškis',
                    district: this.districtsList[4],
                    x: 537,
                    y: 99
                },
                {
                    name: 'Biržai',
                    district: this.districtsList[4],
                    x: 446,
                    y: 50
                },
                {
                    name: 'Elektrėnai',
                    district: this.districtsList[9],
                    x: 436,
                    y: 324
                },
                {
                    name: 'Garliava',
                    district: this.districtsList[1],
                    x: 349,
                    y: 316
                },
                {
                    name: 'Kuršėnai',
                    district: this.districtsList[5],
                    x: 247,
                    y: 90
                },
                {
                    name: 'Jurbarkas',
                    district: this.districtsList[6],
                    x: 226,
                    y: 268
                },
                {
                    name: 'Vilkaviškis',
                    district: this.districtsList[3],
                    x: 258,
                    y: 350
                },
                {
                    name: 'Raseiniai',
                    district: this.districtsList[1],
                    x: 266,
                    y: 210
                },
                {
                    name: 'Anykščiai',
                    district: this.districtsList[8],
                    x: 485,
                    y: 182
                },
                {
                    name: 'Lentvaris',
                    district: this.districtsList[9],
                    x: 477,
                    y: 350
                },
                {
                    name: 'Grigiškės',
                    district: this.districtsList[9],
                    x: 484,
                    y: 344
                },
                {
                    name: 'Naujoji Akmenė',
                    district: this.districtsList[5],
                    x: 243,
                    y: 28
                },
                {
                    name: 'Prienai',
                    district: this.districtsList[1],
                    x: 358,
                    y: 352
                },
                {
                    name: 'Joniškis',
                    district: this.districtsList[5],
                    x: 321,
                    y: 44
                },
                {
                    name: 'Kelmė',
                    district: this.districtsList[5],
                    x: 247,
                    y: 162
                },
                {
                    name: 'Varėna',
                    district: this.districtsList[0],
                    x: 427,
                    y: 430
                },
                {
                    name: 'Kaišiadorys',
                    district: this.districtsList[1],
                    x: 410,
                    y: 310
                },
                {
                    name: 'Pasvalys',
                    district: this.districtsList[4],
                    x: 406,
                    y: 78
                },
                {
                    name: 'Kupiškis',
                    district: this.districtsList[4],
                    x: 470,
                    y: 122
                },
                {
                    name: 'Zarasai',
                    district: this.districtsList[8],
                    x: 609,
                    y: 143
                },
                {
                    name: 'Skuodas',
                    district: this.districtsList[2],
                    x: 92,
                    y: 38
                },
                {
                    name: 'Molėtai',
                    district: this.districtsList[8],
                    x: 518,
                    y: 240
                },
                {
                    name: 'Kazlų rūda',
                    district: this.districtsList[3],
                    x: 308,
                    y: 331
                },
                {
                    name: 'Širvintos',
                    district: this.districtsList[9],
                    x: 468,
                    y: 274
                },
                {
                    name: 'Šalčininkai',
                    district: this.districtsList[9],
                    x: 515,
                    y: 414
                },
                {
                    name: 'Šakiai',
                    district: this.districtsList[3],
                    x: 259,
                    y: 293
                },
                {
                    name: 'Pabradė',
                    district: this.districtsList[9],
                    x: 556,
                    y: 287
                },
                {
                    name: 'Švenčionėliai',
                    district: this.districtsList[9],
                    x: 582,
                    y: 252
                },
                {
                    name: 'Šilalė',
                    district: this.districtsList[6],
                    x: 164,
                    y: 189
                },
                {
                    name: 'Ignalina',
                    district: this.districtsList[8],
                    x: 600,
                    y: 219
                },
                {
                    name: 'Nemenčinė',
                    district: this.districtsList[9],
                    x: 524,
                    y: 313
                },
                {
                    name: 'Kybartai',
                    district: this.districtsList[3],
                    x: 228,
                    y: 352
                },
                {
                    name: 'Švenčionys',
                    district: this.districtsList[9],
                    x: 600,
                    y: 257
                },
                {
                    name: 'Pakruojis',
                    district: this.districtsList[5],
                    x: 340,
                    y: 94
                },
                {
                    name: 'Trakai',
                    district: this.districtsList[9],
                    x: 466,
                    y: 352
                },
                {
                    name: 'Kryžių kalnas',
                    district: this.districtsList[5],
                    x: 300,
                    y: 88
                },
                {
                    name: 'Rumšiškės, Lietuvos liaudies buities muziejus',
                    district: this.districtsList[1],
                    x: 385,
                    y: 309
                },
                {
                    name: 'Europos parkas',
                    district: this.districtsList[9],
                    x: 509,
                    y: 316
                },
                {
                    name: 'Grūto parkas',
                    district: this.districtsList[0],
                    x: 370,
                    y: 468
                },
                {
                    name: 'Molėtų astronomijos observatorija',
                    district: this.districtsList[8],
                    x: 534,
                    y: 223
                },
                {
                    name: 'Ventės ragas',
                    district: this.districtsList[2],
                    x: 56,
                    y: 217
                },
                {
                    name: 'Trakų pilis',
                    district: this.districtsList[9],
                    x: 465,
                    y: 348
                },
                {
                    name: 'Olando kepurė',
                    district: this.districtsList[2],
                    x: 42,
                    y: 128
                },
                {
                    name: 'Puntuko akmuo',
                    district: this.districtsList[8],
                    x: 479,
                    y: 191
                },
                {
                    name: 'Barstyčių akmuo',
                    district: this.districtsList[2],
                    x: 132,
                    y: 53
                },
                {
                    name: 'Velnio duobė',
                    district: this.districtsList[9],
                    x: 419,
                    y: 357
                },
                {
                    name: 'Pučkorių atodanga',
                    district: this.districtsList[9],
                    x: 511,
                    y: 342
                },
                {
                    name: 'Ladakalnis',
                    district: this.districtsList[8],
                    x: 579,
                    y: 212
                },
                {
                    name: 'Medvėgalio kalva',
                    district: this.districtsList[6],
                    x: 185,
                    y: 165
                },
                {
                    name: 'Šatrijos kalva',
                    district: this.districtsList[7],
                    x: 204,
                    y: 115
                },
                {
                    name: 'Vilnius, Šv. Onos bažnyčia',
                    district: this.districtsList[9],
                    x: 505,
                    y: 342
                },
                {
                    name: 'Europos geografinis centras',
                    district: this.districtsList[9],
                    x: 507,
                    y: 302
                },
                {
                    name: 'Vilniaus televizijos bokštas',
                    district: this.districtsList[9],
                    x: 497,
                    y: 341
                },
                {
                    name: 'Kauno pilis',
                    district: this.districtsList[1],
                    x: 348,
                    y: 301
                },
                {
                    name: 'Medininkų pilis',
                    district: this.districtsList[9],
                    x: 544,
                    y: 370
                }

            ];
        }

        private addQuestions(): void {
            this.questionCitiesList = [{
                    text: 'Vilnius',
                    location: this.locationsList[0]
                },
                {
                    text: 'Kaunas',
                    location: this.locationsList[1]
                },
                {
                    text: 'Klaipėda',
                    location: this.locationsList[2]
                },
                {
                    text: 'Šiauliai',
                    location: this.locationsList[3]
                },
                {
                    text: 'Panevėžys',
                    location: this.locationsList[4]
                },
                {
                    text: 'Alytus',
                    location: this.locationsList[5]
                },
                {
                    text: 'Marijampolė',
                    location: this.locationsList[6]
                },
                {
                    text: 'Mažeikiai',
                    location: this.locationsList[7]
                },
                {
                    text: 'Jonava',
                    location: this.locationsList[8]
                },
                {
                    text: 'Utena',
                    location: this.locationsList[9]
                },
                {
                    text: 'Kėdainiai',
                    location: this.locationsList[10]
                },
                {
                    text: 'Telšiai',
                    location: this.locationsList[11]
                },
                {
                    text: 'Visaginas',
                    location: this.locationsList[12]
                },
                {
                    text: 'Tauragė',
                    location: this.locationsList[13]
                },
                {
                    text: 'Ukmergė',
                    location: this.locationsList[14]
                },
                {
                    text: 'Plungė',
                    location: this.locationsList[15]
                },
                {
                    text: 'Kretinga',
                    location: this.locationsList[16]
                },
                {
                    text: 'Šilutė',
                    location: this.locationsList[17]
                },
                {
                    text: 'Radviliškis',
                    location: this.locationsList[18]
                },
                {
                    text: 'Palanga',
                    location: this.locationsList[19]
                },
                {
                    text: 'Gargždai',
                    location: this.locationsList[20]
                },
                {
                    text: 'Druskininkai',
                    location: this.locationsList[21]
                },
                {
                    text: 'Rokiškis',
                    location: this.locationsList[22]
                },
                {
                    text: 'Biržai',
                    location: this.locationsList[23]
                },
                {
                    text: 'Elektrėnai',
                    location: this.locationsList[24]
                },
                {
                    text: 'Garliava',
                    location: this.locationsList[25]
                },
                {
                    text: 'Kuršėnai',
                    location: this.locationsList[26]
                },
                {
                    text: 'Jurbarkas',
                    location: this.locationsList[27]
                },
                {
                    text: 'Vilkaviškis',
                    location: this.locationsList[28]
                },
                {
                    text: 'Raseiniai',
                    location: this.locationsList[29]
                },
                {
                    text: 'Anykščiai',
                    location: this.locationsList[30]
                },
                {
                    text: 'Lentvaris',
                    location: this.locationsList[31]
                },
                {
                    text: 'Grigiškės',
                    location: this.locationsList[32]
                },
                {
                    text: 'Naujoji Akmenė',
                    location: this.locationsList[33]
                },
                {
                    text: 'Prienai',
                    location: this.locationsList[34]
                },
                {
                    text: 'Joniškis',
                    location: this.locationsList[35]
                },
                {
                    text: 'Kelmė',
                    location: this.locationsList[36]
                },
                {
                    text: 'Varėna',
                    location: this.locationsList[37]
                },
                {
                    text: 'Kaišiadorys',
                    location: this.locationsList[38]
                },
                {
                    text: 'Pasvalys',
                    location: this.locationsList[39]
                },
                {
                    text: 'Kupiškis',
                    location: this.locationsList[40]
                },
                {
                    text: 'Zarasai',
                    location: this.locationsList[41]
                },
                {
                    text: 'Skuodas',
                    location: this.locationsList[42]
                },
                {
                    text: 'Molėtai',
                    location: this.locationsList[43]
                },
                {
                    text: 'Kazlų rūda',
                    location: this.locationsList[44]
                },
                {
                    text: 'Širvintos',
                    location: this.locationsList[45]
                },
                {
                    text: 'Šalčininkai',
                    location: this.locationsList[46]
                },
                {
                    text: 'Šakiai',
                    location: this.locationsList[47]
                },
                {
                    text: 'Pabradė',
                    location: this.locationsList[48]
                },
                {
                    text: 'Švenčionėliai',
                    location: this.locationsList[49]
                },
                {
                    text: 'Šilalė',
                    location: this.locationsList[50]
                },
                {
                    text: 'Ignalina',
                    location: this.locationsList[51]
                },
                {
                    text: 'Nemenčinė',
                    location: this.locationsList[52]
                },
                {
                    text: 'Kybartai',
                    location: this.locationsList[53]
                },
                {
                    text: 'Švenčionys',
                    location: this.locationsList[54]
                },
                {
                    text: 'Pakruojis',
                    location: this.locationsList[55]
                },
                {
                    text: 'Trakai',
                    location: this.locationsList[56]
                }
            ];

            this.questionFamousPlacesList = [{
                    text: 'Kryžių kalnas',
                    location: this.locationsList[57]
                }, {
                    text: 'Lietuvos liaudies buities muziejus (Rumšiškės)',
                    location: this.locationsList[58]
                },
                {
                    text: 'Europos parkas',
                    location: this.locationsList[59]
                },
                {
                    text: 'Grūto parkas',
                    location: this.locationsList[60]
                },
                {
                    text: 'Molėtų astronomijos observatorija',
                    location: this.locationsList[61]
                },
                {
                    text: 'Ventės ragas (pusiasalis)',
                    location: this.locationsList[62]
                },
                {
                    text: 'Trakų pilis',
                    location: this.locationsList[63]
                },
                {
                    text: 'Olando kepurė (skardis)',
                    location: this.locationsList[64]
                },
                {
                    text: 'Puntuko akmuo',
                    location: this.locationsList[65]
                },
                {
                    text: 'Barstyčių akmuo',
                    location: this.locationsList[66]
                },
                {
                    text: 'Velnio duobė',
                    location: this.locationsList[67]
                },
                {
                    text: 'Pučkorių atodanga',
                    location: this.locationsList[68]
                },
                {
                    text: 'Ladakalnis',
                    location: this.locationsList[69]
                },
                {
                    text: 'Medvėgalio kalva',
                    location: this.locationsList[70]
                },
                {
                    text: 'Šatrijos kalva',
                    location: this.locationsList[71]
                },
                {
                    text: 'Šv. Onos bažnyčia',
                    location: this.locationsList[72]
                },
                {
                    text: 'Europos geografinis centras',
                    location: this.locationsList[73]
                },
                {
                    text: 'Vilniaus televizijos bokštas',
                    location: this.locationsList[74]
                },
                {
                    text: 'Kauno pilis',
                    location: this.locationsList[75]
                },
                {
                    text: 'Medininkų pilis',
                    location: this.locationsList[76]
                }
            ];
        }

        private enableDeveloperMode(): void {
            this.map.css('background', 'url(img/map-dev.png)');
            this.map.on('click', (event: JQueryEventObject) => {
                this.clickCoordinates = this.getCoordinatesRelativeToImage(event.pageX, event.pageY);
                this.coordinatesText.text('X=' + this.clickCoordinates.x + ' Y=' + this.clickCoordinates.y);
            });
            var editor: JQuery = $('.editor').show();
            var moveArrows: JQuery = editor.find('.move-panel span');
            var menuTabs: JQuery = editor.find('.menu-tab');
            var tabLocations: JQuery = editor.find('.locations-editor');
            var tabQuestions: JQuery = editor.find('.questions-editor');
            var menuItems: JQuery = editor.find('.nav li');

            moveArrows.on('click', (event: JQueryEventObject) => {
                var target: JQuery = $(event.currentTarget);
                editor.css({
                    top: 'unset',
                    left: 'unset',
                    right: 'unset',
                    bottom: 'unset'
                });
                if (target.is('.top-left')) {
                    editor.css({
                        top: 0,
                        left: 0
                    });
                } else if (target.is('.top-right')) {
                    editor.css({
                        top: 0,
                        right: 0
                    });
                } else if (target.is('.bottom-left')) {
                    editor.css({
                        bottom: 0,
                        left: 0
                    });
                } else if (target.is('.bottom-right')) {
                    editor.css({
                        bottom: 0,
                        right: 0
                    });
                }
            });

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

            $.each(this.districtsList, (index: number, district: IDistrict) => {
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

            $.each(this.locationsList, (index: number, location: ILocation) => {
                selectLocations.append('<option value="' + index + '" ' + (index == 0 ? 'selected' : '') + '>' + location.name + '</option>');
            });

            formQuestion.submit((event: JQueryEventObject) => {
                event.preventDefault();
                outputQuestion.html('{ text: \'' + inputQuestion.val() + '\', location: this.locations[' + selectLocations.val() + '] }');
            });
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
                    if (this.currentQuestionNumber == this.questionsPerLevel) {
                        this.handleLastQuestion();
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

        private handleLastQuestion(): void {
            if (this.currentLevel == 1) {
                if (this.totalPoints >= this.pointsToAdvance) {
                    this.currentLevel++;
                    this.currentQuestionNumber = 1;
                    this.begin();
                } else {
                    modalManager.openModal(ModalType.END, {
                        title: 'Puikios pastangos, bet į kitą lygį neperėjai.',
                        content: '<h3>Tavo rezultatas ' + this.totalPoints + ' tašk' + this.correctLTEnding(this.totalPoints) +
                            '.</h3><h4>Surink ' + this.pointsToAdvance + ', kad pereitum į kitą lygį.</h4>'
                    });
                    this.resetLevels();
                }
            } else {
                modalManager.openModal(ModalType.END, {
                    title: 'Sveikinam!',
                    content: '<h3>Tavo rezultatas ' + this.totalPoints + ' tašk' + this.correctLTEnding(this.totalPoints) + '.</h3>'
                });
                this.resetLevels();
            }
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
            this.resetProgressBar();
        }

        private begin(): void {
            this.clearQuestionDetails();
            if (this.currentLevel == 1 && this.currentQuestionNumber == 1) {
                this.currentQuestionsList = this.getRandomElements(this.questionCitiesList, this.questionsPerLevel);
                this.clearScore();
                this.startQuestionWithIntro('Miestai');
                return;
            } else if (this.currentLevel == 2 && this.currentQuestionNumber == 1) {
                this.currentQuestionsList = this.getRandomElements(this.questionFamousPlacesList, this.questionsPerLevel);
                this.startQuestionWithIntro('Žinomos vietos');
                return;
            }
                
            this.startQuestion();
        }

        private startQuestionWithIntro(text: string): void {
            this.updateQuestionCounter();
            this.levelIntroText.text(text);
            this.levelIntro.removeClass('hide-intro');
            setTimeout(() => {
                this.levelIntro.addClass('hide-intro');
                setTimeout(() => {
                    this.questionInnerContainer.removeClass('hidden');
                    this.startQuestion(); }, 1500);
            }, 2500);
        }

        private startQuestion(): void {
            this.currentQuestion = this.currentQuestionsList[this.currentQuestionNumber - 1];
            this.setQuestionText(this.currentQuestion);
            this.questionInnerContainer.removeClass('show-below');
            setTimeout(() => {
                this.updateQuestionCounter();
                this.questionInnerContainer.addClass('show-below');
                this.bindClickForQuestion(this.currentQuestion);
                this.startTimer();
            }, 2200);
        }

        private setTimerTo(seconds: number): void {
            this.timerText.text(this.roundToTenths(seconds).toFixed(1) + 's');
        }

        private roundToTenths(number: number): number {
            return Math.round(10 * number) / 10;
        }

        private startTimer(): void {
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
                    this.setProgressBarWidth('100%');
                    this.setTimerTo(0);
                    this.map.unbind();
                    if (this.currentQuestionNumber == this.questionsPerLevel)
                        this.handleLastQuestion();
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
            this.setTimerTo(0);
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
        }

        private resetLevels(): void {
            this.currentLevel = 1;
            this.currentQuestionNumber = 1;
        }

        private correctLTEnding(number: number): string {
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

        private getRandomElements(array: IQuestion[], numberOfQuestions: number): IQuestion[] {
            return this.shuffle(array).slice(0, numberOfQuestions);
        }

        private updateQuestionCounter(): void {
            this.questionCounter.text('Klausimas ' + this.currentQuestionNumber + ' iš ' + this.questionsPerLevel);
        }


    }
}

new Game.GameController();