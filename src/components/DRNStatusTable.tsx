import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { supabase, DRNStatus } from '../lib/supabase';

export function DRNStatusTable() {
  const [items, setItems] = useState<DRNStatus[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<DRNStatus>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('drn_status')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching DRN items:', error);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({
      document_title: '',
      outstanding_numbers: 0,
      deadline_date: '',
      status: 'Pending',
      comments_raised: 0,
      comment_rejected: 0,
      notes_comments: '',
    });
  };

  const handleEdit = (item: DRNStatus) => {
    setEditingId(item.id!);
    setFormData(item);
  };

  const handleSave = async () => {
    if (isAdding) {
      const { error } = await supabase.from('drn_status').insert([formData]);
      if (error) {
        console.error('Error adding item:', error);
        return;
      }
    } else if (editingId) {
      const { error } = await supabase
        .from('drn_status')
        .update({ ...formData, updated_at: new Date().toISOString() })
        .eq('id', editingId);
      if (error) {
        console.error('Error updating item:', error);
        return;
      }
    }

    setIsAdding(false);
    setEditingId(null);
    setFormData({});
    fetchItems();
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({});
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    const { error } = await supabase.from('drn_status').delete().eq('id', id);
    if (error) {
      console.error('Error deleting item:', error);
      return;
    }
    fetchItems();
  };

  const updateFormData = (field: keyof DRNStatus, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">DRN Status</h2>
        <button
          onClick={handleAdd}
          disabled={isAdding || editingId !== null}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <Plus size={20} />
          Add New
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Document Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Outstanding Numbers
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deadline Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comments Raised
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comment Rejected
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notes/Comments
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isAdding && (
              <tr className="bg-blue-50">
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={formData.document_title || ''}
                    onChange={(e) => updateFormData('document_title', e.target.value)}
                    className="w-full px-2 py-1 border rounded"
                    placeholder="Document Title"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={formData.outstanding_numbers || 0}
                    onChange={(e) => updateFormData('outstanding_numbers', parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="date"
                    value={formData.deadline_date || ''}
                    onChange={(e) => updateFormData('deadline_date', e.target.value)}
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  <select
                    value={formData.status || 'Pending'}
                    onChange={(e) => updateFormData('status', e.target.value)}
                    className="w-full px-2 py-1 border rounded"
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>On Hold</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={formData.comments_raised || 0}
                    onChange={(e) => updateFormData('comments_raised', parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={formData.comment_rejected || 0}
                    onChange={(e) => updateFormData('comment_rejected', parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  <textarea
                    value={formData.notes_comments || ''}
                    onChange={(e) => updateFormData('notes_comments', e.target.value)}
                    className="w-full px-2 py-1 border rounded"
                    rows={2}
                    placeholder="Notes"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="text-green-600 hover:text-green-800"
                      title="Save"
                    >
                      <Save size={20} />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="text-red-600 hover:text-red-800"
                      title="Cancel"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            )}
            {items.map((item) => (
              <tr key={item.id} className={editingId === item.id ? 'bg-blue-50' : ''}>
                {editingId === item.id ? (
                  <>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={formData.document_title || ''}
                        onChange={(e) => updateFormData('document_title', e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={formData.outstanding_numbers || 0}
                        onChange={(e) => updateFormData('outstanding_numbers', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="date"
                        value={formData.deadline_date || ''}
                        onChange={(e) => updateFormData('deadline_date', e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={formData.status || ''}
                        onChange={(e) => updateFormData('status', e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                      >
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                        <option>On Hold</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={formData.comments_raised || 0}
                        onChange={(e) => updateFormData('comments_raised', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={formData.comment_rejected || 0}
                        onChange={(e) => updateFormData('comment_rejected', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <textarea
                        value={formData.notes_comments || ''}
                        onChange={(e) => updateFormData('notes_comments', e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                        rows={2}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={handleSave}
                          className="text-green-600 hover:text-green-800"
                          title="Save"
                        >
                          <Save size={20} />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-red-600 hover:text-red-800"
                          title="Cancel"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.document_title}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.outstanding_numbers}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.deadline_date ? new Date(item.deadline_date).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : item.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : item.status === 'On Hold'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.comments_raised}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.comment_rejected}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {item.notes_comments || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          disabled={isAdding || editingId !== null}
                          className="text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                          title="Edit"
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id!)}
                          disabled={isAdding || editingId !== null}
                          className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                          title="Delete"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {items.length === 0 && !isAdding && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                  No items found. Click "Add New" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
