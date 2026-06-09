import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const VideoGalleryLayout = ({ tipo, titulo }) => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [filters, setFilters] = useState({});
  const [filterOptions, setFilterOptions] = useState({});
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const getDriveID = useCallback((url) => {
    if (!url || typeof url !== 'string' || url.trim() === '') return null;
    const match = url.match(/(?:\/d\/|id=)([-\w]{25,})/);
    return match ? match[1] : null;
  }, []);

  const getEmbedUrl = useCallback((url) => {
    const id = getDriveID(url);
    return id ? `https://drive.google.com/file/d/${id}/preview` : null;
  }, [getDriveID]);

  const getThumbnailUrl = useCallback((url) => {
    const id = getDriveID(url);
    return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w400` : "https://via.placeholder.com/400x225?text=No+Video";
  }, [getDriveID]);

  const fetchVideos = useCallback(async () => {
    try {
      const cleanFilters = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v && v !== ""));
      const params = new URLSearchParams({ tipo, search, ...cleanFilters });
      const response = await api.get('/sheets/videos/?' + params.toString());
      setVideos(response.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setVideos([]);
    }
  }, [tipo, search, filters]);

  useEffect(() => {
    const loadData = async () => {
        try {
            const optsRes = await api.get('/sheets/filter-options/');
            setFilterOptions(optsRes.data);
            await fetchVideos(); 
        } catch (err) {
            console.error("Error inicializando la galería:", err);
        }
    };
    loadData();
  }, [tipo, fetchVideos]);

  const handleFilterChange = (key, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [key]: value
    }));
  };

  const handleAddVideoSubmit = async (e) => {
    e.preventDefault();
    alert("Funcionalidad de añadir video en desarrollo. Aquí se enviaría el formulario.");
    setShowAddForm(false);
  };

  return (
    <div className="gallery-page-centered">
      <header className="control-header glass-panel">
        <h1 className="page-title-center">{titulo}</h1>
        
        <div className="search-box-center">
          <input 
            type="text" 
            placeholder="Buscar por ID o Miembro..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchVideos()}
            className="glass-input main-search"
          />
          <button onClick={fetchVideos} className="neon-button">FILTRAR</button>
          <button onClick={() => setShowAddForm(true)} className="neon-button add-btn">+ AÑADIR</button>
        </div>

        <div className="advanced-filters-center">
          {Object.entries(filterOptions).map(([key, opts]) => (
            <select 
              key={key} 
              className="glass-select-mini custom-filter" 
              value={filters[key] || ""} 
              onChange={(e) => handleFilterChange(key, e.target.value)}
            >
              <option value="">{key.toUpperCase()}</option>
              {opts.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ))}
        </div>
      </header>

      <main className="gallery-content-full">
        <div className="youtube-grid">
          {videos.length === 0 ? (
            <p className="no-results" style={{gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-dim)'}}>No se encontraron videos.</p>
          ) : (
            videos.map(v => (
              <div key={v.id} className="yt-card" onClick={() => setSelectedVideo(v)}>
                <div 
                  className="yt-thumbnail" 
                  style={{ backgroundImage: `url(${getThumbnailUrl(v.drive_link)})` }}
                >
                  <div className="play-btn">▶</div>
                </div>
                <div className="yt-info">
                  <h3 className="yt-title">{v.video_id || 'ID Desconocido'}</h3>
                  <p className="yt-meta">{v.usuario || 'Anónimo'} • {v.estilizado || v.mapa || 'Sin Categoría'}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {showAddForm && (
        <div className="netflix-modal-overlay">
          <form className="netflix-modal-window glass-panel add-form" onSubmit={handleAddVideoSubmit}>
            <button type="button" className="close-modal" onClick={() => setShowAddForm(false)}>×</button>
            <h2 className="neon-title">Añadir Nuevo Video ({tipo.toUpperCase()})</h2>
            <p style={{color: 'var(--text-dim)', textAlign: 'center'}}>Aquí irá el formulario completo para ingresar datos.</p>
            <input type="text" placeholder="ID del Video" required className="glass-input" />
            <input type="text" placeholder="Link de Drive" required className="glass-input" />
            <div className="form-btns">
                <button type="submit" className="neon-button">GUARDAR</button>
                <button type="button" className="logout-btn" onClick={() => setShowAddForm(false)}>CANCELAR</button>
            </div>
          </form>
        </div>
      )}

      {selectedVideo && (
        <div className="netflix-modal-overlay" onClick={() => setSelectedVideo(null)}>
          <div className="netflix-modal-window glass-panel" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedVideo(null)}>×</button>
            
            <div className="modal-hero">
              {getEmbedUrl(selectedVideo.drive_link) ? (
                <iframe 
                  src={getEmbedUrl(selectedVideo.drive_link)} 
                  width="100%" height="100%" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen 
                  title={`Video ${selectedVideo.video_id || ''}`}>
                </iframe>
              ) : (
                <div className="modal-player-placeholder">Video Principal No Disponible</div>
              )}
            </div>

            <div className="modal-content-details">
              <h2 className="neon-cyan-text">{selectedVideo.tipo === 'registro' ? 'REGISTRO TÉCNICO' : 'CENSO'} ID: {selectedVideo.video_id || 'N/A'}</h2>
              <div className="modal-tags">
                {selectedVideo.usuario && <span className="tag">MIEMBRO: {selectedVideo.usuario}</span>}
                {selectedVideo.mateo_miguel && <span className="tag">{selectedVideo.mateo_miguel}</span>}
                {selectedVideo.estilizado && <span className="tag green">ESTILO: {selectedVideo.estilizado}</span>}
                {selectedVideo.mapa && <span className="tag green">MAPA: {selectedVideo.mapa}</span>}
                {selectedVideo.aceptado && <span className={`tag ${selectedVideo.aceptado.toLowerCase() === 'si' ? 'green-bg' : 'red-bg'}`}>ACEPTADO: {selectedVideo.aceptado}</span>}
              </div>

              <div className="modal-sections">
                {selectedVideo.tipo === 'registro' ? (
                  <>
                    <div className="detail-section full-width"><label>PROMPT VIDEO</label><p className="full-text">{selectedVideo.prompt_video || 'No especificado'}</p></div>
                    
                    <div className="detail-section">
                      <label>IMAGEN</label>
                      {selectedVideo.imagen_link && getDriveID(selectedVideo.imagen_link) ? (
                         <img src={getThumbnailUrl(selectedVideo.imagen_link)} className="img-preview" alt="Imagen Ref" />
                      ) : (
                         <p className="full-text">N/A</p>
                      )}
                    </div>

                    <div className="detail-section full-width"><label>PROMPT IMAGEN</label><p className="full-text">{selectedVideo.prompt_imagen || 'No especificado'}</p></div>
                    
                    {selectedVideo.prompt_final && <div className="detail-section full-width"><label>PROMPT FINAL</label><p className="full-text">{selectedVideo.prompt_final}</p></div>}
                    
                    <div className="detail-section">
                      <label>VIDEO ORIGINAL</label><br/>
                      {selectedVideo.video_original_link ? <button onClick={() => window.open(selectedVideo.video_original_link, '_blank')} className="neon-button neon-link-btn">ABRIR EN DRIVE ↗</button> : <p className="full-text">No disponible</p>}
                    </div>
                  </>
                ) : (
                  <div className="modal-grid-metadata">
                    <div className="meta-box"><label>USUARIO</label><p>{selectedVideo.usuario || 'N/A'}</p></div>
                    <div className="meta-box"><label>ID VIDEO EQUIPO</label><p>{selectedVideo.id_video_equipo || 'N/A'}</p></div>
                    <div className="meta-box"><label>MAPA</label><p>{selectedVideo.mapa || 'N/A'}</p></div>
                    <div className="meta-box"><label>GENERO</label><p>{selectedVideo.genero || 'N/A'}</p></div>
                    <div className="meta-box"><label>ETNIA</label><p>{selectedVideo.etnia || 'N/A'}</p></div>
                    <div className="meta-box"><label>DURACION</label><p>{selectedVideo.duracion || 'N/A'}</p></div>
                    <div className="meta-box"><label>CAMARA</label><p>{selectedVideo.camara || 'N/A'}</p></div>
                    <div className="meta-box"><label>ESPECIE</label><p>{selectedVideo.especie || 'N/A'}</p></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoGalleryLayout;
