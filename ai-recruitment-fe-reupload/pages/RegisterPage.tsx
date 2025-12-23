import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { EyeIcon, EyeSlashIcon } from '../components/icons';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const { register, loading, error: authError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setEmailError('');
    setSuccessMessage('');

    if (!email.endsWith('@gmail.com')) {
        setEmailError('Email harus menggunakan domain @gmail.com');
        return;
    }

    const isPasswordValid = password.length >= 6 && /[A-Z]/.test(password) && /[0-9]/.test(password);
    if (!isPasswordValid) {
        setPasswordError('Password harus minimal 6 karakter, mengandung huruf besar, dan angka.');
        return;
    }
    
    if (password !== confirmPassword) {
      setPasswordError('Konfirmasi password tidak cocok.');
      return;
    }

    const success = await register({ name, email, password });
    if (success) {
      setSuccessMessage('✅ Registrasi berhasil!');
      setTimeout(() => navigate('/login'), 3000);
    }
  };
  
  const inputClass = "shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-colors";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-lg rounded-xl px-8 pt-6 pb-8 mb-4">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800">Buat Akun</h1>
            <p className="text-gray-500">Gabung dengan AI Recruit</p>
          </div>
          
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-800 font-medium rounded-md p-3 text-center mb-4" role="alert">
              {successMessage}
            </div>
          )}

          {authError && !successMessage && <p className="bg-red-100 text-red-700 p-3 rounded-md text-center mb-4">{authError}</p>}
          
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Nama Lengkap
              </label>
              <input
                className={inputClass}
                id="name"
                type="text"
                placeholder="Nama Anda"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Alamat Email
              </label>
              <input
                className={inputClass}
                id="email"
                type="email"
                placeholder="email@contoh.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
                required
              />
              {emailError && <p className="text-red-500 text-xs italic mt-2">{emailError}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  className={inputClass}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeIcon className="h-6 w-6 text-gray-500" /> : <EyeSlashIcon className="h-6 w-6 text-gray-500" />}
                </button>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm-password">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  className={inputClass}
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder=""
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  aria-label={showConfirmPassword ? "Sembunyikan konfirmasi password" : "Tampilkan konfirmasi password"}
                >
                  {showConfirmPassword ? <EyeIcon className="h-6 w-6 text-gray-500" /> : <EyeSlashIcon className="h-6 w-6 text-gray-500" />}
                </button>
              </div>
               {passwordError && <p className="text-red-500 text-xs italic mt-2">{passwordError}</p>}
            </div>
            <div className="flex items-center justify-between">
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading || !!successMessage}
              >
                {loading ? 'Memproses...' : 'Daftar'}
              </button>
            </div>
          </form>
          <p className="text-center text-gray-500 text-sm mt-6">
            Sudah punya akun?{' '}
            <Link to="/login" className="font-bold text-blue-600 hover:text-blue-800">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;