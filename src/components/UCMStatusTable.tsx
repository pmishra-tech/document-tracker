import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { supabase, UCMStatus } from '../lib/supabase';

export function UCMStatusTable() {
  const [items, setItems] = useState<UCMStatus[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<UCMStatus>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ucm_status')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching UCM items:', error);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({
      document_id: '',
      title: '',
      deadline_date: '',
      owner: '',
      status: 'Pending',
      reviewer: '',
      reviewer_status: 'Not Started',
      approver: '',
      approver_status: 'Not Started',
      external: false,
    });
  };

  const handleEdit = (item: UCMStatus) => {
    setEditingId(item.id!);
    setFormData(item);
  };

  const handleSave = async () => {
    if (isAdding) {
      const { error } = await supabase.from('ucm_status').insert([formData]);
      if (error) {
        console.error('Error adding item:', error);
        return;
      }
    } else if (editingId) {
      const { error } = await supabase
        .from('ucm_status')
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

    const { error } = await supabase.from('ucm_status').delete().eq('id', id);
    if (error) {
      console.error('Error deleting item:', error);
      return;
    }
    fetchItems();
  };

  const updateFormData = (field: keyof UCMStatus, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">UCM Status</h2>
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
                Document ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deadline Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Owner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reviewer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reviewer Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Approver
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Approver Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                External
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
                    value={formData.document_id || ''}
                    onChange={(e) => updateFormData('document_id', e.target.value)}
                    className="w-full px-2 py-1 border rounded"
                    placeholder="Document ID"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => updateFormData('title', e.target.value)}
                    className="w-full px-2 py-1 border rounded"
                    placeholder="Title"
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
                  <input
                    type="text"
                    value={formData.owner || ''}
                    onChange={(e) => updateFormData('owner', e.target.value)}
                    className="w-full px-2 py-1 border rounded"
                    placeholder="Owner"
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
                    type="text"
                    value={formData.reviewer || ''}
                    onChange={(e) => updateFormData('reviewer', e.target.value)}
                    className="w-full px-2 py-1 border rounded"
                    placeholder="Reviewer"
                  />
                </td>
                <td className="px-6 py-4">
                  <select
                    value={formData.reviewer_status || 'Not Started'}
                    onChange={(e) => updateFormData('reviewer_status', e.target.value)}
                    className="w-full px-2 py-1 border rounded"
                  >
                    <option>Not Started</option>
                    <option>In Review</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={formData.approver || ''}
                    onChange={(e) => updateFormData('approver', e.target.value)}
                    className="w-full px-2 py-1 border rounded"
                    placeholder="Approver"
                  />
                </td>
                <td className="px-6 py-4">
                  <select
                    value={formData.approver_status || 'Not Started'}
                    onChange={(e) => updateFormData('approver_status', e.target.value)}
                    className="w-full px-2 py-1 border rounded"
                  >
                    <option>Not Started</option>
                    <option>In Review</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={formData.external ? 'Yes' : 'No'}
                    onChange={(e) => updateFormData('external', e.target.value === 'Yes')}
                    className="w-full px-2 py-1 border rounded"
                  >
                    <option>No</option>
                    <option>Yes</option>
                  </select>
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
                        value={formData.document_id || ''}
                        onChange={(e) => updateFormData('document_id', e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => updateFormData('title', e.target.value)}
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
                      <input
                        type="text"
                        value={formData.owner || ''}
                        onChange={(e) => updateFormData('owner', e.target.value)}
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
                        type="text"
                        value={formData.reviewer || ''}
                        onChange={(e) => updateFormData('reviewer', e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={formData.reviewer_status || ''}
                        onChange={(e) => updateFormData('reviewer_status', e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                      >
                        <option>Not Started</option>
                        <option>In Review</option>
                        <option>Approved</option>
                        <option>Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={formData.approver || ''}
                        onChange={(e) => updateFormData('approver', e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={formData.approver_status || ''}
                        onChange={(e) => updateFormData('approver_status', e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                      >
                        <option>Not Started</option>
                        <option>In Review</option>
                        <option>Approved</option>
                        <option>Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={formData.external ? 'Yes' : 'No'}
                        onChange={(e) => updateFormData('external', e.target.value === 'Yes')}
                        className="w-full px-2 py-1 border rounded"
                      >
                        <option>No</option>
                        <option>Yes</option>
                      </select>
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
                    <td className="px-6 py-4 text-sm text-gray-900">{item.document_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.deadline_date ? new Date(item.deadline_date).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.owner || '-'}</td>
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
                    <td className="px-6 py-4 text-sm text-gray-900">{item.reviewer || '-'}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.reviewer_status === 'Approved'
                            ? 'bg-green-100 text-green-800'
                            : item.reviewer_status === 'In Review'
                            ? 'bg-blue-100 text-blue-800'
                            : item.reviewer_status === 'Rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {item.reviewer_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.approver || '-'}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.approver_status === 'Approved'
                            ? 'bg-green-100 text-green-800'
                            : item.approver_status === 'In Review'
                            ? 'bg-blue-100 text-blue-800'
                            : item.approver_status === 'Rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {item.approver_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.external ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {item.external ? 'Yes' : 'No'}
                      </span>
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
                <td colSpan={11} className="px-6 py-8 text-center text-gray-500">
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
