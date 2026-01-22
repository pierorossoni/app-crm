import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ExternalLink, Filter } from 'lucide-react';

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
}

export const Applications: React.FC<ApplicationsProps> = ({
    apps,
    onAdd,
    onEdit,
    onDelete,
    searchQuery
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingApp, setEditingApp] = useState<Application | null>(null);
    const [selectedTech, setSelectedTech] = useState('All');

    const [formData, setFormData] = useState<Partial<Application>>({
        name: '',
        system: '',
        has_database: false,
        database_type: '',
        database_location: '',
        online_url: '',
        hosting_location: '',
        status: 'Active',
        notes: ''
    });

    const techs = ['All', ...Array.from(new Set(apps.map(a => a.system)))];

    const filteredApps = apps.filter(app => {
        const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.system.toLowerCase().includes(searchQuery.toLowerCase());
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
            name: '', system: '', has_database: false, database_type: '',
            database_location: '', online_url: '', hosting_location: '',
            status: 'Active', notes: ''
        });
        setIsModalOpen(true);
    };

    const openEditModal = (app: Application) => {
        setEditingApp(app);
        setFormData(app);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingApp(null);
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Active': return 'status-active';
            case 'In Development': return 'status-dev';
            case 'Maintenance': return 'status-maint';
            case 'Archived': return 'status-archived';
            default: return '';
        }
    };

    const getEmoji = (system: string) => {
        const emojiMap: { [key: string]: string } = {
            'React': '⚛️',
            'Laravel': '🐘',
            'Node.js': '🟢',
            'Python': '🐍',
            'Vue': '💚',
            'Angular': '🅰️',
            'Django': '🎸',
            'Flask': '🧪',
            'Express': '🚀',
            'Next.js': '▲',
            'Nuxt.js': '💚',
            'Svelte': '🧡',
            'Ruby on Rails': '💎',
            'PHP': '🐘',
            'Java': '☕',
            'C#': '🔷',
            'Go': '🐹',
            'Rust': '🦀',
            'TypeScript': '🔷',
            'JavaScript': '🟨',
        };
        return emojiMap[system] || '💻';
    };

    return (
        <div className="applications-view">
            <div className="table-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <h2>Gestione Applicazioni</h2>
                    <div className="filter-select" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Filter size={16} color="var(--text-muted)" />
                        <select
                            value={selectedTech}
                            onChange={(e) => setSelectedTech(e.target.value)}
                            style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', fontWeight: 500 }}
                        >
                            {techs.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </div>
                <button className="btn-primary" onClick={openAddModal}>
                    <Plus size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                    Nuova App
                </button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Tecnologia</th>
                            <th>DB Collegato</th>
                            <th>Posizione DB</th>
                            <th>URL Online</th>
                            <th>Hosting</th>
                            <th>Note</th>
                            <th>Creato il</th>
                            <th>Stato</th>
                            <th>Azioni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredApps.map(app => (
                            <tr key={app.id}>
                                <td style={{ fontWeight: 600 }}>{getEmoji(app.system)} {app.name}</td>
                                <td>{app.system}</td>
                                <td>{app.has_database ? `Sì (${app.database_type})` : 'No'}</td>
                                <td>{app.database_location || '-'}</td>
                                <td>{app.online_url ? <a href={app.online_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>{app.online_url}</a> : '-'}</td>
                                <td>{app.hosting_location || '-'}</td>
                                <td>{app.notes ? app.notes.length > 50 ? `${app.notes.substring(0, 50)}...` : app.notes : '-'}</td>
                                <td>{new Date(app.created_at).toLocaleDateString('it-IT')}</td>
                                <td>
                                    <span className={`status-badge ${getStatusClass(app.status)}`}>
                                        {app.status === 'Active' ? 'Attiva' :
                                            app.status === 'In Development' ? 'In Sviluppo' :
                                                app.status === 'Maintenance' ? 'Manutenzione' : 'Archiviata'}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {app.online_url && (
                                            <a href={app.online_url} target="_blank" rel="noopener noreferrer" className="btn-ghost" title="Vai all'app">
                                                <ExternalLink size={16} />
                                            </a>
                                        )}
                                        <button className="btn-ghost" onClick={() => openEditModal(app)} title="Modifica">
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="btn-ghost" onClick={() => onDelete(app.id)} title="Elimina" style={{ color: 'var(--danger)' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredApps.length === 0 && (
                            <tr>
                                <td colSpan={10} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                    Nessuna applicazione trovata.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {
                isModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h2 style={{ marginBottom: '1.5rem' }}>{editingApp ? 'Modifica Applicazione' : 'Aggiungi Nuova Applicazione'}</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Nome Applicazione</label>
                                        <input
                                            type="text" className="form-control" required
                                            value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Sistema/Tecnologia</label>
                                        <input
                                            type="text" className="form-control" required placeholder="Es. React, Laravel"
                                            value={formData.system} onChange={e => setFormData({ ...formData, system: e.target.value })}
                                        />
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
                                            <option value="no">No</option>
                                            <option value="yes">Sì</option>
                                        </select>
                                    </div>
                                    {formData.has_database && (
                                        <div className="form-group">
                                            <label>Tipo Database</label>
                                            <input
                                                type="text" className="form-control" placeholder="Es. Supabase, MongoDB"
                                                value={formData.database_type} onChange={e => setFormData({ ...formData, database_type: e.target.value })}
                                            />
                                        </div>
                                    )}
                                </div>

                                {formData.has_database && (
                                    <div className="form-group">
                                        <label>Dove si trova il Database</label>
                                        <input
                                            type="text" className="form-control"
                                            value={formData.database_location} onChange={e => setFormData({ ...formData, database_location: e.target.value })}
                                        />
                                    </div>
                                )}

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>URL Online</label>
                                        <input
                                            type="url" className="form-control"
                                            value={formData.online_url} onChange={e => setFormData({ ...formData, online_url: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Hosted su</label>
                                        <input
                                            type="text" className="form-control" placeholder="Es. Vercel, AWS"
                                            value={formData.hosting_location} onChange={e => setFormData({ ...formData, hosting_location: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Stato</label>
                                    <select
                                        className="form-control"
                                        value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="Active">Attiva</option>
                                        <option value="In Development">In Sviluppo</option>
                                        <option value="Maintenance">Manutenzione</option>
                                        <option value="Archived">Archiviata</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Note</label>
                                    <textarea
                                        className="form-control" rows={3}
                                        value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    ></textarea>
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn-ghost" onClick={closeModal} style={{ padding: '0.625rem 1.25rem' }}>Annulla</button>
                                    <button type="submit" className="btn-primary">{editingApp ? 'Salva Modifiche' : 'Aggiungi App'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
};
