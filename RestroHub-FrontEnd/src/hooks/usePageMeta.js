import { useEffect } from 'react';
import { applyPageMeta } from '../utils/pageMeta';

export default function usePageMeta(meta) {
  const { title, description, noindex } = meta;
  useEffect(() => {
    applyPageMeta(document, { title, description, noindex });
  }, [title, description, noindex]);
}
