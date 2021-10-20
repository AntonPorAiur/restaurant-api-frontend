
document.addEventListener('DOMContentLoaded', () => {
    obtenerClientes();
});

function obtenerClientes() {

  const url = 'http://localhost:8080/restcv/v1/empleados';

  fetch(url)
  .then( response => response.json() )
  .then( resultado => imprimirEmpleados(resultado) )

}

function imprimirEmpleados(emlpleados) {

  const listadoEmpleados = document.querySelector('#listado-empleados');

  emlpleados.forEach( empleado => {

    const { nombre, apellido, noEmpleado, fechaCreado, id} = empleado;

    listadoEmpleados.innerHTML += `
      <tr>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} ${apellido} </p>
          </td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
              <p class="text-gray-700">${noEmpleado}</p>
          </td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
              <p class="text-gray-600">${fechaCreado}</p>
          </td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
              <a href="ventas-empleado.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Ventas</a>
              <a href="editar-empleado.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
              <a href="#" data-empleado="${id}" class="text-red-600 hover:text-red-900">Borrar</a>
          </td>
      </tr>
      `;
  })
  
}