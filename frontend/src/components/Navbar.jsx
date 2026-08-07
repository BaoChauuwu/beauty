import React, { useState } from 'react';
import { Sparkles, Calendar, User, LogOut, ShieldCheck, MapPin, Phone, Clock, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ onOpenAuth, onNavigate, activeTab }) => {
  const { user, logoutUser, isAdmin } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 4px 20px rgba(13, 38, 28, 0.08)' }}>
      {/* Top Notification & Contact Strip */}
      <div style={{ background: '#091D16', color: '#A3C2B6', fontSize: '0.8rem', padding: '7px 0', borderBottom: '1px solid rgba(197, 160, 89, 0.25)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Clock size={13} color="#C5A059" /> Lịch mở khám: T2 - CN (08:00 - 20:30)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#F7E7C4', fontWeight: 700 }}>
              <Phone size={13} color="#C5A059" /> Hotline / Zalo: 0778 726 235
            </span>
          </div>
        </div>
      </div>

      {/* Main Luxury Header Bar */}
      <nav style={{ background: 'rgba(255, 255, 255, 0.96)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(31, 77, 62, 0.1)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px' }}>
          {/* Brand Logo */}
          <div
            className="logo-brand"
            onClick={() => onNavigate('calendar')}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px' }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1F4D3E 0%, #C5A059 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 4px 14px rgba(31, 77, 62, 0.3)',
              }}
            >
              <Sparkles size={24} />
            </div>

            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-dark)', leadingHeight: 1.1 }}>
                BS. Đỗ Nguyễn Quỳnh Ngân
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--primary-emerald)', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Phòng Khám Da Liễu Thẩm Mỹ
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <ul style={{ display: 'flex', alignItems: 'center', gap: '12px', listStyle: 'none' }}>
            <li
              onClick={() => onNavigate('calendar')}
              style={{
                padding: '10px 20px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.92rem',
                fontWeight: activeTab === 'calendar' ? 800 : 600,
                color: activeTab === 'calendar' ? '#FFFFFF' : 'var(--text-main)',
                background: activeTab === 'calendar' ? 'linear-gradient(135deg, #1F4D3E, #0D261C)' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: activeTab === 'calendar' ? '0 4px 14px rgba(31, 77, 62, 0.3)' : 'none',
              }}
            >
              <Calendar size={16} /> Đặt Lịch Khám Online
            </li>

            <li
              onClick={() => onNavigate('lookup')}
              style={{
                padding: '10px 20px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.92rem',
                fontWeight: activeTab === 'lookup' ? 800 : 600,
                color: activeTab === 'lookup' ? '#FFFFFF' : 'var(--text-main)',
                background: activeTab === 'lookup' ? 'linear-gradient(135deg, #1F4D3E, #0D261C)' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: activeTab === 'lookup' ? '0 4px 14px rgba(31, 77, 62, 0.3)' : 'none',
              }}
            >
              <Search size={16} /> Tra Cứu Lịch Hẹn
            </li>

            {isAdmin && (
              <li
                onClick={() => onNavigate('admin')}
                style={{
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.92rem',
                  fontWeight: activeTab === 'admin' ? 800 : 600,
                  color: activeTab === 'admin' ? '#0D261C' : 'var(--primary-emerald)',
                  background: activeTab === 'admin' ? 'linear-gradient(135deg, #F3E5AB, #C5A059)' : 'rgba(31, 77, 62, 0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <ShieldCheck size={16} /> Bác Sĩ Dashboard
              </li>
            )}
          </ul>

          {/* Right Action / Auth Button */}
          <div>
            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: '#FFFFFF',
                    border: '1.5px solid rgba(31, 77, 62, 0.2)',
                    padding: '8px 18px',
                    borderRadius: 'var(--radius-full)',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
                    cursor: 'pointer',
                  }}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--primary-emerald)' }}
                  />
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary-dark)' }}>{user.name.split(' ')[0]}</span>
                </button>

                {showDropdown && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '52px',
                      right: 0,
                      width: '230px',
                      background: '#FFFFFF',
                      borderRadius: 'var(--radius-md)',
                      padding: '14px',
                      boxShadow: '0 16px 40px rgba(13, 38, 28, 0.15)',
                      border: '1px solid var(--border-light)',
                      zIndex: 100,
                    }}
                  >
                    <div style={{ paddingBottom: '10px', marginBottom: '8px', borderBottom: '1px solid var(--border-light)' }}>
                      <p style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--primary-dark)' }}>{user.name}</p>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{user.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        onNavigate('lookup');
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 12px',
                        background: 'none',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <Calendar size={16} /> Lịch hẹn của tôi
                    </button>

                    <button
                      onClick={() => {
                        logoutUser();
                        setShowDropdown(false);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 12px',
                        background: 'none',
                        border: 'none',
                        color: '#DC2626',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        marginTop: '4px',
                      }}
                    >
                      <LogOut size={16} /> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="btn-gold" onClick={onOpenAuth} style={{ padding: '10px 24px', fontSize: '0.88rem' }}>
                <User size={18} />
                <span>Đăng Nhập</span>
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

