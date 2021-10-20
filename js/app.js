// Objeto principal
let cliente = {
  mesa: '',
  hora: '',
  pedido: []
};

let empleado = {
  noEmpleado: null,
  id: null
}

let venta = { 
  noEmpleado:  null,
  propina: null,
  observacion: null,
  pedido: null
}

const categorias = {
  1: 'Comidas',
  2: 'Bebidas',
  3: 'Postres'
}

const btnGuardarCliente = document.querySelector('#guardar-cliente');
btnGuardarCliente.addEventListener('click', guardarCliente);

function guardarCliente() {
  // console.log('Desde la función')
  const noEmpleado = document.querySelector('#noEmpleado').value;
  const mesa = document.querySelector('#mesa').value;
  const hora = document.querySelector('#hora').value;

  // Revisar si hay campos vacíos
  const camposVacios = [mesa, hora, noEmpleado].some(campo => campo === '');

  if (camposVacios) {
    // console.log('Si hay al menos un campos vacíos');
    const existeAlerta = document.querySelector('.invalid-feedback');

    if (!existeAlerta) {
      const alerta = document.createElement('div');
      alerta.classList.add('invalid-feedback', 'd-block', 'text-center');
      alerta.textContent = 'Todos los campos son obligatorios';

      document.querySelector('.modal-body form').appendChild(alerta);

      setTimeout(() => {
        alerta.remove();
      }, 3000)
    }
    return; // Detén la ejecución del código
  }
  // Asigna datos del formulario a cliente
  cliente = { ...cliente, mesa, hora };
  // Asigna número de empleado a objeto empleado
  empleado = { ...empleado, noEmpleado }

  // console.log(cliente);
  // Ocultar modal
  const modalFormulario = document.querySelector('#formulario');
  const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
  // Se debe obtener la instancia del modal de bootstrap
  modalBootstrap.hide();

  // Mostrar las secciones
  mostrarSecciones();
  // Obtener plantillos
  obtenerPlatillos();
}

function mostrarPlatillos(platillos) {
  const contenido = document.querySelector('#platillos .contenido');

  platillos.forEach(platillo => {
    const row = document.createElement('div');
    row.classList.add('row', 'py-3', 'border-top');

    const nombre = document.createElement('div');
    nombre.classList.add('col-md-4');
    nombre.textContent = platillo.nombre;

    const precio = document.createElement('div');
    precio.classList.add('col-md-3', 'fw-bold');
    precio.textContent = `$${platillo.precio}`;

    const categoria = document.createElement('div');
    categoria.classList.add('col-md-3');
    categoria.textContent = categorias[platillo.categoria];

    const inputCantidad = document.createElement('input');
    inputCantidad.type = 'number';
    inputCantidad.min = 0;
    inputCantidad.value = 0;
    inputCantidad.id = `producto-${platillo.id}`;
    inputCantidad.classList.add('form-control');

    // Funcion que detecta cantidad y platillo agregado
    // Es como agrega un eventListener
    inputCantidad.onchange = function() { 
      // console.log(platillo);
      const cantidad = parseInt( inputCantidad.value ); // Aquí recuperamos la cantidad
      agregarPlatillo({...platillo, cantidad}); // Con las llaves se convierte en objeto 
    };

    const agregar = document.createElement('div');
    agregar.classList.add('col-md-2');

    agregar.appendChild(inputCantidad);

    row.appendChild(nombre);
    row.appendChild(precio);
    row.appendChild(categoria);
    row.appendChild(agregar);
    contenido.appendChild(row);
  })
}

function agregarPlatillo(producto) {
  // console.log('Producto actualizado ' + producto);
  // Solo recibo el ultimo agregado
  let { pedido } = cliente;

  // Revisar que la cantidad sea mayor a cero
  if(producto.cantidad > 0) {

    // Validar si ya existe suma la cantidad
    if(!pedido.some( platillo => platillo.id === producto.id )) {

      cliente.pedido = [...pedido, producto];

    }else {
      // Actualizar la cantidad
      const pedidoActualizado = pedido.map( platillo => {

        if(platillo.id === producto.id) {
          platillo.cantidad = producto.cantidad;
        }
        return platillo; 
      });
      
      // Reescribimos el arreglo de pedido
      cliente.pedido = [...pedidoActualizado];
    }

  }else {
    // console.log('No hay elementos en pedidos');
    const resultado = pedido.filter( articulo => articulo.id !== producto.id);
    cliente.pedido = [...resultado];
  }

  console.log(cliente.pedido);
  //Limpiar codigo HTML previo
  limpiarResumenHTML();

  if(!cliente.pedido.length > 0) {
    creaMensajeAgregaProductos();
  }else {
    // Mostrar resumen
    actualizarResumen();
  }
 
}

function actualizarResumen() {
  const contenido = document.querySelector('#resumen .contenido');

  const resumen = document.createElement('div');
  resumen.classList.add('col-md-6');

  const innerResumen = document.createElement('div');
  innerResumen.classList.add('card', 'py-2','px-3','shadow');
  
  resumen.appendChild(innerResumen);

  // Num Empleado
  const noEmpleado = document.createElement('p');
  noEmpleado.textContent = 'No Empleado: ';
  noEmpleado.classList.add('fw-bold');

  const noEmplSpan = document.createElement('span');
  noEmplSpan.textContent = cliente.noEmpleado;
  noEmplSpan.classList.add('fw-normal');

  // Informacion mesa
  const mesa = document.createElement('p');
  mesa.textContent = 'Mesa: ';
  mesa.classList.add('fw-bold');

  const mesaSpan = document.createElement('span');
  mesaSpan.textContent = cliente.mesa;
  mesaSpan.classList.add('fw-normal');

  // Informacion hora
  const hora = document.createElement('p');
  hora.textContent = 'Hora: ';
  hora.classList.add('fw-bold');

  const horaSpan = document.createElement('span');
  horaSpan.textContent = cliente.hora;
  horaSpan.classList.add('fw-normal');

  noEmpleado.appendChild(noEmplSpan);
  mesa.appendChild(mesaSpan);
  hora.appendChild(horaSpan);

  // Título de la sección
  const heading = document.createElement('h3');
  heading.textContent = 'Paltillos consumidos'
  heading.classList.add('my-4','text-center');

  // Iterar array de pedidos y crear elementos
  const grupo = document.createElement('ul');
  grupo.classList.add('list-group');

  const { pedido } = cliente;
  pedido.forEach( articulo => {
    const { nombre, cantidad, precio, id } = articulo;

    const lista = document.createElement('li');
    lista.classList.add('list-group-item');

    const nombreEl = document.createElement('h4');
    nombreEl.classList.add('my-4');
    nombreEl.textContent = nombre;

    // Cantidad del articulo
    const cantidadEl = document.createElement('p');
    cantidadEl.classList.add('fw-bold');
    cantidadEl.textContent = 'Cantidad: ';

    const cantidadSpan = document.createElement('span');
    cantidadSpan.textContent = cantidad;
    cantidadSpan.classList.add('fw-normal');

    // Precio del articulo
    const precioEl = document.createElement('p');
    precioEl.classList.add('fw-bold');
    precioEl.textContent = 'Precio: ';

    const precioSpan = document.createElement('span');
    precioSpan.textContent = `$${precio}`;
    precioSpan.classList.add('fw-normal');

    // Subtotal del articulo
    const subtotalEl = document.createElement('p');
    subtotalEl.classList.add('fw-bold');
    subtotalEl.textContent = 'Subtotal: ';

    const subtotalSpan = document.createElement('span');
    subtotalSpan.textContent = calcularSubtotal(precio,cantidad);
    subtotalSpan.classList.add('fw-normal');

    // Botón eliminar
    const btnEliminar = document.createElement('button');
    btnEliminar.classList.add('btn','btn-danger');
    btnEliminar.textContent = 'Eliminar pedido';

    // Funcion eliinar pedido
    // Debe pasar como callback si no lo ejecuta inmediatamente
    btnEliminar.onclick = function() {
      eliminarProducto(id);
    }

    cantidadEl.appendChild(cantidadSpan);
    precioEl.appendChild(precioSpan);
    subtotalEl.appendChild(subtotalSpan);

    // Agregar elementos al ul
    lista.append(nombreEl);
    lista.appendChild(cantidadEl);
    lista.appendChild(precioEl);
    lista.appendChild(subtotalEl);
    lista.appendChild(btnEliminar);

    grupo.appendChild(lista);
  })


  innerResumen.appendChild(heading);
  innerResumen.appendChild(noEmpleado);
  innerResumen.appendChild(mesa);
  innerResumen.appendChild(hora);
  innerResumen.appendChild(grupo);

  contenido.appendChild(resumen);

  // Mostrar formulario de propinas
  mostrarFormularioPropinas();
}

function mostrarFormularioPropinas() {
  const contenido = document.querySelector('#resumen .contenido');
  
  const formularioDiv = document.createElement('div');
  formularioDiv.classList.add('col-md-6','formulario');

  const innerDivForm = document.createElement('div');
  innerDivForm.classList.add('py-2','shadow','px-3','card');

  const heading = document.createElement('h3');
  heading.classList.add('my-4','text-center');
  heading.textContent = 'Propina: ';

  // Crear radio button
  const radio10 = document.createElement('input');
  radio10.type = 'radio';
  radio10.name = 'propina';
  radio10.value = "10";
  radio10.classList.add('form-check-input');
  radio10.onclick = calcularPropina;

  const radio10Label = document.createElement('label');
  radio10Label.textContent = '10%';
  radio10Label.classList.add('form-check-label');

  const radio10Div = document.createElement('div');
  radio10Div.classList.add('form-check');

  radio10Div.appendChild(radio10);
  radio10Div.appendChild(radio10Label);
  // 15%
  const radio15 = document.createElement('input');
  radio15.type = 'radio';
  radio15.name = 'propina';
  radio15.value = "15";
  radio15.classList.add('form-check-input');
  radio15.onclick = calcularPropina;

  const radio15Label = document.createElement('label');
  radio15Label.textContent = '15%';
  radio15Label.classList.add('form-check-label');

  const radio15Div = document.createElement('div');
  radio15Div.classList.add('form-check');
  // 20 %
  const radio20 = document.createElement('input');
  radio20.type = 'radio';
  radio20.name = 'propina';
  radio20.value = "20";
  radio20.classList.add('form-check-input');
  radio20.onclick = calcularPropina;

  const radio20Label = document.createElement('label');
  radio20Label.textContent = '20%';
  radio20Label.classList.add('form-check-label');

  const radio20Div = document.createElement('div');
  radio20Div.classList.add('form-check');

  radio10Div.appendChild(radio10);
  radio10Div.appendChild(radio10Label);

  radio15Div.appendChild(radio15);
  radio15Div.appendChild(radio15Label);

  radio20Div.appendChild(radio20);
  radio20Div.appendChild(radio20Label);
  // Div Principal
  innerDivForm.appendChild(heading);

  innerDivForm.appendChild(radio10Div);
  innerDivForm.appendChild(radio15Div);
  innerDivForm.appendChild(radio20Div);


  formularioDiv.appendChild(innerDivForm);
  
  contenido.appendChild(formularioDiv);
}

function eliminarProducto(id) {
  const { pedido } = cliente; 

  const resultado = pedido.filter( articulo => articulo.id !== id);
  cliente.pedido = [...resultado];

  //Limpiar codigo HTML previo
  limpiarResumenHTML();

  if(!cliente.pedido.length > 0) {
    creaMensajeAgregaProductos();
  }else {
    // Mostrar resumen
    actualizarResumen();
  }

  const productoIdString = `#producto-${id}`;
  const productoListSelector = document.querySelector(productoIdString);
  productoListSelector.value = 0;
}

function creaMensajeAgregaProductos() {
  const contenido = document.querySelector('#resumen .contenido'); 

  const agregaMensaje = document.createElement('p');
  agregaMensaje.classList.add('text-center');
  agregaMensaje.textContent = 'Añade los elementos del pedido';

  contenido.appendChild(agregaMensaje);
}

function calcularPropina() {
  
  const { pedido } = cliente;
  let subtotal = 0;

  // Calcula subtotal a pagar
  pedido.forEach( pedido => {
    subtotal += pedido.precio * pedido.cantidad;
  })
  // Selecciona radio button de propina
  const propinaSelected = document.querySelector('[name="propina"]:checked').value;
  
  // Propina 
  const propina = ((subtotal * parseInt(propinaSelected))/100);

  venta.propina = propina;
  // console.log(propina);

  // Total a Pagar
  const total = subtotal + propina;

  mostrarTotalHTMl(subtotal, total, propina);
}

function mostrarTotalHTMl(subtotal, total, propina) {
  
  const divTotales = document.createElement('div');
  divTotales.classList.add('total-pagar');
  
  // Subtotal
  const subtotalParrafo = document.createElement('p');
  subtotalParrafo.classList.add('fs-4','fw-bold','mt-2');
  subtotalParrafo.textContent = 'Subtotal: ';

  const subtotalSpan = document.createElement('span');
  subtotalSpan.classList.add('fw-normal');
  subtotalSpan.textContent = `$${subtotal}`;

  subtotalParrafo.appendChild(subtotalSpan);
  // Propina
  const propinaParr = document.createElement('p');
  propinaParr.classList.add('fs-4','fw-bold','mt-2');
  propinaParr.textContent = 'Propina: ';

  const propinaSpan = document.createElement('span');
  propinaSpan.classList.add('fw-normal');
  propinaSpan.textContent = `$${propina}`;

  propinaParr.appendChild(propinaSpan);
  // Total
  const totalParr = document.createElement('p');
  totalParr.classList.add('fs-4','fw-bold','mt-2');
  totalParr.textContent = 'Total a pagar: ';

  const totalSpan = document.createElement('span');
  totalSpan.classList.add('fw-normal');
  totalSpan.textContent = `$${total}`;

  totalParr.appendChild(totalSpan);

  //Agrega botón de guardar
  const btnGuardarVenta = document.createElement('button');
  btnGuardarVenta.classList.add('btn','btn-sm','btn-success');
  btnGuardarVenta.textContent = 'Guardar Venta';

  btnGuardarVenta.onclick = function() {
    salvarVenta();
  } 

  // Elimina ultimo resultado
  const totalPagarDiv = document.querySelector('.total-pagar');

  if(totalPagarDiv){
    totalPagarDiv.remove();
  }

  divTotales.appendChild(subtotalParrafo);
  divTotales.appendChild(propinaParr);
  divTotales.appendChild(totalParr);
  divTotales.appendChild(btnGuardarVenta);

  const formulario = document.querySelector('.formulario > div');
  formulario.appendChild(divTotales);

}

function calcularSubtotal(precio, cantidad) {
  return `$${precio * cantidad}`;
}

function limpiarResumenHTML() {
  const contenido = document.querySelector('#resumen .contenido');
  while(contenido.firstChild) {
    contenido.removeChild(contenido.firstChild);
  }
}

function mostrarSecciones() {
  const seccionesocultas = document.querySelectorAll('.d-none');
  seccionesocultas.forEach(seccion => seccion.classList.remove('d-none'));
}

function obtenerPlatillos() {

  // const url = 'http://localhost:4000/platillos'
  const url = 'http://localhost:8080/restcv/v1/platillos';

  fetch(url)
    .then(respuesta => respuesta.json())
    .then(resultado => mostrarPlatillos(resultado))
    .catch(error => console.log(error));

}

function salvarVenta() {
  // console.log('Salvando la venta...');

  var url = 'http://localhost:8080/restcv/api/venta';
  venta = { 
    noEmpleado:  empleado.noEmpleado,
    observacion: '',
    pedido: cliente.pedido
  }

  console.log(venta);
  
  fetch(url, {
    method: 'POST', // or 'PUT'
    body: JSON.stringify(venta), // data can be `string` or {object}!
    headers:{
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())
  .catch(error => console.error('Error:', error))
  .then(response => console.log('Success:', response));

}