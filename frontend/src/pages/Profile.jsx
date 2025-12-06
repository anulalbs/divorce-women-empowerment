import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useSelector } from 'react-redux';
import Toast from '../components/common/Toast';

export default function Profile() {
  const { profile } = useSelector((s) => s.user || {});
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const [form, setForm] = useState({ fullname: '', email: '', phone: '', location: '' });
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirm: '' });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get('/users/me');
        if (!mounted) return;
        setUser(res.data.user);
        setForm({ fullname: res.data.user.fullname || '', email: res.data.user.email || '', phone: res.data.user.phone || '', location: res.data.user.location || '' });
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const updateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      // Only send allowed fields (fullname, location). Email and phone are not editable.
      const payload = { fullname: form.fullname, location: form.location };
      const res = await axiosClient.patch('/users/me', payload);
      setUser(res.data.user);
      setMsg({ type: 'success', text: 'Profile updated' });
    } catch (err) {
      console.error('Update failed', err);
      setMsg({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (pw.newPassword !== pw.confirm) {
      setMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    setSaving(true);
    try {
      const res = await axiosClient.patch('/users/me/password', { currentPassword: pw.currentPassword, newPassword: pw.newPassword });
      setMsg({ type: 'success', text: res.data.message || 'Password changed' });
      setPw({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      console.error('Password change failed', err);
      setMsg({ type: 'error', text: err.response?.data?.message || 'Password change failed' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container py-4">Loading...</div>;

  return (
    <div className="container py-4">
  <h2 className="text-start">My Profile</h2>
      <Toast msg={msg} onClose={() => setMsg(null)} />
      <div className="card p-3 mb-3">
        <form onSubmit={updateProfile}>
          <div className="mb-2">
            <label className="form-label">Full name</label>
            <input className="form-control" value={form.fullname} onChange={(e) => setForm(f => ({ ...f, fullname: e.target.value }))} />
          </div>
          <div className="mb-2">
            <label className="form-label">Email</label>
            <input className="form-control" value={form.email} readOnly disabled />
            <div className="form-text">Email cannot be changed. Contact support to update.</div>
          </div>
          <div className="mb-2">
            <label className="form-label">Phone</label>
            <input className="form-control" value={form.phone} readOnly disabled />
            <div className="form-text">Phone cannot be changed. Contact support to update.</div>
          </div>
          <div className="mb-2">
            <label className="form-label">Location</label>
            <input className="form-control" value={form.location} onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Update profile'}</button>
          </div>
        </form>
      </div>

      <div className="card p-3">
        <h5>Change password</h5>
        <form onSubmit={changePassword}>
          <div className="mb-2">
            <label className="form-label">Current password</label>
            <input type="password" className="form-control" value={pw.currentPassword} onChange={(e) => setPw(p => ({ ...p, currentPassword: e.target.value }))} />
          </div>
          <div className="mb-2">
            <label className="form-label">New password</label>
            <input type="password" className="form-control" value={pw.newPassword} onChange={(e) => setPw(p => ({ ...p, newPassword: e.target.value }))} />
          </div>
          <div className="mb-2">
            <label className="form-label">Confirm new password</label>
            <input type="password" className="form-control" value={pw.confirm} onChange={(e) => setPw(p => ({ ...p, confirm: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Change password'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
