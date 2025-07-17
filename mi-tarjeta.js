class MiTarjeta extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }); // Encapsula estilos con Shadow DOM
  }

  connectedCallback() {
    const titulo = this.getAttribute('titulo') || 'Título por defecto';
    const contenido = this.getAttribute('contenido') || 'Contenido por defecto';
    const imagen = this.getAttribute('imagen');

    this.shadowRoot.innerHTML = `
      <style>
        .tarjeta {
          border: 2px solid #ccc;
          border-radius: 1rem;
          padding: 1rem;
          max-width: 300px;
          font-family: sans-serif;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .tarjeta img {
          max-width: 100%;
          border-radius: 0.5rem;
        }
        .tarjeta h3 {
          margin: 0.5rem 0;
        }
      </style>
      <div class="tarjeta">
        ${imagen ? `<img src="${imagen}" alt="Imagen" />` : ''}
        <h3>${titulo}</h3>
        <p>${contenido}</p>
      </div>
    `;
  }
}

customElements.define('mi-tarjeta', MiTarjeta);
