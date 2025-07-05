// Importamos jsPDF desde la ventana global
const { jsPDF } = window.jspdf;

// Seleccionamos los elementos principales del DOM
const formulario = document.getElementById('formulario-factura');
const vistaPrevia = document.getElementById('vista-previa-factura');
const contenidoFactura = document.getElementById('contenido-factura');
const botonDescargar = document.getElementById('boton-descargar-pdf');
const conceptosContainer = document.getElementById('conceptos-container');
const botonAgregarConcepto = document.getElementById('agregar-concepto');

let textoFacturaActual = '';

// Función para calcular el total de un concepto (cantidad * precio)
function calcularTotalConcepto(row) {
    const cantidad = parseFloat(row.querySelector('.cantidadConcepto').value) || 0;
    const precio = parseFloat(row.querySelector('.precioConcepto').value) || 0;

    const total = cantidad * precio;
    row.querySelector('.totalConcepto').value = total.toFixed(2);
}

// Añadimos eventos a las filas de concepto para calcular total al cambiar valores
function agregarEventosCalculo(row) {
    const inputs = row.querySelectorAll('.cantidadConcepto, .precioConcepto');
    inputs.forEach(input => {
        input.addEventListener('input', () => calcularTotalConcepto(row));
    });
}

// Inicializamos eventos para la fila original
document.querySelectorAll('.concepto-row').forEach(row => agregarEventosCalculo(row));

// Agregar nueva fila concepto al pulsar el botón
botonAgregarConcepto.addEventListener('click', () => {
    const primeraFila = conceptosContainer.querySelector('.concepto-row');
    const nuevaFila = primeraFila.cloneNode(true);

    // Limpiar inputs
    nuevaFila.querySelectorAll('input').forEach(input => {
        input.value = '';
    });

    conceptosContainer.appendChild(nuevaFila);
    agregarEventosCalculo(nuevaFila);
});

// Generar texto de la factura para vista previa
function generarTextoFactura(datosEmpresa, datosCliente, conceptos, fecha) {
    let texto = `Factura Simple\nFecha: ${fecha}\n\n`;

    texto += `De:\n${datosEmpresa.nombre}\nNIF: ${datosEmpresa.nif}\nDirección: ${datosEmpresa.direccion}, ${datosEmpresa.cp}, ${datosEmpresa.ciudad}, ${datosEmpresa.provincia}\nTel: ${datosEmpresa.telefono}\nEmail: ${datosEmpresa.email}\n\n`;

    texto += `Para:\n${datosCliente.nombre}\nDNI/NIF: ${datosCliente.dni}\nDirección: ${datosCliente.direccion}, ${datosCliente.cp}, ${datosCliente.ciudad}, ${datosCliente.provincia}\nTel: ${datosCliente.telefono}\nEmail: ${datosCliente.email}\n\n`;

    texto += 'Conceptos:\n';

    conceptos.forEach((c, i) => {
        texto += `${i + 1}. ${c.nombre} - Cantidad: ${c.cantidad}, Precio: $${c.precio.toFixed(2)}, Total: $${c.total.toFixed(2)}\n`;
    });

    const sumaTotal = conceptos.reduce((acc, c) => acc + c.total, 0);

    texto += `\nTotal Factura: $${sumaTotal.toFixed(2)} USD\n\nGracias por su preferencia.\n`;

    return texto;
}

// Manejo del envío del formulario
formulario.addEventListener('submit', (e) => {
    e.preventDefault();

    // Datos empresa
    const datosEmpresa = {
        nombre: document.getElementById('nombreFreelancer').value.trim(),
        nif: document.getElementById('nifFreelancer').value.trim(),
        direccion: document.getElementById('direccionFreelancer').value.trim(),
        cp: document.getElementById('cpFreelancer').value.trim(),
        ciudad: document.getElementById('ciudadFreelancer').value.trim(),
        provincia: document.getElementById('provinciaFreelancer').value.trim(),
        telefono: document.getElementById('telefonoFreelancer').value.trim(),
        email: document.getElementById('correoFreelancer').value.trim()
    };

    // Datos cliente
    const datosCliente = {
        nombre: document.getElementById('nombreCliente').value.trim(),
        dni: document.getElementById('dniCliente').value.trim(),
        direccion: document.getElementById('direccionCliente').value.trim(),
        ciudad: document.getElementById('ciudadCliente').value.trim(),
        provincia: document.getElementById('provinciaCliente').value.trim(),
        cp: document.getElementById('cpCliente').value.trim(),
        telefono: document.getElementById('telefonoCliente').value.trim(),
        email: document.getElementById('correoCliente').value.trim()
    };

    // Validar campos básicos empresa y cliente
    for (const key in datosEmpresa) {
        if (!datosEmpresa[key]) {
            alert('Por favor, rellena todos los campos de la empresa correctamente.');
            return;
        }
    }
    for (const key in datosCliente) {
        if (!datosCliente[key]) {
            alert('Por favor, rellena todos los campos del cliente correctamente.');
            return;
        }
    }

    // Recopilar conceptos
    const filasConcepto = conceptosContainer.querySelectorAll('.concepto-row');
    const conceptos = [];

    for (const fila of filasConcepto) {
        const nombre = fila.querySelector('.nombreConcepto').value.trim();
        const cantidad = parseFloat(fila.querySelector('.cantidadConcepto').value);
        const precio = parseFloat(fila.querySelector('.precioConcepto').value);
        const total = parseFloat(fila.querySelector('.totalConcepto').value);

        if (!nombre || isNaN(cantidad) || isNaN(precio) || isNaN(total)) {
            alert('Por favor, rellena correctamente todos los campos de los conceptos.');
            return;
        }

        conceptos.push({ nombre, cantidad, precio, total });
    }

    if (conceptos.length === 0) {
        alert('Agrega al menos un concepto.');
        return;
    }

    // Fecha actual
    const fechaActual = new Date().toLocaleDateString();

    // Generar texto para vista previa
    textoFacturaActual = generarTextoFactura(datosEmpresa, datosCliente, conceptos, fechaActual);

    // Mostrar vista previa
    contenidoFactura.textContent = textoFacturaActual;
    vistaPrevia.classList.remove('hidden');
});

// Descargar PDF con tabla usando jsPDF y autotable
botonDescargar.addEventListener('click', () => {
    if (!textoFacturaActual) {
        alert('Genera primero la factura antes de descargar.');
        return;
    }

    const doc = new jsPDF();

    // Datos empresa
    const datosEmpresa = {
        nombre: document.getElementById('nombreFreelancer').value.trim(),
        nif: document.getElementById('nifFreelancer').value.trim(),
        direccion: document.getElementById('direccionFreelancer').value.trim(),
        cp: document.getElementById('cpFreelancer').value.trim(),
        ciudad: document.getElementById('ciudadFreelancer').value.trim(),
        provincia: document.getElementById('provinciaFreelancer').value.trim(),
        telefono: document.getElementById('telefonoFreelancer').value.trim(),
        email: document.getElementById('correoFreelancer').value.trim()
    };

    // Datos cliente
    const datosCliente = {
        nombre: document.getElementById('nombreCliente').value.trim(),
        dni: document.getElementById('dniCliente').value.trim(),
        direccion: document.getElementById('direccionCliente').value.trim(),
        ciudad: document.getElementById('ciudadCliente').value.trim(),
        provincia: document.getElementById('provinciaCliente').value.trim(),
        cp: document.getElementById('cpCliente').value.trim(),
        telefono: document.getElementById('telefonoCliente').value.trim(),
        email: document.getElementById('correoCliente').value.trim()
    };

    // Recopilar conceptos
    const filasConcepto = conceptosContainer.querySelectorAll('.concepto-row');
    const conceptos = [];

    for (const fila of filasConcepto) {
        const nombre = fila.querySelector('.nombreConcepto').value.trim();
        const cantidad = parseFloat(fila.querySelector('.cantidadConcepto').value);
        const precio = parseFloat(fila.querySelector('.precioConcepto').value);
        const total = parseFloat(fila.querySelector('.totalConcepto').value);

        conceptos.push({ nombre, cantidad, precio, total });
    }

    // Escribimos encabezados
    doc.setFontSize(18);
    doc.text('Factura Simple', 14, 20);
    doc.setFontSize(11);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 28);

    // Datos empresa
    doc.setFontSize(12);
    doc.text('De:', 14, 38);
    doc.setFontSize(10);
    doc.text(`${datosEmpresa.nombre}`, 14, 44);
    doc.text(`NIF: ${datosEmpresa.nif}`, 14, 50);
    doc.text(`Dirección: ${datosEmpresa.direccion}, ${datosEmpresa.cp}, ${datosEmpresa.ciudad}, ${datosEmpresa.provincia}`, 14, 56);
    doc.text(`Tel: ${datosEmpresa.telefono}`, 14, 62);
    doc.text(`Email: ${datosEmpresa.email}`, 14, 68);

    // Datos cliente
    doc.setFontSize(12);
    doc.text('Para:', 14, 78);
    doc.setFontSize(10);
    doc.text(`${datosCliente.nombre}`, 14, 84);
    doc.text(`DNI/NIF: ${datosCliente.dni}`, 14, 90);
    doc.text(`Dirección: ${datosCliente.direccion}, ${datosCliente.cp}, ${datosCliente.ciudad}, ${datosCliente.provincia}`, 14, 96);
    doc.text(`Tel: ${datosCliente.telefono}`, 14, 102);
    doc.text(`Email: ${datosCliente.email}`, 14, 108);

    // Tabla conceptos
    const startY = 115;
    const columns = [
        { header: 'Concepto', dataKey: 'nombre' },
        { header: 'Cantidad', dataKey: 'cantidad' },
        { header: 'Precio', dataKey: 'precio' },
        { header: 'Total', dataKey: 'total' },
    ];

    const rows = conceptos.map(c => ({
        nombre: c.nombre,
        cantidad: c.cantidad.toString(),
        precio: `$${c.precio.toFixed(2)}`,
        total: `$${c.total.toFixed(2)}`
    }));

    doc.autoTable({
        startY: startY,
        head: [columns.map(c => c.header)],
        body: rows.map(r => columns.map(c => r[c.dataKey])),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [22, 160, 133] },
        theme: 'grid',
    });

    // Sumar total factura
    const sumaTotal = conceptos.reduce((acc, c) => acc + c.total, 0);
    const finalY = doc.lastAutoTable.finalY || startY + 40;

    doc.setFontSize(12);
    doc.text(`Total Factura: $${sumaTotal.toFixed(2)} USD`, 14, finalY + 10);
    doc.setFontSize(10);
    doc.text('Gracias por su preferencia.', 14, finalY + 20);

    // Guardar PDF
    doc.save('factura.pdf');
});


