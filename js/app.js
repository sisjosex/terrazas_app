var module = ons.bootstrap();

angular.module('MyApp', ['QuickList']);

var calendar;

var currentDate = '';


var currentSession;

var selectedDate = '';
var current_page = '';
var current_seccion_id = '';

var applicationParams = '';

var currentSessionFromNotification = null;

window.onresize = function(){
    resizeCardCarousel();
};

function resizeCardCarousel() {
    thumb_width = window.innerWidth;
    thumb_height = parseInt(514 / 640 * window.innerWidth);

    $('.hascarousel .carousel-detail').height(thumb_height);
    $('.hascarousel .page__content').css('top', thumb_height);
}

function onError() {}

var current_list = [];
var carta_data = {};
function goToCarta() {

    getJsonP(api_url + 'get_carta', function(data){

        carta_data = data;

        splash.pushPage('carta.html', {});

    }, function(){}, {});
}

function goToCartaDetalle(section) {

    $('#carta_list').html('');

    loadIntoTemplate('#carta_list', carta_data[section], 'carta_list_content');

    ons.compile($('#carta_scroll')[0]);

    initScroll('carta_scroll');
}

function goToVinoDetalle(section) {

    $('#carta_list').html('');

    loadIntoTemplate('#carta_list', carta_data[section], 'carta_list_vino_content');

    ons.compile($('#carta_scroll')[0]);

    initScroll('carta_scroll');
}

function goToVinosCategoria(id) {

    getJsonP(api_url + 'get_categoria_vinos', function(data){

        current_list = data;

        splash.pushPage('vinos.html', {id: id});

        if(current_list.list) {


        }

    }, function(){}, {id: id});
}

function goToMenuDiario() {

    getJsonP(api_url + 'get_menudiario', function(data){

        current_list = data;

        splash.pushPage('menudiario.html', {});

        if(current_list.list) {


        }

    }, function(){}, {});
}

function goToAmbientes() {

    getJsonP(api_url + 'get_ambientes', function (data) {

        current_list = data;

        splash.pushPage('page.html', {});

        if (current_list.list) {


        }

    }, function () {
    }, {});
}

function goToAlertas() {

    getJsonP(api_url + 'get_novedades', function (data) {

        current_list = data;

        splash.pushPage('novedades.html', {});

        if (current_list.list) {


        }

    }, function () {
    }, {});
}

function goToGruposCategoria() {

    getJsonP(api_url + 'get_menu_grupos', function(data){

        current_list = data;

        splash.pushPage('grupo.html', {});

        if(current_list.list) {

        }

    }, function(){}, {});
}

function goToGruposDetalle(id) {

    getJsonP(api_url + 'get_menus', function(data){

        current_list = data;

        splash.pushPage('grupo_detalle.html', {id: id});

        if(current_list.list) {


        }

    }, function(){}, {categoria_menu: id});
}

function getNosotros() {

    getJsonP(api_url + 'get_laterraza', function(data){

        current_list = data;

        splash.pushPage('page.html', {});

        if(current_list.list) {


        }

    }, function(){}, {});
}

function loadApplicationParams(callback) {

    getJsonPBackground(api_url + 'getParams/', function(data){

        applicationParams = data;

        callback();

    }, function(){

    }, {});
}

function refreshPageScroll() {

    scrolls['page_scroll'].refresh();
}

function refreshNovedadesScroll() {

    scrolls['novedades_scroll'].refresh();
}

closeDetailSession = function() {

    popPage('guest_info.html');

    currentSessionFromNotification=null;


;}

actionCall = function(phone) {

    phonedialer.dial(
        phone,
        function(err) {
            if (err == "empty") {
                alert("Unknown phone number");
            }
            else alert("Dialer Error:" + err);
        },
        function(success) {
            //alert('Dialing succeeded');
        }
    );
};

var scopeSplashController;
module.controller('SplashController', function($scope) {
    ons.ready(function() {

        current_page = 'splash.html';

        try {
            StatusBar.hide();
        }catch(error){}

        scopeSplashController = $scope;

        loadApplicationParams(function(){

            applicationParams.slider = getArrayAsObjects(applicationParams.slider);

            splash.pushPage('main.html');

        });

    });
});


var scopeHomeController;
module.controller('HomeController', function($scope) {
    ons.ready(function() {

        try {
            StatusBar.hide();
        }catch(error){}

        scopeHomeController = $scope;

        current_page = 'main.html';

        $('#guest_paginator > li:nth-child(1)').addClass('selected');

        try { navigator.splashscreen.hide(); } catch(error){}

        loadIntoTemplate('#home_images', applicationParams.slider, 'slider_images');

        ons.compile($('#main_scroll')[0]);

        initScroll('main_scroll');

        resizeCardCarousel();

    });
});

function nextSlide() {
    homeSlider.next();
}

function prevSlide() {
    homeSlider.prev();
}



function compare(a,b) {
    if (parseInt(moment(a.date, "YYYY-MM-DD").format("x")) > parseInt(moment(b.date, "YYYY-MM-DD").format("x")))
        return 1;
    return 0;
}



var scopeCartaController;
module.controller('CartaController', function($scope) {
    ons.ready(function() {

        scopeCartaController = this;

        current_page = 'carta.html';

        $scope.labels = getLabels();

        loadIntoTemplate('#carta_list', carta_data.entrante, 'carta_list_content');

        ons.compile($('#carta_scroll')[0]);

        initScroll('carta_scroll');

    });
});


var scopeMenuDiarioController;
module.controller('MenuDiarioController', function($scope) {
    ons.ready(function() {

        scopeMenuDiarioController = this;

        current_page = 'menudiario.html';

        $scope.labels = getLabels();

        if(current_list.data.dia_spanish)
            $scope.title = current_list.data.dia_spanish + ' - ' + current_list.data.dia_numerico + ' ' + current_list.data.mes_spanish;

        var content = '';
        if(current_list.data.tipo_menu == 'diario') {

            if(current_list.data.primeros) {
                content += '<h3>Primeros</h3><div class="description_listado">' + $(current_list.data.primeros).text() + '</div>';
            }

            if(current_list.data.segundos) {
                content += '<h3>Primeros</h3><div class="description_listado">' + current_list.data.primeros + '</div>';
            }

            if(current_list.data.precio_descripcion) {
                content += '<h3 class="normal">'+ current_list.data.precio_descripcion + '&euro;</h3>';
            }
        }

        if(current_list.data.especialidades) {
            content += '<h3>RECOMENDACIONES</h3><div class="description_listado">' + current_list.data.especialidades + '</div>';
        }

        $('#menu_diario_content').html(content);

        ons.compile($('#menu_diario_content')[0]);

        initScroll('menudiario_scroll');

    });
});

var scopeVinosController;
module.controller('VinosController', function($scope) {
    ons.ready(function() {

        scopeVinosController = this;

        current_page = 'vinos.html';

        $scope.labels = getLabels();

        loadIntoTemplate('#vinos_list_content', current_list.list, 'vino_list_content');

        ons.compile($('#vinos_scroll')[0]);

        initScroll('vinos_scroll');

    });
});

var PageController;
module.controller('PageController', function($scope) {
    ons.ready(function() {

        scopeVinosController = this;

        current_page = 'page.html';

        $scope.labels = getLabels();

        loadIntoTemplate('#page_content', current_list.list, 'page_list_content');

        ons.compile($('#page_content')[0]);

        initScroll('page_scroll');

    });
});

var NovedadesController;
module.controller('NovedadesController', function($scope) {
    ons.ready(function() {

        scopeVinosController = this;

        current_page = 'novedades.html';

        $scope.labels = getLabels();

        loadIntoTemplate('#novedades_content', current_list.list, 'novedades_list_content');

        ons.compile($('#novedades_content')[0]);

        initScroll('novedades_scroll');

    });
});


var scopeVinoDetalleController;
module.controller('VinoDetalleController', function($scope) {
    ons.ready(function() {

        current_page = 'vino_detalle.html';

        $scope.labels = getLabels();

        loadIntoTemplate('#vino_list_content', current_list.list, 'vino_list_detail');

        $scope.subtitle = current_list.categoria_nombre;
        $scope.clase = current_list.clase;

        ons.compile($('#vino_detalle_scroll')[0]);

        if( (current_list.list && current_list.list.length < 6) || !current_list.list) {

            $('#vino_list_content').parent().css('background-size', '100% auto');
        }

        initScroll('vino_detalle_scroll');

    });
});


var scopeGrupoController;
module.controller('GrupoController', function($scope) {
    ons.ready(function() {

        scopeGrupoController = this;

        current_page = 'grupo.html';

        $('#grupos_descripcion').html(current_list.page.description);
        $('#grupos_descripcion').html($('#grupos_descripcion').text());

        loadIntoTemplate('#grupo_list_content', current_list.list, 'grupo_list_content');

        $scope.labels = getLabels();

        initScroll('grupo_scroll');

    });
});

var scopeGrupoDetalleController;
module.controller('GrupoDetalleController', function($scope) {
    ons.ready(function() {

        current_page = 'grupo_detalle.html';

        $scope.labels = getLabels();

        loadIntoTemplate('#grupo_list_content', current_list.list, 'grupo_list_detail');

        $scope.subtitle = current_list.categoria_nombre;
        $scope.clase = current_list.clase;

        ons.compile($('#grupo_detalle_scroll')[0]);

        if( (current_list.list && current_list.list.length < 6) || !current_list.list) {

            $('#grupo_list_content').parent().css('background-size', '100% auto');
        }

        initScroll('grupo_detalle_scroll');

    });
});

function getArrayAsObjects(array, width, height) {
    var result = [];

    width = width*2;
    height = height*2;

    for(var i in array) {
        result.push({list_image:array[i], selected:i === 0 ? 'selected' : ''});
        /*if(width && height) {
            result.push({list_image: thumb_url.replace('%width%', width).replace('%height%', height) + array[i], selected:i === 0 ? 'selected' : ''});
        } else {
            result.push({list_image:array[i], selected:i === 0 ? 'selected' : ''});
        }*/
    }

    return result;
}

function getJsonP(url, callback_success, callback_error, data) {

    if(data === undefined) {
        data = {};
    }


    if(data.lang === undefined) {
        data.lang = applicationLanguage;
    }

    modal.show();

    $.ajax({
        type: 'GET',
        url: url,
        data: data,
        dataType: 'JSONp',
        timeout: 2000,
        async:true,
        success: function(data) {

            modal.hide();

            callback_success(data);
        },
        error: function(data) {

            modal.hide();

            callback_error(data);
        }
    });
}


function getJsonPBackground(url, callback_success, callback_error, data) {

    if(data === undefined) {
        data = {};
    }


    if(data.lang === undefined) {
        data.lang = applicationLanguage;
    }

    $.ajax({
        type: 'GET',
        url: url,
        data: data,
        dataType: 'JSONp',
        timeout: 2000,
        async:true,
        success: function(data) {

            modal.hide();

            callback_success(data);
        },
        error: function(data) {

            modal.hide();

            callback_error(data);
        }
    });
}


function alert(message) {
    ons.notification.alert({
        message: message,
        // or messageHTML: '<div>Message in HTML</div>',
        title: getLabel('alert'),
        buttonLabel: 'OK',
        animation: 'default', // or 'none'
        // modifier: 'optional-modifier'
        callback: function() {
            // Alert button is closed!
        }
    });
}


function fixGuestListItem(height) {

    $('#styleguest').remove();

    $('body').append(
        '<style id="styleguest" type="text/css">'+
        '.guest_list_item {'+
        'position:relative;'+
        'height:'+(height)+'px;'+
        '}'+
        '</style>'
    );
}

function fixModalBottomHeight(height){

    $('#stylemodal').remove();

    $('body').append('<style id="stylemodal" type="text/css">.bottom-dialog .dialog {min-height: ' + height + ';}</style>');
}

var scrolls = {};
function initScroll(div) {

    if(!scrolls[div]) {

        //scrolls[div] = new IScroll('#' + div, {hScrollbar: false, vScrollbar: false});
        scrolls[div] = new iScroll(div, {momentum:true, hScrollbar:false, vScrollbar:false, click: true, checkDOMChanges: true});

    } else {

        //scrolls[div] = new iScroll(div, {hScrollbar: false, vScrollbar: false});
        scrolls[div].scrollTo(0,0);
        setTimeout(function(){
            scrolls[div].destroy();
            scrolls[div] = new iScroll(div, {momentum:true, hScrollbar:false, vScrollbar:false, click: true, checkDOMChanges: true});
        }, 10);
        //scrolls[div].refresh();
        //scrolls[div].destroy();scrolls[div] = new IScroll('#' + div, {hScrollbar: false, vScrollbar: false});
    }

    //$('.button').on('touchstart',function(event){event.preventDefault();});

    //new IScroll('#' + div, { hScrollbar: false, vScrollbar: false });
}

function updateContent (el, data) {
    el.innerHTML = data;
}

function getLabels() {
    return labels[applicationLanguage];
}