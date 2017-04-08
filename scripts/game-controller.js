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
            this.levelIntro = this.map.find('.level-intro');
            this.levelIntroText = this.levelIntro.find('h1');
            this.currentLevel = 1;
            this.currentQuestionNumber = 1;
            this.progressBarUpdateRate = 100;
            this.progressInterval = 0;
            this.questionTime = 10000;
            this.progressYellowTime = this.questionTime * 0.35;
            this.progressRedTime = this.questionTime * 0.15;
            this.progressBarWidthIncreasePerInterval = 100 / (this.questionTime / this.progressBarUpdateRate);
            this.totalPoints = 0;
            this.maxScoreForDistance = 50;
            this.distanceScoreCutoff = 50;
            this.questionsPerLevel = 10;
            this.levelsCount = 2;
            this.pointsToAdvance = ((this.maxScoreForDistance + (this.questionTime / 1000)) * this.questionsPerLevel) * 0.4;
            this.delayAfterQuestion = 3000;
            this.scaleFactor = 1.735;
            this.colors = {
                red: '#e83a35',
                green: '#5cb85c',
                yellow: '#ffae22'
            };
            this.addDistricts();
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
                _this.currentQuestionNumber++;
                _this.begin();
            });
        };
        GameController.prototype.addDistricts = function () {
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
        };
        GameController.prototype.addLocations = function () {
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
        };
        GameController.prototype.addQuestions = function () {
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
        };
        GameController.prototype.enableDeveloperMode = function () {
            var _this = this;
            this.map.css('background', 'url(img/map-dev.png)');
            this.map.on('click', function (event) {
                _this.clickCoordinates = _this.getCoordinatesRelativeToImage(event.pageX, event.pageY);
                _this.coordinatesText.text('X=' + _this.clickCoordinates.x + ' Y=' + _this.clickCoordinates.y);
            });
            var editor = $('.editor').show();
            var moveArrows = editor.find('.move-panel span');
            var menuTabs = editor.find('.menu-tab');
            var tabLocations = editor.find('.locations-editor');
            var tabQuestions = editor.find('.questions-editor');
            var menuItems = editor.find('.nav li');
            moveArrows.on('click', function (event) {
                var target = $(event.currentTarget);
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
                }
                else if (target.is('.top-right')) {
                    editor.css({
                        top: 0,
                        right: 0
                    });
                }
                else if (target.is('.bottom-left')) {
                    editor.css({
                        bottom: 0,
                        left: 0
                    });
                }
                else if (target.is('.bottom-right')) {
                    editor.css({
                        bottom: 0,
                        right: 0
                    });
                }
            });
            menuItems.on('click', function (event) {
                var element = $(event.currentTarget);
                var isActive = element.is('.active');
                if (isActive)
                    return;
                menuTabs.hide();
                if (element.is('.item-locations')) {
                    tabLocations.show();
                }
                else if (element.is('.item-questions')) {
                    tabQuestions.show();
                }
                menuItems.each(function (i, e) {
                    var element = $(e);
                    if (element.is('.active'))
                        element.removeClass('active');
                });
                element.addClass('active');
            });
            tabLocations.show();
            var formLocation = tabLocations.find('form');
            var selectDistrict = formLocation.find('select');
            var inputName = formLocation.find('.name');
            var inputX = formLocation.find('.coordx');
            var inputY = formLocation.find('.coordy');
            var outputLocation = tabLocations.find('.output');
            $.each(this.districtsList, function (index, district) {
                selectDistrict.append('<option value="' + index + '" ' + (index == 0 ? 'selected' : '') + '>' + district.name + '</option>');
            });
            formLocation.submit(function (event) {
                event.preventDefault();
                outputLocation.html('{ name: \'' + inputName.val() + '\', district: this.districts[' + selectDistrict.val() + '], x: ' + inputX.val() + ', y: ' + inputY.val() + ' }');
            });
            var formQuestion = tabQuestions.find('form');
            var selectLocations = formQuestion.find('select');
            var inputQuestion = formQuestion.find('.question-text');
            var outputQuestion = tabQuestions.find('.output');
            $.each(this.locationsList, function (index, location) {
                selectLocations.append('<option value="' + index + '" ' + (index == 0 ? 'selected' : '') + '>' + location.name + '</option>');
            });
            formQuestion.submit(function (event) {
                event.preventDefault();
                outputQuestion.html('{ text: \'' + inputQuestion.val() + '\', location: this.locations[' + selectLocations.val() + '] }');
            });
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
                    if (_this.currentQuestionNumber == _this.questionsPerLevel) {
                        _this.handleLastQuestion();
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
        GameController.prototype.handleLastQuestion = function () {
            if (this.currentLevel == 1) {
                if (this.totalPoints >= this.pointsToAdvance) {
                    this.currentLevel++;
                    this.currentQuestionNumber = 1;
                    this.begin();
                }
                else {
                    modalManager.openModal(Game.ModalType.END, {
                        title: 'Puikios pastangos, bet į kitą lygį neperėjai.',
                        content: '<h3>Tavo rezultatas ' + this.totalPoints + ' tašk' + this.correctLTEnding(this.totalPoints) +
                            '.</h3><h4>Surink ' + this.pointsToAdvance + ', kad pereitum į kitą lygį.</h4>'
                    });
                    this.resetLevels();
                }
            }
            else {
                modalManager.openModal(Game.ModalType.END, {
                    title: 'Sveikinam!',
                    content: '<h3>Tavo rezultatas ' + this.totalPoints + ' tašk' + this.correctLTEnding(this.totalPoints) + '.</h3>'
                });
                this.resetLevels();
            }
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
            var length = question.text.length;
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
                .text(question.text);
            this.questionTextSecondary.text(question.location.district.name);
        };
        GameController.prototype.clearQuestionDetails = function () {
            this.questionTextMain.empty();
            this.questionTextSecondary.empty();
            this.hideMapMarkers();
            this.removeDistanceLine();
            this.resetProgressBar();
        };
        GameController.prototype.begin = function () {
            this.clearQuestionDetails();
            if (this.currentLevel == 1 && this.currentQuestionNumber == 1) {
                this.currentQuestionsList = this.getRandomElements(this.questionCitiesList, this.questionsPerLevel);
                this.clearScore();
                this.startQuestionWithIntro('Miestai');
                return;
            }
            else if (this.currentLevel == 2 && this.currentQuestionNumber == 1) {
                this.currentQuestionsList = this.getRandomElements(this.questionFamousPlacesList, this.questionsPerLevel);
                this.startQuestionWithIntro('Žinomos vietos');
                return;
            }
            this.startQuestion();
        };
        GameController.prototype.startQuestionWithIntro = function (text) {
            var _this = this;
            this.updateQuestionCounter();
            this.levelIntroText.text(text);
            this.levelIntro.removeClass('hide-intro');
            setTimeout(function () {
                _this.levelIntro.addClass('hide-intro');
                setTimeout(function () {
                    _this.questionInnerContainer.removeClass('hidden');
                    _this.startQuestion();
                }, 1500);
            }, 2500);
        };
        GameController.prototype.startQuestion = function () {
            var _this = this;
            this.currentQuestion = this.currentQuestionsList[this.currentQuestionNumber - 1];
            this.setQuestionText(this.currentQuestion);
            this.questionInnerContainer.removeClass('show-below');
            setTimeout(function () {
                _this.updateQuestionCounter();
                _this.questionInnerContainer.addClass('show-below');
                _this.bindClickForQuestion(_this.currentQuestion);
                _this.startTimer();
            }, 2200);
        };
        GameController.prototype.setTimerTo = function (seconds) {
            this.timerText.text(this.roundToTenths(seconds).toFixed(1) + 's');
        };
        GameController.prototype.roundToTenths = function (number) {
            return Math.round(10 * number) / 10;
        };
        GameController.prototype.startTimer = function () {
            var _this = this;
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
                    _this.setProgressBarWidth('100%');
                    _this.setTimerTo(0);
                    _this.map.unbind();
                    if (_this.currentQuestionNumber == _this.questionsPerLevel)
                        _this.handleLastQuestion();
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
            this.setTimerTo(0);
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
        };
        GameController.prototype.resetLevels = function () {
            this.currentLevel = 1;
            this.currentQuestionNumber = 1;
        };
        GameController.prototype.correctLTEnding = function (number) {
            var ending = '';
            var pointsString = number.toString();
            var length = pointsString.length;
            var lastDigit = pointsString[length - 1];
            var lastTwoString;
            var lastTwoNumber;
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
        GameController.prototype.getRandomElements = function (array, numberOfQuestions) {
            return this.shuffle(array).slice(0, numberOfQuestions);
        };
        GameController.prototype.updateQuestionCounter = function () {
            this.questionCounter.text('Klausimas ' + this.currentQuestionNumber + ' iš ' + this.questionsPerLevel);
        };
        return GameController;
    }());
    Game.GameController = GameController;
})(Game || (Game = {}));
new Game.GameController();
