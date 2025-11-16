import React, { useEffect, useRef, useState } from 'react';
import '@/../css/Page.css';
import { useTranslation } from '@/lib/i18n';

interface BulkActionsProps {
  totalOnPage: number;
  selectedCount: number;
  allSelected: boolean;
  onToggleSelectAll: (checked: boolean) => void;
  onClearSelection: () => void;
  onBulkApprove: () => Promise<void> | void;
  onBulkReject: (reason: string) => Promise<void> | void;
  isProcessing?: boolean;
}

type ModalAction = 'approve' | 'reject' | null;

export default function BulkActions({
  totalOnPage,
  selectedCount,
  allSelected,
  onToggleSelectAll,
  onClearSelection,
  onBulkApprove,
  onBulkReject,
  isProcessing = false,
}: BulkActionsProps) {
  const { t } = useTranslation();
  const [modalAction, setModalAction] = useState<ModalAction>(null);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const reasonRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (modalAction === 'reject' && reasonRef.current) {
      reasonRef.current.focus();
    }
  }, [modalAction]);

  const selectionSummary = `${t('Selected')}: ${selectedCount}`;
  const totalSummary = `${t('On this page')}: ${totalOnPage}`;
  const actionsDisabled = selectedCount === 0 || isProcessing;

  const openModal = (action: Exclude<ModalAction, null>) => {
    if (actionsDisabled) {
      return;
    }

    setModalAction(action);
    setReason('');
    setError('');
  };

  const closeModal = () => {
    setModalAction(null);
    setReason('');
    setError('');
  };

  const handleConfirm = async () => {
    if (!modalAction) {
      return;
    }

    try {
      if (modalAction === 'approve') {
        await Promise.resolve(onBulkApprove());
        closeModal();
        return;
      }

      const trimmedReason = reason.trim();
      if (trimmedReason.length < 10) {
        setError(t('Please provide at least 10 characters.'));
        return;
      }

      await Promise.resolve(onBulkReject(trimmedReason));
      closeModal();
    } catch (err) {
      console.error('Bulk action failed', err);
    }
  };

  return (
    <section
      aria-label={t('Bulk actions')}
      style={{
        background: 'var(--light)',
        borderRadius: '20px',
        padding: '16px 24px',
        marginBottom: '24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '16px',
        boxShadow: '0 6px 24px rgba(15, 23, 42, 0.06)',
      }}
    >
      <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          type="checkbox"
          checked={allSelected && totalOnPage > 0}
          onChange={(event) => onToggleSelectAll(event.target.checked)}
          disabled={totalOnPage === 0 || isProcessing}
          aria-label={t('Select all shops on this page')}
        />
        <span className="checkbox-text">{t('Select all')}</span>
      </label>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--dark)' }}>{selectionSummary}</span>
        <span style={{ fontSize: '12px', color: 'var(--dark-grey)' }}>{totalSummary}</span>
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        <button
          type="button"
          className="btn btn-success"
          onClick={() => openModal('approve')}
          disabled={actionsDisabled}
        >
          <i className="bx bx-check-double"></i>
          {t('Approve selected')}
        </button>

        <button
          type="button"
          className="btn btn-danger"
          onClick={() => openModal('reject')}
          disabled={actionsDisabled}
        >
          <i className="bx bx-block"></i>
          {t('Reject selected')}
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onClearSelection}
          disabled={selectedCount === 0 || isProcessing}
        >
          <i className="bx bx-eraser"></i>
          {t('Clear selection')}
        </button>
      </div>

      {modalAction && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-content" role="document">
            <div className="modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 className="modal-title" style={{ margin: 0, fontSize: '18px', color: 'var(--dark)' }}>
                {modalAction === 'approve' ? t('Approve selected shops') : t('Reject selected shops')}
              </h3>
              <button type="button" className="modal-close" onClick={closeModal} aria-label={t('Close')}>
                X
              </button>
            </div>

            <div className="modal-body" style={{ display: 'grid', gap: '12px' }}>
              <p style={{ margin: 0, color: 'var(--dark-grey)' }}>
                {modalAction === 'approve'
                  ? t('Confirm approval for all selected shops. This will grant them access immediately.')
                  : t('Provide a rejection reason for all selected shops. This reason will be recorded in the audit log.')}
              </p>

              {modalAction === 'reject' && (
                <>
                  <label htmlFor="bulk-reject-reason" className="form-label">
                    {t('Rejection reason')}
                  </label>
                  <textarea
                    id="bulk-reject-reason"
                    className="form-input-field"
                    rows={4}
                    ref={reasonRef}
                    value={reason}
                    onChange={(event) => {
                      setReason(event.target.value);
                      if (error) {
                        setError('');
                      }
                    }}
                    aria-required="true"
                    aria-invalid={error ? 'true' : 'false'}
                  />
                  {error && <p className="form-error" role="alert">{error}</p>}
                </>
              )}
            </div>

            <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                {t('Cancel')}
              </button>
              <button
                type="button"
                className={`btn btn-${modalAction === 'approve' ? 'success' : 'danger'}`}
                onClick={handleConfirm}
                disabled={isProcessing || (modalAction === 'reject' && reason.trim().length < 10)}
              >
                {t('Confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
