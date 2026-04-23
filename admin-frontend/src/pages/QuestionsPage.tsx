import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout.tsx';
import toast from 'react-hot-toast';

interface Question {
  _id: string;
  text: string;
  category: string;
  difficulty: string;
}

const API_BASE = 'http://localhost:5001/api/admin/questions';

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [form, setForm] = useState({ text: '', category: 'Technical', difficulty: 'Medium' });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setQuestions(data);
    } catch (err) {
      console.error('Fetch questions error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.text.trim()) return;
    const loadingToast = toast.loading(editingQuestion ? 'Updating question...' : 'Adding question...');
    try {
      if (editingQuestion) {
        await fetch(`${API_BASE}/${editingQuestion._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        toast.success('Question updated successfully!', { id: loadingToast });
      } else {
        await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        toast.success('Question added successfully!', { id: loadingToast });
      }
      fetchQuestions();
      setShowModal(false);
    } catch (err) {
      console.error('Save question error:', err);
      toast.error('Failed to save question.', { id: loadingToast });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you absolutely sure you want to delete this question? This action cannot be undone.')) {
      const loadingToast = toast.loading('Deleting question...');
      try {
        await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
        toast.success('Question deleted successfully.', { id: loadingToast });
        fetchQuestions();
      } catch (err) {
        console.error('Delete error:', err);
        toast.error('Failed to delete question.', { id: loadingToast });
      }
    }
  };

  const filtered = questions.filter(q => q.text.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <AdminLayout activePage="/questions">
      <div className="page-header">
        <div className="page-tag">
          <span className="material-symbols-outlined">quiz</span>
          Question Bank
        </div>
        <h1 className="page-title">Manage <span>Questions</span></h1>
        <button className="btn btn-primary" onClick={() => { setEditingQuestion(null); setForm({ text: '', category: 'Technical', difficulty: 'Medium' }); setShowModal(true); }}>
          Add New Question
        </button>
      </div>

      <div className="table-wrap">
        <div className="table-toolbar">
          <input className="search-input" placeholder="Search questions..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        
        {loading ? <p style={{ padding: 24 }}>Loading questions...</p> : (
          <table>
            <thead>
              <tr>
                <th>Question Text</th>
                <th>Category</th>
                <th>Difficulty</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(q => (
                <tr key={q._id}>
                  <td>{q.text}</td>
                  <td><span className="badge badge-secondary">{q.category}</span></td>
                  <td>
                    <span className={`badge ${q.difficulty === 'Hard' ? 'badge-error' : q.difficulty === 'Medium' ? 'badge-amber' : 'badge-success'}`}>
                      {q.difficulty}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn edit" onClick={() => { setEditingQuestion(q); setForm({ text: q.text, category: q.category, difficulty: q.difficulty }); setShowModal(true); }}>
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button className="action-btn delete" onClick={() => handleDelete(q._id)}>
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingQuestion ? 'Edit' : 'Add'} Question</h3>
            </div>
            <div style={{ padding: 24 }}>
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label">Question Text</label>
                <textarea className="form-textarea" rows={3} value={form.text} onChange={e => setForm({...form, text: e.target.value})} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label className="form-label">Category</label>
                  <select className="form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    <option>Technical</option>
                    <option>Behavioral</option>
                    <option>Problem Solving</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Difficulty</label>
                  <select className="form-select" value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})}>
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Save Question</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
