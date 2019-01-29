function generateItemCard(obj) {
    return "<div class=\"card horizontal\">\n  <div class=\"card-image\">\n    <img src=\"img/home.jpg\">\n  </div>\n  <div class=\"card-stacked\">\n    <div class=\"card-content\">\n      <div>\n        <b>Direccion: </b> " + obj.Direccion + "<p></p>\n      </div>\n      <div>\n        <b>Ciudad: </b> " + obj.Ciudad + "<p></p>\n      </div>\n      <div>\n        <b>Telefono: </b> " + obj.Telefono + "<p></p>\n      </div>\n      <div>\n        <b>C\xF3digo postal: </b> " + obj.Codigo_Postal + "<p></p>\n      </div>\n      <div>\n        <b>Precio: </b> " + obj.Precio + "<p></p>\n      </div>\n      <div>\n        <b>Tipo: </b> " + obj.Tipo + "<p></p>\n      </div>\n    </div>\n  </div>\n</div>";
}

function getArrayPorCampo(campo) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            type: "POST",
            url: "/api/obtener-un-atributo-json",
            data: { campo: campo },
            success: function(data) {
                resolve(data);
            },
            error: function(jqXHR, textStatus, err) {
                reject('text status ' + textStatus + ', err ' + err);
            }
        });
    });
}

function getDataFiltrada(filtros) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            type: "POST",
            url: "/api/all",
            data: filtros,
            success: function(data) {
                resolve(data);
            },
            error: function(jqXHR, textStatus, err) {
                reject('text status ' + textStatus + ', err ' + err);
            }
        });
    });
}

//Inicializador del elemento Slider
$("#rangoPrecio").ionRangeSlider({
    type: "double",
    grid: false,
    min: 0,
    max: 100000,
    from: 1000,
    to: 20000,
    prefix: "$"
});

$("#checkPersonalizada").change(function() {
    getArrayPorCampo('Ciudad').then(function(data) {
        var acum = '<option value="" selected>Escoge una ciudad</option>';
        $.each(data, function(index, column) {
            acum += '<option value="' + column + '">' + column + "</option>"
        });
        $('#ciudad').html(acum).show();
    });

    getArrayPorCampo('Tipo').then(function(data) {
        var acum = '<option value="" selected>Escoge un tipo</option>';
        $.each(data, function(index, column) {
            acum += '<option value="' + column + '">' + column + "</option>"
        });
        $('#tipo').html(acum).show();
    });
});

$("#buscar").click(function() {

    var slider = $("#rangoPrecio").data("ionRangeSlider");
    var from = slider.result.from;
    var to = slider.result.to;

    var busquedaAvanzada = $('#checkPersonalizada').is(':checked');

    if (busquedaAvanzada) {
        var dataToSend = {
            ciudad: $("#ciudad").val(),
            tipo: $("#tipo").val(),
            from: parseInt(from),
            to: parseInt(to)
        };
        getDataFiltrada(dataToSend).then(
            function(data) {
                var acum = "";
                $.each(data, function(index, obj) {
                    acum += generateItemCard(obj);
                });
                $('.lista').html(acum);
            }
        )
    } else {
        $.get("/api/all", function(data, status) {
            var acum = "";
            $.each(data, function(index, obj) {
                acum += generateItemCard(obj);
            });
            $('.lista').html(acum);
        });
    }
});



function setSearch() {
    let busqueda = $('#checkPersonalizada');
    busqueda.on('change', (e) => {
        if (this.customSearch == false) {
            this.customSearch = true
        } else {
            this.customSearch = false
        }
        $('#personalizada').toggleClass('invisible')
    })
}

setSearch();