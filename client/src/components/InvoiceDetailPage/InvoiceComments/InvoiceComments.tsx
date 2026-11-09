import { useId, useState, type FormEvent, type KeyboardEvent } from 'react';
import { CURRENT_USER } from '../../../config';
import { formatTimestamp } from '../../../utils/dates';
import { Button } from '../../Button/Button';
import { Hidden } from '../../VisuallyHidden/VisuallyHidden.styled';
import { Author, Avatar, Body, Composer, Empty, Footer, List } from './InvoiceComments.styled';

interface Comment {
  id: string;
  author: typeof CURRENT_USER;
  text: string;
  timestamp: string;
}

const MAX_LENGTH = 500;

// prototype only: comments live in component state, so they reset on reload and nothing reaches the api.
// render it with key={invoice.id} so each invoice starts with its own empty thread
export const InvoiceComments = () => {
  const inputId = useId();
  const [comments, setComments] = useState<Comment[]>([]);
  const [draft, setDraft] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const text = draft.trim();

  const post = (event?: FormEvent) => {
    event?.preventDefault();

    if (!text) return;
    setComments((current) => [{ id: crypto.randomUUID(), author: CURRENT_USER, text, timestamp: new Date().toISOString() }, ...current]);
    setDraft('');
    setAnnouncement(`Comment added. ${comments.length + 1} total.`);
  };

  // cmd or ctrl + enter posts, plain enter adds a new line
  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) post();
  };

  return (
    <>
      <Composer onSubmit={post}>
        <Hidden as="label" htmlFor={inputId}>
          Add a comment
        </Hidden>
        <textarea
          id={inputId}
          value={draft}
          maxLength={MAX_LENGTH}
          placeholder="Add a comment for your team"
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
        />
        <Footer>
          <Button type="submit" size="sm" variant="primary" disabled={!text}>
            Comment
          </Button>
        </Footer>
      </Composer>

      {comments.length ? (
        <List aria-label="Comments">
          {comments.map((comment) => (
            <li key={comment.id}>
              <Avatar aria-hidden="true">{comment.author.initials}</Avatar>
              <div>
                <Author>
                  {comment.author.name} <small>{formatTimestamp(comment.timestamp)}</small>
                </Author>
                <Body>{comment.text}</Body>
              </div>
            </li>
          ))}
        </List>
      ) : (
        <Empty>No comments yet.</Empty>
      )}

      <Hidden role="status">{announcement}</Hidden>
    </>
  );
};
