import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout.tsx';
import toast from 'react-hot-toast';

interface MetaItem {
  _id: string;
  name: string;
  type: 'position' | 'level';
  usageCount: number;
}

const API_BASE = 'http://localhost:5001/api/admin/metadata';

export default function SystemDataPage() {
  const [items, setItems] = useState<MetaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MetaItem | null>(null);
  const [form, setForm] = useState({ name: '', type: 'position' as 'position' | 'level' });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = (type: 'position' | 'level') => {
    setEditingItem(null);
    setForm({ name: '', type });
    setShowModal(true);
  };

  const openEdit = (item: MetaItem) => {
    setEditingItem(item);
    setForm({ name: item.name, type: item.type });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    const loadingToast = toast.loading(editingItem ? 'Updating metadata...' : 'Adding metadata...');
    try {
      if (editingItem) {
        const res = await fetch(`${API_BASE}/${editingItem._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: form.name })
        });
        if (res.ok) {
          toast.success('Metadata updated successfully!', { id: loadingToast });
          fetchItems();
        } else {
          toast.error('Failed to update metadata.', { id: loadingToast });
        }
      } else {
        const res = await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        if (res.ok) {
          toast.success('Metadata added successfully!', { id: loadingToast });
          fetchItems();
        } else {
          toast.error('Failed to add metadata.', { id: loadingToast });
        }
      }
      setShowModal(false);
    } catch (err) {
      console.error('Save error:', err);
      toast.error('An error occurred while saving.', { id: loadingToast });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item? This may affect existing interview setups.')) {
      const loadingToast = toast.loading('Deleting metadata...');
      try {
        const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
        if (res.ok) {
          toast.success('Metadata deleted successfully.', { id: loadingToast });
          fetchItems();
        } else {
          toast.error('Failed to delete metadata.', { id: loadingToast });
        }
      } catch (err) {
        console.error('Delete error:', err);
        toast.error('An error occurred during deletion.', { id: loadingToast });
      }
    }
  };

  return (
    <AdminLayout activePage="/system-data">
      <div className="page-header">
        <div className="page-tag">
          <span className="material-symbols-outlined">settings_input_component</span>
          System Configuration
        </div>
        <h1 className="page-title">Manage <span>Metadata</span></h1>
        <p className="page-desc">Configure Job Positions and Seniority Levels available across the platform.</p>
      </div>

      {loading ? (
        <div className="empty-state">
           <span className="material-symbols-outlined" style={{ animation: 'spin 1s linear infinite' }}>refresh</span>
           <p>Loading system data...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Positions Column */}
          <div className="table-wrap">
            <div className="table-toolbar">
              <span className="card-title">
                <span className="material-symbols-outlined" style={{ color: 'var(--secondary)' }}>work</span>
                Job Positions
              </span>
              <button className="btn btn-primary" onClick={() => openAdd('position')}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                Add Position
              </button>
            </div>
            <table>
              <thead>
                <tr>
                  <th style={{ width: '45%' }}>Name</th>
                  <th>Usage</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.filter(i => i.type === 'position').map(i => (
                  <tr key={i._id}>
                    <td><strong>{i.name}</strong></td>
                    <td>{i.usageCount} times</td>
                    <td>
                      <div className="action-btns">
                        <button className="action-btn edit" title="Edit" onClick={() => openEdit(i)}>
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button className="action-btn delete" title="Delete" onClick={() => handleDelete(i._id)}>
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Levels Column */}
          <div className="table-wrap">
            <div className="table-toolbar">
              <span className="card-title">
                <span className="material-symbols-outlined" style={{ color: 'var(--tertiary)' }}>bar_chart</span>
                Experience Levels
              </span>
              <button className="btn btn-primary" onClick={() => openAdd('level')}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                Add Level
              </button>
            </div>
            <table>
              <thead>
                <tr>
                  <th style={{ width: '45%' }}>Name</th>
                  <th>Usage</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.filter(i => i.type === 'level').map(i => (
                  <tr key={i._id}>
                    <td><strong>{i.name}</strong></td>
                    <td>{i.usageCount} times</td>
                    <td>
                      <div className="action-btns">
                        <button className="action-btn edit" title="Edit" onClick={() => openEdit(i)}>
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button className="action-btn delete" title="Delete" onClick={() => handleDelete(i._id)}>
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingItem ? 'Edit' : 'Add'} {form.type === 'position' ? 'Position' : 'Level'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div style={{ padding: 24 }}>
              <div className="form-group" style={{ marginBottom: 20 }}>
                <label className="form-label">Name</label>
                <input 
                  className="form-input" 
                  autoFocus
                  placeholder={form.type === 'position' ? "e.g. Data Scientist" : "e.g. Expert"} 
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && handleSave()}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>
                <span className="material-symbols-outlined">save</span>
                {editingItem ? 'Update' : 'Save'} Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
