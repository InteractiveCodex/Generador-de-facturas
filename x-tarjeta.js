class XTarjeta extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const avatar = this.getAttribute('avatar');
    const titulo = this.getAttribute('titulo') || 'Título';
    const subtitulo = this.getAttribute('subtitulo') || 'subtitulo.com';
    const contenido = this.getAttribute('contenido') || 'Texto de contenido...';
    const enlace = this.getAttribute('enlace') || '#';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --color-borde: #e5e7eb;
          --color-fondo: #fff;
          --color-texto: #111827;
          --color-secundario: #6b7280;
          --radius: 1rem;
          --sombra: 0 4px 14px rgba(0,0,0,0.05);
          font-family: sans-serif;
        }

        .card {
          border: 1px solid var(--color-borde);
          background: var(--color-fondo);
          border-radius: var(--radius);
          max-width: 400px;
          box-shadow: var(--sombra);
          overflow: hidden;
        }

        .header, .footer {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
        }

        .body {
          padding: 1rem;
        }

        img.avatar {
          width: 40px;
          height: 40px;
          border-radius: 0.5rem;
        }

        .titulo {
          font-size: 1rem;
          margin: 0;
          color: var(--color-texto);
        }

        .subtitulo {
          font-size: 0.875rem;
          color: var(--color-secundario);
          margin: 0;
        }

        .divider {
          height: 1px;
          background: var(--color-borde);
          margin: 0;
        }

        a {
          color: #2563eb;
          text-decoration: none;
          font-size: 0.875rem;
        }

        a:hover {
          text-decoration: underline;
        }
      </style>

      <div class="card">
        <div class="header">
          <img class="avatar" src="${avatar}" alt="Avatar" />
          <div>
            <p class="titulo">${titulo}</p>
            <p class="subtitulo">${subtitulo}</p>
          </div>
        </div>

        <div class="divider"></div>

        <div class="body">
          <p>${contenido}</p>
        </div>

        <div class="divider"></div>

        <div class="footer">
          <a href="${enlace}" target="_blank" rel="noopener">Ver código en GitHub</a>
        </div>
      </div>
    `;
  }
}

customElements.define('x-tarjeta', XTarjeta);
