import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '../components/icons';
import { useAuthStore } from '../store/useAuthStore';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');

    const success = await login({ email, password });
    if (!success) return;

    // 🔥 AMBIL USER DARI STORE
    const { user } = useAuthStore.getState();
    if (user?.role === 'hrd') {
      navigate('/hrd/dashboard', { replace: true });
    } else {

      navigate('/dashboard', { replace: true });
    }
  };

  const inputClass =
    'shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-colors';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-lg rounded-xl px-8 pt-6 pb-8 mb-4">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800">Masuk Akun</h1>
            <p className="text-gray-500">Masuk untuk melanjutkan ke AI Recruit</p>
          </div>

          {error && (
            <p className="bg-red-100 text-red-700 p-3 rounded-md text-center mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Alamat Email
              </label>
              <input
                className={inputClass}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
                required
              />
              {emailError && (
                <p className="text-red-500 text-xs italic mt-2">
                  {emailError}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  className={inputClass}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeIcon className="h-6 w-6 text-gray-500" />
                  ) : (
                    <EyeSlashIcon className="h-6 w-6 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg disabled:bg-blue-300"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Belum punya akun?{' '}
            <Link to="/register" className="font-bold text-blue-600 hover:text-blue-800">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;