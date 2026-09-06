import React, { useState, useEffect } from 'react';
import {
    Plus,
    Edit2,
    Trash2,
    ExternalLink,
    Database,
    Server,
    Calendar,
    FileText,
    LayoutGrid,
    Table as TableIcon,
    X,
    Check,
    Globe
} from 'lucide-react';

export interface Application {
    id: string;
    created_at: string;
    name: string;
    system: string;
    has_database: boolean;
    database_type?: string;
    database_location?: string;
    online_url?: string;
    hosting_location?: string;
    status: string;
    notes?: string;
}

interface ApplicationsProps {
    apps: Application[];
    onAdd: (app: Partial<Application>) => void;
    onEdit: (id: string, app: Partial<Application>) => void;
    onDelete: (id: string) => void;
    searchQuery: string;
    isExternalModalOpen?: boolean;
    onCloseExternalModal?: () => void;
}

export const Applications: React.FC<ApplicationsProps> = ({
    apps,
    onAdd,
    onEdit,
    onDelete,
    searchQuery,
    isExternalModalOpen = false,
    onCloseExternalModal
}) => {
    // Detect mobile by screen width, default to card view
    const [viewMode, setViewMode] = useState<'cards' | 'table'>(() => {
        if (typeof window !== 'undefined' && window.innerWidth <= 768) {
            return 'cards';
        }
        return 'cards'; // Cards look much better and more modern by default!
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingApp, setEditingApp] = useState<Application | null>(null);
    const [selectedTech, setSelectedTech] = useState('All');
    const [expandedNotesId, setExpandedNotesId] = useState<string | null>(null);

    const [formData, setFormData] = useState<Partial<Application>>({
        name: '',
        system: 'Lovable',
        has_database: false,
        database_type: '',
        database_location: '',
        online_url: '',
        hosting_location: '',
        status: 'Active',
        notes: ''
    });

    // Listen to external modal trigger from layout
    useEffect(() => {
        if (isExternalModalOpen) {
            openAddModal();
        }
    }, [isExternalModalOpen]);

    const uniqueTechs = Array.from(new Set(apps.map(a => a.system).filter(Boolean)));
    const techs = ['All', ...uniqueTechs];

    const filteredApps = apps.filter(app => {
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = !q ||
            app.name.toLowerCase().includes(q) ||
            (app.system && app.system.toLowerCase().includes(q)) ||
            (app.hosting_location && app.hosting_location.toLowerCase().includes(q)) ||
            (app.database_location && app.database_location.toLowerCase().includes(q)) ||
            (app.notes && app.notes.toLowerCase().includes(q));

        const matchesTech = selectedTech === 'All' || app.system === selectedTech;
        return matchesSearch && matchesTech;
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingApp) {
            onEdit(editingApp.id, formData);
        } else {
            onAdd(formData);
        }
        closeModal();
    };

    const openAddModal = () => {
        setEditingApp(null);
        setFormData({
            name: '',
            system: 'Lovable',
            has_database: false,
            database_type: '',
            database_location: '',
            online_url: '',
            hosting_location: '',
            status: 'Active',
            notes: ''
        });
        setIsModalOpen(true);
    };

    const openEditModal = (app: Application) => {
        setEditingApp(app);
        setFormData({ ...app });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingApp(null);
        if (onCloseExternalModal) {
            onCloseExternalModal();
        }
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Active':
            case 'Attiva':
                return 'status-active';
            case 'In Development':
            case 'In Sviluppo':
                return 'status-dev';
            case 'Maintenance':
            case 'Manutenzione':
                return 'status-maint';
            case 'Archived':
            case 'Archiviata':
                return 'status-archived';
            default:
                return 'status-active';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'Active': return 'Attiva';
            case 'In Development': return 'In Sviluppo';
            case 'Maintenance': return 'Manutenzione';
            case 'Archived': return 'Archiviata';
            default: return status;
        }
    };

    const getSystemBadgeClass = (system: string) => {
        const sys = (system || '').toLowerCase();
        if (sys.includes('lovable')) return 'badge-lovable';
        if (sys.includes('bolt')) return 'badge-bolt';
        if (sys.includes('google') || sys.includes('studi')) return 'badge-google-studi';
        if (sys.includes('vs code') || sys.includes('vscode')) return 'badge-vscode';
        return 'badge-altro';
    };

    const getSystemEmoji = (system: string) => {
        const s = (system || '').toLowerCase();
        if (s.includes('lovable')) return '💖';
        if (s.includes('bolt')) return '⚡';
        if (s.includes('google') || s.includes('studi')) return '✨';
        if (s.includes('vs code') || s.includes('vscode')) return '💻';
        if (s.includes('antigravity')) return '🚀';
        if (s.includes('claude')) return '🧠';
        if (s.includes('portainer') || s.includes('hetzner')) return '🐳';
        if (s.includes('evolution')) return '💬';
        if (s.includes('chatwoot')) return '🗨️';
        return '📱';
    };

    return (
        <div className="applications-view">
            {/* Header with Title, View Toggle and Add Button */}
            <div className="apps-header-row">
                <div className="apps-title-block">
                    <h2>Applicazioni</h2>
                    <p>Gestisci le istanze, i database e gli URL online ({filteredApps.length} visualizzate)</p>
                </div>

                <div className="apps-controls">
                    {/* View mode toggle (Cards / Table) */}
                    <div className="view-mode-toggle">
                        <button
                            className={`view-mode-btn ${viewMode === 'cards' ? 'active' : ''}`}
                            onClick={() => setViewMode('cards')}
                            title="Vista a schede"
                        >
                            <LayoutGrid size={16} />
                            <span>Schede</span>
                        </button>
                        <button
                            className={`view-mode-btn ${viewMode === 'table' ? 'active' : ''}`}
                            onClick={() => setViewMode('table')}
                            title="Vista a tabella"
                        >
                            <TableIcon size={16} />
                            <span>Tabella</span>
                        </button>
                    </div>

                    <button className="btn-primary" onClick={openAddModal}>
                        <Plus size={18} />
                        <span>Nuova App</span>
                    </button>
                </div>
            </div>

            {/* Horizontal Filter Chips for Technologies (Thumb-Friendly on Mobile) */}
            <div className="tech-chips-bar">
                <button
                    className={`tech-chip ${selectedTech === 'All' ? 'active' : ''}`}
                    onClick={() => setSelectedTech('All')}
                >
                    <span>Tutte</span>
                    <span className="tech-chip-count">{apps.length}</span>
                </button>
                {uniqueTechs.map(tech => {
                    const count = apps.filter(a => a.system === tech).length;
                    return (
                        <button
                            key={tech}
                            className={`tech-chip ${selectedTech === tech ? 'active' : ''}`}
                            onClick={() => setSelectedTech(tech)}
                        >
                            <span>{getSystemEmoji(tech)} {tech}</span>
                            <span className="tech-chip-count">{count}</span>
                        </button>
                    );
                })}
            </div>

            {/* Content: Cards View vs Table View */}
            {viewMode === 'cards' ? (
                /* Mobile & Tablet First: Cards Grid */
                <div className="app-cards-grid">
                    {filteredApps.map(app => (
                        <div key={app.id} className="app-card">
                            <div>
                                {/* Card Header */}
                                <div className="app-card-top">
                                    <div className="app-card-header-left">
                                        <div className="app-card-icon" style={{ background: '#f8fafc' }}>
                                            {getSystemEmoji(app.system)}
                                        </div>
                                        <div>
                                            <h3 className="app-card-name">{app.name}</h3>
                                            <span className={`system-badge ${getSystemBadgeClass(app.system)}`}>
                                                {app.system || 'Altro'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <span className={`status-badge ${getStatusClass(app.status)}`}>
                                        <span className="status-dot"></span>
                                        {getStatusLabel(app.status)}
                                    </span>
                                </div>

                                {/* Metadata section */}
                                <div className="app-card-meta">
                                    {/* Database info */}
                                    <div className="meta-row">
                                        <span className="meta-label">
                                            <Database size={14} color="#10b981" />
                                            Database:
                                        </span>
                                        <span className="meta-value" title={app.database_location || ''}>
                                            {app.has_database
                                                ? `${app.database_type || 'Supabase'} ${app.database_location ? `• ${app.database_location.split(' ')[0]}` : ''}`
                                                : 'Nessuno'
                                            }
                                        </span>
                                    </div>

                                    {/* Hosting info */}
                                    {app.hosting_location && (
                                        <div className="meta-row">
                                            <span className="meta-label">
                                                <Server size={14} color="#6366f1" />
                                                Hosting:
                                            </span>
                                            <span className="meta-value" title={app.hosting_location}>
                                                {app.hosting_location}
                                            </span>
                                        </div>
                                    )}

                                    {/* Created date */}
                                    {app.created_at && (
                                        <div className="meta-row">
                                            <span className="meta-label">
                                                <Calendar size={14} color="#64748b" />
                                                Creato:
                                            </span>
                                            <span className="meta-value" style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
                                                {new Date(app.created_at).toLocaleDateString('it-IT')}
                                            </span>
                                        </div>
                                    )}

                                    {/* Notes preview */}
                                    {app.notes && (
                                        <div
                                            className="meta-notes-preview"
                                            onClick={() => setExpandedNotesId(expandedNotesId === app.id ? null : app.id)}
                                            style={{ cursor: 'pointer' }}
                                            title="Clicca per espandere le note"
                                        >
                                            <span style={{ fontWeight: 600, notItalic: true } as any}>📝 Note: </span>
                                            {expandedNotesId === app.id ? app.notes : app.notes}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Card Actions Footer */}
                            <div className="app-card-actions">
                                {app.online_url ? (
                                    <a
                                        href={app.online_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-open-link"
                                        title={`Apri ${app.online_url}`}
                                    >
                                        <Globe size={15} />
                                        <span>Apri Online</span>
                                        <ExternalLink size={13} style={{ marginLeft: 2 }} />
                                    </a>
                                ) : (
                                    <div style={{ flex: 1, fontSize: '0.8rem', color: 'var(--text-light)', fontStyle: 'italic' }}>
                                        Nessun link online
                                    </div>
                                )}

                                <div className="card-icon-actions">
                                    <button
                                        className="btn-action-icon"
                                        onClick={() => openEditModal(app)}
                                        title="Modifica applicazione"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        className="btn-action-icon danger"
                                        onClick={() => onDelete(app.id)}
                                        title="Elimina applicazione"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredApps.length === 0 && (
                        <div style={{
                            gridColumn: '1 / -1',
                            textAlign: 'center',
                            padding: '4rem 1.5rem',
                            background: 'white',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--border)'
                        }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔍</div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Nessuna applicazione trovata</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: 360, margin: '0 auto 1.5rem' }}>
                                Prova a cambiare termine di ricerca o rimuovi il filtro selezionato.
                            </p>
                            <button
                                className="btn-primary"
                                onClick={() => { setSelectedTech('All'); openAddModal(); }}
                            >
                                <Plus size={16} />
                                <span>Aggiungi una nuova app</span>
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                /* Desktop Table View */
                <div className="table-container">
                    <div className="table-scroll-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nome & Sistema</th>
                                    <th>Stato</th>
                                    <th>Database</th>
                                    <th>Hosting</th>
                                    <th>URL Online</th>
                                    <th>Data Creazione</th>
                                    <th style={{ textAlign: 'right' }}>Azioni</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredApps.map(app => (
                                    <tr key={app.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                                <span style={{ fontSize: '1.25rem' }}>{getSystemEmoji(app.system)}</span>
                                                <div>
                                                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{app.name}</div>
                                                    <span className={`system-badge ${getSystemBadgeClass(app.system)}`}>
                                                        {app.system || 'Altro'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${getStatusClass(app.status)}`}>
                                                <span className="status-dot"></span>
                                                {getStatusLabel(app.status)}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '0.85rem' }}>
                                                {app.has_database ? (
                                                    <div>
                                                        <span style={{ fontWeight: 600, color: '#065f46' }}>
                                                            {app.database_type || 'Supabase'}
                                                        </span>
                                                        {app.database_location && (
                                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                                {app.database_location}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span style={{ color: 'var(--text-light)' }}>-</span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                {app.hosting_location || '-'}
                                            </span>
                                        </td>
                                        <td>
                                            {app.online_url ? (
                                                <a
                                                    href={app.online_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn-open-link"
                                                    style={{ display: 'inline-flex', padding: '0.35rem 0.65rem' }}
                                                >
                                                    <span>Apri</span>
                                                    <ExternalLink size={12} />
                                                </a>
                                            ) : (
                                                <span style={{ color: 'var(--text-light)' }}>-</span>
                                            )}
                                        </td>
                                        <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                                            {new Date(app.created_at).toLocaleDateString('it-IT')}
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                                                <button
                                                    className="btn-action-icon"
                                                    onClick={() => openEditModal(app)}
                                                    title="Modifica"
                                                >
                                                    <Edit2 size={15} />
                                                </button>
                                                <button
                                                    className="btn-action-icon danger"
                                                    onClick={() => onDelete(app.id)}
                                                    title="Elimina"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal Dialog (Bottom Sheet on Mobile Phones) */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
                    <div className="modal-content">
                        {/* Drag Handle Bar on Mobile */}
                        <div className="modal-handle-bar"></div>

                        <div className="modal-header">
                            <h2>{editingApp ? 'Modifica Applicazione' : 'Nuova Applicazione'}</h2>
                            <button className="modal-close-btn" onClick={closeModal} title="Chiudi">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Nome Applicazione *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        required
                                        placeholder="Es. Deposito, Viaggio"
                                        value={formData.name || ''}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Sistema / Stack *</label>
                                    <select
                                        className="form-control"
                                        required
                                        value={formData.system || 'Lovable'}
                                        onChange={e => setFormData({ ...formData, system: e.target.value })}
                                    >
                                        <option value="Lovable">💖 Lovable</option>
                                        <option value="Bolt">⚡ Bolt</option>
                                        <option value="Google-Studi">✨ Google-Studi</option>
                                        <option value="VS Code">💻 VS Code</option>
                                        <option value="Antigravity">🚀 Antigravity</option>
                                        <option value="Claude Desk">🧠 Claude Desk</option>
                                        <option value="Altro">⚙️ Altro</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Database Collegato?</label>
                                    <select
                                        className="form-control"
                                        value={formData.has_database ? 'yes' : 'no'}
                                        onChange={e => setFormData({ ...formData, has_database: e.target.value === 'yes' })}
                                    >
                                        <option value="no">No, nessun database</option>
                                        <option value="yes">Sì, database collegato</option>
                                    </select>
                                </div>

                                {formData.has_database && (
                                    <div className="form-group">
                                        <label>Tipo Database</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Es. Supabase, PostgreSQL"
                                            value={formData.database_type || ''}
                                            onChange={e => setFormData({ ...formData, database_type: e.target.value })}
                                        />
                                    </div>
                                )}
                            </div>

                            {formData.has_database && (
                                <div className="form-group">
                                    <label>Posizione / Account Database</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Es. Deposito giannir64@gmail.com"
                                        value={formData.database_location || ''}
                                        onChange={e => setFormData({ ...formData, database_location: e.target.value })}
                                    />
                                </div>
                            )}

                            <div className="form-row">
                                <div className="form-group">
                                    <label>URL Online</label>
                                    <input
                                        type="url"
                                        className="form-control"
                                        placeholder="https://app.iprrossoni.com"
                                        value={formData.online_url || ''}
                                        onChange={e => setFormData({ ...formData, online_url: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Piattaforma Hosting</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Es. Vercel, Hetzner, GitHub"
                                        value={formData.hosting_location || ''}
                                        onChange={e => setFormData({ ...formData, hosting_location: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Stato Applicazione</label>
                                <select
                                    className="form-control"
                                    value={formData.status || 'Active'}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="Active">🟢 Attiva (In produzione)</option>
                                    <option value="In Development">🔵 In Sviluppo</option>
                                    <option value="Maintenance">🟡 Manutenzione</option>
                                    <option value="Archived">⚪ Archiviata</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Note & Credenziali / Dettagli</label>
                                <textarea
                                    className="form-control"
                                    rows={3}
                                    placeholder="Note aggiuntive, account collegati, repository, ecc..."
                                    value={formData.notes || ''}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn-ghost"
                                    onClick={closeModal}
                                >
                                    Annulla
                                </button>
                                <button type="submit" className="btn-primary">
                                    <Check size={18} />
                                    <span>{editingApp ? 'Salva Modifiche' : 'Crea Applicazione'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
