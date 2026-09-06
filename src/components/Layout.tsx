import React, { useState } from 'react';
import {
    LayoutDashboard,
    Box,
    Search,
    User,
    LogOut,
    Plus,
    X
} from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
    activeTab: 'dashboard' | 'applications';
    setActiveTab: (tab: 'dashboard' | 'applications') => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onLogout: () => void;
    user: any;
    onOpenAddModal?: () => void;
    appsCount?: number;
}

export const Layout: React.FC<LayoutProps> = ({
    children,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    onLogout,
    user,
    onOpenAddModal,
    appsCount = 0
}) => {
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'U';
    const userDisplayName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Utente';

    return (
        <div className="app-container">
            {/* Desktop Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <div className="logo-icon">
                        <Box size={22} color="white" />
                    </div>
                    <div>
                        <h1>AppCRM</h1>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <button
                        className={`sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </button>
                    <button
                        className={`sidebar-item ${activeTab === 'applications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('applications')}
                    >
                        <Box size={20} />
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            Applicazioni
                            {appsCount > 0 && (
                                <span style={{
                                    fontSize: '0.75rem',
                                    background: activeTab === 'applications' ? 'var(--primary)' : '#e2e8f0',
                                    color: activeTab === 'applications' ? 'white' : 'var(--text-muted)',
                                    padding: '0.1rem 0.5rem',
                                    borderRadius: '10px',
                                    fontWeight: 700
                                }}>
                                    {appsCount}
                                </span>
                            )}
                        </span>
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-profile" title={user?.email}>
                        <div className="user-avatar-mini">{userInitial}</div>
                        <div className="user-info">
                            <span className="user-name">{userDisplayName}</span>
                            <span className="user-sub">{user?.email ? user.email : 'Ospite'}</span>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={onLogout} title="Disconnetti">
                        <LogOut size={18} />
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="main-content">
                {/* Desktop Header */}
                <header className="header">
                    <div className="search-bar">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Cerca app, tecnologia, database, hosting..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                className="search-clear"
                                onClick={() => setSearchQuery('')}
                                title="Cancella ricerca"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                    <div className="header-actions">
                        <div className="header-badge">
                            <span className="status-dot-live"></span>
                            <span>Cloud Live</span>
                        </div>
                        <div className="avatar" title={`Connesso come ${user?.email || 'Ospite'}`}>
                            {userInitial}
                        </div>
                    </div>
                </header>

                {/* Mobile Top Bar */}
                <div className="mobile-top-bar">
                    <div className="mobile-brand" onClick={() => setActiveTab('dashboard')} style={{ cursor: 'pointer' }}>
                        <div className="mobile-brand-icon">
                            <Box size={20} />
                        </div>
                        <span className="mobile-brand-title">AppCRM</span>
                    </div>

                    <div className="mobile-top-actions">
                        <button
                            className="mobile-icon-btn"
                            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                            title="Cerca"
                            style={{ color: searchQuery || mobileSearchOpen ? 'var(--primary)' : 'inherit' }}
                        >
                            <Search size={18} />
                        </button>
                        <button
                            className="mobile-icon-btn"
                            onClick={onLogout}
                            title="Esci"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>

                {/* Mobile Search Tray (collapsible or when query is typed) */}
                <div className={`mobile-search-tray ${(mobileSearchOpen || searchQuery) ? 'open' : ''}`}>
                    <div className="search-bar" style={{ maxWidth: '100%' }}>
                        <Search size={16} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Cerca per nome, tecnologia o hosting..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus={mobileSearchOpen}
                        />
                        {searchQuery && (
                            <button
                                className="search-clear"
                                onClick={() => setSearchQuery('')}
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Scrollable Main Body */}
                <div className="content-scroll">
                    {children}
                </div>

                {/* Mobile Bottom Navigation Bar */}
                <nav className="mobile-bottom-nav">
                    <button
                        className={`mobile-nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <LayoutDashboard size={22} className="mobile-tab-icon" />
                        <span>Dashboard</span>
                    </button>

                    {/* Central Raised Action Button */}
                    <button
                        className="mobile-fab-center"
                        onClick={() => {
                            if (onOpenAddModal) {
                                onOpenAddModal();
                            } else {
                                setActiveTab('applications');
                            }
                        }}
                        title="Nuova Applicazione"
                    >
                        <Plus size={26} strokeWidth={2.5} />
                    </button>

                    <button
                        className={`mobile-nav-tab ${activeTab === 'applications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('applications')}
                    >
                        <Box size={22} className="mobile-tab-icon" />
                        <span>Applicazioni</span>
                        {appsCount > 0 && (
                            <span className="mobile-tab-badge">{appsCount}</span>
                        )}
                    </button>
                </nav>
            </main>
        </div>
    );
};
