import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AppNavbar from './AppNavbar';
import api from '../utils/api';

const VideoGalleryLayout = ({ tipo, titulo }) => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditingInside, setIsEditingInside] = useState(false);
  const [filters, setFilters] = useState({});
  const [filterOptions, setFilterOptions] = useState({});
  const [search, setSearch] = useState('');
  const isAdmin = true; 
  const [formData, setFormData] = useState({});

  const extractDriveID = useCallback((url) => {
    if (!url || typeof url !== 'string' || url.trim() === '') return null;
    const match = url.match(/(?:file\/d\/|id=|\/folders\/|open\?id=)([a-zA-Z0-9_-]{25,})/);
    return match ? match[1] : null;
  }, []);

  const getEmbedUrl = useCallback((url) => {
    const id = extractDriveID(url);
    return id ? `https://drive.google.com/file/d/${id}/preview` : null;
  }, [extractDriveID]);

  const getThumbnailUrl = useCallback((url) => {
    const id = extractDriveID(url);
    return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w600` : "https://via.placeholder.com/600x338?text=NO+VIDEO";
  }, [extractDriveID]);

  const fetchVideos = useCallback(async () => {
    try {
      const cleanFilters = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v && v !== ""));
      const params = new URLSearchParams({ tipo, search, ...cleanFilters });
      const response = await api.get(`/sheets/videos/?${params.toString()}`);
      setVideos(response.data);
    } catch (error) { setVideos([]); }
  }, [tipo, search, filters]);

  useEffect(() => {
    api.get(`/sheets/filter-options/?tipo=${tipo}`).then(res => setFilterOptions(res.data));
  }, [tipo]);

  useEffect(() => {
    fetchVideos();
  }, [filters, fetchVideos]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if(isEditingInside) {
        await api.put(`/sheets/videos/${selectedVideo.id}/`, formData);
        setSelectedVideo({...selectedVideo, ...formData});
        setIsEditingInside(false);
      } else {
        await api.post('/sheets/videos/', { ...formData, tipo });
        setShowAddForm(false);
      }
      fetchVideos();
      alert("Operación completada");
    } catch (err) { alert("Error al guardar."); }
  };

  const startEdit = (v) => { setFormData(v); setIsEditingInside(true); };

  return (
    <>
      <AppNavbar backTo="/dashboard" backLabel="Dashboard" />
      <div className="gallery-page-centered">
        <header className="control-header glass-panel">
          <h1 className="page-title-center">{titulo}</h1>
          <div className="search-box-center">
            <input type="text" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchVideos()} className="glass-input main-search" />
            <button onClick={fetchVideos} className="neon-button">BUSCAR</button>
            {isAdmin && <button onClick={() => { setFormData({}); setShowAddForm(true); }} className="neon-button add-btn">+ ANADIR NUEVO</button>}
          </div>
          <div className="advanced-filters-center">
            {Object.entries(filterOptions).map(([key, opts]) => (
              <select key={key} className="glass-select-mini" value={filters[key] || ""} onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}>
                <option value="">{key.toUpperCase()}</option>
                {opts.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            ))}
          </div>
        </header>

        <main className="gallery-content-full">
          <div className="youtube-grid">
            {videos.map(v => (
              <div key={v.id} className="yt-card" onClick={() => {setSelectedVideo(v); setIsEditingInside(false);}}>
                <div className="yt-thumbnail" style={{ backgroundImage: `url(${getThumbnailUrl(v.drive_link)})` }}>
                  <div className="play-btn">▶</div>
                </div>
                <div className="yt-info">
                  <h3 className="yt-title" style={{color: 'var(--neon-cyan)'}}>ID: {v.video_id}</h3>
                  <p className="yt-meta">{v.usuario} • <span style={{color: 'var(--silver-mid)'}}>{v.estilizado || v.mapa}</span></p>
                </div>
              </div>
            ))}
          </div>
        </main>
        {/* Aquí sigue tu Modal original intacto... */}
      </div>
    </>
  );
};

export default VideoGalleryLayout;
