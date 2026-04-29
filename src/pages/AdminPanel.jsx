import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const C = {
  bg: '#FFFFFF', bgSoft: '#FAFAF8', bgMuted: '#F5F3EF',
  text: '#0A0A0A', textSoft: '#0A0A0A', textMuted: '#5C5C57',
  border: '#E8E6E1',
  green: '#16A34A', greenHover: '#15803D',
  greenLight: 'rgba(22,163,74,0.08)', greenBorder: 'rgba(22,163,74,0.2)',
  success: '#1A7F37', successLight: 'rgba(27,140,58,0.08)', successBorder: 'rgba(27,140,58,0.2)',
  red: '#CF222E', redLight: 'rgba(211,47,47,0.07)', redBorder: 'rgba(211,47,47,0.18)',
  yellow: '#C67F00', yellowLight: 'rgba(198,127,0,0.06)', yellowBorder: 'rgba(198,127,0,0.15)',
};

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAIL || '').split(',').map(e => e.trim().toLowerCase());

const globalStyles = `
  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  * { box-sizing: border-box; }
`;

function StatCard({ label, value, color }) {
  return (
    <div style={{ padding: '20px 24px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16 }}>
      <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 700, fontFamily: "'Instrument Serif', serif", color: color || C.text }}>{value}</div>
    </div>
  );
}

export default function AdminPanel({ user }) {
  const [requests, setRequests]     = useState([]);
  const [users, setUsers]           = useState([]);
  const [reviews, setReviews]       = useState([]);
  const [stats, setStats]           = useState({ pending: 0, active: 0, total: 0 });
  const [loading, setLoading]       = useState(true);
  const [actionId, setActionId]     = useState(null);
  const [tab, setTab]               = useState('payments');
  const [rejectNote, setRejectNote] = useState('');
  const [rejectTarget, setRejectTarget] = useState(null);
  const [reviewActionId, setReviewActionId] = useState(null);
  const [deleteTarget, setDeleteTarget]     = useState(null); // review id pending delete confirm
  const [userFilters, setUserFilters] = useState({ email: '', name: '', status: 'all', plan: 'all', freeSessions: 'all', monthlySessions: 'all' });

  // Gate — only admin email
  if (!user || !ADMIN_EMAILS.includes(user.email.toLowerCase())) {
    return (
      <div style={{ minHeight: '100vh', background: C.bgSoft, paddingTop: 55, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: C.red, marginBottom: 8 }}>Access denied.</div>
          <div style={{ fontSize: 11, color: C.textMuted }}>Admin access requires the designated admin account.</div>
        </div>
      </div>
    );
  }

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [reqRes, profileRes, statsRes, reviewRes] = await Promise.all([
        supabase
          .from('payment_requests')
          .select('*')
          .order('submitted_at', { ascending: false }),
        supabase.rpc('get_all_users'),
        supabase.rpc('get_admin_stats'),
        supabase.rpc('get_all_reviews'),
      ]);

      const reqs  = reqRes.data      || [];
      const profs = profileRes.data  || [];
      const s     = statsRes.data    || {};
      const revs  = reviewRes.data   || [];

      setRequests(reqs);
      setUsers(profs);
      setReviews(revs);
      setStats({
        pending: s.pending_payments ?? 0,
        active:  s.active_pro       ?? 0,
        total:   s.total_users      ?? 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleApprove = async (id) => {
    setActionId(id);
    try {
      const { error } = await supabase.rpc('approve_payment', {
        request_id:  id,
        admin_email: user.email,
      });
      if (error) throw error;
      await loadData();
    } catch (e) {
      alert(`Approve failed: ${e.message}`);
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    setActionId(rejectTarget);
    try {
      const { error } = await supabase.rpc('reject_payment', {
        request_id:  rejectTarget,
        admin_email: user.email,
        note:        rejectNote || null,
      });
      if (error) throw error;
      setRejectTarget(null);
      setRejectNote('');
      await loadData();
    } catch (e) {
      alert(`Reject failed: ${e.message}`);
    } finally {
      setActionId(null);
    }
  };

  const handleReviewStatus = async (id, newStatus) => {
    setReviewActionId(id);
    try {
      const { error } = await supabase.rpc('admin_update_review_status', { review_id: id, new_status: newStatus });
      if (error) throw error;
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (e) {
      alert(`Failed: ${e.message}`);
    } finally {
      setReviewActionId(null);
    }
  };

  const handleDeleteReview = async () => {
    if (!deleteTarget) return;
    setReviewActionId(deleteTarget);
    try {
      const { error } = await supabase.rpc('admin_delete_review', { review_id: deleteTarget });
      if (error) throw error;
      setReviews(prev => prev.filter(r => r.id !== deleteTarget));
      setDeleteTarget(null);
    } catch (e) {
      alert(`Delete failed: ${e.message}`);
    } finally {
      setReviewActionId(null);
    }
  };

  const statusChip = (status) => {
    const map = {
      pending:  { bg: C.yellowLight,  border: C.yellowBorder,  color: C.yellow, label: 'Pending' },
      approved: { bg: C.successLight,   border: C.successBorder,   color: C.success,  label: 'Approved' },
      rejected: { bg: C.redLight,     border: C.redBorder,     color: C.red,    label: 'Rejected' },
    };
    const s = map[status] || { bg: C.bgMuted, border: C.border, color: C.textMuted, label: status };
    return (
      <span style={{ padding: '3px 10px', background: s.bg, border: `1px solid ${s.border}`, borderRadius: 20, fontSize: 10, color: s.color, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: 0.5 }}>
        {s.label}
      </span>
    );
  };

  const subChip = (status) => {
    const map = {
      free:    { bg: C.bgMuted,      border: C.border,        color: C.textMuted, label: 'Free' },
      pending: { bg: C.yellowLight,  border: C.yellowBorder,  color: C.yellow,    label: 'Pending' },
      active:  { bg: C.successLight,   border: C.successBorder,   color: C.success,     label: 'Active' },
      expired: { bg: C.redLight,     border: C.redBorder,     color: C.red,       label: 'Expired' },
    };
    const s = map[status] || map.free;
    return (
      <span style={{ padding: '3px 10px', background: s.bg, border: `1px solid ${s.border}`, borderRadius: 20, fontSize: 10, color: s.color, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: 0.5 }}>
        {s.label}
      </span>
    );
  };

  const fmt = (d) => d ? new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

  return (
    <div style={{ minHeight: '100vh', background: C.bgSoft, paddingTop: 55, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{globalStyles}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 28px', animation: 'fadeUp 0.4s cubic-bezier(0.22,1,0.36,1)' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 10, letterSpacing: 5, color: C.green, textTransform: 'uppercase', marginBottom: 8 }}>Admin</div>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, fontWeight: 700, color: C.text, marginBottom: 4 }}>Control Panel</h1>
          <div style={{ fontSize: 11, color: C.textMuted }}>{user.email}</div>
        </div>

        {/* Stats */}
        {!loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
            <StatCard label="Pending Payments"   value={stats.pending} color={stats.pending > 0 ? C.yellow : C.textMuted} />
            <StatCard label="Active Pro Users"   value={stats.active}  color={C.success} />
            <StatCard label="Total Users"        value={stats.total}   color={C.text} />
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: `1px solid ${C.border}` }}>
          {[['payments', 'Payment Requests'], ['users', 'Users'], ['reviews', 'Reviews']].map(([id, label]) => {
            const pendingReviews = reviews.filter(r => r.status === 'pending').length;
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                style={{
                  padding: '10px 16px', background: 'transparent',
                  border: 'none', borderBottom: `2px solid ${tab === id ? C.green : 'transparent'}`,
                  cursor: 'pointer', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase',
                  color: tab === id ? C.green : C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif",
                  transition: 'all 0.2s', marginBottom: -1,
                }}
              >
                {label}
                {id === 'payments' && stats.pending > 0 && (
                  <span style={{ marginLeft: 8, padding: '2px 6px', background: C.green, color: '#fff', borderRadius: 10, fontSize: 9 }}>
                    {stats.pending}
                  </span>
                )}
                {id === 'reviews' && pendingReviews > 0 && (
                  <span style={{ marginLeft: 8, padding: '2px 6px', background: C.yellow, color: '#fff', borderRadius: 10, fontSize: 9 }}>
                    {pendingReviews}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {loading && (
          <div style={{ padding: '40px 0', textAlign: 'center', fontSize: 11, color: C.textMuted, letterSpacing: 3, textTransform: 'uppercase' }}>
            Loading...
          </div>
        )}

        {/* Payment Requests tab */}
        {!loading && tab === 'payments' && (
          <div>
            {requests.length === 0 ? (
              <div style={{ padding: '40px 0', textAlign: 'center', fontSize: 12, color: C.textMuted }}>No payment requests yet.</div>
            ) : (
              <div style={{ border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: C.bgMuted, borderBottom: `1px solid ${C.border}` }}>
                      {['Email', 'Plan', 'Amount', 'Discount', 'Final Amt', 'UPI Ref', 'Submitted', 'Status', 'Actions'].map(h => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.textMuted, fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((r, i) => (
                      <tr key={r.id} style={{ borderBottom: i < requests.length - 1 ? `1px solid ${C.border}` : 'none', background: r.status === 'pending' ? C.yellowLight : C.bg }}>
                        <td style={{ padding: '12px 14px', color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{r.user_email}</td>
                        <td style={{ padding: '12px 14px', color: C.textSoft, textTransform: 'capitalize' }}>{r.plan}</td>
                        <td style={{ padding: '12px 14px', color: C.text, fontWeight: 600 }}>₹{r.amount_inr?.toLocaleString('en-IN')}</td>
                        <td style={{ padding: '12px 14px' }}>
                          {r.discount_code ? (
                            <span style={{ padding: '2px 8px', background: C.greenLight, border: `1px solid ${C.greenBorder}`, borderRadius: 10, fontSize: 10, color: C.green, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: 0.5, whiteSpace: 'nowrap' }}>
                              {r.discount_code} ({r.discount_percent}%)
                            </span>
                          ) : <span style={{ color: C.textMuted }}>—</span>}
                        </td>
                        <td style={{ padding: '12px 14px', color: r.final_amount ? C.success : C.textMuted, fontWeight: r.final_amount ? 600 : 400 }}>
                          {r.final_amount ? `₹${r.final_amount.toLocaleString('en-IN')}` : '—'}
                        </td>
                        <td style={{ padding: '12px 14px', color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: 0.5 }}>{r.upi_ref}</td>
                        <td style={{ padding: '12px 14px', color: C.textMuted, whiteSpace: 'nowrap' }}>{fmt(r.submitted_at)}</td>
                        <td style={{ padding: '12px 14px' }}>{statusChip(r.status)}</td>
                        <td style={{ padding: '12px 14px' }}>
                          {r.status === 'pending' && (
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button
                                onClick={() => handleApprove(r.id)}
                                disabled={actionId === r.id}
                                style={{ padding: '5px 12px', background: C.green, border: 'none', borderRadius: 6, color: '#fff', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", opacity: actionId === r.id ? 0.5 : 1 }}
                              >
                                {actionId === r.id ? '...' : 'Approve'}
                              </button>
                              <button
                                onClick={() => setRejectTarget(r.id)}
                                disabled={actionId === r.id}
                                style={{ padding: '5px 12px', background: 'transparent', border: `1px solid ${C.red}`, borderRadius: 6, color: C.red, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                              >
                                Reject
                              </button>
                            </div>
                          )}
                          {r.status === 'rejected' && r.admin_note && (
                            <span style={{ fontSize: 11, color: C.textMuted, fontStyle: 'italic' }}>{r.admin_note}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Users tab */}
        {!loading && tab === 'users' && (
          <div>
            {users.length === 0 ? (
              <div style={{ padding: '40px 0', textAlign: 'center', fontSize: 12, color: C.textMuted }}>No users yet.</div>
            ) : (() => {
              const f = userFilters;
              const filtered = users.filter(u => {
                if (f.email && !(u.email || '').toLowerCase().includes(f.email.toLowerCase())) return false;
                if (f.name  && !(u.display_name || '').toLowerCase().includes(f.name.toLowerCase())) return false;
                if (f.status !== 'all') {
                  const st = u.subscription_status || 'free';
                  if (f.status === 'free'    && st !== 'free')    return false;
                  if (f.status === 'active'  && st !== 'active')  return false;
                  if (f.status === 'expired' && st !== 'expired') return false;
                }
                if (f.plan !== 'all') {
                  const pl = u.subscription_plan || '';
                  if (f.plan === 'monthly' && pl !== 'monthly') return false;
                  if (f.plan === 'yearly'  && pl !== 'yearly')  return false;
                  if (f.plan === 'none'    && pl !== '')         return false;
                }
                if (f.freeSessions === 'used'    && (u.free_sessions_used ?? 0) === 0) return false;
                if (f.freeSessions === 'notused' && (u.free_sessions_used ?? 0) > 0)   return false;
                if (f.monthlySessions === 'active'   && (u.monthly_sessions_used ?? 0) === 0) return false;
                if (f.monthlySessions === 'inactive' && (u.monthly_sessions_used ?? 0) > 0)   return false;
                return true;
              });

              const inputStyle = { width: '100%', padding: '6px 10px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12, fontFamily: "'Plus Jakarta Sans', sans-serif", color: C.text, background: C.bg, outline: 'none' };
              const selectStyle = { ...inputStyle, cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%235C5C57'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', paddingRight: 28 };
              const labelStyle = { fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.textMuted, fontWeight: 600, display: 'block', marginBottom: 5 };
              const setF = (key, val) => setUserFilters(prev => ({ ...prev, [key]: val }));
              const hasFilters = f.email || f.name || f.status !== 'all' || f.plan !== 'all' || f.freeSessions !== 'all' || f.monthlySessions !== 'all';

              return (
                <>
                  {/* Filter row */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 12, alignItems: 'flex-end' }}>
                    <div style={{ flex: '1 1 160px', minWidth: 140 }}>
                      <label style={labelStyle}>Email</label>
                      <input type="text" placeholder="Search email…" value={f.email} onChange={e => setF('email', e.target.value)} style={inputStyle} />
                    </div>
                    <div style={{ flex: '1 1 140px', minWidth: 120 }}>
                      <label style={labelStyle}>Name</label>
                      <input type="text" placeholder="Filter by name" value={f.name} onChange={e => setF('name', e.target.value)} style={inputStyle} />
                    </div>
                    <div style={{ flex: '1 1 130px', minWidth: 110 }}>
                      <label style={labelStyle}>Status</label>
                      <select value={f.status} onChange={e => setF('status', e.target.value)} style={selectStyle}>
                        <option value="all">All</option>
                        <option value="free">Free</option>
                        <option value="active">Active (Pro)</option>
                        <option value="expired">Expired</option>
                      </select>
                    </div>
                    <div style={{ flex: '1 1 130px', minWidth: 110 }}>
                      <label style={labelStyle}>Plan</label>
                      <select value={f.plan} onChange={e => setF('plan', e.target.value)} style={selectStyle}>
                        <option value="all">All</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                    <div style={{ flex: '1 1 150px', minWidth: 130 }}>
                      <label style={labelStyle}>Free Sessions</label>
                      <select value={f.freeSessions} onChange={e => setF('freeSessions', e.target.value)} style={selectStyle}>
                        <option value="all">All</option>
                        <option value="used">Used (&gt;0)</option>
                        <option value="notused">Not Used (0)</option>
                      </select>
                    </div>
                    <div style={{ flex: '1 1 170px', minWidth: 150 }}>
                      <label style={labelStyle}>Monthly Sessions</label>
                      <select value={f.monthlySessions} onChange={e => setF('monthlySessions', e.target.value)} style={selectStyle}>
                        <option value="all">All</option>
                        <option value="active">Active (&gt;0)</option>
                        <option value="inactive">Inactive (0)</option>
                      </select>
                    </div>
                    {hasFilters && (
                      <div style={{ flex: '0 0 auto', paddingBottom: 1 }}>
                        <button onClick={() => setUserFilters({ email: '', name: '', status: 'all', plan: 'all', freeSessions: 'all', monthlySessions: 'all' })} style={{ background: 'none', border: 'none', color: C.green, fontSize: 11, cursor: 'pointer', textDecoration: 'underline', fontFamily: "'Plus Jakarta Sans', sans-serif", padding: '6px 0' }}>
                          Reset Filters
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Count */}
                  <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 12 }}>
                    Showing {filtered.length} of {users.length} users
                  </div>

                  {/* Table */}
                  <div style={{ border: `1px solid ${C.border}`, borderRadius: 16, overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 700 }}>
                      <thead>
                        <tr style={{ background: C.bgMuted, borderBottom: `1px solid ${C.border}` }}>
                          {['Email', 'Name', 'Status', 'Plan', 'Expires', 'Free Sessions', 'Monthly Sessions'].map(h => (
                            <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.textMuted, fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.length === 0 ? (
                          <tr><td colSpan={7} style={{ padding: '28px 14px', textAlign: 'center', color: C.textMuted, fontSize: 12 }}>No users match the filters.</td></tr>
                        ) : filtered.map((u, i) => (
                          <tr key={u.id} style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                            <td style={{ padding: '12px 14px', color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12 }}>{u.email || '—'}</td>
                            <td style={{ padding: '12px 14px', color: u.display_name ? C.text : C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{u.display_name || '—'}</td>
                            <td style={{ padding: '12px 14px' }}>{subChip(u.subscription_status)}</td>
                            <td style={{ padding: '12px 14px', color: C.textSoft, textTransform: 'capitalize' }}>{u.subscription_plan || '—'}</td>
                            <td style={{ padding: '12px 14px', color: C.textMuted, whiteSpace: 'nowrap', fontSize: 11 }}>{fmt(u.subscription_expires_at)}</td>
                            <td style={{ padding: '12px 14px', color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{u.free_sessions_used ?? 0}</td>
                            <td style={{ padding: '12px 14px', color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{u.monthly_sessions_used ?? 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* Reviews tab */}
        {!loading && tab === 'reviews' && (
          <div>
            {reviews.length === 0 ? (
              <div style={{ padding: '40px 0', textAlign: 'center', fontSize: 12, color: C.textMuted }}>No reviews yet.</div>
            ) : (
              <div style={{ border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: C.bgMuted, borderBottom: `1px solid ${C.border}` }}>
                      {['Name', 'Email', 'Rating', 'Review', 'Status', 'Date', 'Actions'].map(h => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.textMuted, fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map((r, i) => (
                      <tr key={r.id} style={{ borderBottom: i < reviews.length - 1 ? `1px solid ${C.border}` : 'none', background: r.status === 'pending' ? C.yellowLight : C.bg }}>
                        <td style={{ padding: '12px 14px', color: C.text }}>{r.show_name ? r.display_name : <em style={{ color: C.textMuted }}>anonymous</em>}</td>
                        <td style={{ padding: '12px 14px', color: C.textMuted, fontSize: 11 }}>{r.user_email}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ color: '#F59E0B', letterSpacing: 1 }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                        </td>
                        <td style={{ padding: '12px 14px', color: C.text, maxWidth: 260 }}>
                          <div style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.5 }}>
                            {r.review_text}
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px' }}>{statusChip(r.status)}</td>
                        <td style={{ padding: '12px 14px', color: C.textMuted, whiteSpace: 'nowrap', fontSize: 11 }}>{fmt(r.created_at)}</td>
                        <td style={{ padding: '12px 14px' }}>
                          {r.status !== 'approved' && (
                            <button
                              onClick={() => handleReviewStatus(r.id, 'approved')}
                              disabled={reviewActionId === r.id}
                              style={{ padding: '5px 12px', background: C.green, border: 'none', borderRadius: 6, color: '#fff', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", marginRight: 6, opacity: reviewActionId === r.id ? 0.5 : 1 }}
                            >
                              Approve
                            </button>
                          )}
                          {r.status !== 'rejected' && (
                            <button
                              onClick={() => handleReviewStatus(r.id, 'rejected')}
                              disabled={reviewActionId === r.id}
                              style={{ padding: '5px 12px', background: 'transparent', border: `1px solid ${C.red}`, borderRadius: 6, color: C.red, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", opacity: reviewActionId === r.id ? 0.5 : 1 }}
                            >
                              Reject
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteTarget(r.id)}
                            disabled={reviewActionId === r.id}
                            style={{ padding: '5px 12px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 6, color: C.textMuted, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", opacity: reviewActionId === r.id ? 0.5 : 1, marginLeft: 6 }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <div style={{ height: 60 }} />
      </div>

      {/* Delete review confirmation */}
      {deleteTarget && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ width: '100%', maxWidth: 400, background: C.bg, borderRadius: 16, padding: '28px 32px', boxShadow: '0 16px 48px rgba(0,0,0,0.14)' }}>
            <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 10 }}>Delete Review</h3>
            <p style={{ fontSize: 13, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 24, lineHeight: 1.6 }}>
              Are you sure you want to permanently delete this review? This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={handleDeleteReview}
                disabled={reviewActionId === deleteTarget}
                style={{ flex: 1, padding: '11px 0', background: C.red, border: 'none', borderRadius: 12, color: '#fff', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, opacity: reviewActionId === deleteTarget ? 0.5 : 1 }}
              >
                {reviewActionId === deleteTarget ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                style={{ flex: 1, padding: '11px 0', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 12, color: C.textMuted, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject modal */}
      {rejectTarget && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ width: '100%', maxWidth: 440, background: C.bg, borderRadius: 16, padding: '28px 32px', boxShadow: '0 16px 48px rgba(0,0,0,0.14)' }}>
            <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 8 }}>Reject Payment</h3>
            <p style={{ fontSize: 12, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 16 }}>Optional: add a note for the user.</p>
            <textarea
              value={rejectNote}
              onChange={e => setRejectNote(e.target.value)}
              placeholder="e.g. UPI reference not found. Please resubmit."
              rows={3}
              style={{ width: '100%', padding: '10px 12px', border: `1px solid ${C.border}`, borderRadius: 12, fontSize: 13, fontFamily: "'Plus Jakarta Sans', sans-serif", color: C.text, resize: 'none', marginBottom: 16 }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={handleReject}
                disabled={actionId === rejectTarget}
                style={{ flex: 1, padding: '11px 0', background: C.red, border: 'none', borderRadius: 12, color: '#fff', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}
              >
                {actionId === rejectTarget ? 'Rejecting...' : 'Confirm Reject'}
              </button>
              <button
                onClick={() => { setRejectTarget(null); setRejectNote(''); }}
                style={{ flex: 1, padding: '11px 0', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 12, color: C.textMuted, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
