import React from 'react';
import {
    Box,
    Database,
    Cpu,
    ExternalLink,
    CheckCircle2,
    Sparkles,
    ArrowUpRight,
    Server
} from 'lucide-react';
import { Application } from './Applications';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

interface DashboardProps {
    apps: Application[];
    onNavigateToApps?: () => void;
}

const STATUS_COLORS: { [key: string]: string } = {
    'Attiva': '#10b981',
    'Active': '#10b981',
    'In Sviluppo': '#0ea5e9',
    'In Development': '#0ea5e9',
    'Manutenzione': '#f59e0b',
    'Maintenance': '#f59e0b',
    'Archiviata': '#94a3b8',
    'Archived': '#94a3b8',
};

const CHART_PALETTE = ['#4f46e5', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6'];

export const Dashboard: React.FC<DashboardProps> = ({ apps, onNavigateToApps }) => {
    const totalApps = apps.length;
    const dbLinked = apps.filter(app => app.has_database).length;
    const techSet = Array.from(new Set(apps.map(app => app.system).filter(Boolean)));
    const techCount = techSet.length;
    const activeApps = apps.filter(app => app.status === 'Active' || app.status === 'Attiva').length;
    const onlineApps = apps.filter(app => Boolean(app.online_url));

    // Status breakdown data
    const statusCounts: { [key: string]: number } = {};
    apps.forEach(app => {
        const rawStatus = app.status || 'Active';
        const label = rawStatus === 'Active' ? 'Attiva'
            : rawStatus === 'In Development' ? 'In Sviluppo'
            : rawStatus === 'Maintenance' ? 'Manutenzione'
            : rawStatus === 'Archived' ? 'Archiviata' : rawStatus;
        statusCounts[label] = (statusCounts[label] || 0) + 1;
    });

    const statusData = Object.keys(statusCounts).map(name => ({
        name,
        value: statusCounts[name],
        color: STATUS_COLORS[name] || '#6366f1'
    }));

    // System/Technology breakdown
    const techData = techSet.map((tech, idx) => ({
        name: tech,
        count: apps.filter(a => a.system === tech).length,
        fill: CHART_PALETTE[idx % CHART_PALETTE.length]
    })).sort((a, b) => b.count - a.count);

    return (
        <div className="dashboard">
            {/* Colorful Hero Greeting */}
            <div className="dashboard-hero">
                <div className="hero-text">
                    <h2>Panoramica App & Cloud</h2>
                    <p>Monitora lo stato, i database Supabase e le distribuzioni delle tue applicazioni in un unico posto.</p>
                </div>
                <div className="hero-pill">
                    <span className="status-dot-live"></span>
                    <span>{totalApps} Applicazioni Gestite</span>
                </div>
            </div>

            {/* 4 Colorful KPI Stat Cards */}
            <div className="stats-grid">
                {/* Total Apps */}
                <div className="stat-card" style={{ '--accent-gradient': 'linear-gradient(90deg, #4f46e5, #818cf8)' } as any}>
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)', color: '#4f46e5' }}>
                        <Box size={26} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{totalApps}</span>
                        <span className="stat-label">Applicazioni Totali</span>
                        <span className="stat-subtext">{onlineApps.length} accessibili online</span>
                    </div>
                </div>

                {/* Database Linked */}
                <div className="stat-card" style={{ '--accent-gradient': 'linear-gradient(90deg, #10b981, #34d399)' } as any}>
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', color: '#10b981' }}>
                        <Database size={26} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{dbLinked}</span>
                        <span className="stat-label">Con Database</span>
                        <span className="stat-subtext">{totalApps > 0 ? Math.round((dbLinked / totalApps) * 100) : 0}% con DB Supabase</span>
                    </div>
                </div>

                {/* Active Apps */}
                <div className="stat-card" style={{ '--accent-gradient': 'linear-gradient(90deg, #06b6d4, #38bdf8)' } as any}>
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ecfeff, #cffafe)', color: '#0891b2' }}>
                        <CheckCircle2 size={26} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{activeApps}</span>
                        <span className="stat-label">Applicazioni Attive</span>
                        <span className="stat-subtext">Produzione live</span>
                    </div>
                </div>

                {/* Technologies */}
                <div className="stat-card" style={{ '--accent-gradient': 'linear-gradient(90deg, #f59e0b, #fbbf24)' } as any}>
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fffbeb, #fef3c7)', color: '#d97706' }}>
                        <Cpu size={26} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{techCount}</span>
                        <span className="stat-label">Sistemi / Stack</span>
                        <span className="stat-subtext">Lovable, Studio & Cloud</span>
                    </div>
                </div>
            </div>

            {/* Responsive Charts */}
            <div className="charts-grid">
                {/* Status Donut Chart */}
                <div className="chart-container">
                    <div className="chart-header">
                        <h3 className="chart-title">
                            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#4f46e5', display: 'inline-block' }}></span>
                            Stato Applicazioni
                        </h3>
                        <span className="chart-tag">Distribuzione</span>
                    </div>
                    <div style={{ width: '100%', height: '260px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={80}
                                    paddingAngle={4}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#ffffff',
                                        borderRadius: '12px',
                                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '0.85rem'
                                    }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    iconType="circle"
                                    wrapperStyle={{ paddingTop: '10px', fontSize: '0.825rem' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Technologies Bar Chart */}
                <div className="chart-container">
                    <div className="chart-header">
                        <h3 className="chart-title">
                            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ec4899', display: 'inline-block' }}></span>
                            Tecnologie Utilizzate
                        </h3>
                        <span className="chart-tag">{techCount} Piattaforme</span>
                    </div>
                    <div style={{ width: '100%', height: '260px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={techData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 11, fill: '#64748b' }}
                                    interval={0}
                                    angle={-15}
                                    textAnchor="end"
                                />
                                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#ffffff',
                                        borderRadius: '12px',
                                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '0.85rem'
                                    }}
                                    cursor={{ fill: 'rgba(79, 70, 229, 0.05)' }}
                                />
                                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                                    {techData.map((entry, index) => (
                                        <Cell key={`bar-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Quick Launch Apps list for instant mobile launching */}
            {onlineApps.length > 0 && (
                <div className="quick-launch-section">
                    <div className="quick-launch-header">
                        <div className="quick-launch-title">
                            <Sparkles size={18} color="#ec4899" />
                            <span>Accesso Rapido Online</span>
                        </div>
                        {onNavigateToApps && (
                            <button
                                onClick={onNavigateToApps}
                                className="btn-ghost"
                                style={{ padding: '0.35rem 0.75rem', fontSize: '0.775rem' }}
                            >
                                Vedi tutte ({totalApps})
                            </button>
                        )}
                    </div>

                    <div className="quick-launch-grid">
                        {onlineApps.slice(0, 6).map(app => (
                            <a
                                key={app.id}
                                href={app.online_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="quick-launch-item"
                                title={`Apri ${app.name} (${app.online_url})`}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', minWidth: 0 }}>
                                    <div style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 8,
                                        background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1rem',
                                        flexShrink: 0
                                    }}>
                                        {app.system === 'Lovable' ? '💖' : app.system === 'Google-Studi' ? '✨' : '🌐'}
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{ fontWeight: 700, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {app.name}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {app.system}
                                        </div>
                                    </div>
                                </div>
                                <ArrowUpRight size={16} color="var(--primary)" style={{ flexShrink: 0, marginLeft: '0.5rem' }} />
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
