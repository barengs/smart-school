import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../store/authSlice';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
        if (error) dispatch(clearError());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const resultAction = await dispatch(login(credentials));
        if (login.fulfilled.match(resultAction)) {
            navigate('/admin');
        }
    };

    return (
        <div className="min-h-screen bg-surface-container-low flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-body-md">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="w-16 h-16 bg-primary text-on-primary rounded-xl mx-auto flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-[32px]">school</span>
                </div>
                <h2 className="mt-6 text-center font-display-lg text-[32px] leading-tight text-on-surface">
                    Admin Portal
                </h2>
                <p className="mt-2 text-center font-body-md text-on-surface-variant">
                    Masuk ke akun Anda
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <Card className="py-8 px-4 sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm text-center">
                                {error}
                            </div>
                        )}

                        <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            label="Alamat Email"
                            autoComplete="email" 
                            required 
                            value={credentials.email}
                            onChange={handleChange}
                        />

                        <Input 
                            id="password" 
                            name="password" 
                            type="password" 
                            label="Kata Sandi"
                            autoComplete="current-password" 
                            required 
                            value={credentials.password}
                            onChange={handleChange}
                        />

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input 
                                    id="remember-me" 
                                    name="remember-me" 
                                    type="checkbox" 
                                    className="h-4 w-4 text-primary focus:ring-primary border-outline rounded" 
                                />
                                <label htmlFor="remember-me" className="ml-2 font-body-sm text-on-surface">
                                    Ingat saya
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-label-md text-primary hover:text-primary-container hover:underline">
                                    Lupa kata sandi?
                                </a>
                            </div>
                        </div>

                        <div>
                            <Button 
                                type="submit" 
                                disabled={loading}
                                className="w-full"
                            >
                                {loading ? 'Memproses...' : 'Masuk'}
                            </Button>
                        </div>
                    </form>
                    
                    <div className="mt-6 text-center">
                        <Link to="/" className="font-body-sm text-on-surface-variant hover:text-primary hover:underline">
                            <span className="material-symbols-outlined text-[14px] align-middle mr-1">arrow_back</span>
                            Kembali ke Beranda Publik
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Login;
