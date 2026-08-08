import React, { useState } from 'react';
import { Sparkles, Calendar, User, LogOut, ShieldCheck, Phone, Clock, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ onOpenAuth, onNavigate, activeTab }) => {
  const { user, logoutUser, isAdmin } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 4px 20px rgba(13, 38, 28, 0.08)', width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
      {/* Top Notification & Contact Strip */}
      <div style={{ background: '#091D16', color: '#A3C2B6', fontSize: '0.72rem', padding: '5px 0', borderBottom: '1px solid rgba(197, 160, 89, 0.25)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px 10px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={11} color="#C5A059" /> Lịch khám: T2 - CN (08:00 - 20:30)
          </span>

          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F7E7C4', fontWeight: 700 }}>
            <Phone size={11} color="#C5A059" /> Hotline / Zalo: 0778 726 235
          </span>
        </div>
      </div>

      {/* Main Luxury Header Bar */}
      <nav style={{ background: 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(31, 77, 62, 0.1)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px' }}>
          {/* Brand Logo */}
          <div
            className="logo-brand"
            onClick={() => handleNavClick('calendar')}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 1, minWidth: 0 }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1F4D3E 0%, #C5A059 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 4px 14px rgba(31, 77, 62, 0.3)',
                flexShrink: 0,
              }}
            >
              <Sparkles size={16} />
            </div>

            <div style={{ minWidth: 0, flexShrink: 1 }}>
              <div className="navbar-logo-title" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-dark)', lineHeight: 1.2, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem' }}>Dermacare</span>
                <span style={{ color: 'var(--primary-emerald)', fontSize: '0.88rem', fontWeight: 700 }}>• Đặt Lịch Khám</span>
              </div>
              <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                BS. Đỗ Nguyễn Quỳnh Ngân
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <ul className="desktop-only" style={{ alignItems: 'center', gap: '10px', listStyle: 'none' }}>
            <li
              onClick={() => handleNavClick('calendar')}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.88rem',
                fontWeight: activeTab === 'calendar' ? 800 : 600,
                color: activeTab === 'calendar' ? '#FFFFFF' : 'var(--text-main)',
                background: activeTab === 'calendar' ? 'linear-gradient(135deg, #1F4D3E, #0D261C)' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                boxShadow: activeTab === 'calendar' ? '0 4px 14px rgba(31, 77, 62, 0.3)' : 'none',
              }}
            >
              <Calendar size={15} /> Đặt Lịch Khám Online
            </li>

            <li
              onClick={() => handleNavClick('lookup')}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.88rem',
                fontWeight: activeTab === 'lookup' ? 800 : 600,
                color: activeTab === 'lookup' ? '#FFFFFF' : 'var(--text-main)',
                background: activeTab === 'lookup' ? 'linear-gradient(135deg, #1F4D3E, #0D261C)' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                boxShadow: activeTab === 'lookup' ? '0 4px 14px rgba(31, 77, 62, 0.3)' : 'none',
              }}
            >
              <Search size={15} /> Tra Cứu Lịch Hẹn
            </li>

            {isAdmin && (
              <li
                onClick={() => handleNavClick('admin')}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.88rem',
                  fontWeight: activeTab === 'admin' ? 800 : 600,
                  color: activeTab === 'admin' ? '#0D261C' : 'var(--primary-emerald)',
                  background: activeTab === 'admin' ? 'linear-gradient(135deg, #F3E5AB, #C5A059)' : 'rgba(31, 77, 62, 0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                }}
              >
                <ShieldCheck size={15} /> Bác Sĩ Dashboard
              </li>
            )}
          </ul>

          {/* Right Action / Auth & Mobile Toggle Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#FFFFFF',
                    border: '1.5px solid rgba(31, 77, 62, 0.2)',
                    padding: '5px 10px',
                    borderRadius: 'var(--radius-full)',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
                    cursor: 'pointer',
                  }}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--primary-emerald)' }}
                  />
                  <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--primary-dark)', whiteSpace: 'nowrap' }}>{user.name.split(' ')[0]}</span>
                </button>

                {showDropdown && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '46px',
                      right: 0,
                      width: '210px',
                      background: '#FFFFFF',
                      borderRadius: 'var(--radius-md)',
                      padding: '12px',
                      boxShadow: '0 16px 40px rgba(13, 38, 28, 0.15)',
                      border: '1px solid var(--border-light)',
                      zIndex: 100,
                    }}
                  >
                    <div style={{ paddingBottom: '8px', marginBottom: '8px', borderBottom: '1px solid var(--border-light)' }}>
                      <p style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--primary-dark)' }}>{user.name}</p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{user.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        handleNavClick('lookup');
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 10px',
                        background: 'none',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <Calendar size={14} /> Lịch hẹn của tôi
                    </button>

                    <button
                      onClick={() => {
                        logoutUser();
                        setShowDropdown(false);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 10px',
                        background: '#fee2e2',
                        border: 'none',
                        color: '#991b1b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        marginTop: '6px',
                      }}
                    >
                      <LogOut size={14} /> Đăng Xuất Tài Khoản
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="btn-gold desktop-only" onClick={onOpenAuth} style={{ padding: '7px 16px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                <User size={14} />
                <span>Đăng Nhập</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              className="mobile-only"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-cream)',
                border: '1px solid var(--border-light)',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-dark)',
                cursor: 'pointer',
                flexShrink: 0,
              }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Down Drawer Menu */}
        {mobileMenuOpen && (
          <div
            className="mobile-only"
            style={{
              flexDirection: 'column',
              background: '#FFFFFF',
              borderTop: '1px solid var(--border-light)',
              padding: '12px 14px',
              animation: 'slideDown 0.25s ease forwards',
              boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
              <button
                onClick={() => handleNavClick('calendar')}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: activeTab === 'calendar' ? 'linear-gradient(135deg, #1F4D3E, #0D261C)' : 'var(--bg-cream)',
                  color: activeTab === 'calendar' ? '#FFFFFF' : 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  border: 'none',
                }}
              >
                <Calendar size={16} /> Đặt Lịch Khám Online
              </button>

              <button
                onClick={() => handleNavClick('lookup')}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: activeTab === 'lookup' ? 'linear-gradient(135deg, #1F4D3E, #0D261C)' : 'var(--bg-cream)',
                  color: activeTab === 'lookup' ? '#FFFFFF' : 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  border: 'none',
                }}
              >
                <Search size={16} /> Tra Cứu Lịch Hẹn
              </button>

              {isAdmin && (
                <button
                  onClick={() => handleNavClick('admin')}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: activeTab === 'admin' ? 'linear-gradient(135deg, #F3E5AB, #C5A059)' : 'rgba(31, 77, 62, 0.08)',
                    color: activeTab === 'admin' ? '#0D261C' : 'var(--primary-emerald)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    border: 'none',
                  }}
                >
                  <ShieldCheck size={16} /> Bác Sĩ Dashboard
                </button>
              )}

              {user ? (
                <div style={{ padding: '10px 12px', background: 'var(--bg-cream)', borderRadius: 'var(--radius-md)', marginTop: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <img
                      src={user.avatar}
                      alt={user.name}
                      style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1.5px solid var(--primary-emerald)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--primary-dark)' }}>{user.name}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logoutUser();
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: '#fee2e2',
                      color: '#991b1b',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    <LogOut size={16} /> Đăng Xuất Tài Khoản
                  </button>
                </div>
              ) : (
                <button
                  className="btn-gold"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    marginTop: '4px',
                    padding: '10px',
                  }}
                >
                  <User size={16} /> Đăng Nhập / Đăng Ký
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
