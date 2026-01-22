import React from 'react';
import { Box, Database, Cpu, PieChart as PieChartIcon } from 'lucide-react';
import { Application } from './Applications';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

interface DashboardProps {
    apps: Application[];
}

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const Dashboard: React.FC<DashboardProps> = ({ apps }) => {
    const totalApps = apps.length;
    const dbLinked = apps.filter(app => app.has_database).length;
    const techCount = new Set(apps.map(app => app.system)).size;

    // Prepare chart data
    const statusData = [
        { name: 'Attiva', value: apps.filter(a => a.status === 'Active').length },
        { name: 'In Sviluppo', value: apps.filter(a => a.status === 'In Development').length },
        { name: 'Manutenzione', value: apps.filter(a => a.status === 'Maintenance').length },
        { name: 'Archiviata', value: apps.filter(a => a.status === 'Archived').length },
    ].filter(d => d.value > 0);

    const techData = Array.from(new Set(apps.map(app => app.system))).map(tech => ({
        name: tech,
        count: apps.filter(a => a.system === tech).length
    }));

    return (
        <div className="dashboard">
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                        <Box size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{totalApps}</span>
                        <span className="stat-label">Applicazioni Totali</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
                        <Database size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{dbLinked}</span>
                        <span className="stat-label">Con Database Collegato</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: '#fff7ed', color: '#f59e0b' }}>
                        <Cpu size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{techCount}</span>
                        <span className="stat-label">Sistemi/Tecnologie</span>
                    </div>
                </div>
            </div>

            <div className="charts-grid">
                <div className="chart-container">
                    <h3 className="chart-title">Stato Applicazioni</h3>
                    <div style={{ width: '100%', height: '280px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-container">
                    <h3 className="chart-title">Tecnologie Utilizzate</h3>
                    <div style={{ width: '100%', height: '280px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={techData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};
