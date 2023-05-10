import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.5/+esm';

async function getData() {
    await axios.get("https://projects-back.up.railway.app/api/mindy")
      .then(response => {

        let articulos = response.data.res
        let cardContainer = document.getElementById("card-container");
        
      let checkbox = document.getElementById("checkbox");
      let inputSearch = document.getElementById("js-search");
  
      let check = [];
  
      let toyFilt = articulos.filter(art => art.tipo.includes("Juguete"));
      filterSearch(check);
  
      checkbox.addEventListener("change", filterSearch);
      inputSearch.addEventListener("keyup", filterSearch);
      
      function filterSearch(checkItem) {
        let filterchecked = [];
        checkItem = [...document.querySelectorAll('input[type="checkbox"]:checked')].map(element => element.value);
  
        if (checkItem.length == 0) {
          filterchecked = [...toyFilt];
        } else {
          checkItem.forEach(value => {
            if (value == "barato") {
              filterchecked = filterchecked.concat(toyFilt.filter(juguete => juguete.precio < 400));
            } else if (value == "medio") {
              filterchecked = filterchecked.concat(
                toyFilt.filter(juguete => juguete.precio >= 400 && juguete.precio <= 700)
              );
            } else if (value == "caro") {
              filterchecked = filterchecked.concat(toyFilt.filter(juguete => juguete.precio >= 700));
            }
          });
        }
  
        let filterText = filterchecked.filter(text =>
          text.nombre.toLowerCase().includes(inputSearch.value.toLowerCase())
        );
  
        cleanDom(cardContainer);
  
        filterText.sort((element1, element2) => element1.stock - element2.stock);
        let carrito = localStorage.getItem("carrito");
        if (!carrito) {
          carrito = [];
        } else {
          carrito = JSON.parse(carrito);
        }
  
        filterText.forEach(card => {
          let estaEnCarrito = carrito.findIndex(juguete => juguete._id == card._id) != -1;
          makeCards(card, cardContainer, estaEnCarrito);
        });
        
        if(!filterText.length) {
          cardContainer.innerHTML = `
          <h2 class="text-danger w-100 bg-white">
          No se pudo encontrar productos con los filtros establecidos, guau. Por favor, utilice otros filtros, guau.
          </h2>`
        }
  
        let elementoProducto = document.querySelectorAll(".js-card");
        elementoProducto.forEach(elemento => {
          elemento.addEventListener("click", event => {
            let target = event.currentTarget;
            let juguete = toyFilt.find(juguete => juguete._id === target.id);
            let carrito = localStorage.getItem("carrito");
  
            if (!carrito) {
              carrito = [];
            } else {
              carrito = JSON.parse(carrito);
            }
            console.log(carrito);
            if (carrito.findIndex(producto => producto._id === juguete._id) == -1) {
              carrito.push(juguete);
  
              localStorage.setItem("carrito", JSON.stringify(carrito));
  
              let boton = document.getElementById(`btn-carrito-${juguete._id}`);
  
              boton.classList.add("btn-success");
              boton.innerText = "Agregado a Carrito";
  
              Swal.fire({
                icon: 'success',
                title: '¡Guau!',
                text: 'El producto se agregó correctamente al carrito',
                footer: '<a href="./carrito.html">Ver mi compra...</a>'
              })
            }
          });
        });
      }
  
      function cleanDom(contain) {
        contain.innerHTML = "";
      }
  
      function makeCards(data, container, enCarrito) {
        container.innerHTML += `
            <div class="col flex-wrap">
              <div class="card h-100 m-auto js-card" id="${data._id}">
                <img src="${data.imagen}">
                  <div class="card-body d-flex flex-column justify-content-around ">
                  <h5 class="card-title">${data.nombre}</h5>
                  <div class="d-flex justify-content-center w-100">
                  <div class="p-2 border border-info rounded-pill my-2">Precio: $${data.precio}</div>
                  </div>
                  <i href="#" id="btn-carrito-${
                    data._id
                  }" class="border border-info rounded-pill text-center btn btn-cart fa-solid fa-cart-shopping ${
          enCarrito ? "btn-success" : ""
        }"> ${enCarrito ? "Agregado a Carrito" : "Agregar Carrito"}</i>
                </div>
                ${data.stock <= 3 ? `<div class="w-100 text-white bg-danger">¡Últimos productos!</div>` : ""}
              </div> 
            </div>
        `;
      }
      })
    .catch(err => {
      console.log(err);
    })
}
getData();
