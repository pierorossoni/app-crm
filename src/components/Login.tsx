import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Lock, Box, ArrowRight } from 'lucide-react';

interface LoginProps {
    onLogin: (user: any) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isSignUp) {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                if (data.user) {
                    onLogin(data.user);
                } else {
                    setError('Controlla la tua email per confermare la registrazione');
                }
            } else {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) throw error;

                if (data.user) {
                    onLogin(data.user);
                }
            }
        } catch (error: any) {
            setError(error.message || (isSignUp ? 'Errore durante la registrazione' : 'Errore durante il login'));
        } finally {
            setLoading(false);
        }
    };

    const handleGuestLogin = () => {
        onLogin({
            id: 'guest-user',
            email: 'info.iprdigital@gmail.com',
            user_metadata: { name: 'Demo User' },
        });
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                        <div className="logo-icon" style={{ width: 56, height: 56, borderRadius: 16 }}>
                            <Box size={30} color="white" />
                        </div>
                    </div>
                    <h1>AppCRM</h1>
                    <p>{isSignUp ? 'Crea un nuovo account per gestire le tue app' : 'Piattaforma di controllo e gestione cloud'}</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && (
                        <div style={{
                            color: '#b91c1c',
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            padding: '0.75rem 1rem',
                            borderRadius: '12px',
                            marginBottom: '1.25rem',
                            fontSize: '0.875rem',
                            fontWeight: 500
                        }}>
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <div className="input-with-icon">
                            <Mail size={18} />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tua@email.com"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-with-icon">
                            <Lock size={18} />
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                        style={{ width: '100%', padding: '0.875rem', justifyContent: 'center', fontSize: '1rem', marginTop: '0.5rem' }}
                    >
                        <span>{loading ? (isSignUp ? 'Registrazione in corso...' : 'Accesso in corso...') : (isSignUp ? 'Crea Account' : 'Accedi')}</span>
                        <ArrowRight size={18} />
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem' }}>
                        <button
                            type="button"
                            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 0, fontWeight: 600 }}
                        >
                            {isSignUp ? 'Hai già un account? Accedi qui' : 'Non hai un account? Registrati'}
                        </button>
                    </div>

                    <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                        <button
                            type="button"
                            onClick={handleGuestLogin}
                            className="btn-ghost"
                            style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem', justifyContent: 'center' }}
                        >
                            ✨ Esplora come Ospite (Accesso Immediato)
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
