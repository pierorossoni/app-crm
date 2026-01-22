import React from 'react';
import { LayoutDashboard, Box, Search, Bell, User, LogOut } from 'lucide-react';

interface SidebarItemProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick }) => (
    <button
        className={`sidebar-item ${active ? 'active' : ''}`}
        onClick={onClick}
    >
        {icon}
        <span>{label}</span>
    </button>
);

interface LayoutProps {
    children: React.ReactNode;
    activeTab: 'dashboard' | 'applications';
    setActiveTab: (tab: 'dashboard' | 'applications') => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onLogout: () => void;
    user: any;
}

export const Layout: React.FC<LayoutProps> = ({
    children,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    onLogout,
    user
}) => {
    return (
        <div className="app-container">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <div className="logo-icon">
                        <Box size={24} color="white" />
                    </div>
                    <h1>AppCRM</h1>
                </div>

                <nav className="sidebar-nav">
                    <SidebarItem
                        icon={<LayoutDashboard size={20} />}
                        label="Dashboard"
                        active={activeTab === 'dashboard'}
                        onClick={() => setActiveTab('dashboard')}
                    />
                    <SidebarItem
                        icon={<Box size={20} />}
                        label="Applicazioni"
                        active={activeTab === 'applications'}
                        onClick={() => setActiveTab('applications')}
                    />
                </nav>

                <div className="sidebar-footer">
                    <div className="user-profile">
                        <User size={20} />
                        <div className="user-info">
                            <span className="user-name">{user?.email || 'Utente'}</span>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={onLogout} title="Logout">
                        <LogOut size={18} />
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <header className="header">
                    <div className="search-bar">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Cerca per nome o sistema..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="header-actions">
                        <button className="icon-btn">
                            <Bell size={20} />
                        </button>
                        <div className="avatar">A</div>
                    </div>
                </header>

                <div className="content-scroll">
                    {children}
                </div>
            </main>
        </div>
    );
};
