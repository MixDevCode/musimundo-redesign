function generarBarras(data) {
  $("#cuota").text(
    `$${data.disponibleContadoMegatone.toLocaleString("es-ES", {
      minimumFractionDigits: 2,
    })}`
  );

  var cuotaBar = new ProgressBar.Circle("#progressCuota", {
    color: "#aaa",
    // This has to be the same size as the maximum width to
    // prevent clipping
    strokeWidth: 4,
    trailWidth: 1,
    easing: "easeInOut",
    duration: 1400,
    text: {
      autoStyleContainer: true,
    },
    from: { color: "#FFEA82" },
    to: { color: "#ED6A5A" },
    // Set default step function for all animate calls
    step: function (state, circle) {
      circle.path.setAttribute("stroke", state.color);
      circle.path.setAttribute("stroke-width", state.width);

      var value = Math.round(circle.value() * 100);
      if (value === 0) {
        circle.setText("");
      } else {
        circle.setText(value + "%");
      }
    },
  });

  cuotaBar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
  cuotaBar.text.style.fontSize = "2rem";

  cuotaBar.animate(data.disponibleContadoMegatone / data.limiteContadoMegatone); // Number from 0.0 to 1.0
  $("#credito").text(
    `$${data.disponibleCreditoMegatone.toLocaleString("es-ES", {
      minimumFractionDigits: 2,
    })}`
  );

  var bar = new ProgressBar.Circle("#progressCredito", {
    color: "#aaa",
    // This has to be the same size as the maximum width to
    // prevent clipping
    strokeWidth: 4,
    trailWidth: 1,
    easing: "easeInOut",
    duration: 1400,
    text: {
      autoStyleContainer: true,
    },
    from: { color: "#FFEA82" },
    to: { color: "#ED6A5A" },
    // Set default step function for all animate calls
    step: function (state, circle) {
      circle.path.setAttribute("stroke", state.color);
      circle.path.setAttribute("stroke-width", state.width);

      var value = Math.round(circle.value() * 100);
      if (value === 0) {
        circle.setText("");
      } else {
        circle.setText(value + "%");
      }
    },
  });
  bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
  bar.text.style.fontSize = "2rem";

  bar.animate(data.disponibleCreditoMegatone / data.limiteCreditoMegatone); // Number from 0.0 to 1.0
}

function generarSucursales(data) {
    const tableContainer = document.getElementById("table-container");
    if (!tableContainer) {
      console.error("No se encontró el contenedor de la tabla.");
      return;
    }
  
    // Crear tabla con Bootstrap
    const tableHTML = `
      <table class="table">
        <thead>
          <tr>
            <th>Provincia</th>
            <th>Dirección</th>
            <th>Localidad</th>
          </tr>
        </thead>
        <tbody id="tablaSucursalesBody">
          ${data.map(sucursal => `
            <tr>
              <td>${sucursal.prov}</td>
              <td>${sucursal.dir}</td>
              <td>${sucursal.loc}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  
    tableContainer.innerHTML = tableHTML;
  
    // Agregar funcionalidad de filtrado
    const filtroSucursales = document.getElementById("filtroSucursales");
    if (filtroSucursales) {
      filtroSucursales.addEventListener("input", function() {
        const filtro = this.value.toLowerCase();
        const filas = document.querySelectorAll("#tablaSucursalesBody tr");
  
        filas.forEach(fila => {
          const direccion = fila.querySelector("td:nth-child(2)").textContent.toLowerCase();
          const provincia = fila.querySelector("td:nth-child(1)").textContent.toLowerCase();
          const localidad = fila.querySelector("td:nth-child(3)").textContent.toLowerCase();
          if (direccion.includes(filtro) || provincia.includes(filtro) || localidad.includes(filtro)) {
            fila.style.display = "";
          } else {
            fila.style.display = "none";
          }
        });
      });
    }
}
function generarResumenes(data) {
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  data.forEach((resumen) => {
    $("#resumenes").append(`
          <tr>
            <td class="col-4">${meses[resumen.mes - 1]}</td>
            <td class="col-4">${resumen.anio}</td>
            <td class="col-4">
                <a href="${
                  resumen.resumenEncriptado
                }" class="btn btn-ms" target="_blank">Descargar</a>
            </td>
          </tr>`);
  });
}

function generarUltResumen(data) {
    $("#total").text(
        `$${data.monto.toFixed(2).toString().replace(".", ",")}`
      );
      $("#vencimiento").text(
        `Vencimiento: ${data.fechaVencimiento}`
      );
}

function establecerUsuario(data) {
    $("#user").text(`${data.firstName} ${data.lastName}`);
}


function establecerDatos(data) {
    $("#userProfile").text(`${data.user.firstName} ${data.user.lastName}`);
    $("#userEmail").text(data.user.email);
    $("#userPhone").text(data.user.phone);
    $("#userDNI").text(data.user.dni);
    $("#userAddress").text(`${data.calle}, ${data.localidad}, ${data.provincia}, ${data.codigoPostal}`);
}