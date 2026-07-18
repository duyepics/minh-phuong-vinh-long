'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  // Khởi tạo Supabase client ở phía trình duyệt
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Gọi API đăng nhập của Supabase
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('Sai email hoặc mật khẩu! Vui lòng thử lại.');
      setLoading(false);
    } else {
      // Đăng nhập thành công -> đẩy vào Dashboard và refresh lại layout
      router.push('/admin');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen dash-main-bg flex items-center justify-center p-4">
      <div className="dash-card w-full max-w-md p-8 dash-animate-in">
        <div className="text-center mb-8">
          <h1 className="dash-page-title mb-2">Quản trị hệ thống</h1>
          <p className="dash-page-desc">Đăng nhập để quản lý Gốm Sứ Minh Phương</p>
          <div className="dash-page-title-underline mx-auto"></div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="dash-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="dash-input"
              placeholder="admin@minhphuong.com"
              required
            />
          </div>
          <div>
            <label className="dash-label">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="dash-input"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="dash-btn-primary w-full mt-2"
            disabled={loading}
          >
            {loading ? 'Đang xác thực...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
}
