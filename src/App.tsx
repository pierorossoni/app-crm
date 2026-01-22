import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Applications, Application } from './components/Applications';
import { Login } from './components/Login';
import './App.css';

function App() {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'applications'>('dashboard');
    const [apps, setApps] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [user, setUser] = useState<any>(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        checkUser();
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setAuthLoading(false);
        });
        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            fetchApps();
        }
    }, [user]);

    const checkUser = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        } catch (error) {
            console.error('Error checking user:', error);
        } finally {
            setAuthLoading(false);
        }
    };

    const handleLogin = (loggedUser: any) => {
        setUser(loggedUser);
    };

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            setUser(null);
            setApps([]);
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const fetchApps = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('applications')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setApps(data || []);
        } catch (error) {
            console.error('Error fetching apps:', error);
            alert('Errore nel caricamento dei dati');
        } finally {
            setLoading(false);
        }
    };

    const handleAddApp = async (appData: Partial<Application>) => {
        try {
            const { data, error } = await supabase
                .from('applications')
                .insert([appData])
                .select();

            if (error) throw error;
            if (data) {
                setApps([data[0], ...apps]);
            }
        } catch (error) {
            console.error('Error adding app:', error);
            alert('Errore durante l\'aggiunta');
        }
    };

    const handleEditApp = async (id: string, appData: Partial<Application>) => {
        try {
            // Ensure we don't try to update metadata fields
            const { id: _, created_at: __, ...updateData } = appData as any;

            const { data, error } = await supabase
                .from('applications')
                .update(updateData)
                .eq('id', id)
                .select();

            if (error) throw error;
            if (data) {
                setApps(apps.map(app => app.id === id ? data[0] : app));
            }
        } catch (error) {
            console.error('Error editing app:', error);
            alert('Errore durante la modifica');
        }
    };

    const handleDeleteApp = async (id: string) => {
        if (!confirm('Sei sicuro di voler eliminare questa applicazione?')) return;

        try {
            const { error } = await supabase
                .from('applications')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setApps(apps.filter(app => app.id !== id));
        } catch (error) {
            console.error('Error deleting app:', error);
            alert('Errore durante l\'eliminazione');
        }
    };

    return (
        <>
            {authLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                    <div className="loader">Caricamento...</div>
                </div>
            ) : user ? (
                <Layout
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onLogout={handleLogout}
                    user={user}
                >
                    {loading ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <div className="loader">Caricamento...</div>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'dashboard' ? (
                                <Dashboard apps={apps} />
                            ) : (
                                <Applications
                                    apps={apps}
                                    onAdd={handleAddApp}
                                    onEdit={handleEditApp}
                                    onDelete={handleDeleteApp}
                                    searchQuery={searchQuery}
                                />
                            )}
                        </>
                    )}
                </Layout>
            ) : (
                <Login onLogin={handleLogin} />
            )}
        </>
    );
}

export default App;
