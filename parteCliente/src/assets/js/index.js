$(document).ready(function () {
  cargarCategorias();
  cargarImagenesCarousel();
  cargarRedesSociales();

  //event listeners
  $(".menu-lateral__hamburguesa").on("click", toggleHamburguesa);
  $("#botonAbrirLogIn").on("click", abrirLogIn);
  $("#botonRegistrarse").on("click", registrarse);
  $("#botonLogin").on("click", logIn);

  window.addEventListener("popstate", function (event) {
    console.log(event);
    //$('.page-content').html(state);
  });
});

//cerrar el log in al hacer click en la pagina
$(document).mouseup(function (e) {
  var container = $(".log-in");

  if (!container.is(e.target) && container.has(e.target).length === 0) {
    container.hide();
  }
});

function abrirLogIn(event) {
  $(".log-in").show();
  $(".log-in").toggleClass("log-in--visible");
  let altura = this.getBoundingClientRect().height;
  let posY = this.getBoundingClientRect().y;

  $(".log-in").css({
    top: posY + altura + 20,
    right: 20
  });
}

function logIn() {
  let email = $("#inputUsuario").val();
  let password = $("#inputContrasenya").val();
  let objetoUsuario = {
    email: email,
    password: password
  };
  console.log(objetoUsuario);

  $.post("http://127.0.0.1:8000/api/auth/login", objetoUsuario)
    .done(function () {
      abrirNotificacion("Login correcto");
    })
    .fail(function () {
      abrirNotificacion("Login fallido");
    });
}

function registrarse() {
  window.location.replace("registro.html");
}

function toggleHamburguesa() {
  $(".menu-lateral__hamburguesa").html("");

  if (!$(".l-page").hasClass("l-page--con-sidebar")) {
    //abrir el menu lateral
    $(".l-page").removeClass("l-page--sin-sidebar");
    $(".l-page__menu-lateral").removeClass(
      "l-page__menu-lateral__animacion-cerrar"
    );
    $(".l-page__content").removeClass("l-page__content__animacion-sin-sidebar");

    $(".l-page").addClass("l-page--con-sidebar");
    $(".l-page__menu-lateral").addClass(
      "l-page__menu-lateral__animacion-abrir"
    );
    $(".l-page__content").addClass("l-page__content__animacion-con-sidebar");

    $(".menu-lateral__hamburguesa").html("<i class='fas fa-times'></i>");
  } else {
    //cerrar el menu lateral
    $(".l-page").removeClass("l-page--con-sidebar");
    $(".l-page__menu-lateral").removeClass(
      "l-page__menu-lateral__animacion-abrir"
    );
    $(".l-page__content").removeClass("l-page__content__animacion-con-sidebar");

    $(".l-page").addClass("l-page--sin-sidebar");
    $(".l-page__menu-lateral").addClass(
      "l-page__menu-lateral__animacion-cerrar"
    );
    $(".l-page__content").addClass("l-page__content__animacion-sin-sidebar");

    $(".menu-lateral__hamburguesa").html("<i class='fas fa-bars'></i>");
  }
}

function cargarCategorias() {
  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:8000/api/categorias"
  }).done(function (response) {
    console.log(response.mensaje);
    let html = "";
    html += "<div class='menu-lateral__contenedor-enlaces'>";
    response.data.forEach(element => {
      // html += "<div class='menu-lateral__item'><a href='#' class='menu-lateral__enlace'>" + element.nombre + "</a></div>"
      /* html +=
        "<a href='categorias/" +
        element.nombre +
        "'class='menu-lateral__enlace' id='" +
        element.id +
        "' onclick='cargarProductosCategoria(event, \"" +
        element.nombre +
        "\")'><i class='" +
        element.icono +
        " menu-lateral__icono'></i>" +
        element.nombre +
        "</a>"; */

      html +=
        "<a href='categorias/" +
        element.nombre +
        "'class='menu-lateral__enlace' id='" +
        element.id +
        "' onclick='openURL(this," + element.nombre + ")'><i class='" +
        element.icono +
        " menu-lateral__icono'></i>" +
        element.nombre +
        "</a>";
    });
    html += "<div>";

    $("#menu-lateral").append(html);
  });
}

function cargarImagenesCarousel() {
  console.log("entrado");
  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:8000/api/carousel"
  }).done(function (response) {
    console.log(response);
    console.log(response.mensaje);
    let html = "";
    let contador = 0;
    response.imagenes.forEach(element => {
      html +=
        "<div class='carousel-item " + (contador != 0 ? "" : "active") + "'>";
      html +=
        "<img class='d-block c-carousel__imagen' src='http://127.0.0.1:8000" +
        response.rutaServerImagenes +
        "/" +
        element +
        "'>";
      html += "</div>";
      contador++;
    });

    $("#carousel").append(html);
  });
}

function cargarRedesSociales() {
  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:8000/api/redessociales"
  }).done(function (response) {
    console.log(response.mensaje);
    let numRedes = response.data.length;
    let html = "";

    html +=
      "<div class='l-columnas l-columnas" +
      (numRedes <= 4 ? "--" + numRedes + "-columnas" : "--4-columnas") +
      "'>";
    response.data.forEach(element => {
      html +=
        "<a href='" +
        element.enlace +
        "' class='red'><i class='red__icono " +
        element.icono +
        "'></i>" +
        element.nombre +
        "</a>";
    });
    html += "</div>";
    $(".footer__enlaces").append(html);
  });
}

function cargarProductosCategoria(event, nombreCategoria) {
  event.stopPropagation();
  event.preventDefault();
  //nombreCategoria = $(elemento).attr('data-categoria');
  //let nombreCategoria = elemento;
  /*console.log('hola');
    console.log(nombreCategoria);
    console.log('adios');*/
  //let nombreCategoria = this;
  let url1 =
    "http://127.0.0.1:8000/api/categorias/" + nombreCategoria + "/productos";
  console.log("URL llamada: " + url1);
  $.ajax({
    type: "GET",
    url: url1
  }).done(function (response) {
    console.log("Consulta done");
    window.history.pushState(
      { categoria: nombreCategoria },
      nombreCategoria,
      nombreCategoria
    );
    console.log("productos");
    console.log(response);
    console.log(response.mensaje);
    let numRedes = response.data.length;
    let html =
      "<div class='l-columnas l-columnas--4-columnas'>"; /*div general que contenga todos los div de productos*/
    response.data.forEach(element => {
      console.log(element.id);
      html += "<div class='producto'>";
      html += "<img class='producto__imagen' src='http://127.0.0.1/api/'";
      html += "<div class='producto__nombre'>" + element.nombre + "</div>";
      html +=
        "<div class='producto__informacion'>" + element.descripcion + "</div>";
      html += "<div class='producto__precio'>" + element.precio + "€</div>";
      html += "</div>";
    });
    html += "</div>";
    $(".l-page__content").html("");
    $(".l-page__content").html(html);
  })
    .fail(function () {
      console.log("consulta fallida");
    });
}

function abrirNotificacion(mensaje) {
  console.log(mensaje);
  $("#notificacion").text(mensaje);
  $("#notificacion").addClass("notificacion--show");

  // After 3 seconds, remove the show class from DIV
  setTimeout(function () {
    $("#notificacion").removeClass("notificacion--show");
  }, 3000);
}

function openURL(href, nombreCategoria) {
  let link =
    "http://127.0.0.1:8000/api/categorias/" + nombreCategoria + "/productos";
  // var link = href;  //$(this).attr('href');                                    
  $.ajax({
    url: link,
    type: "GET",
  }).done(function (response) {
    console.log("hola soy response" + response);
    let html =
      "<div class='l-columnas l-columnas--4-columnas'>"; /*div general que contenga todos los div de productos*/
    response.data.forEach(element => {
      console.log(element.id);
      html += "<div class='producto'>";
      html += "<img class='producto__imagen' src='http://127.0.0.1/api/" + response.rutaServerImagenes + "/" + element.imagen + "'";
      html += "<div class='producto__nombre'>" + element.nombre + "</div>";
      html +=
        "<div class='producto__informacion'>" + element.descripcion + "</div>";
      html += "<div class='producto__precio'>" + element.precio + "€</div>";
      html += "</div>";
    });
    html += "</div>";

    $(".l-page__content").html("");
    $(".l-page__content").html(html);
  });
  window.history.pushState({ href: href }, '', href);
}

$(document).ready(function () {

  $(document).on('click', 'a', function () {
    openURL($(this).attr("href"));
    return false; //intercept the link
  });

  window.addEventListener('popstate', function (e) {
    if (e.state)
      openURL(e.state.href);
  });

});