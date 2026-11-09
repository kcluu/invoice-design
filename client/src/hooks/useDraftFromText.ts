import { useCallback, useEffect, useState } from 'react';
import { errorMessage } from '../api/http';
import { invoicesApi } from '../api/invoicesApi';
import type { DraftExample, DraftResult } from '../types/invoice';

type DraftStatus = 'idle' | 'drafting' | 'done' | 'error';

interface UseDraftFromTextOptions {
  onDraft: (result: DraftResult) => void;
}

export const useDraftFromText = ({ onDraft }: UseDraftFromTextOptions) => {
  const [text, setText] = useState('');
  const [status, setStatus] = useState<DraftStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [needsReview, setNeedsReview] = useState<string[]>([]);
  const [examples, setExamples] = useState<DraftExample[]>([]);

  useEffect(() => {
    let active = true;
    invoicesApi
      .draftExamples()
      .then((data) => {
        if (active) setExamples(data);
      })
      .catch(() => {
        // examples are a nice to have, the panel works without them
      });
    return () => {
      active = false;
    };
  }, []);

  const run = useCallback(
    async (input?: string) => {
      const request = (input ?? text).trim();
      if (input !== undefined) setText(input);
      if (!request) {
        setError('Describe the invoice first, for example who to bill and for what.');
        setStatus('error');
        return;
      }
      setStatus('drafting');
      setError(null);
      setNeedsReview([]);
      try {
        const result = await invoicesApi.draftFromText(request);
        setNeedsReview(result.needsReview);
        setStatus('done');
        onDraft(result);
      } catch (err) {
        setError(errorMessage(err, "Couldn't draft that request. Try rewording it."));
        setStatus('error');
      }
    },
    [text, onDraft]
  );

  return { text, setText, status, error, needsReview, examples, run };
};
