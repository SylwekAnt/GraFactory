'use strict';

(function start(global) {
    class Cars {
        constructor(brand, bodycar, engine, gear, color, serialNo, NoOR, cost, price, profit, quantityOrder) {
            this.brand = brand;
            this.bodycar = bodycar;
            this.engine = engine;
            this.gear = gear;
            this.color = color;
            this.serialNo = serialNo; // numer kolejny auta
            this.NoOR = NoOR; // numer zamówienia
            this.cost = cost; //koszt wykonania egzemplarza auta
            this.price = price; //cena sprzedaży egzemplarza auta
            this.profit = profit; //zysk na aucie
            this.quantityOrder = quantityOrder; //ilość aut na zamówieniu
            this.NoUN = 0;  // sprawdzenie czy wykonano egzemplarz z zamówienia
            this.NoCA = 0;
            this.NoFU = 0;
            this.NoGE = 0;
            this.NoPA = 10;
            this.NoAS = 20;
            this.NoST = 30; // status: zamówione, w toku, gotowe
            this.forecast = 0;
        }
    };

    const tabBrand = [{name: "Corsa", hotKey: "CO"}, {name: "Astra", hotKey: "AS"}, {name: "Vectra", hotKey: "VE"}, {name: "Insygnia", hotKey: "IN"}]; //tablica modeli

    const tabBodyCar = [{name: "Sedan", hotKey:"SE"}, {name: "Hachback", hotKey: "HB"}, {name: "Combi", hotKey:"CO"}, {name: "Cabriolet", hotKey: "CB"}];  //tablica nadwozi

    const tabEngine = [{name: "Olej napędowy", hotKey: "ON"}, {name: "Benzyna", hotKey: "PB"}, {name: "Benzyna / Gaz", hotKey: "LG"}, {name: "Elektryk", hotKey: "EC"}]; //tablica silnikow

    const tabColor = [{name: "Biały", hotKey: "BI", Ename: "white", ratio: .0025}, {name: "Czerwony", hotKey: "CE", Ename: "red", ratio: .005}, {name: "Zielony", hotKey: "ZI", Ename: "green", ratio: .0075}, {name: "Czarny", hotKey: "CZ", Ename: "black", ratio: .01}, {name: "Niebieski", hotKey: "NI", Ename: "blue", ratio: .0125}, {name: "Złoty", hotKey: "ZL", Ename: "gold", ratio: .015}, {name: "Szary", hotKey: "SZ", Ename: "gray", ratio: .0175}, {name: "Purpurowy", hotKey: "PU", Ename: "purple", ratio: .02}, {name: "Srebrny", hotKey: "SR", Ename: "silver", ratio: .0225}, {name: "Limonkowy", hotKey: "LI", Ename: "lime", ratio: .025}, {name: "Morski", hotKey: "MO", Ename: "teal", ratio: .0275}, {name: "Oliwkowy", hotKey: "OL", Ename: "olive", ratio: .03}, {name: "Fukcja", hotKey: "FU", Ename: "fuchsja", ratio: .0325}, {name: "Granat", hotKey: "GR", Ename: "navy", ratio: .035}, {name: "Kasztanowy", hotKey: "KA", Ename: "maroon", ratio: .0375}, {name: "Błękitny", hotKey: "BL", Ename: "aqua", ratio: .04}]; //tablica kolorow

    const tabGear = [{name: "Manual", hotKey:"MA"}, {name: "Półautomat", hotKey: "PA"}, {name: "Automat", hotKey:"AU"}, {name: "Bezstopniowa", hotKey:"BS"}];  //tablica skrzyn

    const tabNumber =[1, 5, 10, 20];  //tablica ilosci zamawianych aut
    const tabAllChoised = []; //czy wybrano wszystkie opcje do zamowienia
    let tabCars = [];  //tab na zamowione samochody
    const tabVIN = []; //tab na numery VIN
    const tabUpdateDes = ['0 >> 1', '1 >> 2', '2 >> 3','3 >> 4', '4 >> 5', '5 >> 6', '6 >> 7', '7 >> 8', '8 >> 9','9 >> 10', 'max.10']; //opis na przycisku ulepszenia

    const OP_BRAND = document.querySelector('.brand');  //uchwyt rodzic modelu
    const OC_BRAND = OP_BRAND.querySelectorAll('.but_model');  //wybr. model
    const OP_BODYCAR = document.querySelector('.body_car'); //uchwyt rodzic nadwozia
    const OC_BODYCAR = OP_BODYCAR.querySelectorAll('.but_model'); //wybr. nadwozie
    const OP_ENGINE = document.querySelector('.engine'); //uchwyt rodzic silnika
    const OC_ENGINE = OP_ENGINE.querySelectorAll('.but_model'); //wybr. silnik
    const OP_COLOR = document.querySelectorAll('.but_model_color'); //uchwyt koloru
    const OP_GEAR = document.querySelector('.gear'); //uchwyt rodzic skrzyni
    const OC_GEAR = OP_GEAR.querySelectorAll('.but_model'); //wybr. skrzynia
    const OP_NUMBER = document.querySelector('.number'); //uchwyt rodzic ilosci
    const OC_NUMBER = OP_NUMBER.querySelectorAll('.but_model'); //wybr. ilosc
    const ORDER = document.querySelector('.make_order');  //uchwyt do przycisku zlozenia zamowienia
    const CASH = document.querySelector('.cash'); // uchwyt do stanu finansów
    const ORDER_LIST = document.querySelector('.order_list_js'); //uchwyt do listy złożonych zamówień

    let choisedBrand = null;  //wybrany model
    let choisedBodyCar = null;  //wybrane nadwozie
    let choisedEngine = null;  //wybrany silnik
    let choisedColor = null; //wybrany kolor
    let choisedGear = null;  //wybrany skrzynia
    let choisedNumber = null;  //wybrana ilosc
    let ratioColor = 0; //współczynnik dla wybranego koloru
    let orderNo = 0; // numer kolejny zamówienia
    let cash = 30000000000; //stan startowy finansów
    let counterCars = 0;  //całkowita ilość zamówionych samochodów
    let format_cash = 0; //formatowanie kasy na sep. 1000
    

    //funkcja zamiany na liczby z separatorem tysięcznym
    function formatNumber(number) {  
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    //usunięcie class 'but_set' i 'but_set_color'
    function remClass(BTN) {  
        BTN.forEach(btn => { 
            btn.classList.remove('but_set');
            btn.classList.remove('but_set_color');
            btn.classList.remove('make_order_set');
        });
    };

    // ustawienie klasy po wybraniu buttona
    function setClass(btn) {  
        if(btn.classList.contains('but_model')) {
            btn.classList.add('but_set');
        } else {
            btn.classList.add('but_set_color');
        };
    };
    let countclick = 0;
    //sprawdzenie czy wszystkie opcje sa wybrane i koszt wykonania zamówienia nie przekracza dostepnego stanu finansów
    function sumaChoised() { 
        if(tabAllChoised.length == 6) { //odblokowujemy przycisk: zloz zamowienie
            countclick++;
            let sumaCostOrder = 0; // suma kosztu dla całego zamówienia
            const costOneCar = takeCost(choisedBrand, choisedBodyCar, choisedEngine, choisedGear); //koszt jednego zamówionego auta

            sumaCostOrder = costOneCar  * tabFactoryLvl[updateProdLvl].cost * choisedNumber;

            if(cash - sumaCostOrder >= 0) { // gdy jest kasa składamy zamówienie
                const ORDER = document.querySelector('.make_order');
                ORDER.classList.add('make_order_set'); 
            } else {
                alert("Brak środków na wykonanie tego zamówienia !");
                const ORDERFY = document.querySelector('.order_department');  //uchwyt do działu zamowien
                const ACTIVEBTN = ORDERFY.querySelectorAll('.but_set, .but_set_color');  //wyszukanie class do usuniecia z przyciskow

                remClass(ACTIVEBTN);  // usunięcie class wybranych opcji zamówienia
                tabAllChoised.length = 0;  //zerowanie tablicy wyboru opcji
                choisedBodyCar = choisedBrand = choisedColor = null;
                choisedEngine = choisedGear = choisedNumber = null;
            }
        };
    };

    // suma kosztów działów do wykonania samochodu
    function takeCost(choisedBrand, choisedBodyCar, choisedEngine, choisedGear) {  
        let costSuma = 0;
        let costUN = 0;
        let costCA = 0;
        let costFU = 0;
        let costGE = 0;
        let costPA = 0;
        let costAS = 0;

        costUN = tabUNDERBODY.find(el => el.name == choisedBrand && el.hotKey == choisedBodyCar) // i sumujemy koszty wykonania poszczególnych elementów dla całego zamówienia
        costSuma += costUN.cost;

        costCA = tabCARBODY.find(el => el.name == choisedBrand && el.hotKey == choisedBodyCar)
        costSuma += costCA.cost;

        costFU = tabFUEL.find(el => el.name == choisedBrand && el.hotKey == choisedEngine)
        costSuma += costFU.cost;

        costGE = tabGEAR.find(el => el.name == choisedBrand && el.hotKey ==choisedGear)
        costSuma += costGE.cost;

        costPA = tabPAINT.find(el => el.name == choisedBrand && el.hotKey == choisedBodyCar)
        costSuma += costPA.cost;

        costAS = tabASSEMBLY.find(el => el.name == choisedBrand && el.hotKey == choisedBodyCar)
        costSuma += costAS.cost;

        return costSuma;
    };

    // zapisanie zam. w tab. tabCars i VIN w tab
    function makeNewCars(choisedBrand, choisedBodyCar, choisedEngine, choisedGear, choisedColor,choisedNumber) { 
        let costCar = takeCost(choisedBrand, choisedBodyCar, choisedEngine, choisedGear);  // obliczenie kosztu jednego zam. auta

        let NoVIN = ''; //nr seryjny samochodu
        let yearProdCar = startDate.getFullYear();  //pobranie roku produkcji
        let monthProdCar = startDate.getMonth() + 1; //pobranie m-ca produkcji
        let profit = 0; //zysk na aucie

        let price = costCar * (tabOrderLvl[updateOrderLvl].ratio + ratioColor);  // ustalenie wyjściowej ceny za auto

        costCar *= (tabFactoryLvl[updateProdLvl].cost); //ustalenie kosztu dla auta zależnie od poziomu produkcji 
        costCar = Math.floor(costCar);

        profit = (price - costCar) * tabFactoryLvl[updateProdLvl].profit;
        profit = Math.floor(profit); //rzeczywisty zysk z poziomu produkcji

        price = Math.floor((costCar + profit) * tabWHLvl[updateWHLvl].ratio); //rzeczywista cena po odliczeniu kosztów

        profit = price - costCar; //rzeczywisty pełny zysk na aucie
        profit = Math.floor(profit);

        if(monthProdCar < 10) monthProdCar = "0" + monthProdCar;

        for(let i = 1; i <= choisedNumber; i++) {
            counterCars ++;

            const Car = new Cars(choisedBrand, choisedBodyCar, choisedEngine, choisedGear, choisedColor, counterCars, orderNo, costCar, price, profit, choisedNumber);
            tabCars.push(Car);

            /* aktualizacja stanu finansów po przyjęciu nowego zamówienia */
            cash -= costCar;  

            let strCounterCars = counterCars.toString();
            let carNo = '';
            
            switch (strCounterCars.length) {
                case 1:
                    carNo = `000000${counterCars}`;
                    break;
                case 2:
                    carNo = `00000${counterCars}`;
                    break;
                case 3:
                    carNo = `0000${counterCars}`;
                    break;
                case 4:
                    carNo = `000${counterCars}`;
                    break;
                case 5:
                    carNo = `00${counterCars}`;
                    break;
                case 6:
                    carNo = `0${counterCars}`;
                    break;
                case 7:
                    carNo = `${counterCars}`;
                    break;
                default:
                    break;
            };
            
            let colorElem = tabColor.find(color => color.Ename == choisedColor);
            let color = colorElem.hotKey;

            NoVIN = yearProdCar + monthProdCar + choisedBrand + choisedBodyCar + choisedEngine + choisedGear + color + carNo;

            tabVIN.push(NoVIN);   
        };

        format_cash = formatNumber(cash); //formatowanie kasy na sep. 1000
        CASH.innerHTML = `Stan finansów: &nbsp;&nbsp; ${format_cash} zł`;
    };

    // tworzenie listy zamówień na ekranie
    function orderList() {
        if(tabCars.length > 0) {
            const ORDER_QUANTITY = tabCars[tabCars.length - 1].NoOR;  // ilość zamówień w tabCars
            let lineValue = ""; // linia zamówienia na ekran

            for(let i = 0; i < ORDER_QUANTITY; i++) {
                let costSuma = 0;  // sumowanie kosztów realizacji każdego zamówienia
                let quantityOrderCars = 0;  // ilość aut w zamówieniu
                let NoOR = 0; //nr zamówienia

                tabCars.forEach(order => {
                    if(order.NoOR == i + 1) {
                        costSuma += order.cost; 
                        quantityOrderCars ++;
                        NoOR = order.NoOR;
                    };
                });

                const ORDER = tabCars.find(order => order.NoOR == NoOR);  // wyszukanie pierwszego rekordu o wybranym NoOR
                let format_cost = formatNumber(costSuma);
                
                let ORDER_LINE = `<div class="order_line"><div class="order_des">${ORDER.NoOR}</div><div class="order_des">${ORDER.brand}</div><div class="order_des">${ORDER.bodycar}</div><div class="order_des">${ORDER.engine}</div><div class="order_des">${ORDER.gear}</div><div class="order_des order_des_big">${ORDER.color}</div><div class="order_des">${quantityOrderCars}</div><div class="order_des order_des_big order_number">${format_cost}&nbsp;</div></div>`;

                lineValue = ORDER_LINE + lineValue;
            };
            ORDER_LIST.innerHTML =  lineValue;
        } else {
            ORDER_LIST.innerHTML ='';
        };  
    };

    
    //wybor modelu
    OC_BRAND.forEach((btn, i) => {  
        btn.addEventListener('click', () => {
            if(choisedBrand === null) tabAllChoised.push(1); //dodajemy element do tablicy sprawdzenia czy wybrano te opcje juz
            choisedBrand = tabBrand[i].hotKey;
            remClass(OC_BRAND);
            setClass(btn);
            sumaChoised();
        });
    });

    //wybor nadwozia
    OC_BODYCAR.forEach((btn, i) => {  
        btn.addEventListener('click', () => {
            if(choisedBodyCar === null) tabAllChoised.push(1); //dodajemy element do tablicy sprawdzenia czy wybrano te opcje juz
            choisedBodyCar = tabBodyCar[i].hotKey;
            remClass(OC_BODYCAR);
            setClass(btn);
            sumaChoised();
        });
    });

    //wybor silnika
    OC_ENGINE.forEach((btn, i) => {  
        btn.addEventListener('click', () => {
            if(choisedEngine === null) tabAllChoised.push(1); //dodajemy element do tablicy sprawdzenia czy wybrano te opcje juz
            choisedEngine = tabEngine[i].hotKey;
            remClass(OC_ENGINE);
            setClass(btn);
            sumaChoised();
        });
    });

    //wybor koloru
    OP_COLOR.forEach((btn, i) => {  
        btn.addEventListener('click', () => {
            if(choisedColor === null) tabAllChoised.push(1); //dodajemy element do tablicy sprawdzenia czy wybrano te opcje juz
            choisedColor = tabColor[i].Ename;
            ratioColor = tabColor[i].ratio;
            remClass(OP_COLOR);
            setClass(btn);
            sumaChoised();
        });
    });

    //wybor skrzyni
    OC_GEAR.forEach((btn, i) => {  
        btn.addEventListener('click', () => {
            if(choisedGear === null) tabAllChoised.push(1); //dodajemy element do tablicy sprawdzenia czy wybrano te opcje juz
            choisedGear = tabGear[i].hotKey;   
            remClass(OC_GEAR);
            setClass(btn);         
            sumaChoised();
        });
    });

    //wybor ilosci zamawianych aut
    OC_NUMBER.forEach((btn, i) => {  
        btn.addEventListener('click', () => {
            if(choisedNumber === null) tabAllChoised.push(1); //dodajemy element do tablicy sprawdzenia czy wybrano te opcje juz
            choisedNumber = tabNumber[i];
            remClass(OC_NUMBER);
            setClass(btn);
            sumaChoised();
        });
    });

    // tworzenie zamówień w tabCars
    ORDER.addEventListener('click', () => { 
        const ORDERFY = document.querySelector('.order_department');  //uchwyt do działu zamowien
        const ACTIVEBTN = ORDERFY.querySelectorAll('.but_set, .but_set_color');  //wyszukanie class do usuniecia z przyciskow
        const ORDER = document.querySelectorAll('.make_order');  //uchwyt do przycisku zlozenia zamowienia

        remClass(ACTIVEBTN);  // usunięcie class wybranych opcji zamówienia
        remClass(ORDER);  // usuniecie class przycisku złozenia zamówienia

        tabAllChoised.length = 0;  //zerowanie tablicy wyboru opcji

        orderNo ++;  // nadanie numeru dla zamówienia

        makeNewCars(choisedBrand, choisedBodyCar, choisedEngine, choisedGear, choisedColor,choisedNumber);  // zapis zamówienia do tablicy tabCars
        orderList();  // zapis zamówienia do tabOrderList

        choisedBodyCar = choisedBrand = choisedColor = null;
        choisedEngine = choisedGear = choisedNumber = null;
    });


    //podgląd prognozy finansowej
    CASH.addEventListener('mouseover', () => {
        
        let financialForecast = 0;
        let allSellOrder = 0; //suma wartości zamówionych aut

        tabCars.forEach(order => {
            allSellOrder += order.price;
        })

        financialForecast = allSellOrder + cash;
        
        financialForecast = formatNumber(Math.floor(financialForecast));

        CASH.innerHTML = `Prognoza finansów: &nbsp;&nbsp; ${financialForecast} zł`;

    })

    //wyświetlenie stanu finansów po prognozie finansowej
    CASH.addEventListener('mouseout', () => {
        let format_cash = null;

        format_cash = formatNumber(cash); //formatowanie kasy na sep. 1000
        CASH.innerHTML = `Stan finansów: &nbsp;&nbsp; ${format_cash} zł`;
    })

    //dzienny zysk
    let profitDay = 0; // dzienny zysk fabryki
    let flagProfitDay = 0; //licznik upływu 24h
    const PROFIT_DAY = document.querySelector('.profit_day');

    function dayProfit() {
        let showProfitDay = 0;

        showProfitDay = formatNumber(profitDay);
        PROFIT_DAY.innerHTML = `Dzienny zysk: &nbsp;&nbsp; ${showProfitDay} zł`;
    }

    //okno najlepszych wyników
    const STANDING = document.querySelector('.whstanding');

    //klasa dla najlepszych wyników: data uzyskania i wartość
    class PosStand {  
        constructor(date, bestProfit) {
            this.date = date,
            this.bestProfit = bestProfit
        }
    }

    let tabBestProfit = [];

    //zapisanie do tablicy najlepszych 5 wyników
    function bestProfit() {
        let curYear = startDate.getFullYear();
        let curMonth = startDate.getMonth() + 1;
        let curDay = startDate.getDate() - 1;

        if (curMonth < 10) curMonth = "0" + curMonth;
        if (curDay < 10) curDay = "0" + curDay;

        let actualDate = `${curYear}-${curMonth}-${curDay}`;
        const BESTPROFIT = new PosStand(actualDate, profitDay);

        if(tabBestProfit.length < 5) {
            tabBestProfit.push(BESTPROFIT);
        } else {
            if(BESTPROFIT.bestProfit > tabBestProfit[tabBestProfit.length - 1].bestProfit) tabBestProfit[tabBestProfit.length - 1] = BESTPROFIT;
        }
        tabBestProfit.sort((a, b) => b.bestProfit - a.bestProfit);
    }

    //pokazanie najlepszych wyników
    PROFIT_DAY.addEventListener('mouseover', () => {
        const elements = STANDING.querySelectorAll('.elemA_js, .elemB_js, .elemC_js, .elemD_js, .elemE_js, .elemF_js, .elemG_js, .elemH_js, .elemI_js, .elemJ_js');
        
        elements.forEach((element, index) => {
            if (index % 2 === 0) {
                // Indeksy parzyste to daty
                element.innerHTML = tabBestProfit[Math.floor(index / 2)]?.date || '';
            } else {
                // Indeksy nieparzyste to wartości bestProfit
                element.innerHTML = formatNumber(tabBestProfit[Math.floor(index / 2)]?.bestProfit || '');
            }
        });
    
        STANDING.classList.remove('wh_standing_hidden');
    });

    PROFIT_DAY.addEventListener('mouseout', () => {
        STANDING.classList.add('wh_standing_hidden');
    })


    /* ******************************************************************* */
                        /*  PRODUKCJA CAŁY ZAKŁAD   */ 
    /*  ****************************************************************** */

    const PRODUCTION = document.querySelector('.production_department');  //uchwyt do całej produkcji
    const PR_TITLE = PRODUCTION.querySelector('.div_pr_title');  // uchwyt na etykietę produkcji wybranego modelu
    const PR_CHECKMODEL = PRODUCTION.querySelectorAll('.pr_checkmodel'); //uchwyt na wybór modelu
    PR_CHECKMODEL[0].classList.add('pr_checkmodel_set');  // startowy wybór modelu na produkcji

    const tabMaxNoOrder =[5, 10, 20, 30, 40, 45, 55, 60, 65, 75, 80]; // max ilość zamówień w kolejce do wykonania
    const tabMaxNoStock =[3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 40]; // max ilość gotowych podzespołów każdego działu

    let prAnChosedModel = 'CO'; // wybór modelu do analizy - startowy Corsa

    PR_CHECKMODEL.forEach((model, i) => { // wybór modelu do analizy produkcji
        model.addEventListener('click', () => {
            PR_CHECKMODEL.forEach(elem => {
                elem.classList.remove('pr_checkmodel_set');
            });
            model.classList.add('pr_checkmodel_set');
            PR_TITLE.innerHTML = `PRODUKCJA: [ model ${tabBrand[i].name} ]`;
            prAnChosedModel = tabBrand[i].hotKey;  //pobranie wybranego modelu
            });
    });
    
    /* *********************  A N A L I T Y K A  ***********************  
       **********************  FUNKCJE WSPÓLNE  ************************ */

    //zerowanie tablicy przed kolejną aktualizacją
    const PR_CLEARTAB = function(getTab) {
        getTab.forEach(position => {  
            position.count = 0;
            position.inStock = 0;
        });
    };

    //pobranie zamówień z tablicy zamówień do kolejki i magazyn got.
    // 0 - kolejka dla podzespołów, 1 - wykonany podzespół, 2 - zejście z podzespołów 11 - kolejka na malarni, 12 - gotowy na malarni, 13 - zejście z malarni 21 - kolejka na montażu, 22 - gotowy na montażu, 23 - zejście z montażu 31 - magazyn samochodów gotowych
    const PR_GETORDER = function(getTab, returnTab, divNo) {
        getTab.forEach(order => { 
            returnTab.forEach(position => {
                // kolejka dla produkcji podzespołów
                if((order.bodycar == position.hotKey || order.engine == position.hotKey || order.gear == position.hotKey) && order.brand == position.name && order[divNo] == 0) {
                    position.count += 1
                    
                };

                // wyroby gotowe na podzespołach
                if((order.bodycar == position.hotKey || order.engine == position.hotKey || order.gear == position.hotKey) && order.brand == position.name && order[divNo] == 1) {
                    position.inStock += 1
                    order.NoST = 31; //zmiana statusu zam. na 'w toku'
                };

                // kolejka dla malarni
                if(order.bodycar == position.hotKey && order.brand == position.name && order[divNo] == 11 && position.mark == 'PA') {  
                    position.count += 1; // ilość modelu do malowania
                };

                //  wyroby gotowe na malarni
                if(order.bodycar == position.hotKey && order.brand == position.name && order[divNo] == 12 && position.mark == 'PA') {
                    position.inStock += 1; // ilość każdego modelu po malowaniu
                };
                
                // kolejka dla montażu
                if(order.bodycar == position.hotKey && order.brand == position.name && order.NoAS == 21 && position.mark == 'AS') {  
                    position.count += 1; // ilość każdego modelu do montażu
                };

                //  wyroby gotowe na montażu
                if(order.bodycar == position.hotKey && order.brand == position.name && order.NoAS == 22 && position.mark == 'AS') {
                    position.inStock += 1; // ilość każdego modelu po montażu
                }; 
            });
        });
    };

    //wyświetla ilość zamówień i wyrobów gotowych w tabeli
    const PR_SHOWORDER = function(getTab, hotKey, text1, text2, updateLvl) {
        getTab.forEach(elem => { 
            if(elem.hotKey == hotKey && elem.name == prAnChosedModel) {
                text1.innerHTML = elem.count;
                text2.innerHTML = elem.inStock;
                if(elem.inStock == tabMaxNoStock[updateLvl]) {
                    text2.style.background = 'red';
                } else {
                    text2.style.background = 'rgb(33, 26, 37)';
                }
            };        
        });
    };

    //oblicza i zapisuje w tablicy progres
    const PR_PROGRES = function(getTab, updateLvl) {
        getTab.forEach(elem => {  //dla każdego zamówienia
            if(elem.inStock < tabMaxNoStock[updateLvl]) {
                if (elem.count > 0) {  //jeśli są zamówienia to wykonujemy
                    let progres = Number(100 / (elem.skill * tabUpdateProdTime[updateLvl].ratio)); //wyliczamy progres na minutę
                    progres = Number(progres.toFixed(2));
                    elem.progres += progres; // zapis w tablicy aktualnej wartości postępu
                };
            }
            
        });
    };

    // aktualizacja interfejsu i tablic po osiągnięciu min.100% progresu
    const PR_OVERPROGRES = function(getTab, TABLEDATA, mark, divNo, getTabCars) {
        getTab.forEach(elem => {
            if(elem.progres >= 100) {  // gdy progres postępu osiąga min.100% 
                for(let i = 0; i < getTabCars.length; i ++) {
                    let order = getTabCars[i];

                    // zmiana z kolejki podzespołów na magazyn podzespołów
                    if(order.brand == elem.name && (order.bodycar == elem.hotKey  || order.engine == elem.hotKey || order.gear == elem.hotKey) && elem.mark == mark && order[divNo] == 0) {
                        order[divNo] = 1; // zmiana podzespołu na gotowy
                        elem.count --; // zmniejszenie w kolejce
                        elem.inStock ++; // zwiększenie gotowych
                        break;
                    };

                    // zmiana z kolejki malarni na magazyn malarni
                    if(order.brand == elem.name && order.bodycar == elem.hotKey && elem.mark == 'PA' && order.NoPA == 11) {
                        order.NoPA = 12;
                        elem.count --;
                        elem.inStock ++;
                        let changeColor = tabPaintsColor.find(color => color.NoPA == 11)
                        changeColor.NoPA = 12;
                        break;
                    };   

                   // zmiana z kolejki montaż na magazyn montaż
                    if(order.brand == elem.name && order.bodycar == elem.hotKey && elem.mark == 'AS' && order[divNo] == 21) {
                        order.NoAS = 22;
                        elem.count --;
                        elem.inStock ++;      
                        break;
                    }; 
                };    

                elem.count == 0 ? elem.progres = 0 : elem.progres = elem.progres % 100;

                // Aktualizacja elementów interfejsu dla wybranego modelu samochodu
                if(elem.name == prAnChosedModel) {
                    const {order, stock, progtxt} = TABLEDATA[elem.hotKey];
                    order.innerHTML = elem.count;
                    stock.innerHTML = elem.inStock;
                    progtxt.innerHTML = elem.progres;
                };
            };
        });
    };

    function updateProgressBar(progress, progresElemBar) {  //pasek postępu
    // Obliczenie liczby divów, które powinny być widoczne na podstawie postępu
    const visibleCount = Math.ceil(progress / 4);
    
    // Iteracja przez wszystkie divy .pr_prog_pices
    
        progresElemBar.forEach((div, index) => {
            
            // Jeśli indeks diva jest mniejszy niż liczba widocznych divów, pokaż div, w przeciwnym razie ukryj
            if (index < visibleCount -1) {
                div.style.display = 'block';           
            } else {
                div.style.display = 'none';
            }
        });
    }

    function makeTxtProg(takeProg) { //obróbka postępu do wyświetlenia
        let showProg = takeProg.progres;
        showProg = Number(showProg.toFixed(2))
        showProg = showProg.toString();
        
        if (showProg.indexOf('.') !== -1 && showProg.split('.')[1].length === 1) {
            showProg += '0';
        } else if (showProg.indexOf('.') === -1) {
            showProg += '.00';
        }
        return showProg;
    };

    const PR_SHOWPROGRES = function(hotKey, progresElemTXT, progresElemBar, getTab) {
        // wyświetlenie wybranego modelu
        let takeProg = getTab.find(el => el.hotKey == hotKey && el.name == prAnChosedModel);
        const SHOWPROGTXT = makeTxtProg(takeProg);
        updateProgressBar(SHOWPROGTXT, progresElemBar);
        
        progresElemTXT.innerHTML = `${SHOWPROGTXT} %`;
    };

    /* *****************   D Z I A Ł   P O D W O Z I   ***************** */

    const UNDERBODY = document.querySelector('.pr_underbody');  //dział podwozi
    const UN_SE_ORDER = UNDERBODY.querySelector('.pr_SE_order'); // zam. sedan
    const UN_HB_ORDER = UNDERBODY.querySelector('.pr_HB_order'); // zam. hachback
    const UN_CO_ORDER = UNDERBODY.querySelector('.pr_CO_order'); // zam. combi
    const UN_CB_ORDER = UNDERBODY.querySelector('.pr_CB_order'); // zam. cabriolet
    const UN_SE_PROGTXT = UNDERBODY.querySelector('.pr_SE_progs'); // pos txt sedan
    const UN_HB_PROGTXT = UNDERBODY.querySelector('.pr_HB_progs'); // pos txt Hback
    const UN_CO_PROGTXT = UNDERBODY.querySelector('.pr_CO_progs'); // pos txt combi
    const UN_CB_PROGTXT = UNDERBODY.querySelector('.pr_CB_progs'); // pos txt cabrio
    const UN_SE_PROGBAR = UNDERBODY.querySelectorAll('.pr_prog_barSE'); //pos bar SE
    const UN_HB_PROGBAR = UNDERBODY.querySelectorAll('.pr_prog_barHB'); //pos bar HB
    const UN_CO_PROGBAR = UNDERBODY.querySelectorAll('.pr_prog_barCO'); //pos bar CO
    const UN_CB_PROGBAR = UNDERBODY.querySelectorAll('.pr_prog_barCB'); //pos bar CB
    const UN_SE_STOCK = UNDERBODY.querySelector('.pr_stock_SE'); // gotowe SE
    const UN_HB_STOCK = UNDERBODY.querySelector('.pr_stock_HB'); // gotowe HB
    const UN_CO_STOCK = UNDERBODY.querySelector('.pr_stock_CO'); // gotowe CO
    const UN_CB_STOCK = UNDERBODY.querySelector('.pr_stock_CB'); // gotowe CB
    

    const UN_TABLEDATA = { //mapowanie elementów interfejsu dla każdego typu podwozia
        'SE': {order: UN_SE_ORDER, progtxt: UN_SE_PROGTXT, stock: UN_SE_STOCK},
        'HB': {order: UN_HB_ORDER, progtxt: UN_HB_PROGTXT, stock: UN_HB_STOCK},
        'CO': {order: UN_CO_ORDER, progtxt: UN_CO_PROGTXT, stock: UN_CO_STOCK},
        'CB': {order: UN_CB_ORDER, progtxt: UN_CB_PROGTXT, stock: UN_CB_STOCK},
    }

    const tabUNDERBODY = [ //tablica danych produkcji podwozi
        {name: 'CO', hotKey: 'SE', skill: 47, count: 0, progres: 0, inStock: 0, mark: 'UN', cost: 20000}, 
        {name: 'CO', hotKey: 'HB', skill: 48, count: 0, progres: 0, inStock: 0, mark: 'UN', cost: 22000}, 
        {name: 'CO', hotKey: 'CO', skill: 55, count: 0, progres: 0, inStock: 0, mark: 'UN', cost: 26000}, 
        {name: 'CO', hotKey: 'CB', skill: 46, count: 0, progres: 0, inStock: 0, mark: 'UN', cost: 20000},
        {name: 'AS', hotKey: 'SE', skill: 49, count: 0, progres: 0, inStock: 0, mark: 'UN', cost: 24000}, 
        {name: 'AS', hotKey: 'HB', skill: 54, count: 0, progres: 0, inStock: 0, mark: 'UN', cost: 26000},
        {name: 'AS', hotKey: 'CO', skill: 66, count: 0, progres: 0, inStock: 0, mark: 'UN', cost: 30000}, 
        {name: 'AS', hotKey: 'CB', skill: 47, count: 0, progres: 0, inStock: 0, mark: 'UN', cost: 24000}, 
        {name: 'VE', hotKey: 'SE', skill: 56, count: 0, progres: 0, inStock: 0, mark: 'UN', cost: 25500}, 
        {name: 'VE', hotKey: 'HB', skill: 59, count: 0, progres: 0, inStock: 0, mark: 'UN', cost: 27500}, 
        {name: 'VE', hotKey: 'CO', skill: 75, count: 0, progres: 0, inStock: 0, mark: 'UN', cost: 31500}, 
        {name: 'VE', hotKey: 'CB', skill: 51, count: 0, progres: 0, inStock: 0, mark: 'UN', cost: 25500}, 
        {name: 'IN', hotKey: 'SE', skill: 68, count: 0, progres: 0, inStock: 0, mark: 'UN', cost: 28000}, 
        {name: 'IN', hotKey: 'HB', skill: 72, count: 0, progres: 0, inStock: 0, mark: 'UN', cost: 30000}, 
        {name: 'IN', hotKey: 'CO', skill: 80, count: 0, progres: 0, inStock: 0, mark: 'UN', cost: 34000}, 
        {name: 'IN', hotKey: 'CB', skill: 57, count: 0, progres: 0, inStock: 0, mark: 'UN', cost: 28000}
    ];  

    const PR_AN_UNDERBODY = function() {  //analiza produkcji podwozi

        PR_CLEARTAB(tabUNDERBODY); //zerowanie ilości zam. przed aktualizacją
        PR_GETORDER(tabCars, tabUNDERBODY, 'NoUN'); // pobranie z tabCars ilości zamówień do produkcji i na magazyn gotowych

        PR_PROGRES(tabUNDERBODY, updateUNLvl); // oblicz i zapisz w tablicy progres
        PR_OVERPROGRES(tabUNDERBODY, UN_TABLEDATA, 'UN', 'NoUN', tabCars); // aktualizacja interfejsu i tablic po osiągnięciu min.100% progresu

        PR_SHOWORDER(tabUNDERBODY, 'SE', UN_SE_ORDER, UN_SE_STOCK, updateUNLvl); //wyświetl ilość zamówień i wyrobów gotowych dla SE
        PR_SHOWORDER(tabUNDERBODY, 'HB', UN_HB_ORDER, UN_HB_STOCK, updateUNLvl); //wyświetl ilość zamówień i wyrobów gotowych dla HB
        PR_SHOWORDER(tabUNDERBODY, 'CO', UN_CO_ORDER, UN_CO_STOCK, updateUNLvl); //wyświetl ilość zamówień i wyrobów gotowych dla CO
        PR_SHOWORDER(tabUNDERBODY, 'CB', UN_CB_ORDER, UN_CB_STOCK, updateUNLvl); //wyświetl ilość zamówień i wyrobów gotowych dla CB

        PR_SHOWPROGRES('SE', UN_SE_PROGTXT, UN_SE_PROGBAR, tabUNDERBODY)  //wyświetlenie postepu dla SE i wybranego modelu
        PR_SHOWPROGRES('HB', UN_HB_PROGTXT, UN_HB_PROGBAR, tabUNDERBODY)  //wyświetlenie postepu dla HB i wybranego modelu
        PR_SHOWPROGRES('CO', UN_CO_PROGTXT, UN_CO_PROGBAR, tabUNDERBODY)  //wyświetlenie postepu dla CO i wybranego modelu
        PR_SHOWPROGRES('CB', UN_CB_PROGTXT, UN_CB_PROGBAR, tabUNDERBODY)  //wyświetlenie postepu dla CB i wybranego modelu */  
    };

   /* *********************  A N A L I T Y K A  *********************** 
       *****************   D Z I A Ł   N A D W O Z I   ***************** */

    const CARBODY = document.querySelector('.pr_carbody');  //dział nadwozi
    const CA_SE_ORDER = CARBODY.querySelector('.pr_SE_order'); // zam. sedan
    const CA_HB_ORDER = CARBODY.querySelector('.pr_HB_order'); // zam. hachback
    const CA_CO_ORDER = CARBODY.querySelector('.pr_CO_order'); // zam. combi
    const CA_CB_ORDER = CARBODY.querySelector('.pr_CB_order'); // zam. cabriolet
    const CA_SE_PROGTXT = CARBODY.querySelector('.pr_SE_progs'); // pos txt sedan
    const CA_HB_PROGTXT = CARBODY.querySelector('.pr_HB_progs'); // pos txt Hback
    const CA_CO_PROGTXT = CARBODY.querySelector('.pr_CO_progs'); // pos txt combi
    const CA_CB_PROGTXT = CARBODY.querySelector('.pr_CB_progs'); // pos txt cabrio
    const CA_SE_PROGBAR = CARBODY.querySelectorAll('.pr_prog_barSE'); //pos bar SE
    const CA_HB_PROGBAR = CARBODY.querySelectorAll('.pr_prog_barHB'); //pos bar HB
    const CA_CO_PROGBAR = CARBODY.querySelectorAll('.pr_prog_barCO'); //pos bar CO
    const CA_CB_PROGBAR = CARBODY.querySelectorAll('.pr_prog_barCB'); //pos bar CB
    const CA_SE_STOCK = CARBODY.querySelector('.pr_stock_SE'); // gotowe SE
    const CA_HB_STOCK = CARBODY.querySelector('.pr_stock_HB'); // gotowe HB
    const CA_CO_STOCK = CARBODY.querySelector('.pr_stock_CO'); // gotowe CO
    const CA_CB_STOCK = CARBODY.querySelector('.pr_stock_CB'); // gotowe CB

    const CA_TABLEDATA = { //mapowanie elementów interfejsu dla każdego typu nadwozia
        'SE': {order: CA_SE_ORDER, progtxt: CA_SE_PROGTXT, stock: CA_SE_STOCK},
        'HB': {order: CA_HB_ORDER, progtxt: CA_HB_PROGTXT, stock: CA_HB_STOCK},
        'CO': {order: CA_CO_ORDER, progtxt: CA_CO_PROGTXT, stock: CA_CO_STOCK},
        'CB': {order: CA_CB_ORDER, progtxt: CA_CB_PROGTXT, stock: CA_CB_STOCK},
    }

    const tabCARBODY = [ //tablica danych produkcji nadwozi
        {name: 'CO', hotKey: 'SE', skill: 50, inStock: 0, count: 0, progres: 0, mark: 'CA', cost: 24000}, 
        {name: 'CO', hotKey: 'HB', skill: 53, inStock: 0, count: 0, progres: 0, mark: 'CA', cost: 26400}, 
        {name: 'CO', hotKey: 'CO', skill: 62, inStock: 0, count: 0, progres: 0, mark: 'CA', cost: 31200}, 
        {name: 'CO', hotKey: 'CB', skill: 47, inStock: 0, count: 0, progres: 0, mark: 'CA', cost: 23000}, 
        {name: 'AS', hotKey: 'SE', skill: 54, inStock: 0, count: 0, progres: 0, mark: 'CA', cost: 28800}, 
        {name: 'AS', hotKey: 'HB', skill: 59, inStock: 0, count: 0, progres: 0, mark: 'CA', cost: 31680}, 
        {name: 'AS', hotKey: 'CO', skill: 71, inStock: 0, count: 0, progres: 0, mark: 'CA', cost: 37440}, 
        {name: 'AS', hotKey: 'CB', skill: 49, inStock: 0, count: 0, progres: 0, mark: 'CA', cost: 27800}, 
        {name: 'VE', hotKey: 'SE', skill: 60, inStock: 0, count: 0, progres: 0, mark: 'CA', cost: 34560}, 
        {name: 'VE', hotKey: 'HB', skill: 64, inStock: 0, count: 0, progres: 0, mark: 'CA', cost: 38016}, 
        {name: 'VE', hotKey: 'CO', skill: 80, inStock: 0, count: 0, progres: 0, mark: 'CA', cost: 44928}, 
        {name: 'VE', hotKey: 'CB', skill: 54, inStock: 0, count: 0, progres: 0, mark: 'CA', cost: 32560}, 
        {name: 'IN', hotKey: 'SE', skill: 71, inStock: 0, count: 0, progres: 0, mark: 'CA', cost: 41472}, 
        {name: 'IN', hotKey: 'HB', skill: 75, inStock: 0, count: 0, progres: 0, mark: 'CA', cost: 45619}, 
        {name: 'IN', hotKey: 'CO', skill: 85, inStock: 0, count: 0, progres: 0, mark: 'CA', cost: 53914}, 
        {name: 'IN', hotKey: 'CB', skill: 60, inStock: 0, count: 0, progres: 0, mark: 'CA', cost: 39472}
    ];  

    const PR_AN_CARBODY = function () {

        PR_CLEARTAB(tabCARBODY); //zerowanie tab.zam. przed aktualizacją
        PR_GETORDER(tabCars, tabCARBODY, 'NoCA'); // pobranie z tabCars ilości zamówień

        PR_PROGRES(tabCARBODY, updateCALvl); // oblicz i zapisz w tablicy progres
        PR_OVERPROGRES(tabCARBODY, CA_TABLEDATA, 'CA', 'NoCA', tabCars); // aktualizacja interfejsu i tablic po osiągnięciu min.100% progresu

        PR_SHOWORDER(tabCARBODY, 'SE', CA_SE_ORDER, CA_SE_STOCK, updateCALvl); //wyświetl ilość zamówień i wyrobów gotowych dla SE
        PR_SHOWORDER(tabCARBODY, 'HB', CA_HB_ORDER, CA_HB_STOCK, updateCALvl); //wyświetl ilość zamówień i wyrobów gotowych dla HB
        PR_SHOWORDER(tabCARBODY, 'CO', CA_CO_ORDER, CA_CO_STOCK, updateCALvl); //wyświetl ilość zamówień i wyrobów gotowych dla CO
        PR_SHOWORDER(tabCARBODY, 'CB', CA_CB_ORDER, CA_CB_STOCK, updateCALvl); //wyświetl ilość zamówień i wyrobów gotowych dla CB

        PR_SHOWPROGRES('SE', CA_SE_PROGTXT, CA_SE_PROGBAR, tabCARBODY)  //wyświetlenie postepu dla SE i wybranego modelu
        PR_SHOWPROGRES('HB', CA_HB_PROGTXT, CA_HB_PROGBAR, tabCARBODY)  //wyświetlenie postepu dla HB i wybranego modelu
        PR_SHOWPROGRES('CO', CA_CO_PROGTXT, CA_CO_PROGBAR, tabCARBODY)  //wyświetlenie postepu dla CO i wybranego modelu
        PR_SHOWPROGRES('CB', CA_CB_PROGTXT, CA_CB_PROGBAR, tabCARBODY)  //wyświetlenie postepu dla CB i wybranego modelu */
    };


    /* *********************  A N A L I T Y K A  *********************** 
       *****************   D Z I A Ł   S I L N I K I   ***************** */

    const FUEL = document.querySelector('.pr_engine');  //dział silniki
    const FU_ON_ORDER = FUEL.querySelector('.pr_ON_order'); // zam. disel
    const FU_PB_ORDER = FUEL.querySelector('.pr_PB_order'); // zam. benzyna
    const FU_LG_ORDER = FUEL.querySelector('.pr_LG_order'); // zam. gaz
    const FU_EC_ORDER = FUEL.querySelector('.pr_EC_order'); // zam. elektryk
    const FU_ON_PROGTXT = FUEL.querySelector('.pr_ON_progs'); // pos txt disel
    const FU_PB_PROGTXT = FUEL.querySelector('.pr_PB_progs'); // pos txt benzyna
    const FU_LG_PROGTXT = FUEL.querySelector('.pr_LG_progs'); // pos txt gaz
    const FU_EC_PROGTXT = FUEL.querySelector('.pr_EC_progs'); // pos txt elektryk
    const FU_ON_PROGBAR = FUEL.querySelectorAll('.pr_prog_barON'); //pos bar ON
    const FU_PB_PROGBAR = FUEL.querySelectorAll('.pr_prog_barPB'); //pos bar PB
    const FU_LG_PROGBAR = FUEL.querySelectorAll('.pr_prog_barLG'); //pos bar LG
    const FU_EC_PROGBAR = FUEL.querySelectorAll('.pr_prog_barEC'); //pos bar EC
    const FU_ON_STOCK = FUEL.querySelector('.pr_stock_ON'); // gotowe ON
    const FU_PB_STOCK = FUEL.querySelector('.pr_stock_PB'); // gotowe PB
    const FU_LG_STOCK = FUEL.querySelector('.pr_stock_LG'); // gotowe LG
    const FU_EC_STOCK = FUEL.querySelector('.pr_stock_EC'); // gotowe EC

    const FU_TABLEDATA = { //mapowanie elementów interfejsu dla każdego typu silnika
        'ON': {order: FU_ON_ORDER, progtxt: FU_ON_PROGTXT, stock: FU_ON_STOCK},
        'PB': {order: FU_PB_ORDER, progtxt: FU_PB_PROGTXT, stock: FU_PB_STOCK},
        'LG': {order: FU_LG_ORDER, progtxt: FU_LG_PROGTXT, stock: FU_LG_STOCK},
        'EC': {order: FU_EC_ORDER, progtxt: FU_EC_PROGTXT, stock: FU_EC_STOCK},
    }

    const tabFUEL = [ //tablica danych produkcji silników
        {name: 'CO', hotKey: 'ON', skill: 51, inStock: 0, count: 0, progres: 0, mark: 'FU', cost: 8000}, 
        {name: 'CO', hotKey: 'PB', skill: 54, inStock: 0, count: 0, progres: 0, mark: 'FU', cost: 7000}, 
        {name: 'CO', hotKey: 'LG', skill: 60, inStock: 0, count: 0, progres: 0, mark: 'FU', cost: 9500}, 
        {name: 'CO', hotKey: 'EC', skill: 57, inStock: 0, count: 0, progres: 0, mark: 'FU', cost: 11000}, 
        {name: 'AS', hotKey: 'ON', skill: 56, inStock: 0, count: 0, progres: 0, mark: 'FU', cost: 8800}, 
        {name: 'AS', hotKey: 'PB', skill: 60, inStock: 0, count: 0, progres: 0, mark: 'FU', cost: 7700}, 
        {name: 'AS', hotKey: 'LG', skill: 66, inStock: 0, count: 0, progres: 0, mark: 'FU', cost: 10450}, 
        {name: 'AS', hotKey: 'EC', skill: 63, inStock: 0, count: 0, progres: 0, mark: 'FU', cost: 12100}, 
        {name: 'VE', hotKey: 'ON', skill: 61, inStock: 0, count: 0, progres: 0, mark: 'FU', cost: 9680}, 
        {name: 'VE', hotKey: 'PB', skill: 63, inStock: 0, count: 0, progres: 0, mark: 'FU', cost: 8470}, 
        {name: 'VE', hotKey: 'LG', skill: 69, inStock: 0, count: 0, progres: 0, mark: 'FU', cost: 11495}, 
        {name: 'VE', hotKey: 'EC', skill: 65, inStock: 0, count: 0, progres: 0, mark: 'FU', cost: 13310}, 
        {name: 'IN', hotKey: 'ON', skill: 70, inStock: 0, count: 0, progres: 0, mark: 'FU', cost: 10648}, 
        {name: 'IN', hotKey: 'PB', skill: 72, inStock: 0, count: 0, progres: 0, mark: 'FU', cost: 9317}, 
        {name: 'IN', hotKey: 'LG', skill: 80, inStock: 0, count: 0, progres: 0, mark: 'FU', cost: 12645}, 
        {name: 'IN', hotKey: 'EC', skill: 77, inStock: 0, count: 0, progres: 0, mark: 'FU', cost: 14641}
    ];  

    const PR_AN_ENGINE = function () {
        PR_CLEARTAB(tabFUEL); //zerowanie tab.zam. przed aktualizacją
        PR_GETORDER(tabCars, tabFUEL, 'NoFU'); // pobranie z tabCars ilości zamówień

        PR_PROGRES(tabFUEL, updateFULvl); // oblicz i zapisz w tablicy progres
        PR_OVERPROGRES(tabFUEL, FU_TABLEDATA, 'FU', 'NoFU', tabCars); // aktualizacja interfejsu i tablic po osiągnięciu min.100% progresu

        PR_SHOWORDER(tabFUEL, 'ON', FU_ON_ORDER, FU_ON_STOCK, updateFULvl); //wyświetl ilość zamówień i wyrobów gotowych dla ON
        PR_SHOWORDER(tabFUEL, 'PB', FU_PB_ORDER, FU_PB_STOCK, updateFULvl); //wyświetl ilość zamówień i wyrobów gotowych dla PB
        PR_SHOWORDER(tabFUEL, 'LG', FU_LG_ORDER, FU_LG_STOCK, updateFULvl); //wyświetl ilość zamówień i wyrobów gotowych dla LG
        PR_SHOWORDER(tabFUEL, 'EC', FU_EC_ORDER, FU_EC_STOCK, updateFULvl); //wyświetl ilość zamówień i wyrobów gotowych dla EC

        PR_SHOWPROGRES('ON', FU_ON_PROGTXT, FU_ON_PROGBAR, tabFUEL)  //wyświetlenie postepu dla ON i wybranego modelu
        PR_SHOWPROGRES('PB', FU_PB_PROGTXT, FU_PB_PROGBAR, tabFUEL)  //wyświetlenie postepu dla PB i wybranego modelu
        PR_SHOWPROGRES('LG', FU_LG_PROGTXT, FU_LG_PROGBAR, tabFUEL)  //wyświetlenie postepu dla LG i wybranego modelu
        PR_SHOWPROGRES('EC', FU_EC_PROGTXT, FU_EC_PROGBAR, tabFUEL)  //wyświetlenie postepu dla EC i wybranego modelu */
    };


    /* *********************  A N A L I T Y K A  *********************** 
       ********   D Z I A Ł   S K R Z Y N I E    B I E G Ó W   ********* */

    const GEAR = document.querySelector('.pr_gear');  //dział skrzynie biegów
    const GE_MA_ORDER = GEAR.querySelector('.pr_MA_order'); // zam. MA
    const GE_PA_ORDER = GEAR.querySelector('.pr_PA_order'); // zam. półautomat
    const GE_AU_ORDER = GEAR.querySelector('.pr_AU_order'); // zam. automat
    const GE_BS_ORDER = GEAR.querySelector('.pr_BS_order'); // zam. BS
    const GE_MA_PROGTXT = GEAR.querySelector('.pr_MA_progs'); // pos txt manual
    const GE_PA_PROGTXT = GEAR.querySelector('.pr_PA_progs'); // pos txt półautomat
    const GE_AU_PROGTXT = GEAR.querySelector('.pr_AU_progs'); // pos txt automat
    const GE_BS_PROGTXT = GEAR.querySelector('.pr_BS_progs'); // pos txt BS
    const GE_MA_PROGBAR = GEAR.querySelectorAll('.pr_prog_barMA'); //pos bar MA
    const GE_PA_PROGBAR = GEAR.querySelectorAll('.pr_prog_barPA'); //pos bar PA
    const GE_AU_PROGBAR = GEAR.querySelectorAll('.pr_prog_barAU'); //pos bar AU
    const GE_BS_PROGBAR = GEAR.querySelectorAll('.pr_prog_barBS'); //pos bar BS
    const GE_MA_STOCK = GEAR.querySelector('.pr_stock_MA'); // gotowe MA
    const GE_PA_STOCK = GEAR.querySelector('.pr_stock_PA'); // gotowe PA
    const GE_AU_STOCK = GEAR.querySelector('.pr_stock_AU'); // gotowe AU
    const GE_BS_STOCK = GEAR.querySelector('.pr_stock_BS'); // gotowe BS

    const GE_TABLEDATA = { //mapowanie elementów interfejsu dla każdego typu skrzyni
        'MA': {order: GE_MA_ORDER, progtxt: GE_MA_PROGTXT, stock: GE_MA_STOCK},
        'PA': {order: GE_PA_ORDER, progtxt: GE_PA_PROGTXT, stock: GE_PA_STOCK},
        'AU': {order: GE_AU_ORDER, progtxt: GE_AU_PROGTXT, stock: GE_AU_STOCK},
        'BS': {order: GE_BS_ORDER, progtxt: GE_BS_PROGTXT, stock: GE_BS_STOCK},
    }

    const tabGEAR = [ //tablica danych produkcji skrzyń biegów
        {name: 'CO', hotKey: 'MA', skill: 46, inStock: 0, count: 0, progres: 0, mark: 'GE', cost: 4500}, 
        {name: 'CO', hotKey: 'PA', skill: 50, inStock: 0, count: 0, progres: 0, mark: 'GE', cost: 5900}, 
        {name: 'CO', hotKey: 'AU', skill: 59, inStock: 0, count: 0, progres: 0, mark: 'GE', cost: 7500}, 
        {name: 'CO', hotKey: 'BS', skill: 64, inStock: 0, count: 0, progres: 0, mark: 'GE', cost: 9000}, 
        {name: 'AS', hotKey: 'MA', skill: 47, inStock: 0, count: 0, progres: 0, mark: 'GE', cost: 4950}, 
        {name: 'AS', hotKey: 'PA', skill: 51, inStock: 0, count: 0, progres: 0, mark: 'GE', cost: 6490}, 
        {name: 'AS', hotKey: 'AU', skill: 60, inStock: 0, count: 0, progres: 0, mark: 'GE', cost: 8250}, 
        {name: 'AS', hotKey: 'BS', skill: 67, inStock: 0, count: 0, progres: 0, mark: 'GE', cost: 9900}, 
        {name: 'VE', hotKey: 'MA', skill: 50, inStock: 0, count: 0, progres: 0, mark: 'GE', cost: 5445}, 
        {name: 'VE', hotKey: 'PA', skill: 54, inStock: 0, count: 0, progres: 0, mark: 'GE', cost: 7139}, 
        {name: 'VE', hotKey: 'AU', skill: 63, inStock: 0, count: 0, progres: 0, mark: 'GE', cost: 9075}, 
        {name: 'VE', hotKey: 'BS', skill: 70, inStock: 0, count: 0, progres: 0, mark: 'GE', cost: 10890}, 
        {name: 'IN', hotKey: 'MA', skill: 55, inStock: 0, count: 0, progres: 0, mark: 'GE', cost: 5990}, 
        {name: 'IN', hotKey: 'PA', skill: 59, inStock: 0, count: 0, progres: 0, mark: 'GE', cost: 7853}, 
        {name: 'IN', hotKey: 'AU', skill: 66, inStock: 0, count: 0, progres: 0, mark: 'GE', cost: 9983}, 
        {name: 'IN', hotKey: 'BS', skill: 77, inStock: 0, count: 0, progres: 0, mark: 'GE', cost: 11979}
    ];  

    const PR_AN_GEAR = function () {
        PR_CLEARTAB(tabGEAR); //zerowanie tab.zam. przed aktualizacją
        PR_GETORDER(tabCars, tabGEAR, 'NoGE'); // pobranie z tabCars ilości zamówień

        PR_PROGRES(tabGEAR, updateGELvl); // oblicz i zapisz w tablicy progres
        PR_OVERPROGRES(tabGEAR, GE_TABLEDATA, 'GE', 'NoGE', tabCars); // aktualizacja interfejsu i tablic po osiągnięciu min.100% progresu

        PR_SHOWORDER(tabGEAR, 'MA', GE_MA_ORDER, GE_MA_STOCK, updateGELvl); //wyświetl ilość zamówień i wyrobów gotowych dla MA
        PR_SHOWORDER(tabGEAR, 'PA', GE_PA_ORDER, GE_PA_STOCK, updateGELvl); //wyświetl ilość zamówień i wyrobów gotowych dla PA
        PR_SHOWORDER(tabGEAR, 'AU', GE_AU_ORDER, GE_AU_STOCK, updateGELvl); //wyświetl ilość zamówień i wyrobów gotowych dla AU
        PR_SHOWORDER(tabGEAR, 'BS', GE_BS_ORDER, GE_BS_STOCK, updateGELvl); //wyświetl ilość zamówień i wyrobów gotowych dla BS

        PR_SHOWPROGRES('MA', GE_MA_PROGTXT, GE_MA_PROGBAR, tabGEAR)  //wyświetlenie postepu dla MA i wybranego modelu
        PR_SHOWPROGRES('PA', GE_PA_PROGTXT, GE_PA_PROGBAR, tabGEAR)  //wyświetlenie postepu dla PA i wybranego modelu
        PR_SHOWPROGRES('AU', GE_AU_PROGTXT, GE_AU_PROGBAR, tabGEAR)  //wyświetlenie postepu dla AU i wybranego modelu
        PR_SHOWPROGRES('BS', GE_BS_PROGTXT, GE_BS_PROGBAR, tabGEAR)  //wyświetlenie postepu dla BS i wybranego modelu */
    };


    /* *********************  A N A L I T Y K A  *********************** 
    ******************   D Z I A Ł   M A L A R N I A   ***************** */

    class Paints {
        constructor (brand, bodycar, color, NoPA, serialNo) {
            this.brand = brand;
            this.bodycar = bodycar;
            this.color = color;
            this.NoPA = NoPA;
            this.serialNo = serialNo;
        }
    }

    const PAINT = document.querySelector('.pr_paintcar');  //dział malarni
    const PA_SE_ORDER = PAINT.querySelector('.pr_SEP_order'); // zam. SE
    const PA_HB_ORDER = PAINT.querySelector('.pr_HBP_order'); // zam. HB
    const PA_CO_ORDER = PAINT.querySelector('.pr_COP_order'); // zam. CO
    const PA_CB_ORDER = PAINT.querySelector('.pr_CBP_order'); // zam. CB
    const PA_SE_PROGTXT = PAINT.querySelector('.pr_SEP_progs'); // pos txt SE
    const PA_HB_PROGTXT = PAINT.querySelector('.pr_HBP_progs'); // pos txt HB
    const PA_CO_PROGTXT = PAINT.querySelector('.pr_COP_progs'); // pos txt CO
    const PA_CB_PROGTXT = PAINT.querySelector('.pr_CBP_progs'); // pos txt CB
    const PA_SE_PROGBAR = PAINT.querySelectorAll('.pr_prog_barSEP'); //pos bar SE
    const PA_HB_PROGBAR = PAINT.querySelectorAll('.pr_prog_barHBP'); //pos bar HB
    const PA_CO_PROGBAR = PAINT.querySelectorAll('.pr_prog_barCOP'); //pos bar CO
    const PA_CB_PROGBAR = PAINT.querySelectorAll('.pr_prog_barCBP'); //pos bar CB
    const PA_SE_STOCK = PAINT.querySelector('.pr_stock_SEP'); // gotowe SE
    const PA_HB_STOCK = PAINT.querySelector('.pr_stock_HBP'); // gotowe HB
    const PA_CO_STOCK = PAINT.querySelector('.pr_stock_COP'); // gotowe CO
    const PA_CB_STOCK = PAINT.querySelector('.pr_stock_CBP'); // gotowe CB

    const PA_TABLEDATA = { //mapowanie elementów interfejsu dla każdego typu podwozia
        'SE': {order: PA_SE_ORDER, progtxt: PA_SE_PROGTXT, stock: PA_SE_STOCK},
        'HB': {order: PA_HB_ORDER, progtxt: PA_HB_PROGTXT, stock: PA_HB_STOCK},
        'CO': {order: PA_CO_ORDER, progtxt: PA_CO_PROGTXT, stock: PA_CO_STOCK},
        'CB': {order: PA_CB_ORDER, progtxt: PA_CB_PROGTXT, stock: PA_CB_STOCK},
    }

    const tabPAINT = [ //tablica danych produkcji malarni
    {name: 'CO', hotKey: 'SE', skill: 58, progres: 0, mark: 'PA', count: 0, inStock: 0, cost: 7000, flag: true}, 
    {name: 'CO', hotKey: 'HB', skill: 62, progres: 0, mark: 'PA', count: 0, inStock: 0, cost: 8200, flag: true}, 
    {name: 'CO', hotKey: 'CO', skill: 70, progres: 0, mark: 'PA', count: 0, inStock: 0, cost: 9100, flag: true}, 
    {name: 'CO', hotKey: 'CB', skill: 53, progres: 0, mark: 'PA', count: 0, inStock: 0, cost: 5200, flag: true},
    {name: 'AS', hotKey: 'SE', skill: 63, progres: 0, mark: 'PA', count: 0, inStock: 0, cost: 8050, flag: true}, 
    {name: 'AS', hotKey: 'HB', skill: 67, progres: 0, mark: 'PA', count: 0, inStock: 0, cost: 9430, flag: true},
    {name: 'AS', hotKey: 'CO', skill: 75, progres: 0, mark: 'PA', count: 0, inStock: 0, cost: 10465, flag: true}, 
    {name: 'AS', hotKey: 'CB', skill: 58, progres: 0, mark: 'PA', count: 0, inStock: 0, cost: 5980, flag: true}, 
    {name: 'VE', hotKey: 'SE', skill: 69, progres: 0, mark: 'PA', count: 0, inStock: 0, cost: 9258, flag: true}, 
    {name: 'VE', hotKey: 'HB', skill: 73, progres: 0, mark: 'PA', count: 0, inStock: 0, cost: 10845, flag: true}, 
    {name: 'VE', hotKey: 'CO', skill: 81, progres: 0, mark: 'PA', count: 0, inStock: 0, cost: 12035, flag: true}, 
    {name: 'VE', hotKey: 'CB', skill: 60, progres: 0, mark: 'PA', count: 0, inStock: 0, cost: 6877, flag: true}, 
    {name: 'IN', hotKey: 'SE', skill: 77, progres: 0, mark: 'PA', count: 0, inStock: 0, cost: 10646, flag: true}, 
    {name: 'IN', hotKey: 'HB', skill: 81, progres: 0, mark: 'PA', count: 0, inStock: 0, cost: 12471, flag: true}, 
    {name: 'IN', hotKey: 'CO', skill: 89, progres: 0, mark: 'PA', count: 0, inStock: 0, cost: 13840, flag: true}, 
    {name: 'IN', hotKey: 'CB', skill: 66, progres: 0, mark: 'PA', count: 0, inStock: 0, cost: 7909, flag: true}
    ];

    let tabPaintsColor = [];  //tab na samochody do malowania

    const PR_AN_PAINT = function() {    
    
        function updateProgressBar(SHOWPROGTXT, progresElemBar, takeColor, progresElemTXT) {  //pasek postępu
            // Obliczenie liczby divów, które powinny być widoczne na podstawie postępu
            const visibleCount = Math.ceil(SHOWPROGTXT / 4);
            
            // Iteracja przez wszystkie divy .pr_prog_pices
            progresElemBar.forEach((div, index) => {
                
                // Jeśli indeks diva jest mniejszy niż liczba widocznych divów, pokaż div, w przeciwnym razie ukryj
                if (index <= visibleCount -1) {
                    div.style.display = 'block';   
                    div.style.background = takeColor.color; //kolor malowanego auta na pasku postepu
                    if(takeColor.color == "white" || takeColor.color == "silver" || takeColor.color == "gray" || takeColor.color == "gold") {
                        progresElemTXT.style.color = "red";  
                    } else { // zmiana coloru textu na pasku postepu
                        progresElemTXT.style.color = "rgb(247, 255, 2)"; 
                    };
   
                } else {
                    div.style.display = 'none';
                };
            });
        };
        
        function makeTxtProg(takeProg) { //obróbka postępu do wyświetlenia
            let showProg = takeProg.progres;
            showProg = Number(showProg.toFixed(2))
            showProg = showProg.toString();
            
            if (showProg.indexOf('.') !== -1 && showProg.split('.')[1].length === 1) {
                showProg += '0';
            } else if (showProg.indexOf('.') === -1) {
                showProg += '.00';
            }
            return showProg;
        };
    
        const PR_SHOWPROGRES_PA = function(hotKey, progresElemTXT, progresElemBar, gettabPAINT, gettabColor) {
            // wyświetlenie wybranego modelu
            let takeProg = gettabPAINT.find(el => el.hotKey == hotKey && el.name == prAnChosedModel);  //pobieramy rekord aktywnego auta

            const SHOWPROGTXT = makeTxtProg(takeProg);  // obrabiamy wyświetlanie progresu

            if(gettabColor.length > 0) { //gdy są auta do malowania
                let takeColor = gettabColor.find(col => col.bodycar == hotKey && col.brand == prAnChosedModel && col.NoPA == 11); //tworzymy tablice 
                if(takeColor) {
                    updateProgressBar(SHOWPROGTXT, progresElemBar, takeColor, progresElemTXT);  // aktualizujemy paski postepu malowania
                    progresElemTXT.innerHTML = `${SHOWPROGTXT} %`;
                } else {
                    progresElemTXT.innerHTML = `${SHOWPROGTXT} %`;
                    progresElemTXT.style.color = "rgb(247, 255, 2)";
                    progresElemBar.forEach(div => {
                        div.style.display = 'none';
                    })
                    
                }
            }
        };
        

        PR_CLEARTAB(tabPAINT); //zerowanie tab.zam. przed aktualizacją        
        PR_GETORDER(tabCars, tabPAINT, 'NoPA', 'PA'); // pobranie ilości zamówień

        // czy wszystkie 4 podzespoły gotowe
        tabCars.forEach(order => {
            if(order.NoUN == 1 && order.NoCA == 1 && order.NoFU == 1 && order.NoGE == 1) {
                const FLAG_PA = tabPAINT.find(elem => elem.name == order.brand && elem.hotKey == order.bodycar)
                if(FLAG_PA && FLAG_PA.count < tabMaxNoOrder[updatePALvl]) {
                    order.NoUN = 2; // zejście z prod. podzespołow
                    order.NoCA = 2; // zejście z prod. podzespołow
                    order.NoFU = 2; // zejście z prod. podzespołow
                    order.NoGE = 2; // zejście z prod. podzespołow
                    order.NoPA = 11; // przypisanie do kolejki malarni
                    FLAG_PA.count ++;
                    
                    const PAINT = new Paints(order.brand, order.bodycar, order.color, order.NoPA, order.serialNo)
                    tabPaintsColor.push(PAINT); // tab. aut na malarni
                }
            }
        })

        PR_SHOWORDER(tabPAINT, 'SE', PA_SE_ORDER, PA_SE_STOCK, updatePALvl); //wyświetl ilość zamówień i wyrobów gotowych dla SE
        PR_SHOWORDER(tabPAINT, 'HB', PA_HB_ORDER, PA_HB_STOCK, updatePALvl); //wyświetl ilość zamówień i wyrobów gotowych dla HB
        PR_SHOWORDER(tabPAINT, 'CO', PA_CO_ORDER, PA_CO_STOCK, updatePALvl); //wyświetl ilość zamówień i wyrobów gotowych dla CO
        PR_SHOWORDER(tabPAINT, 'CB', PA_CB_ORDER, PA_CB_STOCK, updatePALvl); //wyświetl ilość zamówień i wyrobów gotowych dla CB

        PR_PROGRES(tabPAINT, updatePALvl); // oblicz i zapisz w tablicy progres
        PR_OVERPROGRES(tabPAINT, PA_TABLEDATA, 'PA', 'NoPA', tabCars); // aktualizacja interfejsu i tablic po osiągnięciu min.100% progresu

        PR_SHOWPROGRES_PA('SE', PA_SE_PROGTXT, PA_SE_PROGBAR, tabPAINT, tabPaintsColor)  //wyświetlenie postepu dla SE i wybranego modelu
        PR_SHOWPROGRES_PA('HB', PA_HB_PROGTXT, PA_HB_PROGBAR, tabPAINT, tabPaintsColor)  //wyświetlenie postepu dla HB i wybranego modelu
        PR_SHOWPROGRES_PA('CO', PA_CO_PROGTXT, PA_CO_PROGBAR, tabPAINT, tabPaintsColor)  //wyświetlenie postepu dla CO i wybranego modelu
        PR_SHOWPROGRES_PA('CB', PA_CB_PROGTXT, PA_CB_PROGBAR, tabPAINT, tabPaintsColor)  //wyświetlenie postepu dla CB i wybranego modelu */

    };

    /* *********************  A N A L I T Y K A  *********************** 
        ***************   D Z I A Ł   M O N T A Ż   ***************** */

    const ASSEMBLY = document.querySelector('.pr_assembly');  //dział montaż
    const AS_SE_ORDER = ASSEMBLY.querySelector('.pr_SEA_order'); // zam. SE
    const AS_HB_ORDER = ASSEMBLY.querySelector('.pr_HBA_order'); // zam. HB
    const AS_CO_ORDER = ASSEMBLY.querySelector('.pr_COA_order'); // zam. CO
    const AS_CB_ORDER = ASSEMBLY.querySelector('.pr_CBA_order'); // zam. CB
    const AS_SE_PROGTXT = ASSEMBLY.querySelector('.pr_SEA_progs'); // pos txt SE
    const AS_HB_PROGTXT = ASSEMBLY.querySelector('.pr_HBA_progs'); // pos txt HB
    const AS_CO_PROGTXT = ASSEMBLY.querySelector('.pr_COA_progs'); // pos txt CO
    const AS_CB_PROGTXT = ASSEMBLY.querySelector('.pr_CBA_progs'); // pos txt CB
    const AS_SE_PROGBAR = ASSEMBLY.querySelectorAll('.pr_prog_barSEA'); //pos bar SE
    const AS_HB_PROGBAR = ASSEMBLY.querySelectorAll('.pr_prog_barHBA'); //pos bar HB
    const AS_CO_PROGBAR = ASSEMBLY.querySelectorAll('.pr_prog_barCOA'); //pos bar CO
    const AS_CB_PROGBAR = ASSEMBLY.querySelectorAll('.pr_prog_barCBA'); //pos bar CB
    const AS_SE_STOCK = ASSEMBLY.querySelector('.pr_stock_SEA'); // gotowe SE
    const AS_HB_STOCK = ASSEMBLY.querySelector('.pr_stock_HBA'); // gotowe HB
    const AS_CO_STOCK = ASSEMBLY.querySelector('.pr_stock_COA'); // gotowe CO
    const AS_CB_STOCK = ASSEMBLY.querySelector('.pr_stock_CBA'); // gotowe CB
    
    const AS_TABLEDATA = { //mapowanie elementów interfejsu dla każdego typu podwozia
        'SE': {order: AS_SE_ORDER, progtxt: AS_SE_PROGTXT, stock: AS_SE_STOCK},
        'HB': {order: AS_HB_ORDER, progtxt: AS_HB_PROGTXT, stock: AS_HB_STOCK},
        'CO': {order: AS_CO_ORDER, progtxt: AS_CO_PROGTXT, stock: AS_CO_STOCK},
        'CB': {order: AS_CB_ORDER, progtxt: AS_CB_PROGTXT, stock: AS_CB_STOCK},
    }

    const tabASSEMBLY = [ //tablica danych produkcji montażu
    {name: 'CO', hotKey: 'SE', skill: 56, progres: 0, mark: 'AS', count: 0, inStock: 0, cost: 4000, flag: true}, 
    {name: 'CO', hotKey: 'HB', skill: 60, progres: 0, mark: 'AS', count: 0, inStock: 0, cost: 5300, flag: true}, 
    {name: 'CO', hotKey: 'CO', skill: 67, progres: 0, mark: 'AS', count: 0, inStock: 0, cost: 6800, flag: true}, 
    {name: 'CO', hotKey: 'CB', skill: 52, progres: 0, mark: 'AS', count: 0, inStock: 0, cost: 4000, flag: true},
    {name: 'AS', hotKey: 'SE', skill: 63, progres: 0, mark: 'AS', count: 0, inStock: 0, cost: 4600, flag: true}, 
    {name: 'AS', hotKey: 'HB', skill: 65, progres: 0, mark: 'AS', count: 0, inStock: 0, cost: 6095, flag: true},
    {name: 'AS', hotKey: 'CO', skill: 69, progres: 0, mark: 'AS', count: 0, inStock: 0, cost: 7820, flag: true}, 
    {name: 'AS', hotKey: 'CB', skill: 59, progres: 0, mark: 'AS', count: 0, inStock: 0, cost: 4600, flag: true}, 
    {name: 'VE', hotKey: 'SE', skill: 65, progres: 0, mark: 'AS', count: 0, inStock: 0, cost: 5290, flag: true}, 
    {name: 'VE', hotKey: 'HB', skill: 67, progres: 0, mark: 'AS', count: 0, inStock: 0, cost: 7009, flag: true}, 
    {name: 'VE', hotKey: 'CO', skill: 71, progres: 0, mark: 'AS', count: 0, inStock: 0, cost: 8993, flag: true}, 
    {name: 'VE', hotKey: 'CB', skill: 61, progres: 0, mark: 'AS', count: 0, inStock: 0, cost: 5290, flag: true}, 
    {name: 'IN', hotKey: 'SE', skill: 73, progres: 0, mark: 'AS', count: 0, inStock: 0, cost: 6084, flag: true}, 
    {name: 'IN', hotKey: 'HB', skill: 75, progres: 0, mark: 'AS', count: 0, inStock: 0, cost: 8061, flag: true}, 
    {name: 'IN', hotKey: 'CO', skill: 78, progres: 0, mark: 'AS', count: 0, inStock: 0, cost: 10342, flag: true}, 
    {name: 'IN', hotKey: 'CB', skill: 67, progres: 0, mark: 'AS', count: 0, inStock: 0, cost: 6084, flag: true}
    ];

    const PR_AN_ASSEMBLY = function() {

        PR_CLEARTAB(tabASSEMBLY); //zerowanie tab.zam. przed aktualizacją
        PR_GETORDER(tabCars, tabASSEMBLY, 'NoAS', 'AS'); // wewnętrzna funkcja

        tabCars.forEach(order => {
            //zmiana z magazyn malarni na kolejke montaz
            if(order.NoPA == 12) {
                const FLAG_AS = tabASSEMBLY.find(elem => elem.name == order.brand && elem.hotKey == order.bodycar)
                if(FLAG_AS && FLAG_AS.count < tabMaxNoOrder[updateASLvl]) {
                    order.NoPA = 13;
                    order.NoAS = 21;
                    FLAG_AS.count ++;
                }
            }; 
        })

        PR_SHOWORDER(tabASSEMBLY, 'SE', AS_SE_ORDER, AS_SE_STOCK, updateASLvl); //wyświetl ilość zamówień i wyrobów gotowych dla SE
        PR_SHOWORDER(tabASSEMBLY, 'HB', AS_HB_ORDER, AS_HB_STOCK, updateASLvl); //wyświetl ilość zamówień i wyrobów gotowych dla HB
        PR_SHOWORDER(tabASSEMBLY, 'CO', AS_CO_ORDER, AS_CO_STOCK, updateASLvl); //wyświetl ilość zamówień i wyrobów gotowych dla CO
        PR_SHOWORDER(tabASSEMBLY, 'CB', AS_CB_ORDER, AS_CB_STOCK, updateASLvl); //wyświetl ilość zamówień i wyrobów gotowych dla CB

        PR_PROGRES(tabASSEMBLY, updateASLvl); // oblicz i zapisz w tablicy progres
        PR_OVERPROGRES(tabASSEMBLY, AS_TABLEDATA, 'AS', 'NoAS', tabCars); // aktualizacja interfejsu i tablic po osiągnięciu min.100% progresu

        PR_SHOWPROGRES('SE', AS_SE_PROGTXT, AS_SE_PROGBAR, tabASSEMBLY)  //wyświetlenie postepu dla SE i wybranego modelu
        PR_SHOWPROGRES('HB', AS_HB_PROGTXT, AS_HB_PROGBAR, tabASSEMBLY)  //wyświetlenie postepu dla HB i wybranego modelu
        PR_SHOWPROGRES('CO', AS_CO_PROGTXT, AS_CO_PROGBAR, tabASSEMBLY)  //wyświetlenie postepu dla CO i wybranego modelu
        PR_SHOWPROGRES('CB', AS_CB_PROGTXT, AS_CB_PROGBAR, tabASSEMBLY)  //wyświetlenie postepu dla CB i wybranego modelu */

    };

    /* *********************  A N A L I T Y K A  *********************** 
    ***************   S T A T Y S T Y K I  P R O D U K C J I    ***************** */

    const STATS = document.querySelector('.pr_stats');  //dział statystyk
    const ST_SE_ORDER = STATS.querySelector('.pr_order_SES'); // zam. SE
    const ST_HB_ORDER = STATS.querySelector('.pr_order_HBS'); // zam. HB
    const ST_CO_ORDER = STATS.querySelector('.pr_order_COS'); // zam. CO
    const ST_CB_ORDER = STATS.querySelector('.pr_order_CBS'); // zam. CB
    const ST_SE_PROGTXT = STATS.querySelector('.pr_prog_SES'); // pos txt SE
    const ST_HB_PROGTXT = STATS.querySelector('.pr_prog_HBS'); // pos txt HB
    const ST_CO_PROGTXT = STATS.querySelector('.pr_prog_COS'); // pos txt CO
    const ST_CB_PROGTXT = STATS.querySelector('.pr_prog_CBS'); // pos txt CB
    const ST_SE_STOCK = STATS.querySelector('.pr_stock_SES'); // gotowe SE
    const ST_HB_STOCK = STATS.querySelector('.pr_stock_HBS'); // gotowe HB
    const ST_CO_STOCK = STATS.querySelector('.pr_stock_COS'); // gotowe CO
    const ST_CB_STOCK = STATS.querySelector('.pr_stock_CBS'); // gotowe CB

    const ST_TABLEDATA = { //mapowanie elementów interfejsu dla każdego typu podwozia
        'SE': {order: ST_SE_ORDER, progtxt: ST_SE_PROGTXT, stock: ST_SE_STOCK},
        'HB': {order: ST_HB_ORDER, progtxt: ST_HB_PROGTXT, stock: ST_HB_STOCK},
        'CO': {order: ST_CO_ORDER, progtxt: ST_CO_PROGTXT, stock: ST_CO_STOCK},
        'CB': {order: ST_CB_ORDER, progtxt: ST_CB_PROGTXT, stock: ST_CB_STOCK},
    }

    const tabSTATS = [ //tablica statystyk produkcji
    {name: 'CO', hotKey: 'SE', progres: 0, count: 0, inStock: 0}, 
    {name: 'CO', hotKey: 'HB', progres: 0, count: 0, inStock: 0}, 
    {name: 'CO', hotKey: 'CO', progres: 0, count: 0, inStock: 0}, 
    {name: 'CO', hotKey: 'CB', progres: 0, count: 0, inStock: 0},
    {name: 'AS', hotKey: 'SE', progres: 0, count: 0, inStock: 0}, 
    {name: 'AS', hotKey: 'HB', progres: 0, count: 0, inStock: 0},
    {name: 'AS', hotKey: 'CO', progres: 0, count: 0, inStock: 0}, 
    {name: 'AS', hotKey: 'CB', progres: 0, count: 0, inStock: 0}, 
    {name: 'VE', hotKey: 'SE', progres: 0, count: 0, inStock: 0}, 
    {name: 'VE', hotKey: 'HB', progres: 0, count: 0, inStock: 0}, 
    {name: 'VE', hotKey: 'CO', progres: 0, count: 0, inStock: 0}, 
    {name: 'VE', hotKey: 'CB', progres: 0, count: 0, inStock: 0}, 
    {name: 'IN', hotKey: 'SE', progres: 0, count: 0, inStock: 0}, 
    {name: 'IN', hotKey: 'HB', progres: 0, count: 0, inStock: 0}, 
    {name: 'IN', hotKey: 'CO', progres: 0, count: 0, inStock: 0}, 
    {name: 'IN', hotKey: 'CB', progres: 0, count: 0, inStock: 0}
    ];

    // zerowanie liczników
        const PR_ST_CLEAR = function(getTabSTATS) {  
            getTabSTATS.forEach(elem => {
                elem.count = 0;
                elem.progres = 0;
                elem.inStock = 0;
            });
        };

        // pobranie ilości samochodów na etapach produkcji
        const PR_ST_GETORDER = function(getTabCars, getTabSTATS) {
            getTabCars.forEach(order => {
                getTabSTATS.forEach(position => {
                    if(order.brand == position.name && order.bodycar == position.hotKey) {
                        if(order.NoST == 30) position.count ++; // zam. w kolejce
                        if(order.NoST == 31) position.progres ++; // zam. w toku
                        if(order.NoST == 32) position.inStock++; // zam. gotowe
                    };
                });
            });

            //zmiana z magazyn montażu na magazyn gotowych
            getTabCars.forEach(order => {
                if(order.NoAS == 22) {
                // console.log(order.NoAS);
                    const FLAG_WH = tabSTATS.find(elem => elem.name == order.brand && elem.hotKey == order.bodycar)
                    if(FLAG_WH && FLAG_WH.inStock < tabMaxNoOrder[updateWHLvl]) {
                        order.NoAS = 23; //zejście z montażu
                        order.NoST = 32; // zmiana statusu zam. na 'gotowe'
                        FLAG_WH.inStock ++;
                    }
                }; 
            })
        };

        // wyświetlenie ilości samochodów na etapch produkcji
        const PR_ST_SHOWSTATS = function(getTabSTATS, getST_TABLEDATA) {
            getTabSTATS.forEach(position => {
                // Aktualizacja elementów interfejsu dla wybranego modelu samochodu
            if(position.name == prAnChosedModel) {
                const {order, stock, progtxt} = getST_TABLEDATA[position.hotKey];
                order.innerHTML = position.count;
                stock.innerHTML = position.inStock;
                progtxt.innerHTML = position.progres;
            };
            });
            
        };

    const PR_AN_STATS = function() {
        PR_ST_CLEAR(tabSTATS); // zerowanie liczników przed odświeżeniem
        PR_ST_GETORDER(tabCars, tabSTATS); // pobranie stanu zam do tablicy
        PR_ST_SHOWSTATS(tabSTATS, ST_TABLEDATA); //wyświetlenie ilości samochodów na etapch produkcji
    };


    /* *********************  A N A L I T Y K A  *********************** 
    ***************   S T A T Y S T Y K I  M A G A Z Y N U    ***************** */


    const WAREHOUSE = document.querySelector('.warehouse_department');  //magazyn

    const warehouseElements = {
        'CO': { 'SE': WAREHOUSE.querySelector('.wh_CO_SE'), 
                'HB': WAREHOUSE.querySelector('.wh_CO_HB'), 
                'CO': WAREHOUSE.querySelector('.wh_CO_CO'), 
                'CB': WAREHOUSE.querySelector('.wh_CO_CB') },
        'AS': { 'SE': WAREHOUSE.querySelector('.wh_AS_SE'), 
                'HB': WAREHOUSE.querySelector('.wh_AS_HB'), 
                'CO': WAREHOUSE.querySelector('.wh_AS_CO'), 
                'CB': WAREHOUSE.querySelector('.wh_AS_CB') },
        'VE': { 'SE': WAREHOUSE.querySelector('.wh_VE_SE'), 
                'HB': WAREHOUSE.querySelector('.wh_VE_HB'), 
                'CO': WAREHOUSE.querySelector('.wh_VE_CO'), 
                'CB': WAREHOUSE.querySelector('.wh_VE_CB') },
        'IN': { 'SE': WAREHOUSE.querySelector('.wh_IN_SE'), 
                'HB': WAREHOUSE.querySelector('.wh_IN_HB'), 
                'CO': WAREHOUSE.querySelector('.wh_IN_CO'), 
                'CB': WAREHOUSE.querySelector('.wh_IN_CB') }
    };

    const WH_ALL = document.querySelector('.wh_all'); //dział magazynu
    const SELL_WINDOW = WH_ALL.querySelector('.wh_popup'); // okno potwierdzenia sprzedaży
    const BUT_SELL_YES = SELL_WINDOW.querySelector('.but_sell_Y');  //przycisk TAK
    const BUT_SELL_NO = SELL_WINDOW.querySelector('.but_sell_N');  //przycisk NIE
    const END_ORDER_LIST = WH_ALL.querySelector('.end_order_list_js'); //uchwyt do listy wykonanych zamówień

    let WH_lineValue = ``; // treść linii skończonych zamówień
    let NoORtoSell = 0; //nr zam. wybranego do sprzedaży
    let lastQuantityOrder = 0;  //ostatnia zapisana ilość ukończonych zamówień
    let OBS_END_ORDER; // zmienna globalna przechowująca obiekt MutationObserver
    let isPlay = true; //czy gra była uruchomiona podczas wyboru zamówienia do sprzedaży


    //mechanizm sprzedaży
    function makeSell () {
        // aktualizacja finansów po sprzedaży
        let valueSell = tabCars.find(el => el.NoOR == NoORtoSell); //szukamy sprzedawane zamówienie
        let allValueSell = valueSell.price * valueSell.quantityOrder; //liczymy wartość sprzedaży
        
        profitDay += Number(valueSell.profit * valueSell.quantityOrder); // zysk z zamówienia

        cash += allValueSell;
        cash = Math.floor(cash);
        let format_cash = formatNumber(cash);
        CASH.innerHTML = `Stan finansów: &nbsp;&nbsp; ${format_cash} zł`;

        dayProfit(); //wyświetlenie dziennego zysku

        // prządkujemy tabCars po usunięciu wybranego do sprzedazy zam.
        tabCars = tabCars.filter(order => order.NoOR !== NoORtoSell);

        if(tabCars.length < 1) {
            orderNo = 0;  //gdy tabCars jest pusta zerujemy licznik zamówień
        } else {
            if(tabCars[0].NoOR == 2) { // gdy pierwsze zam. ma nr 2
                if(tabCars.length == 1) { // a dł. tab. = 1
                    tabCars[0].NoOR = 1; // to zmieniamy nr zam. na 1 
                    orderNo = 1; // i ustawiamy licznik na 1
                } else {
                    tabCars.forEach(order => {
                        order.NoOR --;    
                    });
                    orderNo = tabCars[tabCars.length - 1].NoOR;
                };
            } else {
                tabCars.forEach((order, index, arr) => {
                    if(arr[index + 1] !== undefined) {
                        if(arr[index + 1].NoOR - order.NoOR  == 2) {
                            for(let i = index + 1; i < tabCars.length; i ++) {
                                tabCars[i].NoOR --;
                            };
                        };
                    };
                });
                orderNo = tabCars[tabCars.length - 1].NoOR;
            };
        };

        // odświeżamy okna zamówień, statystyk, magazynu
        orderList();
        PR_ST_CLEAR(tabSTATS); // zerowanie liczników przed odświeżeniem
        PR_ST_GETORDER(tabCars, tabSTATS); // pobranie stanu zam do tablicy
        PR_ST_SHOWSTATS(tabSTATS, ST_TABLEDATA);
        WH_STATS();
        WH_ORDER_END_A();
        END_ORDER_LIST.innerHTML =  WH_lineValue;

        SELL_WINDOW.classList.add('window_hidden');
    }

    //potwierdzenie sprzedaży i zakończenia zamówienia
    BUT_SELL_YES.addEventListener('click', () => { 
        // uruchamiamy dalej grę jeżeli miała taki stan podczas wyboru zamówienia do sprzedaży
        if(isPlay == false) {
            clearInterval(intervalID); // zatrzymanie gry do czasu potwierdzenia
            intervalID = setInterval(countTime, chosenSpeed); 
            STARTBUT.innerHTML = "STOP";
            STARTBUT.style.background = 'red';
            STARTBUT.disabled = false;
            isRunning = !isRunning;
            isPlay = true;
        }

        makeSell(); //mechanizm sprzedaży
    });
    

    // rezygnujemy ze sprzedaży i zakończenia zamówienia
    BUT_SELL_NO.addEventListener('click', () => {
        // uruchamiamy dalej grę jeżeli miała taki stan podczas wyboru zamówienia do sprzedaży
        if(isPlay == false) {
            clearInterval(intervalID); // zatrzymanie gry do czasu potwierdzenia
            intervalID = setInterval(countTime, chosenSpeed); 
            STARTBUT.innerHTML = "STOP";
            STARTBUT.style.background = 'red';
            STARTBUT.disabled = false;
            isRunning = !isRunning;
            isPlay = true;
        }
        
        // odznaczamy zamówienie na liście, ukrywamy okno sprzedaży
        findOrder(NoORtoSell, false);
        const ALL_END_ORDER_LIST = END_ORDER_LIST.querySelectorAll('.order_line');
        ALL_END_ORDER_LIST.forEach(elem => {
            if(elem.firstChild.innerHTML == NoORtoSell) {
                elem.classList.remove('wh_order_line_style');
            }
        })
        SELL_WINDOW.classList.add('window_hidden');
    });
    
    // wyszukanie i zaznaczenie/odznaczenie zam. na liscie zamówień
    function findOrder(NoOR, flag) {  
        const ORDER_LINE = ORDER_LIST.querySelectorAll('.order_line');
        ORDER_LINE.forEach(elem => {
            if(elem.firstChild.innerHTML == NoOR && flag == true) {
                elem.classList.add('wh_order_line_style');
            } else {
                elem.classList.remove('wh_order_line_style');
            };
        });
    };

    // zaznaczenie ukończonego zamówienia na liście
    function sellCars() {  
        const ALL_END_ORDER_LIST = END_ORDER_LIST.querySelectorAll('.order_line');
        ALL_END_ORDER_LIST.forEach(elem => {
            
            elem.addEventListener('mouseover', () => { //wybór zam. do sprzedaży
                if(isRunning == false) {
                    clearInterval(intervalID); // zatrzymanie gry do czasu potwierdzenia
                    STARTBUT.innerHTML = "START";
                    STARTBUT.style.background = 'green';
                    STARTBUT.disabled = true;
                    isRunning = !isRunning;
                    isPlay = false;
                }
                // odznaczenie wszystkich ukończonych zamówień
                ALL_END_ORDER_LIST.forEach(line => {
                    line.classList.remove('wh_order_line_style');
                })
                
                // zaznaczenie aktywnego zam. do sprzedaży
                elem.classList.add('wh_order_line_style');
                //pobranie nr zam. do sprzedaży
                NoORtoSell= elem.firstChild.innerHTML;
                NoORtoSell = Number(NoORtoSell);
                findOrder(NoORtoSell, true);  //wyszukanie i zaznaczenie zam. na liscie zamówień

                //wyświetlenie okna potwierdzenia sprzedaży
                SELL_WINDOW.classList.remove('window_hidden');                
            });
        });  
    };

    // tworzenie obiektu observer do śledzenia zmian w liście zam. ukończonych
    function startObserving() {
        OBS_END_ORDER = new MutationObserver(sellCars); 
        const TARGET_NODE = document.querySelector('.end_order_list_js');
        const CONFIG = { childList: true};

        OBS_END_ORDER.observe(TARGET_NODE, CONFIG); // rozpoczęcie obserwacji
        
        END_ORDER_LIST.innerHTML =  WH_lineValue;
    }

    // zatrzymanie obserwacji 
    function stopObserving() {
        if (OBS_END_ORDER) {
            OBS_END_ORDER.disconnect(); 
        }
    }
    
    // Aktualizuja statystyk magazynu
    const WH_STATS = function() {
        for (const elem of tabSTATS) {
            const { name, hotKey, inStock } = elem;
            if (warehouseElements[name] && warehouseElements[name][hotKey]) {
                warehouseElements[name][hotKey].innerHTML = inStock;
            }
        }
    };

    //wyświetl listę wykonanych zamówień
    let actualQuantityOrder = 0; //aktualna ilość skończonych zamówień
    const WH_ORDER_END_A = function() {  
        if(tabCars.length > 0) {
            WH_lineValue = ``; // treść linii skończonych zamówień
            actualQuantityOrder = 0;
            const ORDER_QUANTITY = tabCars[tabCars.length - 1].NoOR;  // ilość zamówień w tabCars

            for(let i = 0; i < ORDER_QUANTITY; i++) {
                let allQuanOrder = 0; // ilość ukończonych aut z zamówienia
                let allPrice = 0; // wartość sprzedaży całego zamówienia
                let allProfit = 0; // wartość zysku dla całego zamówienia
                tabCars.forEach(order => {
                    if(order.NoOR == i + 1 && order.NoST == 32) {
                        allQuanOrder ++; 
                        if(order.quantityOrder == allQuanOrder) {
                            allPrice = Math.floor(order.price * order.quantityOrder);
                            allProfit =  Math.floor(allPrice - (order.cost * order.quantityOrder));
                            allPrice = formatNumber(allPrice);
                            allProfit = formatNumber(allProfit);

                            let ORDER_LINE = `<div class="order_line"><div class="order_des">${order.NoOR}</div><div class="order_des">${order.brand}</div><div class="order_des">${order.quantityOrder}</div><div class="order_des order_des_big order_number">${allPrice}&nbsp;</div>
                            <div class="order_des order_des_big order_number">${allProfit}&nbsp;</div></div>`;

                            WH_lineValue = ORDER_LINE + WH_lineValue;

                            if(actualQuantityOrder == 0) lastQuantityOrder = 0; // zerowanie flagi gdy na liscie nie ma już zakończonych zamówień a są w toku
                            actualQuantityOrder ++;

                            //robimy sprawdzenie by wykonywac kod stop/start Obserwer gdy zachodzą zmiany na liście ukończonych zamówień
                            if(actualQuantityOrder !== lastQuantityOrder) {
                                stopObserving(); 
                                startObserving();

                                lastQuantityOrder = actualQuantityOrder;
                            }                        
                        };
                    };
                });
            };    
        } else {
            END_ORDER_LIST.innerHTML =  '';
            lastQuantityOrder = 0;
        };  
    };        

    //automatyczna sprzedaż z magazynu
    let flagSell = 0; //czas do wyzwolenia autosprzedaży
    function AUTO_SELL() {
        flagProfitDay++;
        if(actualQuantityOrder > tabWHLvl[updateWHLvl].maxorder) {
            flagSell ++;
            if(flagSell >= tabWHLvl[updateWHLvl].autotime) {
                let orderToSell = Math.floor((Math.random()* actualQuantityOrder));
                const ALL_END_ORDER_LIST = END_ORDER_LIST.querySelectorAll('.order_line');

                const RANDOM_ORDER = ALL_END_ORDER_LIST[orderToSell];
                NoORtoSell = RANDOM_ORDER.firstChild.innerHTML;
                NoORtoSell = Number(NoORtoSell);

                makeSell();
                flagSell = 0;
            }
        }

        if(flagProfitDay == 1440) {
            flagProfitDay = 0;
            bestProfit();
            profitDay = 0;
            dayProfit();
        }
    }
    
    
    /* ************************* SPEED GAME ********************** */

    let chosenSpeed = 1000;  //wybrana prędkość gry
    let isRunning = true; //przełącznik start / stop gry
    let startDate = new Date('2024-01-01T00:01');
    let intervalID = null;  //nazwa interwału
    let speedCounter = 1; // wybrana prędkośc gry
    let autoOrderCount = 0; //licznik wyzwalania funkcji AUTO_ORDER

    const tabLowSpeedDes = ['min. x1', 'x1 << x2', 'x2 << x4', 'x4 << x8', 'x8 << x16'];
    const tabHighSpeedDes = ['x1 >> x2', 'x2 >> x4', 'x4 >> x8', 'x8 >> x16', 'max. x16'];
    const tabChosenSpeed = [1000, 500, 250, 125, 65];  //dostepne szybkości gry
    const GAMEDATE = document.querySelector('.speed_day');
    const STARTBUT = document.querySelector('.but_start');
    const LOWSPEED = document.querySelector('.but_speedM');
    const HIGHSPEED = document.querySelector('.but_speedP');

    function countTime() {  //obsługa licznika czasu
        let curYear = startDate.getFullYear();
        let curMonth = startDate.getMonth() + 1;
        let curDay = startDate.getDate();
        let curHours = startDate.getHours();
        let curMinutes = startDate.getMinutes();

        if (curMonth < 10) curMonth = "0" + curMonth;
        if (curDay < 10) curDay = "0" + curDay;
        if (curHours < 10) curHours = "0" + curHours;
        if (curMinutes < 10) curMinutes = "0" + curMinutes;

        startDate.setMinutes(startDate.getMinutes() + 1);
        GAMEDATE.innerHTML = `${curYear}-${curMonth}-${curDay} &nbsp;&nbsp;  ${curHours}:${curMinutes}`;

        autoOrderCount++;

        PR_AN_UNDERBODY(); //analiza produkcji podwozi
        PR_AN_CARBODY(); //analiza produkcji nadwozi
        PR_AN_ENGINE(); //analiza produkcji silników
        PR_AN_GEAR(); //analiza produkcji skrzyń biegów 
        PR_AN_PAINT();  //analiza pracy malarni
        PR_AN_ASSEMBLY(); //analiza pracy montowni
        PR_AN_STATS(); //statystyki produkcji
        WH_STATS(); //magazyn
        WH_ORDER_END_A();  //wyświetl ukończone zamówienia
        AUTO_ORDER(); //automatyczny wybór zamówienia
        AUTO_SELL(); //automatyczna sprzedaż
    }

    LOWSPEED.disabled = true;
    HIGHSPEED.disabled = false;
    LOWSPEED.innerHTML = tabLowSpeedDes[0];
    HIGHSPEED.innerHTML = tabHighSpeedDes[0];

    function toggleTime() {  //zmiana start / stop gry
        if (isRunning) {  //gdy startujemy grę to ...

            clearInterval(intervalID);
            intervalID = setInterval(countTime, chosenSpeed);
            STARTBUT.innerHTML = "STOP";
            STARTBUT.style.background = 'red';

        } else {  //gdy zatrzymujemy grę to ...

            clearInterval(intervalID);
            STARTBUT.innerHTML = "START";
            STARTBUT.style.background = 'green';
        }
        isRunning = !isRunning;
    }

    function changeSpeed(direction) {
        if (direction === 'up' && speedCounter < tabChosenSpeed.length) {
            speedCounter++;
        } else if (direction === 'down' && speedCounter > 1) {
            speedCounter--;
        }
        chosenSpeed = tabChosenSpeed[speedCounter - 1];

        if(isRunning == false) {
            clearInterval(intervalID);
            intervalID = setInterval(countTime, chosenSpeed); 
        }
        
        LOWSPEED.disabled = speedCounter === 1;
        HIGHSPEED.disabled = speedCounter === tabChosenSpeed.length;
        LOWSPEED.innerHTML = tabLowSpeedDes[speedCounter - 1];
        HIGHSPEED.innerHTML = tabHighSpeedDes[speedCounter - 1];
    }

    STARTBUT.addEventListener('click', toggleTime);
    HIGHSPEED.addEventListener('click', () => changeSpeed('up'));
    LOWSPEED.addEventListener('click', () => changeSpeed('down'));

    
    /*  ************** ULEPSZANIE DZIAŁÓW ************* */

    //tab. poziomów działu zamówień
    const tabOrderLvl = [
        {name: 'lv.0', autotime: 239, NoOrders: 1, minOR: 1, maxOR: 2, uplevel: 0, ratio: 1.13, inorder: 10},
        {name: 'lv.1', autotime: 215, NoOrders: 0.85, minOR: 1, maxOR: 3, uplevel: 1500000, ratio: 1.14, inorder: 15}, 
        {name: 'lv.2', autotime: 190, NoOrders: 0.7, minOR: 2, maxOR: 4, uplevel: 2500000, ratio: 1.15, inorder: 20}, 
        {name: 'lv.3', autotime: 165, NoOrders: 0.6, minOR: 3, maxOR: 6, uplevel: 4500000, ratio: 1.16, inorder: 25}, 
        {name: 'lv.4', autotime: 140, NoOrders: 0.5, minOR: 4, maxOR: 8, uplevel: 9000000, ratio: 1.17, inorder: 30}, 
        {name: 'lv.5', autotime: 115, NoOrders: 0.4, minOR: 6, maxOR: 9, uplevel: 13000000, ratio: 1.18, inorder: 35}, 
        {name: 'lv.6', autotime: 90, NoOrders: 0.3, minOR: 8, maxOR: 11, uplevel: 20000000, ratio: 1.19, inorder: 40}, 
        {name: 'lv.7', autotime: 65, NoOrders: 0.2, minOR: 10, maxOR: 14, uplevel: 32000000, ratio: 1.20, inorder: 45}, 
        {name: 'lv.8', autotime: 40, NoOrders: 0.1, minOR: 13, maxOR: 16, uplevel: 50000000, ratio: 1.21, inorder: 50}, 
        {name: 'lv.9', autotime: 30, NoOrders: 0.05, minOR: 16, maxOR: 18, uplevel: 90000000, ratio: 1.22, inorder: 55}, 
        {name: 'lv.10', autotime: 15, NoOrders: 0.01, minOR: 20, maxOR: 80, uplevel: 150000000, ratio: 1.23, inorder: 60}
    ];

    // tab. poziomów produkcji, stopnia kosztów i kosztów ulepszeń
    const tabFactoryLvl = [
        {name: 'lv.0', profit: 0.10, cost: 1.00, uplevel: 0},
        {name: 'lv.1', profit: 0.20, cost: 0.90, uplevel: 2000000}, 
        {name: 'lv.2', profit: 0.25, cost: 0.81, uplevel: 3500000}, 
        {name: 'lv.3', profit: 0.30, cost: 0.72, uplevel: 6000000}, 
        {name: 'lv.4', profit: 0.35, cost: 0.63, uplevel: 10000000}, 
        {name: 'lv.5', profit: 0.40, cost: 0.55, uplevel: 16000000}, 
        {name: 'lv.6', profit: 0.42, cost: 0.48, uplevel: 25000000}, 
        {name: 'lv.7', profit: 0.44, cost: 0.42, uplevel: 40000000}, 
        {name: 'lv.8', profit: 0.46, cost: 0.36, uplevel: 70000000}, 
        {name: 'lv.9', profit: 0.48, cost: 0.31, uplevel: 120000000}, 
        {name: 'lv.10', profit: 0.50, cost: 0.25, uplevel: 200000000}
    ];

    // tab. poziomów działów produkcji ,kosztów ulepszeń
    const tabUpdateProdTime = [
        {name: 'lv.0', ratio: 1.00, uplevel: 0},
        {name: 'lv.1', ratio: 0.97, uplevel: 1000000}, 
        {name: 'lv.2', ratio: 0.94, uplevel: 1500000}, 
        {name: 'lv.3', ratio: 0.91, uplevel: 4000000}, 
        {name: 'lv.4', ratio: 0.88, uplevel: 7000000}, 
        {name: 'lv.5', ratio: 0.85, uplevel: 12000000}, 
        {name: 'lv.6', ratio: 0.83, uplevel: 20000000}, 
        {name: 'lv.7', ratio: 0.81, uplevel: 33000000}, 
        {name: 'lv.8', ratio: 0.79, uplevel: 58000000}, 
        {name: 'lv.9', ratio: 0.77, uplevel: 93000000}, 
        {name: 'lv.10', ratio: 0.75, uplevel: 140000000}
    ];

    //tab. poziomów magazynu-sprzedaży
    const tabWHLvl = [
        {name: 'lv.0', autotime: 250, maxorder: 20, uplevel: 0, ratio: 1.01},
        {name: 'lv.1', autotime: 235, maxorder: 17, uplevel: 1200000, ratio: 1.024}, 
        {name: 'lv.2', autotime: 215, maxorder: 14, uplevel: 2300000, ratio: 1.028}, 
        {name: 'lv.3', autotime: 190, maxorder: 12, uplevel: 3800000, ratio: 1.031}, 
        {name: 'lv.4', autotime: 165, maxorder: 10, uplevel: 7700000, ratio: 1.034}, 
        {name: 'lv.5', autotime: 140, maxorder: 8, uplevel: 11000000, ratio: 1.037}, 
        {name: 'lv.6', autotime: 115, maxorder: 6, uplevel: 16200000, ratio: 1.04}, 
        {name: 'lv.7', autotime: 90, maxorder: 5, uplevel: 26900000, ratio: 1.043}, 
        {name: 'lv.8', autotime: 65, maxorder: 4, uplevel: 43600000, ratio: 1.046}, 
        {name: 'lv.9', autotime: 40, maxorder: 3, uplevel: 79800000, ratio: 1.05}, 
        {name: 'lv.10', autotime: 25, maxorder: 1, uplevel: 110000000, ratio: 1.055}
    ];

    const COST_INFO_FIRST_DAY = document.querySelector('.cost_info'); //okno informacyjne po pierwszym dniu kosztów
    const CLOSE_INFO = document.querySelector('.close_window'); //przycisk zamknięcia okna informacyjnego

    //uchwyt rodzic do działu
    const ORDER_DEPARTMENT = document.querySelector('.order_department');
    const PROD_DEPARTMENT = document.querySelector('.production_department');
    const WHOUSE_DEPARTMENT = document.querySelector('.warehouse_department');

    //uchwyty do przycisków ulepszeń na działach
    const BUT_UPDATE_ORDER = ORDER_DEPARTMENT.querySelector('.order_update');
    const BUT_UPDATE_PROD = PROD_DEPARTMENT.querySelector('.prod_update');
    const BUT_UPDATE_WHOUSE = WHOUSE_DEPARTMENT.querySelector('.wh_update');
    const BUT_UPDATE_UN = UNDERBODY.querySelector('.prod_update');
    const BUT_UPDATE_CA = CARBODY.querySelector('.prod_update');
    const BUT_UPDATE_FU = FUEL.querySelector('.prod_update');
    const BUT_UPDATE_GE = GEAR.querySelector('.prod_update');
    const BUT_UPDATE_PA = PAINT.querySelector('.prod_update');
    const BUT_UPDATE_AS = ASSEMBLY.querySelector('.prod_update');

    //uchwyt okna potwierdzenia rozbudowy działu
    const LVL_POPUP_OR = ORDER_DEPARTMENT.querySelector('.or_popup');
    const LVL_POPUP_PR = PROD_DEPARTMENT.querySelector('.pr_popup');
    const LVL_POPUP_WH = WHOUSE_DEPARTMENT.querySelector('.whouse_popup')
    const LVL_POPUP_UN = UNDERBODY.querySelector('.pr_popup');
    const LVL_POPUP_CA =  CARBODY.querySelector('.pr_popup');
    const LVL_POPUP_FU =  FUEL.querySelector('.pr_popup');
    const LVL_POPUP_GE =  GEAR.querySelector('.pr_popup');
    const LVL_POPUP_PA =  PAINT.querySelector('.pr_popup');
    const LVL_POPUP_AS =  ASSEMBLY.querySelector('.pr_popup');

    //przycisk potwierdzenia rozbudowy
    const BUT_YES_OR = LVL_POPUP_OR.querySelector('.but_sell_Y');
    const BUT_YES_PR = LVL_POPUP_PR.querySelector('.but_sell_Y');
    const BUT_YES_WH = LVL_POPUP_WH.querySelector('.but_sell_Y')
    const BUT_YES_UN = LVL_POPUP_UN.querySelector('.but_sell_Y');
    const BUT_YES_CA = LVL_POPUP_CA.querySelector('.but_sell_Y');
    const BUT_YES_FU = LVL_POPUP_FU.querySelector('.but_sell_Y');
    const BUT_YES_GE = LVL_POPUP_GE.querySelector('.but_sell_Y');
    const BUT_YES_PA = LVL_POPUP_PA.querySelector('.but_sell_Y');
    const BUT_YES_AS = LVL_POPUP_AS.querySelector('.but_sell_Y');

    //przycisk rezygnacji z rozbudowy / zamknięcia okna gdy brak środków
    const BUT_NO_OR = LVL_POPUP_OR.querySelector('.but_sell_N');
    const BUT_NO_PR = LVL_POPUP_PR.querySelector('.but_sell_N');
    const BUT_NO_WH = LVL_POPUP_WH.querySelector('.but_sell_N');
    const BUT_NO_UN = LVL_POPUP_UN.querySelector('.but_sell_N');
    const BUT_NO_CA = LVL_POPUP_CA.querySelector('.but_sell_N');
    const BUT_NO_FU = LVL_POPUP_FU.querySelector('.but_sell_N');
    const BUT_NO_GE = LVL_POPUP_GE.querySelector('.but_sell_N');
    const BUT_NO_PA = LVL_POPUP_PA.querySelector('.but_sell_N');
    const BUT_NO_AS = LVL_POPUP_AS.querySelector('.but_sell_N');

    //uchwyty na grafikę gwaiazdek każdego działu
    const STARS_LVL_OR = ORDER_DEPARTMENT.querySelectorAll('.or_star');
    const STARS_LVL_PR = PROD_DEPARTMENT.querySelectorAll('.pr_star');
    const STARS_LVL_WH = WHOUSE_DEPARTMENT.querySelectorAll('.wh_star');
    const STARS_LVL_UN = UNDERBODY.querySelectorAll('.pr_star');
    const STARS_LVL_CA = CARBODY.querySelectorAll('.pr_star');
    const STARS_LVL_FU = FUEL.querySelectorAll('.pr_star');
    const STARS_LVL_GE = GEAR.querySelectorAll('.pr_star');
    const STARS_LVL_PA = PAINT.querySelectorAll('.pr_star');
    const STARS_LVL_AS = ASSEMBLY.querySelectorAll('.pr_star');

    //startowy index poziomu rozwoju działu
    let updateOrderLvl = 0; //ORDER
    let updateProdLvl = 0; //ALL_PRODUCTION
    let updateWHLvl = 0; //WAREHOUSE
    let updateUNLvl = 0; //UNDERBODY
    let updateCALvl = 0; //CARBODY
    let updateFULvl = 0; //FUEL
    let updateGELvl = 0; //GEAR
    let updatePALvl = 0; //PAINT
    let updateASLvl = 0; //ASSEMBLY

    let minOrder = tabOrderLvl[updateOrderLvl].minOR; //minimalna ilość aut na zamówieniu
    let maxOrder = tabOrderLvl[updateOrderLvl].maxOR; //maksymalna ilość aut na zamówieniu

    let tabCatchColor = []; //tab. do zapisu oryginalnych kolorów przycisków wyboru koloru

    //wyświetlenie startowych poziomów ulepszeń na przyciskach
    BUT_UPDATE_ORDER.innerHTML = tabUpdateDes[updateOrderLvl];
    BUT_UPDATE_PROD.innerHTML = tabUpdateDes[updateProdLvl];
    BUT_UPDATE_WHOUSE.innerHTML = tabUpdateDes[updateWHLvl];
    BUT_UPDATE_UN.innerHTML = tabUpdateDes[updateUNLvl];
    BUT_UPDATE_CA.innerHTML = tabUpdateDes[updateCALvl];
    BUT_UPDATE_FU.innerHTML = tabUpdateDes[updateFULvl];
    BUT_UPDATE_GE.innerHTML = tabUpdateDes[updateGELvl];
    BUT_UPDATE_PA.innerHTML = tabUpdateDes[updatePALvl];
    BUT_UPDATE_AS.innerHTML = tabUpdateDes[updateASLvl];

    OP_COLOR.forEach(btn => {
        tabCatchColor.push(btn.style.background)
    })

    //stylizacja przycisków wyboru zamówienia
    function setButton(button) {
        button.disabled = true;
        button.classList.add('grey_button');
    }

    function clearButton(button) {
        button.classList.remove('grey_button');
        button.disabled = false;
    }

    function styleButtons() {
            switch (updateOrderLvl) {
            case 0:
                //ustawienie przycisków wyboru modelu
                OC_BRAND.forEach((btn, i) => {
                    if(i !== 0) {
                        setButton(btn);
                    }
                })

                //ustawienie przycisków wyboru nadwozia
                OC_BODYCAR.forEach((btn, i) => {
                    if(i > 1) {
                        setButton(btn);
                    }
                })

                //ustawienie przycisków wyboru silnika
                OC_ENGINE.forEach((btn, i) => {
                    if(i !== 0) {
                        setButton(btn);
                    }
                })

                //ustawienie przycisków wyboru skrzyni biegów
                OC_GEAR.forEach((btn, i) => {
                    if(i > 1) {
                        setButton(btn);
                    }
                })

                //ustawienie przycisków wyboru ilości zamawianych aut
                OC_NUMBER.forEach((btn, i) => {
                    if(i !== 0) {
                        setButton(btn);
                    }
                })

                //ustawienie przycisków wyboru koloru zamawianych aut 
                OP_COLOR.forEach((btn, i) => {
                    if(i > 3) {
                        setButton(btn);
                        btn.style.background = 'grey';
                    }
                })
            break;

            case 1:
                OC_ENGINE.forEach((btn, i) => {
                    clearButton(btn);
                    if(i > 1) {
                        setButton(btn);
                    }
                })
            break;

            case 2:
                OP_COLOR.forEach((btn, i) => {
                    clearButton(btn);
                    btn.style.background = tabCatchColor[i];
                    if(i > 7) {
                        setButton(btn);
                        btn.style.background = 'grey';
                    }
                })
            break;

            case 3:
                OC_NUMBER.forEach((btn, i) => {
                    clearButton(btn);
                    if(i > 1) {
                        setButton(btn);
                    }
                })
            break;

            case 4:
                OC_BRAND.forEach((btn, i) => {
                    clearButton(btn);
                    if(i > 1) {
                        setButton(btn);
                    }
                })
            break;

            case 5:
                OP_COLOR.forEach((btn, i) => {
                    clearButton(btn);
                    btn.style.background = tabCatchColor[i];
                    if(i > 11) {
                        setButton(btn);
                        btn.style.background = 'grey';
                    }
                })

                OC_ENGINE.forEach((btn, i) => {
                    clearButton(btn);
                    if(i > 2) {
                        setButton(btn);
                    }
                })
            break;

            case 6:
                OC_NUMBER.forEach((btn, i) => {
                    clearButton(btn);
                    if(i > 2) {
                        setButton(btn);
                    }
                })

                OC_GEAR.forEach((btn, i) => {
                    clearButton(btn);
                    if(i > 2) {
                        setButton(btn);
                    }
                })
            break;

            case 7:
                OC_BRAND.forEach((btn, i) => {
                    clearButton(btn);
                    if(i > 2) {
                        setButton(btn);
                    }
                })
               
                OC_BODYCAR.forEach((btn, i) => {
                    clearButton(btn);
                    if(i > 2) {
                        setButton(btn);
                    }
                })
            break;

            case 8:
                OP_COLOR.forEach((btn, i) => {
                    clearButton(btn);
                    btn.style.background = tabCatchColor[i];
                })

                OC_ENGINE.forEach((btn, i) => {
                    clearButton(btn);
                })
            break;

            case 9:
                OC_NUMBER.forEach((btn, i) => {
                    clearButton(btn);
                })

                OC_GEAR.forEach((btn, i) => {
                    clearButton(btn);
                })
            break;

            case 10:
                OC_BRAND.forEach((btn, i) => {
                    clearButton(btn);
                })
               
                OC_BODYCAR.forEach((btn, i) => {
                    clearButton(btn);
                })
            break;

            default:
        }
    }
    
    styleButtons();

    // Funkcja, która aktualizuje gwiazdki
    function updateStars(updateLvl, STARS_LVL) {
        const starIndex = Math.floor((updateLvl - 1) / 2); // Indeks gwiazdki
        const starState = updateLvl % 2; // Stan gwiazdki (0: pełna, 1: pół-gwiazdka)
        const starElement = STARS_LVL[starIndex].querySelector('i');
    
        starElement.classList.remove('icon-star-empty', 'icon-star-half-alt', 'icon-star');
        starElement.classList.add(starState === 1 ? 'icon-star-half-alt' : 'icon-star');
    }

    // funkcja potwierdzenia rozbudowy działu
    function butYesDepartment(tabLvl,updateLvl, BUT_UPDATE, LVL_POPUP, STARS_LVL, BUT_YES) {
        if(cash >= tabLvl[updateLvl + 1].uplevel) {
            updateLvl ++;
            if(tabLvl == tabOrderLvl) {
                minOrder = tabLvl[updateLvl].minOR;
                maxOrder = tabLvl[updateLvl].maxOR;
            }

            BUT_UPDATE.innerHTML = tabUpdateDes[updateLvl];
            BUT_UPDATE.disabled = false;
            cash -= tabLvl[updateLvl].uplevel;
            CASH.innerHTML = `Stan finansów: &nbsp;&nbsp; ${formatNumber(cash)} zł`;
            LVL_POPUP.classList.add('window_hidden');

            updateStars(updateLvl, STARS_LVL);
        } else {
            BUT_YES.disabled = true;
        }

        return updateLvl;  // Zwracamy zaktualizowany poziom
    }

    //funkcja rezygnacji z rozbudowy - zamkniecie okna
    function butNoDepartment(BUT_UPDATE, LVL_POPUP) {
        BUT_UPDATE.disabled = false;
        LVL_POPUP.classList.add('window_hidden');
    }

    //ulepszenie o poziom
    function updateDepartment(updateLvl, tabLvl, LVL_POPUP, BUT_UPDATE, BUT_YES, BUT_NO) {
        //gdy nie osiągnięto max. poziomu ulepszenia
        if(updateLvl < tabUpdateDes.length - 1) { 
            //gdy jest dość kasy na ulepszenie
            if(cash >= tabLvl[updateLvl + 1].uplevel) {
            LVL_POPUP.classList.remove('window_hidden'); //wywołanie okna potwierdzenia wyboru
                const PARAGRAPH = LVL_POPUP.querySelector('p'); //tekst komunikatu

                PARAGRAPH.textContent = `Potwierdź rozbudowę za ${formatNumber(tabLvl[updateLvl + 1].uplevel)} PLN`;

                BUT_UPDATE.disabled = true; //blokujemy przycisk ulepszenia
                BUT_YES.textContent = 'TAK';
                BUT_NO.textContent = 'NIE';
                BUT_YES.classList.remove('window_hidden');
                BUT_NO.classList.remove('window_hidden');
            } else { //gdy nie ma środków na ulepszenie
                LVL_POPUP.classList.remove('window_hidden'); //wywołanie okna potwierdzenia wyboru
                const PARAGRAPH = LVL_POPUP.querySelector('p'); //tekst komunikatu

                PARAGRAPH.textContent = `Brak środków finansowych do rozbudowy.`;
                BUT_YES.classList.add('window_hidden');
                BUT_NO.classList.remove('window_hidden');
                BUT_NO.textContent = 'Zamknij';
            }             
        }
    }

    //podgląd kosztu kolejnego poziomu ulepszenia
    function showCostUpdate(tabLvl, updateLvl, BUT_UPDATE) {
        if(updateLvl < tabLvl.length - 1) {
            let format_cash = formatNumber(tabLvl[updateLvl + 1].uplevel);
            BUT_UPDATE.innerHTML = format_cash + ' zł';
        }
    }

    //pokaż poziom ulepszenia na przycisku
    function showUpdate(updateLvl, BUT_UPDATE) {
        let lvlDescryption = tabUpdateDes[updateLvl];
        BUT_UPDATE.innerHTML = lvlDescryption;
    }


    //rozbudowa działu zamówień ***********************************
    //potwierdzenie rozbudowy działu zamówień
    BUT_YES_OR.addEventListener('click', () => {
        updateOrderLvl = butYesDepartment(tabOrderLvl, updateOrderLvl, BUT_UPDATE_ORDER, LVL_POPUP_OR, STARS_LVL_OR, BUT_YES_OR);
        styleButtons();
    })

    //rezygnacja z rozbudowy / zamknięcie okna gdy brak środków
    BUT_NO_OR.addEventListener('click', () => {
        butNoDepartment(BUT_UPDATE_ORDER, LVL_POPUP_OR)
    })

    //ulepszenie działu zamówień o poziom
    BUT_UPDATE_ORDER.addEventListener('click', () => {
        updateDepartment(updateOrderLvl, tabOrderLvl, LVL_POPUP_OR, BUT_UPDATE_ORDER, BUT_YES_OR, BUT_NO_OR);         
    })

    //podgląd kosztu kolejnego ulepszenia
    BUT_UPDATE_ORDER.addEventListener('mouseover', () => {
        showCostUpdate(tabOrderLvl, updateOrderLvl, BUT_UPDATE_ORDER);
    })

    //powrót do opisu poziomu na przycisku
    BUT_UPDATE_ORDER.addEventListener('mouseout', () => {
        showUpdate(updateOrderLvl, BUT_UPDATE_ORDER);
    })


    //rozbudowa działu produkcji *********************************
    //potwierdzenie rozbudowy działu zamówień
    BUT_YES_PR.addEventListener('click', () => {
        updateProdLvl = butYesDepartment(tabFactoryLvl, updateProdLvl, BUT_UPDATE_PROD, LVL_POPUP_PR, STARS_LVL_PR, BUT_YES_PR);
    })

    //rezygnacja z rozbudowy / zamknięcie okna gdy brak środków
    BUT_NO_PR.addEventListener('click', () => {
        butNoDepartment(BUT_UPDATE_PROD, LVL_POPUP_PR)
    })

    //ulepszenie działu produkcji o poziom
    BUT_UPDATE_PROD.addEventListener('click', () => {
        updateDepartment(updateProdLvl, tabFactoryLvl, LVL_POPUP_PR, BUT_UPDATE_PROD, BUT_YES_PR, BUT_NO_PR);
    })

    //podgląd kosztu kolejnego ulepszenia
    BUT_UPDATE_PROD.addEventListener('mouseover', () => {
        showCostUpdate(tabFactoryLvl, updateProdLvl, BUT_UPDATE_PROD);
    })

    //powrót do opisu poziomu na przycisku
    BUT_UPDATE_PROD.addEventListener('mouseout', () => {
        showUpdate(updateProdLvl, BUT_UPDATE_PROD);
    })

    //rozbudowa działu podwozi
    //potwierdzenie rozbudowy
    BUT_YES_UN.addEventListener('click', () => {
        updateUNLvl = butYesDepartment(tabUpdateProdTime, updateUNLvl, BUT_UPDATE_UN, LVL_POPUP_UN, STARS_LVL_UN, BUT_YES_UN);
    })

    //rezygnacja z rozbudowy / zamknięcie okna gdy brak środków
    BUT_NO_UN.addEventListener('click', () => {
        butNoDepartment(BUT_UPDATE_UN, LVL_POPUP_UN)
    })

    //ulepszenie działu podwozi o poziom
    BUT_UPDATE_UN.addEventListener('click', () => {
        updateDepartment(updateUNLvl, tabUpdateProdTime, LVL_POPUP_UN, BUT_UPDATE_UN, BUT_YES_UN, BUT_NO_UN);
    })

    //podgląd kosztu kolejnego ulepszenia
    BUT_UPDATE_UN.addEventListener('mouseover', () => {
        showCostUpdate(tabUpdateProdTime, updateUNLvl, BUT_UPDATE_UN);
    })

    //powrót do opisu poziomu na przycisku
    BUT_UPDATE_UN.addEventListener('mouseout', () => {
        showUpdate(updateUNLvl, BUT_UPDATE_UN);
    })

    //rozbudowa działu nadwozi
    //potwierdzenie rozbudowy
    BUT_YES_CA.addEventListener('click', () => {
        updateCALvl = butYesDepartment(tabUpdateProdTime, updateCALvl, BUT_UPDATE_CA, LVL_POPUP_CA, STARS_LVL_CA, BUT_YES_CA);
    })

    //rezygnacja z rozbudowy / zamknięcie okna gdy brak środków
    BUT_NO_CA.addEventListener('click', () => {
        butNoDepartment(BUT_UPDATE_CA, LVL_POPUP_CA)
    })

    //ulepszenie działu nadwozi o poziom
    BUT_UPDATE_CA.addEventListener('click', () => {
        updateDepartment(updateCALvl, tabUpdateProdTime, LVL_POPUP_CA, BUT_UPDATE_CA, BUT_YES_CA, BUT_NO_CA);
    })

    //podgląd kosztu kolejnego ulepszenia
    BUT_UPDATE_CA.addEventListener('mouseover', () => {
        showCostUpdate(tabUpdateProdTime, updateCALvl, BUT_UPDATE_CA);
    })

    //powrót do opisu poziomu na przycisku
    BUT_UPDATE_CA.addEventListener('mouseout', () => {
        showUpdate(updateCALvl, BUT_UPDATE_CA);
    })

    //rozbudowa działu silników
    //potwierdzenie rozbudowy
    BUT_YES_FU.addEventListener('click', () => {
        updateFULvl = butYesDepartment(tabUpdateProdTime, updateFULvl, BUT_UPDATE_FU, LVL_POPUP_FU, STARS_LVL_FU, BUT_YES_FU);
    })

    //rezygnacja z rozbudowy / zamknięcie okna gdy brak środków
    BUT_NO_FU.addEventListener('click', () => {
        butNoDepartment(BUT_UPDATE_FU, LVL_POPUP_FU)
    })

    //ulepszenie działu silników o poziom
    BUT_UPDATE_FU.addEventListener('click', () => {
        updateDepartment(updateFULvl, tabUpdateProdTime, LVL_POPUP_FU, BUT_UPDATE_FU, BUT_YES_FU, BUT_NO_FU);
    })

    //podgląd kosztu kolejnego ulepszenia
    BUT_UPDATE_FU.addEventListener('mouseover', () => {
        showCostUpdate(tabUpdateProdTime, updateFULvl, BUT_UPDATE_FU);
    })

    //powrót do opisu poziomu na przycisku
    BUT_UPDATE_FU.addEventListener('mouseout', () => {
        showUpdate(updateFULvl, BUT_UPDATE_FU);
    })

    //rozbudowa działu skrzyń biegów
    //potwierdzenie rozbudowy
    BUT_YES_GE.addEventListener('click', () => {
        updateGELvl = butYesDepartment(tabUpdateProdTime, updateGELvl, BUT_UPDATE_GE, LVL_POPUP_GE, STARS_LVL_GE, BUT_YES_GE);
    })

    //rezygnacja z rozbudowy / zamknięcie okna gdy brak środków
    BUT_NO_GE.addEventListener('click', () => {
        butNoDepartment(BUT_UPDATE_GE, LVL_POPUP_GE)
    })

    //ulepszenie działu skrzyń biegów o poziom
    BUT_UPDATE_GE.addEventListener('click', () => {
        updateDepartment(updateGELvl, tabUpdateProdTime, LVL_POPUP_GE, BUT_UPDATE_GE, BUT_YES_GE, BUT_NO_GE);
    })

    //podgląd kosztu kolejnego ulepszenia
    BUT_UPDATE_GE.addEventListener('mouseover', () => {
        showCostUpdate(tabUpdateProdTime, updateGELvl, BUT_UPDATE_GE);
    })

    //powrót do opisu poziomu na przycisku
    BUT_UPDATE_GE.addEventListener('mouseout', () => {
        showUpdate(updateGELvl, BUT_UPDATE_GE);
    })

    //rozbudowa działu malarni
    //potwierdzenie rozbudowy
    BUT_YES_PA.addEventListener('click', () => {
        updatePALvl = butYesDepartment(tabUpdateProdTime, updatePALvl, BUT_UPDATE_PA, LVL_POPUP_PA, STARS_LVL_PA, BUT_YES_PA);
    })

    //rezygnacja z rozbudowy / zamknięcie okna gdy brak środków
    BUT_NO_PA.addEventListener('click', () => {
        butNoDepartment(BUT_UPDATE_PA, LVL_POPUP_PA)
    })

    //ulepszenie działu malarni o poziom
    BUT_UPDATE_PA.addEventListener('click', () => {
        updateDepartment(updatePALvl, tabUpdateProdTime, LVL_POPUP_PA, BUT_UPDATE_PA, BUT_YES_PA, BUT_NO_PA);
    })

    //podgląd kosztu kolejnego ulepszenia
    BUT_UPDATE_PA.addEventListener('mouseover', () => {
        showCostUpdate(tabUpdateProdTime, updatePALvl, BUT_UPDATE_PA);
    })

    //powrót do opisu poziomu na przycisku
    BUT_UPDATE_PA.addEventListener('mouseout', () => {
        showUpdate(updatePALvl, BUT_UPDATE_PA);
    })

    //rozbudowa działu montażu
    //potwierdzenie rozbudowy
    BUT_YES_AS.addEventListener('click', () => {
        updateASLvl = butYesDepartment(tabUpdateProdTime, updateASLvl, BUT_UPDATE_AS, LVL_POPUP_AS, STARS_LVL_AS, BUT_YES_AS);
    })

    //rezygnacja z rozbudowy / zamknięcie okna gdy brak środków
    BUT_NO_AS.addEventListener('click', () => {
        butNoDepartment(BUT_UPDATE_AS, LVL_POPUP_AS)
    })

    //ulepszenie działu montażu o poziom
    BUT_UPDATE_AS.addEventListener('click', () => {
        updateDepartment(updateASLvl, tabUpdateProdTime, LVL_POPUP_AS, BUT_UPDATE_AS, BUT_YES_AS, BUT_NO_AS);
    })

    //podgląd kosztu kolejnego ulepszenia
    BUT_UPDATE_AS.addEventListener('mouseover', () => {
        showCostUpdate(tabUpdateProdTime, updateASLvl, BUT_UPDATE_AS);
    })

    //powrót do opisu poziomu na przycisku
    BUT_UPDATE_AS.addEventListener('mouseout', () => {
        showUpdate(updateASLvl, BUT_UPDATE_AS);
    })


     //rozbudowa działu magazyn-sprzedaż ********************************
    //potwierdzenie rozbudowy działu magazyn
    BUT_YES_WH.addEventListener('click', () => {
        updateWHLvl = butYesDepartment(tabWHLvl, updateWHLvl, BUT_UPDATE_WHOUSE, LVL_POPUP_WH, STARS_LVL_WH, BUT_YES_WH);
    })

    //rezygnacja z rozbudowy / zamknięcie okna gdy brak środków
    BUT_NO_WH.addEventListener('click', () => {
        butNoDepartment(BUT_UPDATE_WHOUSE, LVL_POPUP_WH)
    })

    //ulepszenie magazynu o poziom
    BUT_UPDATE_WHOUSE.addEventListener('click', () => {
        updateDepartment(updateWHLvl, tabWHLvl, LVL_POPUP_WH, BUT_UPDATE_WHOUSE, BUT_YES_WH, BUT_NO_WH);
    })

    //podgląd kosztu kolejnego ulepszenia
    BUT_UPDATE_WHOUSE.addEventListener('mouseover', () => {
        showCostUpdate(tabWHLvl, updateWHLvl, BUT_UPDATE_WHOUSE);
    })

    //powrót do opisu poziomu na przycisku
    BUT_UPDATE_WHOUSE.addEventListener('mouseout', () => {
        showUpdate(updateWHLvl, BUT_UPDATE_WHOUSE);
    })

    //zamknięcie okna informacyjnego o kosztach
    CLOSE_INFO.addEventListener('click', () => { 
        COST_INFO_FIRST_DAY.classList.add('cost_info_hidden');
    })

    /*************** Najlepsze zamówienie - AUTO-GENEROWANIE**************/

    class ProdTimes {
        constructor(name, hotKey1, hotKey2, hotKey3, u_skill, c_skill, f_skill, g_skill, p_skill, a_skill) {
            this.name = name;
            this.hotKey1 = hotKey1;
            this.hotKey2 = hotKey2;
            this.hotKey3 = hotKey3;
            this.u_skill = u_skill;
            this.c_skill = c_skill;
            this.f_skill = f_skill;
            this.g_skill = g_skill;
            this.p_skill = p_skill;
            this.a_skill = a_skill;
            this.sumaTimeUN = 0;
            this.sumaTimeCA = 0;
            this.sumaTimeFU = 0;
            this.sumaTimeGE = 0;
            this.sumaBigTimeUNCAFUGE = 0;
            this.countNoUN = 0;
            this.countNoCA = 0;
            this.countNoFU = 0;
            this.countNoGE = 0;
            this.profit1 = 0;
        }
    }

    // włączenie / wyłączenie auto zamówień
    const OPAQUE_AUTO_ORDER = document.querySelector('.opaque_or');
    const BUT_AUTO_ORDER = OPAQUE_AUTO_ORDER.querySelector('.auto_order');
    let flagAutoOrder = true;

    BUT_AUTO_ORDER.innerHTML = 'auto: on';

    BUT_AUTO_ORDER.addEventListener('click', () => {
        if(flagAutoOrder) {
            flagAutoOrder = false;
            BUT_AUTO_ORDER.innerHTML = 'auto: off';
            BUT_AUTO_ORDER.classList.add('auto_off');
        } else {
            flagAutoOrder = true;
            BUT_AUTO_ORDER.innerHTML = 'auto: on';
            BUT_AUTO_ORDER.classList.remove('auto_off');
        }
    })

    let choisedBrandAuto = null;  //wybrany model
    let choisedBodyCarAuto = null;  //wybrane nadwozie
    let choisedEngineAuto = null;  //wybrany silnik
    let choisedColorAuto = null; //wybrany kolor
    let choisedGearAuto = null;  //wybrany skrzynia
    let choisedNumberAuto = null;  //wybrana ilosc

    //funkcja automatycznego generowania zamówień
    const AUTO_ORDER = function() {
        if(autoOrderCount >= tabOrderLvl[updateOrderLvl].autotime) {
            //obiekt do przechowywania info o ilości zamówionych modeli
            if(flagAutoOrder) {
                const SumaCounter = {
                    'CO': {
                        'SE': {'UN': 0, 'CA': 0},
                        'HB': {'UN': 0, 'CA': 0},
                        'CO': {'UN': 0, 'CA': 0},
                        'CB': {'UN': 0, 'CA': 0},
                        'FU': {'ON': 0, 'PB': 0, 'LG': 0, 'EC': 0},
                        'GE': {'MA': 0, 'PA': 0, 'AU': 0, 'BS': 0}
                    },
                    'AS': {
                        'SE': {'UN': 0, 'CA': 0},
                        'HB': {'UN': 0, 'CA': 0},
                        'CO': {'UN': 0, 'CA': 0},
                        'CB': {'UN': 0, 'CA': 0},
                        'FU': {'ON': 0, 'PB': 0, 'LG': 0, 'EC': 0},
                        'GE': {'MA': 0, 'PA': 0, 'AU': 0, 'BS': 0}  
                    },
                    'VE': {
                        'SE': {'UN': 0, 'CA': 0},
                        'HB': {'UN': 0, 'CA': 0},
                        'CO': {'UN': 0, 'CA': 0},
                        'CB': {'UN': 0, 'CA': 0},
                        'FU': {'ON': 0, 'PB': 0, 'LG': 0, 'EC': 0},
                        'GE': {'MA': 0, 'PA': 0, 'AU': 0, 'BS': 0}
                    },
                    'IN': {
                        'SE': {'UN': 0, 'CA': 0},
                        'HB': {'UN': 0, 'CA': 0},
                        'CO': {'UN': 0, 'CA': 0},
                        'CB': {'UN': 0, 'CA': 0},
                        'FU': {'ON': 0, 'PB': 0, 'LG': 0, 'EC': 0},
                        'GE': {'MA': 0, 'PA': 0, 'AU': 0, 'BS': 0}
                    }
                };

                const tabProdTimes = [];

                tabUNDERBODY.forEach(ubody => {
                    const carbody = tabCARBODY.find(cbody => cbody.name == ubody.name && cbody.hotKey == ubody.hotKey);
                    const paint = tabPAINT.find(paint => paint.name == ubody.name && paint.hotKey == ubody.hotKey);
                    const assembly = tabASSEMBLY.find(assem => assem.name == ubody.name && assem.hotKey == ubody.hotKey);

                    if(carbody && paint && assembly) {
                        tabFUEL.forEach(fuel => {
                            if(fuel.name == ubody.name){
                                tabGEAR.forEach(gear => {
                                    if(gear.name == ubody.name) {
                                        let updateUNskill = Math.floor(ubody.skill * tabUpdateProdTime[updateUNLvl].ratio);
                                        let updateCAskill = Math.floor(carbody.skill * tabUpdateProdTime[updateCALvl].ratio);
                                        let updateFUskill = Math.floor(fuel.skill * tabUpdateProdTime[updateFULvl].ratio);
                                        let updateGEskill = Math.floor(gear.skill * tabUpdateProdTime[updateGELvl].ratio);
                                        let updatePAskill = Math.floor(paint.skill * tabUpdateProdTime[updatePALvl].ratio);
                                        let updateASskill = Math.floor(assembly.skill * tabUpdateProdTime[updateASLvl].ratio);

                                        const ProdTime = new ProdTimes(ubody.name, ubody.hotKey, fuel.hotKey, gear.hotKey, updateUNskill, updateCAskill, updateFUskill, updateGEskill, updatePAskill, updateASskill);
                                        tabProdTimes.push(ProdTime);
                                    }
                                })
                            }
                        })
                    }
                })
                
                //liczenie ilości zamówionych modeli samochodów
                tabProdTimes.forEach(line => {
                    tabCars.forEach(order => {
                        if(line.name == order.brand && line.hotKey1 == order.bodycar && line.hotKey2 == order.engine && line.hotKey3 == order.gear) {
                            if(order.NoUN == 0) {
                                SumaCounter[line.name][line.hotKey1]['UN']++; // Aktualizacja SumaCounter dla 'UN'
                            } 
                            if(order.NoCA == 0) {
                                SumaCounter[line.name][line.hotKey1]['CA']++; // Aktualizacja SumaCounter dla 'CA'
                            } 
                            if(order.NoFU == 0) {
                                SumaCounter[line.name]['FU'][line.hotKey2]++; // Aktualizacja SumaCounter dla 'FU'
                            } 
                            if(order.NoGE == 0) {
                                SumaCounter[line.name]['GE'][line.hotKey3]++; // Aktualizacja SumaCounter dla 'GE'
                            }     
                        } 
                    });
                });

                
                //przypisanie ilości zamówionych modeli 
                tabProdTimes.forEach(line => {  
                    line.countNoUN = SumaCounter[line.name][line.hotKey1]['UN'];
                    line.countNoCA = SumaCounter[line.name][line.hotKey1]['CA'];
                    line.countNoFU = SumaCounter[line.name]['FU'][line.hotKey2];
                    line.countNoGE = SumaCounter[line.name]['GE'][line.hotKey3];
                })

                
                //wyliczenie i zapisanie czasu produkcji zamówionych samochodów
                tabProdTimes.forEach(line => {
                    
                    if(line.countNoUN > 0) {
                        const PROG_TIME_UN = tabUNDERBODY.find(elem => elem.name == line.name && elem.hotKey == line.hotKey1);
                        const COUNT_PA = tabPAINT.find(elem => elem.name == line.name && elem.hotKey == line.hotKey1);
                        const COUNT_AS = tabASSEMBLY.find(elem => elem.name == line.name && elem.hotKey == line.hotKey1);
                        let timeToEnd = 0;

                        if(COUNT_PA.count == 0 && COUNT_AS.count == 0) {
                            timeToEnd = Math.ceil(PROG_TIME_UN.skill - (PROG_TIME_UN.skill * PROG_TIME_UN.progres / 100));

                            line.sumaTimeUN = timeToEnd + line.p_skill + line.a_skill + ((line.countNoUN - 1) * Math.max(line.u_skill, line.p_skill, line.a_skill));
                        } else {
                            line.sumaTimeUN = line.countNoUN * Math.max(line.u_skill, line.p_skill, line.a_skill);
                        }
                    } else {
                        line.sumaTimeUN = 0;
                    }

                    if(line.countNoCA > 0) {
                        const PROG_TIME_CA = tabCARBODY.find(elem => elem.name == line.name && elem.hotKey == line.hotKey1);
                        const COUNT_PA = tabPAINT.find(elem => elem.name == line.name && elem.hotKey == line.hotKey1);
                        const COUNT_AS = tabASSEMBLY.find(elem => elem.name == line.name && elem.hotKey == line.hotKey1);
                        let timeToEnd = 0;

                        if(COUNT_PA.count == 0 && COUNT_AS.count == 0) {
                            timeToEnd = Math.ceil(PROG_TIME_CA.skill - (PROG_TIME_CA.skill * PROG_TIME_CA.progres / 100));

                            line.sumaTimeCA = timeToEnd + line.p_skill + line.a_skill + ((line.countNoCA - 1) * Math.max(line.c_skill, line.p_skill, line.a_skill));
                        } else {
                            line.sumaTimeCA = line.countNoCA * Math.max(line.c_skill, line.p_skill, line.a_skill);
                        }
                        
                    } else {
                        line.sumaTimeCA = 0;
                    }

                    if(line.countNoFU > 0) {
                        const PROG_TIME_FU = tabFUEL.find(elem => elem.name == line.name && elem.hotKey == line.hotKey2);
                        const COUNT_PA = tabPAINT.find(elem => elem.name == line.name && elem.hotKey == line.hotKey1);
                        const COUNT_AS = tabASSEMBLY.find(elem => elem.name == line.name && elem.hotKey == line.hotKey1);
                        let timeToEnd = 0;

                        if(COUNT_PA.count == 0 && COUNT_AS.count == 0) {
                            timeToEnd = Math.ceil(PROG_TIME_FU.skill - (PROG_TIME_FU.skill * PROG_TIME_FU.progres / 100));

                            line.sumaTimeFU = timeToEnd + line.p_skill + line.a_skill + ((line.countNoFU - 1) * Math.max(line.f_skill, line.p_skill, line.a_skill));
                        } else {
                            line.sumaTimeFU = line.countNoUN * Math.max(line.f_skill, line.p_skill, line.a_skill);
                        }
                        
                    } else {
                        line.sumaTimeFU = 0;
                    }

                    if(line.countNoGE > 0) {
                        const PROG_TIME_GE = tabGEAR.find(elem => elem.name == line.name && elem.hotKey == line.hotKey3);
                        const COUNT_PA = tabPAINT.find(elem => elem.name == line.name && elem.hotKey == line.hotKey1);
                        const COUNT_AS = tabASSEMBLY.find(elem => elem.name == line.name && elem.hotKey == line.hotKey1);
                        let timeToEnd = 0;

                        if(COUNT_PA.count == 0 && COUNT_AS.count == 0) {
                            timeToEnd = Math.ceil(PROG_TIME_GE.skill - (PROG_TIME_GE.skill * PROG_TIME_GE.progres / 100));

                            line.sumaTimeGE = timeToEnd + line.p_skill + line.a_skill + ((line.countNoGE - 1) * Math.max(line.g_skill, line.p_skill, line.a_skill));
                        } else {
                            line.sumaTimeGE = line.countNoUN * Math.max(line.g_skill, line.p_skill, line.a_skill);
                        }
                        
                    } else {
                        line.sumaTimeGE = 0;
                    }

                    //przypisanie najdłuższego czasu produkcji
                    line.sumaBigTimeUNCAFUGE = Math.max(line.sumaTimeUN, line.sumaTimeCA,  line.sumaTimeFU, line.sumaTimeGE);

                    //koszt wykonania jednego podzespołu dla modelu auta
                    let costUN = tabUNDERBODY.find(elem => elem.name == line.name && elem.hotKey == line.hotKey1);
                    costUN = costUN.cost;

                    let costCA = tabCARBODY.find(elem => elem.name == line.name && elem.hotKey == line.hotKey1);
                    costCA = costCA.cost;

                    let costFU = tabFUEL.find(elem => elem.name == line.name && elem.hotKey == line.hotKey2);
                    costFU = costFU.cost;

                    let costGE = tabGEAR.find(elem => elem.name == line.name && elem.hotKey == line.hotKey3);
                    costGE = costGE.cost;

                    let costPA = tabPAINT.find(el => el.name == line.name && el.hotKey == line.hotKey1);
                    costPA = costPA.cost;

                    let costAS = tabASSEMBLY.find(el => el.name == line.name && el.hotKey == line.hotKey1);
                    costAS = costAS.cost;

                    // koszt wykonania całego auta
                    let sumaCost = costUN + costCA + costFU + costGE + costPA + costAS;

                    let price = 0; //cena jednego modelu auta
                    let profit = 0; //zysk dla jednego auta

                    //losowy kolor dla auta
                    let choisedColorNo = null;
                    let fromNumber = 0; // z jakiej ilości kolorów będzie losowanie

                    if(updateOrderLvl >= 0 && updateOrderLvl <= 1) {
                        fromNumber = 580
                    } else if(updateOrderLvl >= 2 && updateOrderLvl <= 4) {
                        fromNumber = 1000
                    } else if(updateOrderLvl >= 5 && updateOrderLvl <= 8) {
                        fromNumber = 1260
                    } else  {
                        fromNumber = 1360
                    }

                    const ranges = [160, 310, 450, 580, 700, 810, 910, 1000, 1080, 1150, 1210, 1260, 1300, 1330, 1350, 1360];
                    const colors = tabColor.map(color => color.Ename);

                    choisedColorNo = Math.floor(Math.random() * fromNumber);

                    for (let i = 0; i < ranges.length; i++) {
                        if (choisedColorNo <= ranges[i]) {
                            choisedColorAuto = colors[i];
                            ratioColor = tabColor[i].ratio; 
                            break;
                        }
                    }

                    price = sumaCost * (tabOrderLvl[updateOrderLvl].ratio + ratioColor);

                    sumaCost *= (tabFactoryLvl[updateProdLvl].cost); //ustalenie kosztu dla auta zależnie od poziomu produkcji 
                    sumaCost = Math.floor(sumaCost);

                    profit = (price - sumaCost) * tabFactoryLvl[updateProdLvl].profit;
                    profit = Math.floor(profit); //rzeczywisty zysk

                    price = Math.floor((sumaCost + profit) * tabWHLvl[updateWHLvl].ratio); //rzeczywista cena po odliczeniu kosztów

                    //czas produkcji dla 1 auta
                    let timeFor1 = Math.max(line.u_skill, line.c_skill, line.f_skill, line.g_skill) + line.p_skill + line.a_skill;

                    //zysk na minutę dla zamówienia
                    line.profit1 = (price - sumaCost) / timeFor1; 
                })

                //stworzenie tablicy możliwych kombinacji zamówienia zależnych od poziomu działu zamówień
                let tabMatrixOrder = [];

                const nameLevels = {
                    0: ['CO'],
                    1: ['CO'],
                    2: ['CO'],
                    3: ['CO'],
                    4: ['CO', 'AS'],
                    5: ['CO', 'AS'],
                    6: ['CO', 'AS'],
                    7: ['CO', 'AS', 'VE'],
                    8: ['CO', 'AS', 'VE'],
                    9: ['CO', 'AS', 'VE'],
                    10: ['CO', 'AS', 'VE', 'IN']
                };

                const hotKey1Levels = {
                    0: ['SE', 'HB'],
                    1: ['SE', 'HB'],
                    2: ['SE', 'HB'],
                    3: ['SE', 'HB'],
                    4: ['SE', 'HB'],
                    5: ['SE', 'HB'],
                    6: ['SE', 'HB'],
                    7: ['SE', 'HB', 'CO'],
                    8: ['SE', 'HB', 'CO'],
                    9: ['SE', 'HB', 'CO'],
                    10: ['SE', 'HB', 'CO', 'CB']
                };

                const hotKey2Levels = {
                    0: ['ON'],
                    1: ['ON', 'PB'],
                    2: ['ON', 'PB'],
                    3: ['ON', 'PB'],
                    4: ['ON', 'PB'],
                    5: ['ON', 'PB', 'LG'],
                    6: ['ON', 'PB', 'LG'],
                    7: ['ON', 'PB', 'LG'],
                    8: ['ON', 'PB', 'LG', 'EC'],
                    9: ['ON', 'PB', 'LG', 'EC'],
                    10: ['ON', 'PB', 'LG', 'EC']
                };

                const hotKey3Levels = {
                    0: ['MA', 'PA'],
                    1: ['MA', 'PA'],
                    2: ['MA', 'PA'],
                    3: ['MA', 'PA'],
                    4: ['MA', 'PA'],
                    5: ['MA', 'PA'],
                    6: ['MA', 'PA', 'AU'],
                    7: ['MA', 'PA', 'AU'],
                    8: ['MA', 'PA', 'AU'],
                    9: ['MA', 'PA', 'AU', 'BS'],
                    10: ['MA', 'PA', 'AU', 'BS']
                };

                //pobranie dostępnych opcji zam. od poziomu rozwoju działu zam.
                const names = nameLevels[updateOrderLvl];
                const hotKey1s = hotKey1Levels[updateOrderLvl];
                const hotKey2s = hotKey2Levels[updateOrderLvl];
                const hotKey3s = hotKey3Levels[updateOrderLvl];

                //stworzenie tab spełniającej warunki rozwoju działu zamówień
                tabMatrixOrder = tabProdTimes.filter(elem => 
                    names.includes(elem.name) &&
                    hotKey1s.includes(elem.hotKey1) &&
                    hotKey2s.includes(elem.hotKey2) &&
                    hotKey3s.includes(elem.hotKey3)
                );

                //stworzenie tab. możliwych zam. gdy ilość mniejsza od max. dopuszczalnej
                tabMatrixOrder = tabMatrixOrder.filter(line => 
                    line.countNoUN < tabMaxNoOrder[updateUNLvl] &&
                    line.countNoCA < tabMaxNoOrder[updateCALvl] &&
                    line.countNoFU < tabMaxNoOrder[updateFULvl] &&
                    line.countNoGE < tabMaxNoOrder[updateGELvl])


                if(tabMatrixOrder.length > 0) {
                    //sortowanie by pobrać najzyskowniejsze auta
                    tabMatrixOrder.sort((a, b) => {
                        // Najpierw sortowanie wg czasu produkcji
                        if (a.sumaBigTimeUNCAFUGE !== b.sumaBigTimeUNCAFUGE) {
                            return a.sumaBigTimeUNCAFUGE - b.sumaBigTimeUNCAFUGE;
                        }
                        // Jeśli countNoUN jest takie samo, sortujemy wg profit1
                        return b.profit1 - a.profit1;
                    });


                    //pobranie do tablicy najlepszych dostępnych zamówień zależnych od rozwoju działu zamówień
                    const tabBestProdCars = tabMatrixOrder.slice(0, Math.ceil(tabMatrixOrder.length * tabOrderLvl[updateOrderLvl].NoOrders));

                    //losowy wybór automatycznego najlepszego zamówienia zależnego od rozwoju działu zamówień
                    const RND_RESULT =  Math.floor(Math.random() * tabBestProdCars.length); 

                    //sprawdzenie ile max. możemy zamówić aut do kasy
                    function checkOrder() { 
                        let sumaCostOrder = 0; // suma kosztu dla całego zamówienia
                        const costOneCar = takeCost(choisedBrandAuto, choisedBodyCarAuto, choisedEngineAuto, choisedGearAuto); //koszt jednego zamówionego auta
                    
                        sumaCostOrder = costOneCar * tabFactoryLvl[updateProdLvl].cost * choisedNumberAuto;
                        
                        if(cash - sumaCostOrder >= 0) { // gdy jest kasa składamy zamówienie
                            return true;
                        } else {
                            choisedNumberAuto--;
                            if(choisedNumberAuto > 0) {
                                return checkOrder(); // Rekurencyjne wywołanie zwraca wartość
                            } else {
                                alert("Brak środków na przyjęcie nowego zamówienia !");
                                return false;
                            }  
                        }
                    };

                    //losowa ilość aut na zamówieniu zależna od rozwoju działu zamówień
                    choisedNumberAuto = Math.floor(Math.random()* (maxOrder - minOrder + 1) + minOrder);


                    const POS_TO_ORDER = tabBestProdCars[RND_RESULT];

                    choisedBrandAuto = POS_TO_ORDER.name; //pobranie modelu auta
                    choisedBodyCarAuto = POS_TO_ORDER.hotKey1; //pobranie nadwozia

                    //dla wybranej marki szukamy w obiekcie SumaCounter produkcji silnika najmniej obciążonego
                    let fuels = SumaCounter[choisedBrandAuto]['FU']; 
                    let minValue = Infinity;

                    for (let key in fuels) {  // Użycie zmiennej w pętli
                        if (hotKey2s.includes(key)) { //czy typ silnika jest dostępny dla poziomu działu
                            if (fuels[key] < minValue) {
                                minValue = fuels[key];
                                choisedEngineAuto = key;
                            }
                        }
                        
                    }

                    //dla wybranej marki szukamy w obiekcie SumaCounter produkcji skrzyni najmniej obciążonego
                    let gears = SumaCounter[choisedBrandAuto]['GE']; 
                    minValue = Infinity;

                    for (let key in gears) {  // Użycie zmiennej w pętli
                        if (hotKey3s.includes(key)) { //czy typ skrzyni jest dostępny dla poziomu działu
                            if (gears[key] < minValue) {
                                minValue = gears[key];
                                choisedGearAuto = key;
                            }
                        }
                    }

                    // sprawdż czy jest kasa na realizację zamówienia
                    const CASH_TO_ORDER = checkOrder(choisedBrandAuto, choisedBodyCarAuto, choisedEngineAuto, choisedGearAuto, choisedNumberAuto);

                    //poziom najmniej rozwiniętego działu produkcji
                    const MIN_UPDATE_PROD_LVL = Math.min(updateCALvl, updateUNLvl, updateFULvl, updateGELvl);

                    //max ilość zamówień w kolejce zależna od ulepszenia działu
                    const MAX_NO_ORDER = tabMaxNoOrder[MIN_UPDATE_PROD_LVL];


                    const LARGEST_NO_QUEUE = Math.max(SumaCounter[choisedBrandAuto][choisedBodyCarAuto]['UN'], SumaCounter[choisedBrandAuto][choisedBodyCarAuto]['CA'], SumaCounter[choisedBrandAuto]['FU'][choisedEngineAuto], SumaCounter[choisedBrandAuto]['GE'][choisedGearAuto]);

                   //gdy ilość w kolejce na dziale + nowe zamówienie ma byc wieksze od dopuszczalnego poziomu to zmniejszamy do max.
                    if(LARGEST_NO_QUEUE + choisedNumberAuto > MAX_NO_ORDER) {
                        choisedNumberAuto = MAX_NO_ORDER - LARGEST_NO_QUEUE;
                    }
                    
                    if(CASH_TO_ORDER === true && orderNo <= tabOrderLvl[updateOrderLvl].inorder){
                        orderNo ++;  // nadanie numeru dla zamówienia
                        
                        makeNewCars(choisedBrandAuto, choisedBodyCarAuto, choisedEngineAuto, choisedGearAuto, choisedColorAuto, choisedNumberAuto);  // zapis zamówienia do tablicy tabCars
                        orderList();  // zapis zamówienia do tabOrderList
                    }
                    
                    autoOrderCount = 0;
                    choisedBrandAuto = null;  //wybrany model
                    choisedBodyCarAuto = null;  //wybrane nadwozie
                    choisedEngineAuto = null;  //wybrany silnik
                    choisedColorAuto = null; //wybrany kolor
                    choisedGearAuto = null;  //wybrany skrzynia
                    choisedNumberAuto = null;  //wybrana ilosc
                }
            }       
        }
        
    }

}());
