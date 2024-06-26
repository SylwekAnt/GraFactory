'use strict';

(function start(global) {
    class Cars {
        constructor(brand, bodycar, engine, gear, color, serialNo, NoOR, cost, price, quanOrder, progTime = 0) {
            this.brand = brand;
            this.bodycar = bodycar;
            this.engine = engine;
            this.gear = gear;
            this.color = color;
            this.serialNo = serialNo; // numer kolejny auta
            this.NoOR = NoOR; // numer zamówienia
            this.cost = cost; //koszt wykonania egzemplarza auta
            this.price = price; //cena sprzedaży egzemplarza auta
            this.quantityOrder = quanOrder; //ilość aut na zamówieniu
            this.NoUN = 0;  // sprawdzenie czy wykonano egzemplarz z zamówienia
            this.NoCA = 0;
            this.NoFU = 0;
            this.NoGE = 0;
            this.NoPA = 0;
            this.NoAS = 0;
            this.NoST = 0;
            this.progTime = progTime; //wykorzystany czas do osiągniecia 100% progresu
        }

    };

    const tabBrand = [{name: "Corsa", hotKey: "CO"}, {name: "Astra", hotKey: "AS"}, {name: "Vectra", hotKey: "VE"}, {name: "Insygnia", hotKey: "IN"}]; //tablica modeli

    const tabBodyCar = [{name: "Sedan", hotKey:"SE"}, {name: "Hachback", hotKey: "HB"}, {name: "Combi", hotKey:"CO"}, {name: "Cabriolet", hotKey: "CB"}];  //tablica nadwozi

    const tabEngine = [{name: "Olej napędowy", hotKey: "ON"}, {name: "Benzyna", hotKey: "PB"}, {name: "Benzyna / Gaz", hotKey: "LG"}, {name: "Elektryk", hotKey: "EC"}]; //tablica silnikow

    const tabColor = [{name: "Biały", hotKey: "BI", Ename: "white"}, {name: "Srebrny", hotKey: "SR", Ename: "silver"}, {name: "Szary", hotKey: "SZ", Ename: "gray"}, {name: "Czarny", hotKey: "CZ", Ename: "black"}, {name: "Fukcja", hotKey: "FU", Ename: "fuchsja"}, {name: "Czerwony", hotKey: "CE", Ename: "red"}, {name: "Purpurowy", hotKey: "PU", Ename: "purple"}, {name: "Kasztanowy", hotKey: "KA", Ename: "maroon"}, {name: "Złoty", hotKey: "ZL", Ename: "gold"}, {name: "Oliwkowy", hotKey: "OL", Ename: "olive"}, {name: "Limonkowy", hotKey: "LI", Ename: "lime"}, {name: "Zielony", hotKey: "ZI", Ename: "green"}, {name: "Błękitny", hotKey: "BL", Ename: "aqua"}, {name: "Morski", hotKey: "MO", Ename: "teal"}, {name: "Niebieski", hotKey: "NI", Ename: "blue"}, {name: "Granat", hotKey: "GR", Ename: "navy"}]; //tablica kolorow

    const tabGear = [{name: "Manual", hotKey:"MA"}, {name: "Półautomat", hotKey: "PA"}, {name: "Automat", hotKey:"AU"}, {name: "Bezstopniowa", hotKey:"BS"}];  //tablica skrzyn

    const tabNumber =[1, 5, 10, 20];  //tablica ilosci zamawianych aut
    const tabAllChoised = []; //czy wybrano wszystkie opcje do zamowienia
    let tabCars = [];  //tab na zamowione samochody
    const tabVIN = []; //tab na numery VIN

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
    let orderNo = 0; // numer kolejny zamówienia
    let cash = 10000000; //stan startowy finansów
    let counterCars = 0;  //całkowita ilość zamówionych samochodów
    let timeForEnd = 0; //ilość minut dla następnego działu po osiagnięciu 100% progresu na dziale obecnym


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
    
    //sprawdzenie czy wszystkie opcje sa wybrane
    function sumaChoised() { 
        if(tabAllChoised.length == 6) { //odblokowujemy przycisk: zloz zamowienie
            const ORDER = document.querySelector('.make_order');
            ORDER.classList.add('make_order_set'); 
        };
    };

    // suma kosztów działów do wykonania samochodu
    function takeCost() {  
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
    function makeNewCars() { 
        const costCar = takeCost();  // obliczenie kosztu jednego zam. auta
        const price = costCar * 1.13;  // ustalenie ceny za auto
        let format_cash = 0; //formatowanie kasy na sep. 1000
        let NoVIN = ''; //nr seryjny samochodu
        let yearProdCar = startDate.getFullYear();  //pobranie roku produkcji
        let monthProdCar = startDate.getMonth() + 1; //pobranie m-ca produkcji

        if(monthProdCar <10) monthProdCar = "0" + monthProdCar;

        for(let i = 1; i <= choisedNumber; i++) {
            counterCars ++;
            const Car = new Cars(choisedBrand, choisedBodyCar, choisedEngine, choisedGear, choisedColor, counterCars, orderNo, costCar, price,choisedNumber);
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
            sumaChoised();
            remClass(OC_BRAND);
            setClass(btn);
        });
    });

    //wybor nadwozia
    OC_BODYCAR.forEach((btn, i) => {  
        btn.addEventListener('click', () => {
            if(choisedBodyCar === null) tabAllChoised.push(1); //dodajemy element do tablicy sprawdzenia czy wybrano te opcje juz
            choisedBodyCar = tabBodyCar[i].hotKey;
            sumaChoised();
            remClass(OC_BODYCAR);
            setClass(btn);
        });
    });

    //wybor silnika
    OC_ENGINE.forEach((btn, i) => {  
        btn.addEventListener('click', () => {
            if(choisedEngine === null) tabAllChoised.push(1); //dodajemy element do tablicy sprawdzenia czy wybrano te opcje juz
            choisedEngine = tabEngine[i].hotKey;
            sumaChoised();
            remClass(OC_ENGINE);
            setClass(btn);
        });
    });

    //wybor koloru
    OP_COLOR.forEach((btn, i) => {  
        btn.addEventListener('click', () => {
            if(choisedColor === null) tabAllChoised.push(1); //dodajemy element do tablicy sprawdzenia czy wybrano te opcje juz
            choisedColor = tabColor[i].Ename;
            sumaChoised();
            remClass(OP_COLOR);
            setClass(btn);
        });
    });

    //wybor skrzyni
    OC_GEAR.forEach((btn, i) => {  
        btn.addEventListener('click', () => {
            if(choisedGear === null) tabAllChoised.push(1); //dodajemy element do tablicy sprawdzenia czy wybrano te opcje juz
            choisedGear = tabGear[i].hotKey;            
            sumaChoised();
            remClass(OC_GEAR);
            setClass(btn);
        });
    });

    //wybor ilosci zamawianych aut
    OC_NUMBER.forEach((btn, i) => {  
        btn.addEventListener('click', () => {
            if(choisedNumber === null) tabAllChoised.push(1); //dodajemy element do tablicy sprawdzenia czy wybrano te opcje juz
            choisedNumber = tabNumber[i];
            sumaChoised();
            remClass(OC_NUMBER);
            setClass(btn);
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

        makeNewCars();  // zapis zamówienia do tablicy tabCars
        orderList();  // zapis zamówienia do tabOrderList

        choisedBodyCar = choisedBrand = choisedColor = null;
        choisedEngine = choisedGear = choisedNumber = null;
    });

    /* ******************************************************************* */
                        /*  PRODUKCJA CAŁY ZAKŁAD   */ 
    /*  ****************************************************************** */

    const PRODUCTION = document.querySelector('.production_department');  //uchwyt do całej produkcji
    const PR_TITLE = PRODUCTION.querySelector('.title_production');  // uchwyt na etykietę produkcji wybranego modelu
    const PR_CHECKMODEL = PRODUCTION.querySelectorAll('.pr_checkmodel'); //uchwyt na wybór modelu
    PR_CHECKMODEL[0].classList.add('pr_checkmodel_set');  // startowy wybór modelu na produkcji

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
    const PR_GETORDER = function(getTab, returnTab, divNo, divMark) {
        getTab.forEach(elem => { 
            returnTab.forEach(position => {
                if((elem.bodycar == position.hotKey || elem.engine == position.hotKey || elem.gear == position.hotKey) && elem.brand == position.name && elem[divNo] == 0 && position.mark == divMark) {
                    position.count += 1
                };
                if((elem.bodycar == position.hotKey || elem.engine == position.hotKey || elem.gear == position.hotKey) && elem.brand == position.name && elem[divNo] == 1 && position.mark == divMark) {
                    position.inStock += 1
                };
            });
        });
    };

    //wyświetla ilość zamówień i wyrobów gotowych w tabeli
    const PR_SHOWORDER = function(getTab, hotKey, text1, text2) {
        getTab.forEach(elem => { 
            if(elem.hotKey == hotKey && elem.name == prAnChosedModel) {
                text1.innerHTML = elem.count;
                text2.innerHTML = elem.inStock;
            };        
        });
    };

    //oblicza i zapisuje w tablicy progres
    const PR_PROGRES = function(getTab, mark, divNo) {
        getTab.forEach(elem => {  //dla każdego zamówienia
            if (elem.count > 0) {  //jeśli są zamówienia to wykonujemy
                let progres = Number(60 / elem.skill * 1.6667); //wyliczamy progres na minutę
                let flag = true; //flaga zapisania momentu osiągnięcia 100% progresu

                progres = Number(progres.toFixed(2));

                for(let i = 0; i < chosenSpeed; i++){
                    elem.progres += progres; // zapis w tablicy aktualnej wartości postępu
                    if(elem.progres >= 100 && flag == true) {
                        timeForEnd = i; //czas jaki kolejny dział może wykorzystac na produkcje w obecnym przeliczeniu
                        for(let i = 0; i < tabCars.length; i ++) {
                            let order = tabCars[i];
        
                            if(order.brand == elem.name && (order.bodycar == elem.hotKey  || order.engine == elem.hotKey || order.gear == elem.hotKey) && elem.mark == mark && order[divNo] == 0) {
                                order.progTime = timeForEnd;
                                break;
                            };
        
                            if(order.brand == elem.name && (order.bodycar == elem.hotKey  || order.engine == elem.hotKey || order.gear == elem.hotKey) && elem.mark == mark && order[divNo] == 3) {
                                order.progTime = timeForEnd;                      
                                break;
                            };  
                        };
                        flag = false;
                    }
                }
                
            };
        });
    };

    // aktualizacja interfejsu i tablic po osiągnięciu min.100% progresu
    const PR_OVERPROGRES = function(getTab, TABLEDATA, mark, divNo, getTabCars) {
        getTab.forEach(elem => {
            if(elem.progres >= 100) {  // gdy progres postępu osiąga min.100% 
                
                elem.inStock ++; //zwiększamy wyroby gotowe 
                elem.count --; //pomniejszamy ilość zam.do wykonania
                elem.count == 0 ? elem.progres = 0 : elem.progres = elem.progres % 100;

                // Aktualizacja elementów interfejsu dla wybranego modelu samochodu
                if(elem.name == prAnChosedModel) {
                    const {order, stock, progtxt} = TABLEDATA[elem.hotKey];
                    order.innerHTML = elem.count;
                    stock.innerHTML = elem.inStock;
                    progtxt.innerHTML = elem.progres;
                };

                for(let i = 0; i < getTabCars.length; i ++) {
                    let order = getTabCars[i];

                    if(order.brand == elem.name && (order.bodycar == elem.hotKey  || order.engine == elem.hotKey || order.gear == elem.hotKey) && elem.mark == mark && order[divNo] == 0) {
                        order[divNo] = 1;
                        order.NoST = 1;
                        break;
                    };

                    if(order.brand == elem.name && (order.bodycar == elem.hotKey  || order.engine == elem.hotKey || order.gear == elem.hotKey) && elem.mark == mark && order[divNo] == 3) {
                        order[divNo] = 4;
                        flagPaint = false;   
                        if(elem.mark == 'AS') order.NoST = 2; // zmiana na wyrób ukończony                      
                        break;
                    };  
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
        {name: 'CO', hotKey: 'SE', skill: 45, count: 0, progres: 0, inStock: 0, mark: 'UN', cost: 20000}, 
        {name: 'CO', hotKey: 'HB', skill: 48, count: 0, progres: 0, inStock: 0, mark: 'UN', cost: 22000}, 
        {name: 'CO', hotKey: 'CO', skill: 55, count: 0, progres: 0, inStock: 0, mark: 'UN', cost: 26000}, 
        {name: 'CO', hotKey: 'CB', skill: 40, count: 0, progres: 0, inStock: 0, mark: 'UN', cost: 2000},
        {name: 'AS', hotKey: 'SE', skill: 49, count: 0, progres: 0, inStock: 0, mark: 'UN', cost: 24000}, 
        {name: 'AS', hotKey: 'HB', skill: 54, count: 0, progres: 0, inStock: 0, mark: 'UN', cost: 26000},
        {name: 'AS', hotKey: 'CO', skill: 66, count: 0, progres: 0, inStock: 0, mark: 'UN', cost: 30000}, 
        {name: 'AS', hotKey: 'CB', skill: 44, count: 0, progres: 0, inStock: 0, mark: 'UN', cost: 24000}, 
        {name: 'VE', hotKey: 'SE', skill: 56, count: 0, progres: 0, inStock: 0, mark: 'UN', cost: 25500}, 
        {name: 'VE', hotKey: 'HB', skill: 59, count: 0, progres: 0, inStock: 0, mark: 'UN', cost: 27500}, 
        {name: 'VE', hotKey: 'CO', skill: 75, count: 0, progres: 0, inStock: 0, mark: 'UN', cost: 31500}, 
        {name: 'VE', hotKey: 'CB', skill: 49, count: 0, progres: 0, inStock: 0, mark: 'UN', cost: 25500}, 
        {name: 'IN', hotKey: 'SE', skill: 68, count: 0, progres: 0, inStock: 0, mark: 'UN', cost: 28000}, 
        {name: 'IN', hotKey: 'HB', skill: 72, count: 0, progres: 0, inStock: 0, mark: 'UN', cost: 30000}, 
        {name: 'IN', hotKey: 'CO', skill: 80, count: 0, progres: 0, inStock: 0, mark: 'UN', cost: 34000}, 
        {name: 'IN', hotKey: 'CB', skill: 55, count: 0, progres: 0, inStock: 0, mark: 'UN', cost: 28000}
    ];  

    const PR_AN_UNDERBODY = function() {  //analiza produkcji podwozi

        PR_CLEARTAB(tabUNDERBODY); //zerowanie ilości zam. przed aktualizacją
        PR_GETORDER(tabCars, tabUNDERBODY, 'NoUN', 'UN'); // pobranie z tabCars ilości zamówień do produkcji i na magazyn gotowych

        PR_SHOWORDER(tabUNDERBODY, 'SE', UN_SE_ORDER, UN_SE_STOCK); //wyświetl ilość zamówień i wyrobów gotowych dla SE
        PR_SHOWORDER(tabUNDERBODY, 'HB', UN_HB_ORDER, UN_HB_STOCK); //wyświetl ilość zamówień i wyrobów gotowych dla HB
        PR_SHOWORDER(tabUNDERBODY, 'CO', UN_CO_ORDER, UN_CO_STOCK); //wyświetl ilość zamówień i wyrobów gotowych dla CO
        PR_SHOWORDER(tabUNDERBODY, 'CB', UN_CB_ORDER, UN_CB_STOCK); //wyświetl ilość zamówień i wyrobów gotowych dla CB

        PR_PROGRES(tabUNDERBODY, 'UN', 'NoUN'); // oblicz i zapisz w tablicy progres
        PR_OVERPROGRES(tabUNDERBODY, UN_TABLEDATA, 'UN', 'NoUN', tabCars); // aktualizacja interfejsu i tablic po osiągnięciu min.100% progresu

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
        {name: 'CO', hotKey: 'CO', skill: 65, inStock: 0, count: 0, progres: 0, mark: 'CA', cost: 31200}, 
        {name: 'CO', hotKey: 'CB', skill: 45, inStock: 0, count: 0, progres: 0, mark: 'CA', cost: 24000}, 
        {name: 'AS', hotKey: 'SE', skill: 54, inStock: 0, count: 0, progres: 0, mark: 'CA', cost: 28800}, 
        {name: 'AS', hotKey: 'HB', skill: 59, inStock: 0, count: 0, progres: 0, mark: 'CA', cost: 31680}, 
        {name: 'AS', hotKey: 'CO', skill: 71, inStock: 0, count: 0, progres: 0, mark: 'CA', cost: 37440}, 
        {name: 'AS', hotKey: 'CB', skill: 49, inStock: 0, count: 0, progres: 0, mark: 'CA', cost: 28800}, 
        {name: 'VE', hotKey: 'SE', skill: 61, inStock: 0, count: 0, progres: 0, mark: 'CA', cost: 34560}, 
        {name: 'VE', hotKey: 'HB', skill: 64, inStock: 0, count: 0, progres: 0, mark: 'CA', cost: 38016}, 
        {name: 'VE', hotKey: 'CO', skill: 80, inStock: 0, count: 0, progres: 0, mark: 'CA', cost: 44928}, 
        {name: 'VE', hotKey: 'CB', skill: 54, inStock: 0, count: 0, progres: 0, mark: 'CA', cost: 34560}, 
        {name: 'IN', hotKey: 'SE', skill: 73, inStock: 0, count: 0, progres: 0, mark: 'CA', cost: 41472}, 
        {name: 'IN', hotKey: 'HB', skill: 77, inStock: 0, count: 0, progres: 0, mark: 'CA', cost: 45619}, 
        {name: 'IN', hotKey: 'CO', skill: 85, inStock: 0, count: 0, progres: 0, mark: 'CA', cost: 53914}, 
        {name: 'IN', hotKey: 'CB', skill: 60, inStock: 0, count: 0, progres: 0, mark: 'CA', cost: 41472}
    ];  

    const PR_AN_CARBODY = function () {

        PR_CLEARTAB(tabCARBODY); //zerowanie tab.zam. przed aktualizacją
        PR_GETORDER(tabCars, tabCARBODY, 'NoCA', 'CA'); // pobranie z tabCars ilości zamówień

        PR_SHOWORDER(tabCARBODY, 'SE', CA_SE_ORDER, CA_SE_STOCK); //wyświetl ilość zamówień i wyrobów gotowych dla SE
        PR_SHOWORDER(tabCARBODY, 'HB', CA_HB_ORDER, CA_HB_STOCK); //wyświetl ilość zamówień i wyrobów gotowych dla HB
        PR_SHOWORDER(tabCARBODY, 'CO', CA_CO_ORDER, CA_CO_STOCK); //wyświetl ilość zamówień i wyrobów gotowych dla CO
        PR_SHOWORDER(tabCARBODY, 'CB', CA_CB_ORDER, CA_CB_STOCK); //wyświetl ilość zamówień i wyrobów gotowych dla CB

        PR_PROGRES(tabCARBODY, 'CA', 'NoCA'); // oblicz i zapisz w tablicy progres
        PR_OVERPROGRES(tabCARBODY, CA_TABLEDATA, 'CA', 'NoCA', tabCars); // aktualizacja interfejsu i tablic po osiągnięciu min.100% progresu

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
        {name: 'CO', hotKey: 'ON', skill: 52, inStock: 0, count: 0, progres: 0, mark: 'FU', cost: 8000}, 
        {name: 'CO', hotKey: 'PB', skill: 55, inStock: 0, count: 0, progres: 0, mark: 'FU', cost: 7000}, 
        {name: 'CO', hotKey: 'LG', skill: 68, inStock: 0, count: 0, progres: 0, mark: 'FU', cost: 9500}, 
        {name: 'CO', hotKey: 'EC', skill: 61, inStock: 0, count: 0, progres: 0, mark: 'FU', cost: 11000}, 
        {name: 'AS', hotKey: 'ON', skill: 58, inStock: 0, count: 0, progres: 0, mark: 'FU', cost: 8800}, 
        {name: 'AS', hotKey: 'PB', skill: 61, inStock: 0, count: 0, progres: 0, mark: 'FU', cost: 7700}, 
        {name: 'AS', hotKey: 'LG', skill: 74, inStock: 0, count: 0, progres: 0, mark: 'FU', cost: 10450}, 
        {name: 'AS', hotKey: 'EC', skill: 67, inStock: 0, count: 0, progres: 0, mark: 'FU', cost: 12100}, 
        {name: 'VE', hotKey: 'ON', skill: 63, inStock: 0, count: 0, progres: 0, mark: 'FU', cost: 9680}, 
        {name: 'VE', hotKey: 'PB', skill: 66, inStock: 0, count: 0, progres: 0, mark: 'FU', cost: 8470}, 
        {name: 'VE', hotKey: 'LG', skill: 79, inStock: 0, count: 0, progres: 0, mark: 'FU', cost: 11495}, 
        {name: 'VE', hotKey: 'EC', skill: 72, inStock: 0, count: 0, progres: 0, mark: 'FU', cost: 13310}, 
        {name: 'IN', hotKey: 'ON', skill: 75, inStock: 0, count: 0, progres: 0, mark: 'FU', cost: 10648}, 
        {name: 'IN', hotKey: 'PB', skill: 78, inStock: 0, count: 0, progres: 0, mark: 'FU', cost: 9317}, 
        {name: 'IN', hotKey: 'LG', skill: 91, inStock: 0, count: 0, progres: 0, mark: 'FU', cost: 12645}, 
        {name: 'IN', hotKey: 'EC', skill: 84, inStock: 0, count: 0, progres: 0, mark: 'FU', cost: 14641}
    ];  

    const PR_AN_ENGINE = function () {
        PR_CLEARTAB(tabFUEL); //zerowanie tab.zam. przed aktualizacją
        PR_GETORDER(tabCars, tabFUEL, 'NoFU', 'FU'); // pobranie z tabCars ilości zamówień

        PR_SHOWORDER(tabFUEL, 'ON', FU_ON_ORDER, FU_ON_STOCK); //wyświetl ilość zamówień i wyrobów gotowych dla ON
        PR_SHOWORDER(tabFUEL, 'PB', FU_PB_ORDER, FU_PB_STOCK); //wyświetl ilość zamówień i wyrobów gotowych dla PB
        PR_SHOWORDER(tabFUEL, 'LG', FU_LG_ORDER, FU_LG_STOCK); //wyświetl ilość zamówień i wyrobów gotowych dla LG
        PR_SHOWORDER(tabFUEL, 'EC', FU_EC_ORDER, FU_EC_STOCK); //wyświetl ilość zamówień i wyrobów gotowych dla EC

        PR_PROGRES(tabFUEL, 'FU', 'NoFU'); // oblicz i zapisz w tablicy progres
        PR_OVERPROGRES(tabFUEL, FU_TABLEDATA, 'FU', 'NoFU', tabCars); // aktualizacja interfejsu i tablic po osiągnięciu min.100% progresu

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
        {name: 'CO', hotKey: 'MA', skill: 40, inStock: 0, count: 0, progres: 0, mark: 'GE', cost: 4500}, 
        {name: 'CO', hotKey: 'PA', skill: 48, inStock: 0, count: 0, progres: 0, mark: 'GE', cost: 5900}, 
        {name: 'CO', hotKey: 'AU', skill: 57, inStock: 0, count: 0, progres: 0, mark: 'GE', cost: 7500}, 
        {name: 'CO', hotKey: 'BS', skill: 68, inStock: 0, count: 0, progres: 0, mark: 'GE', cost: 9000}, 
        {name: 'AS', hotKey: 'MA', skill: 43, inStock: 0, count: 0, progres: 0, mark: 'GE', cost: 4950}, 
        {name: 'AS', hotKey: 'PA', skill: 51, inStock: 0, count: 0, progres: 0, mark: 'GE', cost: 6490}, 
        {name: 'AS', hotKey: 'AU', skill: 60, inStock: 0, count: 0, progres: 0, mark: 'GE', cost: 8250}, 
        {name: 'AS', hotKey: 'BS', skill: 71, inStock: 0, count: 0, progres: 0, mark: 'GE', cost: 9900}, 
        {name: 'VE', hotKey: 'MA', skill: 46, inStock: 0, count: 0, progres: 0, mark: 'GE', cost: 5445}, 
        {name: 'VE', hotKey: 'PA', skill: 54, inStock: 0, count: 0, progres: 0, mark: 'GE', cost: 7139}, 
        {name: 'VE', hotKey: 'AU', skill: 63, inStock: 0, count: 0, progres: 0, mark: 'GE', cost: 9075}, 
        {name: 'VE', hotKey: 'BS', skill: 74, inStock: 0, count: 0, progres: 0, mark: 'GE', cost: 10890}, 
        {name: 'IN', hotKey: 'MA', skill: 49, inStock: 0, count: 0, progres: 0, mark: 'GE', cost: 5990}, 
        {name: 'IN', hotKey: 'PA', skill: 57, inStock: 0, count: 0, progres: 0, mark: 'GE', cost: 7853}, 
        {name: 'IN', hotKey: 'AU', skill: 66, inStock: 0, count: 0, progres: 0, mark: 'GE', cost: 9983}, 
        {name: 'IN', hotKey: 'BS', skill: 77, inStock: 0, count: 0, progres: 0, mark: 'GE', cost: 11979}
    ];  

    const PR_AN_GEAR = function () {
        PR_CLEARTAB(tabGEAR); //zerowanie tab.zam. przed aktualizacją
        PR_GETORDER(tabCars, tabGEAR, 'NoGE', 'GE'); // pobranie z tabCars ilości zamówień

        PR_SHOWORDER(tabGEAR, 'MA', GE_MA_ORDER, GE_MA_STOCK); //wyświetl ilość zamówień i wyrobów gotowych dla MA
        PR_SHOWORDER(tabGEAR, 'PA', GE_PA_ORDER, GE_PA_STOCK); //wyświetl ilość zamówień i wyrobów gotowych dla PA
        PR_SHOWORDER(tabGEAR, 'AU', GE_AU_ORDER, GE_AU_STOCK); //wyświetl ilość zamówień i wyrobów gotowych dla AU
        PR_SHOWORDER(tabGEAR, 'BS', GE_BS_ORDER, GE_BS_STOCK); //wyświetl ilość zamówień i wyrobów gotowych dla BS

        PR_PROGRES(tabGEAR, 'GE', 'NoGE'); // oblicz i zapisz w tablicy progres
        PR_OVERPROGRES(tabGEAR, GE_TABLEDATA, 'GE', 'NoGE', tabCars); // aktualizacja interfejsu i tablic po osiągnięciu min.100% progresu

        PR_SHOWPROGRES('MA', GE_MA_PROGTXT, GE_MA_PROGBAR, tabGEAR)  //wyświetlenie postepu dla MA i wybranego modelu
        PR_SHOWPROGRES('PA', GE_PA_PROGTXT, GE_PA_PROGBAR, tabGEAR)  //wyświetlenie postepu dla PA i wybranego modelu
        PR_SHOWPROGRES('AU', GE_AU_PROGTXT, GE_AU_PROGBAR, tabGEAR)  //wyświetlenie postepu dla AU i wybranego modelu
        PR_SHOWPROGRES('BS', GE_BS_PROGTXT, GE_BS_PROGBAR, tabGEAR)  //wyświetlenie postepu dla BS i wybranego modelu */
    };


    /* *********************  A N A L I T Y K A  *********************** 
       ***************   D Z I A Ł   M A L A R N I A   ***************** */

    class Paints {
        constructor (brand, bodycar, color, NoPA, serialNo) {
            this.brand = brand;
            this.bodycar = bodycar;
            this.color = color;
            this.NoPA = NoPA;
            this.serialNo = serialNo;
        }
    }

    let flagPaint = true; //wybór kolejnego koloru do malowania jak 100% poprzedniego mija

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
    {name: 'CO', hotKey: 'HB', skill: 65, progres: 0, mark: 'PA', count: 0, inStock: 0, cost: 8200, flag: true}, 
    {name: 'CO', hotKey: 'CO', skill: 76, progres: 0, mark: 'PA', count: 0, inStock: 0, cost: 9100, flag: true}, 
    {name: 'CO', hotKey: 'CB', skill: 47, progres: 0, mark: 'PA', count: 0, inStock: 0, cost: 5200, flag: true},
    {name: 'AS', hotKey: 'SE', skill: 63, progres: 0, mark: 'PA', count: 0, inStock: 0, cost: 8050, flag: true}, 
    {name: 'AS', hotKey: 'HB', skill: 70, progres: 0, mark: 'PA', count: 0, inStock: 0, cost: 9430, flag: true},
    {name: 'AS', hotKey: 'CO', skill: 81, progres: 0, mark: 'PA', count: 0, inStock: 0, cost: 10465, flag: true}, 
    {name: 'AS', hotKey: 'CB', skill: 52, progres: 0, mark: 'PA', count: 0, inStock: 0, cost: 5980, flag: true}, 
    {name: 'VE', hotKey: 'SE', skill: 69, progres: 0, mark: 'PA', count: 0, inStock: 0, cost: 9258, flag: true}, 
    {name: 'VE', hotKey: 'HB', skill: 76, progres: 0, mark: 'PA', count: 0, inStock: 0, cost: 10845, flag: true}, 
    {name: 'VE', hotKey: 'CO', skill: 87, progres: 0, mark: 'PA', count: 0, inStock: 0, cost: 12035, flag: true}, 
    {name: 'VE', hotKey: 'CB', skill: 58, progres: 0, mark: 'PA', count: 0, inStock: 0, cost: 6877, flag: true}, 
    {name: 'IN', hotKey: 'SE', skill: 77, progres: 0, mark: 'PA', count: 0, inStock: 0, cost: 10646, flag: true}, 
    {name: 'IN', hotKey: 'HB', skill: 84, progres: 0, mark: 'PA', count: 0, inStock: 0, cost: 12471, flag: true}, 
    {name: 'IN', hotKey: 'CO', skill: 95, progres: 0, mark: 'PA', count: 0, inStock: 0, cost: 13840, flag: true}, 
    {name: 'IN', hotKey: 'CB', skill: 66, progres: 0, mark: 'PA', count: 0, inStock: 0, cost: 7909, flag: true}
    ];

    const PR_AN_PAINT = function() {    

        let tabPaintsColor = [];  //tab na samochody do malowania

        //pobranie zamówień z tablicy zamówień do kolejki i magazyn got.
        const PR_GETORDER_PA = function(getTab, returnTab) {
            getTab.forEach(order => { 
                returnTab.forEach(position => {
                    if(order.bodycar == position.hotKey && order.brand == position.name && order.NoUN == 1 && order.NoCA == 1 && order.NoFU == 1 && order.NoGE == 1 && order.NoPA == 0) {  //gdy komplet zmieniamy numery na przejście na malarnie
                        order.NoUN = 2; // 2 koniec produkcji na dziale
                        order.NoCA = 2;
                        order.NoFU = 2;
                        order.NoGE = 2;
                        order.NoPA = 3; // 3 przesunięcie na malarnie
                    };
                });
            });

            getTab.forEach(order => { 
                returnTab.forEach(position => {
                    if(order.bodycar == position.hotKey && order.brand == position.name && order.NoPA == 3) {
                        position.count ++; // ilość każdego modelu do malowania

                    const PAINT = new Paints(order.brand, order.bodycar, order.color, order.NoPA, order.serialNo)
                    tabPaintsColor.push(PAINT); // tab. aut na malarni
                    };

                    if(order.bodycar == position.hotKey && order.brand == position.name && order.NoPA == 4) {
                        position.inStock ++; // ilość każdego modelu po malowaniu
                    };
                });
            });
        };


        //oblicza i zapisuje w tablicy progres
        const PR_PROGRES_PA = function(getTab, mark, divNo) {

            getTab.forEach(elem => {  //dla każdego zamówienia
                if(elem.count > 1) elem.flag = false;
                if(elem.count == 0) elem.flag = true;
                
                if(elem.count > 0) {
                    let progres = 0;

                    progres = Number(60 / elem.skill * 1.6667); //wyliczamy progres na minutę
                    progres = Number(progres.toFixed(2));

                    if(elem.count == 1 && elem.flag == true) {
                        for(let i = 0; i < tabCars.length; i++) {
                            let order = tabCars[i];

                            if(order.brand == elem.name && order.bodycar == elem.hotKey && order.NoPA == 3) {
                                let workedTime = order.progTime;
                                elem.flag = false;

                                for(let i = 0; i < chosenSpeed - workedTime; i++) {
                                    elem.progres += progres; // zapis w tablicy aktualnej wartości postępu
                                    if(elem.progres >= 100) elem.flag = true;
                                }
                            }
                        }
                    } else {
                        for(let i = 0; i < chosenSpeed; i++){
                            elem.progres += progres; // zapis w tablicy aktualnej wartości postępu
                            
                            if(elem.progres >= 100 && elem.flag == false) {
                                elem.flag = true;
                                timeForEnd = i; //czas jaki kolejny dział może wykorzystac na produkcje w obecnym przeliczeniu
                                for(let i = 0; i < tabCars.length; i ++) {
                                    let order = tabCars[i];
                
                                    if(order.brand == elem.name && order.bodycar == elem.hotKey && elem.mark == mark && order[divNo] == 3) {
                                        order.progTime = timeForEnd;                      
                                        break;
                                    };  
                                };
                            }
                        }
                        elem.flag = false;
                    }
                }
            });
        };

        function updateProgressBar(SHOWPROGTXT, progresElemBar, takeColor, progresElemTXT) {  //pasek postępu
            // Obliczenie liczby divów, które powinny być widoczne na podstawie postępu
            const visibleCount = Math.ceil(SHOWPROGTXT / 4);
            
            // Iteracja przez wszystkie divy .pr_prog_pices
            
            progresElemBar.forEach((div, index) => {
                
                // Jeśli indeks diva jest mniejszy niż liczba widocznych divów, pokaż div, w przeciwnym razie ukryj
                if (index < visibleCount -1) {
                    if(flagPaint == true) { // robimy gdy progres jest < 100 %
                            let color = takeColor[0].color;
                            div.style.display = 'block';   
                            div.style.background = color; //kolor malowanego auta na pasku postepu
                            if(color == "white" || color == "silver" || color == "gray" || color == "gold") {
                                progresElemTXT.style.color = "red";  
                            } else { // zmiana coloru textu na pasku postepu
                                progresElemTXT.style.color = "rgb(247, 255, 2)"; 
                            };

                    } else { // gdy progres jest > 100 %
                        if(takeColor.length < 2) { // gdy w kolejce 1 samochód
                            let color = takeColor[0].color;
                            div.style.display = 'block';   
                            div.style.background = color;
                            if(color == "white" || color == "silver" || color == "gray" || color == "gold") {
                                progresElemTXT.style.color = "red";
                            } else {
                                progresElemTXT.style.color = "rgb(247, 255, 2)"; 
                            };
                            
                        } else { // gdy w kolejce więcej jak 1 samochód
                            let colorA = takeColor[0].color;
                            let colorB = takeColor[1].color;
                            if(colorA == colorB) { // sprawdzamy czy kolejny będzie tego samego koloru i wybieramy kolor aktualny lub po przekroczeniu 100% kolor kolejnego auta
                                div.style.display = 'block';   
                                div.style.background = colorA; 
                                if(colorA == "white" || colorA == "silver" || colorA == "gray" || colorA == "gold") {
                                    progresElemTXT.style.color = "red";
                                } else {
                                    progresElemTXT.style.color = "rgb(247, 255, 2)"; 
                                };
                                
                            } else {
                                div.style.display = 'block';   
                                div.style.background = colorB;
                                if(colorB == "white" || colorB == "silver" || colorB == "gray" || colorB == "gold") {
                                    progresElemTXT.style.color = "red";
                                } else {
                                    progresElemTXT.style.color = "rgb(247, 255, 2)"; 
                                };
                                
                            };   
                        };     
                    };          
                } else {
                    div.style.display = 'none';
                };
                
            });
            flagPaint = true;
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
                let takeColor = gettabColor.filter(col => col.bodycar == hotKey && col.brand == prAnChosedModel); //tworzymy tablice 
                updateProgressBar(SHOWPROGTXT, progresElemBar, takeColor, progresElemTXT);  // aktualizujemy paski postepu malaowania

                progresElemTXT.innerHTML = `${SHOWPROGTXT} %`;
            }; 
        };

        PR_CLEARTAB(tabPAINT); //zerowanie tab.zam. przed aktualizacją
        PR_GETORDER_PA(tabCars, tabPAINT, 'PA'); // wewnętrzna funkcja

        PR_SHOWORDER(tabPAINT, 'SE', PA_SE_ORDER, PA_SE_STOCK); //wyświetl ilość zamówień i wyrobów gotowych dla SE
        PR_SHOWORDER(tabPAINT, 'HB', PA_HB_ORDER, PA_HB_STOCK); //wyświetl ilość zamówień i wyrobów gotowych dla HB
        PR_SHOWORDER(tabPAINT, 'CO', PA_CO_ORDER, PA_CO_STOCK); //wyświetl ilość zamówień i wyrobów gotowych dla CO
        PR_SHOWORDER(tabPAINT, 'CB', PA_CB_ORDER, PA_CB_STOCK); //wyświetl ilość zamówień i wyrobów gotowych dla CB

        PR_PROGRES_PA(tabPAINT, 'PA', 'NoPA'); // oblicz i zapisz w tablicy progres
        PR_OVERPROGRES(tabPAINT, PA_TABLEDATA, 'PA', 'NoPA', tabCars); // aktualizacja interfejsu i tablic po osiągnięciu min.100% progresu

        PR_SHOWPROGRES_PA('SE', PA_SE_PROGTXT, PA_SE_PROGBAR, tabPAINT, tabPaintsColor, tabCars)  //wyświetlenie postepu dla SE i wybranego modelu
        PR_SHOWPROGRES_PA('HB', PA_HB_PROGTXT, PA_HB_PROGBAR, tabPAINT, tabPaintsColor, tabCars)  //wyświetlenie postepu dla HB i wybranego modelu
        PR_SHOWPROGRES_PA('CO', PA_CO_PROGTXT, PA_CO_PROGBAR, tabPAINT, tabPaintsColor, tabCars)  //wyświetlenie postepu dla CO i wybranego modelu
        PR_SHOWPROGRES_PA('CB', PA_CB_PROGTXT, PA_CB_PROGBAR, tabPAINT, tabPaintsColor, tabCars)  //wyświetlenie postepu dla CB i wybranego modelu */

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
    {name: 'CO', hotKey: 'SE', skill: 61, progres: 0, mark: 'AS', count: 0, inStock: 0, cost: 4000, flag: true}, 
    {name: 'CO', hotKey: 'HB', skill: 63, progres: 0, mark: 'AS', count: 0, inStock: 0, cost: 5300, flag: true}, 
    {name: 'CO', hotKey: 'CO', skill: 67, progres: 0, mark: 'AS', count: 0, inStock: 0, cost: 6800, flag: true}, 
    {name: 'CO', hotKey: 'CB', skill: 59, progres: 0, mark: 'AS', count: 0, inStock: 0, cost: 4000, flag: true},
    {name: 'AS', hotKey: 'SE', skill: 63, progres: 0, mark: 'AS', count: 0, inStock: 0, cost: 4600, flag: true}, 
    {name: 'AS', hotKey: 'HB', skill: 65, progres: 0, mark: 'AS', count: 0, inStock: 0, cost: 6095, flag: true},
    {name: 'AS', hotKey: 'CO', skill: 69, progres: 0, mark: 'AS', count: 0, inStock: 0, cost: 7820, flag: true}, 
    {name: 'AS', hotKey: 'CB', skill: 61, progres: 0, mark: 'AS', count: 0, inStock: 0, cost: 4600, flag: true}, 
    {name: 'VE', hotKey: 'SE', skill: 65, progres: 0, mark: 'AS', count: 0, inStock: 0, cost: 5290, flag: true}, 
    {name: 'VE', hotKey: 'HB', skill: 67, progres: 0, mark: 'AS', count: 0, inStock: 0, cost: 7009, flag: true}, 
    {name: 'VE', hotKey: 'CO', skill: 71, progres: 0, mark: 'AS', count: 0, inStock: 0, cost: 8993, flag: true}, 
    {name: 'VE', hotKey: 'CB', skill: 63, progres: 0, mark: 'AS', count: 0, inStock: 0, cost: 5290, flag: true}, 
    {name: 'IN', hotKey: 'SE', skill: 67, progres: 0, mark: 'AS', count: 0, inStock: 0, cost: 6084, flag: true}, 
    {name: 'IN', hotKey: 'HB', skill: 69, progres: 0, mark: 'AS', count: 0, inStock: 0, cost: 8061, flag: true}, 
    {name: 'IN', hotKey: 'CO', skill: 73, progres: 0, mark: 'AS', count: 0, inStock: 0, cost: 10342, flag: true}, 
    {name: 'IN', hotKey: 'CB', skill: 65, progres: 0, mark: 'AS', count: 0, inStock: 0, cost: 6084, flag: true}
    ];

    const PR_AN_ASSEMBLY = function() {

        //pobranie zamówień z tablicy zamówień do kolejki i magazyn got.
        const PR_GETORDER_AS = function(getTab, returnTab) {
            getTab.forEach(order => { 
                returnTab.forEach(position => {
                    if(order.bodycar == position.hotKey && order.brand == position.name && order.NoPA == 4) {  // gdy na mag malarni zmieniamy na nr montażu
                        order.NoPA = 5; // 5 koniec na malarni
                        order.NoAS = 3; // 3 wejście na montaż
                    };
                });
            });

            getTab.forEach(order => { 
                returnTab.forEach(position => {
                    if(order.bodycar == position.hotKey && order.brand == position.name && order.NoAS == 3) 
                        position.count ++; // ilość każdego modelu do montażu

                    if(order.bodycar == position.hotKey && order.brand == position.name && order.NoAS == 4) {
                        position.inStock ++; // ilość każdego gotowego modelu 
                    };
                });
            });
        };

        //oblicza i zapisuje w tablicy progres
        const PR_PROGRES_AS = function(getTab, mark, divNo) {

            getTab.forEach(elem => {  //dla każdego zamówienia
                if(elem.count > 1) elem.flag = false;
                if(elem.count == 0) elem.flag = true;
                
                if(elem.count > 0) {
                    let progres = 0;

                    progres = Number(60 / elem.skill * 1.6667); //wyliczamy progres na minutę
                    progres = Number(progres.toFixed(2));

                    if(elem.count == 1 && elem.flag == true) {
                        for(let i = 0; i < tabCars.length; i++) {
                            let order = tabCars[i];

                            if(order.brand == elem.name && order.bodycar == elem.hotKey && order.NoAS == 3) {
                                let workedTime = order.progTime;
                                elem.flag = false;

                                for(let i = 0; i < chosenSpeed - workedTime; i++) {
                                    elem.progres += progres; // zapis w tablicy aktualnej wartości postępu
                                    if(elem.progres >= 100) elem.flag = true;
                                }
                            }
                        }
                    } else {
                        for(let i = 0; i < chosenSpeed; i++){
                            elem.progres += progres; // zapis w tablicy aktualnej wartości postępu
                        }
                       /* elem.flag = false;*/
                    }
                }
            });
        };

        PR_CLEARTAB(tabASSEMBLY); //zerowanie tab.zam. przed aktualizacją
        PR_GETORDER_AS(tabCars, tabASSEMBLY, 'AS'); // wewnętrzna funkcja

        PR_SHOWORDER(tabASSEMBLY, 'SE', AS_SE_ORDER, AS_SE_STOCK); //wyświetl ilość zamówień i wyrobów gotowych dla SE
        PR_SHOWORDER(tabASSEMBLY, 'HB', AS_HB_ORDER, AS_HB_STOCK); //wyświetl ilość zamówień i wyrobów gotowych dla HB
        PR_SHOWORDER(tabASSEMBLY, 'CO', AS_CO_ORDER, AS_CO_STOCK); //wyświetl ilość zamówień i wyrobów gotowych dla CO
        PR_SHOWORDER(tabASSEMBLY, 'CB', AS_CB_ORDER, AS_CB_STOCK); //wyświetl ilość zamówień i wyrobów gotowych dla CB

        PR_PROGRES_AS(tabASSEMBLY, 'AS', 'NoAS'); // oblicz i zapisz w tablicy progres
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
                        if(order.NoST == 0) position.count ++;
                        if(order.NoST == 1) position.progres ++;
                        if(order.NoST == 2) position.inStock++;
                    };
                });
            });
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
        PR_ST_SHOWSTATS(tabSTATS, ST_TABLEDATA);
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

    const SELL_WINDOW = document.querySelector('.wh_popup'); // okno potwierdzenia sprzedaży
    const BUT_SELL_YES = document.querySelector('.but_sell_Y');  //przycisk TAK
    const BUT_SELL_NO = document.querySelector('.but_sell_N');  //przycisk NIE
    const END_ORDER_LIST = document.querySelector('.end_order_list_js'); //uchwyt do listy wykonanych zamówień

    let WH_lineValue = ``; // treść linii skończonych zamówień
    let NoORtoSell = 0; //nr zam. wybranego do sprzedaży
    let lastQuantityOrder = 0;  //ostatnia zapisana ilość ukończonych zamówień
    let OBS_END_ORDER; // zmienna globalna przechowująca obiekt MutationObserver

    //potwierdzenie sprzedaży i zakończenia zamówienia
    BUT_SELL_YES.addEventListener('click', () => { 
        // uruchamiamy dalej grę
        intervalID = setInterval(countTime, 1000); 
        STARTBUT.innerHTML = "STOP";
        STARTBUT.style.background = 'red';
        STARTBUT.disabled = false;

        // aktualizacja finansów po sprzedaży
        let valueSell = tabCars.find(el => el.NoOR == NoORtoSell);
        let allValueSell = valueSell.price * valueSell.quantityOrder;
        cash += allValueSell;
        cash = Math.floor(cash);
        let format_cash = formatNumber(cash);
        CASH.innerHTML = `Stan finansów: &nbsp;&nbsp; ${format_cash} zł`;

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

        SELL_WINDOW.classList.add('wh_hidden');
    });
    

    // rezygnujemy ze sprzedaży i zakończenia zamówienia
    BUT_SELL_NO.addEventListener('click', () => {
        // uruchamiamy dalej grę
        intervalID = setInterval(countTime, 1000); 
        STARTBUT.innerHTML = "STOP";
        STARTBUT.style.background = 'red';
        STARTBUT.disabled = false;
        // odznaczamy zamówienie na liście, ukrywamy okno sprzedaży
        findOrder(NoORtoSell, false);
        SELL_WINDOW.classList.add('wh_hidden');
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
            elem.addEventListener('click', () => { //wybór zam. do sprzedaży
                clearInterval(intervalID); // zatrzymanie gry do czasu potwierdzenia
                STARTBUT.innerHTML = "START";
                STARTBUT.style.background = 'green';
                STARTBUT.disabled = true;

                elem.classList.add('wh_order_line_style');
                NoORtoSell= elem.firstChild.innerHTML;
                NoORtoSell = Number(NoORtoSell);
                findOrder(NoORtoSell, true);  //wyszukanie i zaznaczenie zam. na liscie zamówień

                SELL_WINDOW.classList.remove('wh_hidden');                
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
    const WH_ORDER_END_A = function() {  
        if(tabCars.length > 0) {
            WH_lineValue = ``; // treść linii skończonych zamówień
            let actualQuantityOrder = 0; //aktualna ilość skończonych zamówień
            const ORDER_QUANTITY = tabCars[tabCars.length - 1].NoOR;  // ilość zamówień w tabCars

            for(let i = 0; i < ORDER_QUANTITY; i++) {
                let allQuanOrder = 0; // ilość ukończonych aut z zamówienia
                let allPrice = 0; // wartość sprzedaży całego zamówienia
                let allProfit = 0; // wartość zysku dla całego zamówienia
                tabCars.forEach(order => {
                    if(order.NoOR == i + 1 && order.NoST == 2) {
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

                            //robimy sprawdzenie by wykonywac kod stop/start Obserwer dgy zachodzą zmiany na liście ukończonych zamówień
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
    
    
    /* ************************* SPEED GAME ********************** */

    let chosenSpeed = 1;  //wybrana prędkość upływu czasu
    let isRunning = true;
    let startDate = new Date('2024-01-01T00:01');
    let intervalID = null;
    let speedCounter = 1;

    const tabLowSpeedDes = ['min. x1', 'x1 << x2', 'x2 << x4', 'x4 << x8', 'x8 << x16'];
    const tabHighSpeedDes = ['x1 >> x2', 'x2 >> x4', 'x4 >> x8', 'x8 >> x16', 'max. x16'];
    const tabChosenSpeed = [1, 2, 4, 8, 16];  //dostepne szybkości gry
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

        startDate.setMinutes(startDate.getMinutes() + chosenSpeed);
        GAMEDATE.innerHTML = `${curYear}-${curMonth}-${curDay} &nbsp;&nbsp;  ${curHours}:${curMinutes}`;

        PR_AN_UNDERBODY(); //analiza produkcji podwozi
        PR_AN_CARBODY(); //analiza produkcji nadwozi
        PR_AN_ENGINE(); //analiza produkcji silników
        PR_AN_GEAR(); //analiza produkcji skrzyń biegów 
        PR_AN_PAINT();  //analiza pracy malarni
        PR_AN_ASSEMBLY(); //analiza pracy montowni
        PR_AN_STATS(); //statystyki produkcji
        WH_STATS(); //magazyn
        WH_ORDER_END_A();  //wyświetl ukończone zamówienia
       /* console.log(tabCars);*/
    }

    LOWSPEED.disabled = true;
    HIGHSPEED.disabled = false;
    LOWSPEED.innerHTML = tabLowSpeedDes[0];
    HIGHSPEED.innerHTML = tabHighSpeedDes[0];

    function toggleTime() {  //zmiana start / stop gry
        if (isRunning) {  //gdy gra nie jest zatrzymana to...
            intervalID = setInterval(countTime, 1000);
            STARTBUT.innerHTML = "STOP";
            STARTBUT.style.background = 'red';

        } else {  //gdy gra jest zatrzymana to ...

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
        LOWSPEED.disabled = speedCounter === 1;
        HIGHSPEED.disabled = speedCounter === tabChosenSpeed.length;
        LOWSPEED.innerHTML = tabLowSpeedDes[speedCounter - 1];
        HIGHSPEED.innerHTML = tabHighSpeedDes[speedCounter - 1];
    }

    STARTBUT.addEventListener('click', toggleTime);
    HIGHSPEED.addEventListener('click', () => changeSpeed('up'));
    LOWSPEED.addEventListener('click', () => changeSpeed('down'));

    
    /*  ************** WYLICZANIE KOSZTÓW DZIAŁALNOŚCI ************* */

    // tab. poziomów zakładu, stopnia kosztów i kosztów ulepszeń
    const tabFactoryCost = [
        {name: 'lv.1', cost: 0.9, uplevel: 1500000}, 
        {name: 'lv.2', cost: 0.75, uplevel: 3500000}, 
        {name: 'lv.3', cost: 0.63, uplevel: 6000000}, 
        {name: 'lv.4', cost: 0.53, uplevel: 10000000}, 
        {name: 'lv.5', cost: 0.45, uplevel: 16000000}, 
        {name: 'lv.6', cost: 0.38, uplevel: 25000000}, 
        {name: 'lv.7', cost: 0.32, uplevel: 40000000}, 
        {name: 'lv.8', cost: 0.26, uplevel: 70000000}, 
        {name: 'lv.9', cost: 0.21, uplevel: 120000000}, 
        {name: 'lv.10', cost: 0.17, uplevel: 200000000}
    ];

    /*************** testy **************/

    const tabTest = [];

    tabUNDERBODY.forEach(ubody => {
        const carbody = tabCARBODY.find(cbody => cbody.name == ubody.name && cbody.hotKey == ubody.hotKey);
        const paint = tabPAINT.find(paint => paint.name == ubody.name && paint.hotKey == ubody.hotKey);
        const assembly = tabASSEMBLY.find(assem => assem.name == ubody.name && assem.hotKey == ubody.hotKey);

        if(carbody && paint && assembly) {
            tabFUEL.forEach(fuel => {
                if(fuel.name == ubody.name){
                    tabGEAR.forEach(gear => {
                        if(gear.name == ubody.name) {
                                tabTest.push({
                                name: ubody.name,
                                hotKey1: ubody.hotKey,
                                hotKey2: fuel.hotKey,
                                hotKey3: gear.hotKey,
                                u_skill: ubody.skill,
                                c_skill: carbody.skill,
                                f_skill: fuel.skill,
                                g_skill: gear.skill,
                                p_skill: paint.skill,
                                a_skill: assembly.skill
                            });
                        }
                        
                    })
                    
                }
            })
        }
    })

   /* console.log(tabTest);*/

}());