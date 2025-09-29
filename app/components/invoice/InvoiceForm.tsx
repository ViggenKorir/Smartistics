import React, { useState } from 'react';
import { IInvoice, IClient, IVendor, IInvoiceItem } from '@/app/lib/types/invoice';
import { useInvoices } from '@/app/lib/hooks/useInvoices';

interface InvoiceFormProps {
  invoice?: IInvoice;
  onSuccess?: (invoice: IInvoice) => void;
  onCancel?: () => void;
}

export default function InvoiceForm({ invoice, onSuccess, onCancel }: InvoiceFormProps) {
  const { createInvoice, updateInvoice, loading } = useInvoices({
    onSuccess: (data) => {
      onSuccess?.(data.data);
    },
  });

  const [formData, setFormData] = useState<Partial<IInvoice>>(
    invoice || {
      items: [],
      client: {} as IClient,
      vendor: {} as IVendor,
      taxRate: 0,
      currency: 'USD',
    }
  );

  const [items, setItems] = useState<IInvoiceItem[]>(invoice?.items || []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = {
        ...formData,
        items,
        dueDate: formData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };

      if (invoice?.id) {
        await updateInvoice(invoice.id, data);
      } else {
        await createInvoice(data);
      }
    } catch (error) {
      console.error('Failed to save invoice:', error);
    }
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: crypto.randomUUID(),
        description: '',
        quantity: 1,
        unitPrice: 0,
        amount: 0,
      },
    ]);
  };

  const updateItem = (index: number, updates: Partial<IInvoiceItem>) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      ...updates,
      amount: (updates.quantity || items[index].quantity) * 
              (updates.unitPrice || items[index].unitPrice),
    };
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Client Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Client Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Client Name"
            value={formData.client?.name || ''}
            onChange={(e) => setFormData({
              ...formData,
              client: { ...formData.client, name: e.target.value },
            })}
            className="border rounded-md p-2"
            required
          />
          <input
            type="text"
            placeholder="Client Email"
            value={formData.client?.email || ''}
            onChange={(e) => setFormData({
              ...formData,
              client: { ...formData.client, email: e.target.value },
            })}
            className="border rounded-md p-2"
            required
          />
          <input
            type="text"
            placeholder="Client Address"
            value={formData.client?.address || ''}
            onChange={(e) => setFormData({
              ...formData,
              client: { ...formData.client, address: e.target.value },
            })}
            className="border rounded-md p-2"
            required
          />
          <input
            type="tel"
            placeholder="Client Phone"
            value={formData.client?.phone || ''}
            onChange={(e) => setFormData({
              ...formData,
              client: { ...formData.client, phone: e.target.value },
            })}
            className="border rounded-md p-2"
            required
          />
        </div>
      </div>

      {/* Invoice Items */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Invoice Items</h3>
          <button
            type="button"
            onClick={addItem}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add Item
          </button>
        </div>
        
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-5">
                <input
                  type="text"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => updateItem(index, { description: e.target.value })}
                  className="border rounded-md p-2 w-full"
                  required
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, { quantity: Number(e.target.value) })}
                  className="border rounded-md p-2 w-full"
                  min="1"
                  required
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  placeholder="Unit Price"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(index, { unitPrice: Number(e.target.value) })}
                  className="border rounded-md p-2 w-full"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="col-span-2 text-right">
                {(item.quantity * item.unitPrice).toFixed(2)}
              </div>
              <div className="col-span-1">
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invoice Settings */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Invoice Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tax Rate (%)
            </label>
            <input
              type="number"
              value={formData.taxRate || 0}
              onChange={(e) => setFormData({
                ...formData,
                taxRate: Number(e.target.value),
              })}
              className="border rounded-md p-2 w-full"
              min="0"
              max="100"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate?.toString().split('T')[0] || ''}
              onChange={(e) => setFormData({
                ...formData,
                dueDate: e.target.value,
              })}
              className="border rounded-md p-2 w-full"
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Saving...' : invoice ? 'Update Invoice' : 'Create Invoice'}
        </button>
      </div>
    </form>
  );
}