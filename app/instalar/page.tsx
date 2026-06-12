export default function InstallPage() {
  return (
    <section className="screen">
      <header className="page-header">
        <div className="section-label">App móvil</div>
        <h1>Instalar</h1>
        <p>Añade Mundial 2026 a la pantalla de inicio y ábrela como una app.</p>
      </header>

      <div className="install-hero-card">
        <img src="/icon-192.png" alt="Icono Mundial 2026" className="install-icon" />
        <div>
          <h2>Mundial 2026</h2>
          <p>Clasificación, calendario y quinielas siempre a mano.</p>
        </div>
      </div>

      <section className="install-section">
        <h2>iPhone / iPad</h2>
        <ol className="install-steps">
          <li>Abre esta web en Safari.</li>
          <li>Toca compartir.</li>
          <li>Elige “Añadir a pantalla de inicio”.</li>
          <li>Confirma con “Añadir”.</li>
        </ol>
      </section>

      <section className="install-section">
        <h2>Android</h2>
        <ol className="install-steps">
          <li>Abre esta web en Chrome.</li>
          <li>Toca el menú de tres puntos.</li>
          <li>Elige “Instalar aplicación” o “Añadir a pantalla de inicio”.</li>
          <li>Confirma.</li>
        </ol>
      </section>
    </section>
  );
}
