import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'تأكيد' }) {
  return (
    <Modal open={open} onClose={onClose} title={title} titleIcon={<AlertTriangle size={18} className="text-gold-light" />}>
      <div className="px-6 py-6">
        <p className="text-sm text-warm-brown leading-relaxed mb-6">{message}</p>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-warm-brown hover:text-ink border border-ivory-dark hover:border-warm-brown transition-colors rounded-sm"
          >
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 text-sm font-medium bg-burgundy text-ivory hover:bg-burgundy-light transition-colors rounded-sm"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}