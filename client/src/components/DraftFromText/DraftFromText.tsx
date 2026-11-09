import { useId } from 'react';
import { useDraftFromText } from '../../hooks/useDraftFromText';
import type { DraftResult } from '../../types/invoice';
import { Button } from '../Button/Button';
import { Skeleton } from '../Skeleton/Skeleton';
import { Chip, ErrorText, Examples, Heading, Label, Loading, Panel, Review, Row, Success, TextArea } from './DraftFromText.styled';

interface DraftFromTextProp {
  onDraft: (result: DraftResult) => void;
}

export const DraftFromText = ({ onDraft }: DraftFromTextProp) => {
  const { text, setText, status, error, needsReview, examples, examplesLoading, run } = useDraftFromText({ onDraft });
  const headingId = useId();
  const inputId = useId();
  const drafting = status === 'drafting';

  // the outcome sits in a polite live region so it is read out without moving focus
  return (
    <Panel aria-labelledby={headingId}>
      <Heading id={headingId}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z" />
        </svg>
        Draft from a billing request
      </Heading>
      <Label htmlFor={inputId}>
        Describe the invoice in plain words. The form below fills in, and anything that needs a human check is listed.
      </Label>
      <TextArea
        id={inputId}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="e.g. Invoice Acme Labs for April: $12,000 subscription plus 1,480,000 events at $0.012, Net 30"
        aria-describedby={error ? `${inputId}-error` : undefined}
        aria-invalid={error ? true : undefined}
      />
      {error && <ErrorText id={`${inputId}-error`}>{error}</ErrorText>}

      <Row>
        {examplesLoading && (
          <Examples aria-busy="true">
            <Skeleton width="300px" height={30} />
          </Examples>
        )}
        {examples.length > 0 && (
          <Examples>
            <span id={`${inputId}-examples`}>Try an example:</span>
            {examples.map((example) => (
              <Chip
                key={example.id}
                type="button"
                disabled={drafting}
                aria-describedby={`${inputId}-examples`}
                onClick={() => void run(example.input)}
              >
                {example.label}
              </Chip>
            ))}
          </Examples>
        )}
        <Button variant="primary" disabled={drafting} onClick={() => void run()}>
          {drafting ? 'Drafting…' : 'Draft invoice'}
        </Button>
      </Row>

      <div aria-live="polite">
        {drafting && (
          <Loading>
            <span>Reading the request and matching it to customers, terms and products…</span>
            <Skeleton width="62%" />
            <Skeleton width="78%" />
            <Skeleton width="44%" />
          </Loading>
        )}
        {status === 'done' && needsReview.length > 0 && (
          <Review>
            <strong>Check these before sending</strong>
            <ul>
              {needsReview.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </Review>
        )}
        {status === 'done' && needsReview.length === 0 && <Success>Draft filled in. Everything the request asked for was found.</Success>}
      </div>
    </Panel>
  );
};
