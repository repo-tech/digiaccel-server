import { useState, useCallback } from 'react';
import ConfirmDialog from '../components/ConfirmDialog';

interface ConfirmConfig {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function useConfirm() {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<ConfirmConfig | null>(null);
  const [loading, setLoading] = useState(false);

  const show = useCallback(
    ({ title = 'Are you sure?', message, confirmLabel, cancelLabel }: ConfirmConfig) => {
      setConfig({ title, message, confirmLabel, cancelLabel });
      setOpen(true);
      setLoading(false);
      return Promise.resolve(true);
    },
    []
  );

  const onCancel = useCallback(() => {
    setOpen(false);
    setConfig(null);
  }, []);

  const onConfirm = useCallback(() => {
    setOpen(false);
    setConfig(null);
  }, []);

  const Confirm = <ConfirmDialog open={open} title={config?.title || ''} message={config?.message || ''} onConfirm={onConfirm} onCancel={onCancel} loading={loading} />;
  return {
    show,
    open,
    config,
    loading,
    Confirm,
  };
}