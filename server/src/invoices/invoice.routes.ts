import { Router, type NextFunction, type Request, type Response } from 'express';
import type { DraftExample } from '../db/seedData';
import type { InvoiceService } from './invoice.service';

type Handler = (req: Request, res: Response) => Promise<unknown>;

// express 4 doesn't forward rejected promises, so do it here
const handle = (fn: Handler) => (req: Request, res: Response, next: NextFunction) => {
  fn(req, res).catch(next);
};

// no auth yet, the client can say who is acting
const actorOf = (req: Request) => req.get('x-user-name')?.trim() || 'Finance team';

export const createInvoiceRouter = (service: InvoiceService, examples: DraftExample[] = []) => {
  const router = Router();

  // registered before /:id so they aren't read as invoice ids
  router.get('/draft-examples', (_req, res) => {
    res.json(examples.map(({ id, label, input }) => ({ id, label, input })));
  });

  router.post(
    '/draft-from-text',
    handle(async (req, res) => {
      res.json(await service.draftFromText(req.body));
    })
  );

  router.get(
    '/',
    handle(async (_req, res) => {
      res.json(await service.list());
    })
  );

  router.post(
    '/',
    handle(async (req, res) => {
      res.status(201).json(await service.create(req.body, actorOf(req)));
    })
  );

  router.get(
    '/:id',
    handle(async (req, res) => {
      res.json(await service.get(req.params.id));
    })
  );

  router.patch(
    '/:id',
    handle(async (req, res) => {
      res.json(await service.update(req.params.id, req.body, actorOf(req)));
    })
  );

  router.post(
    '/:id/send',
    handle(async (req, res) => {
      res.json(await service.send(req.params.id, actorOf(req)));
    })
  );

  router.post(
    '/:id/payments',
    handle(async (req, res) => {
      res.json(await service.recordPayment(req.params.id, actorOf(req)));
    })
  );

  router.post(
    '/:id/void',
    handle(async (req, res) => {
      res.json(await service.void(req.params.id, actorOf(req)));
    })
  );

  router.delete(
    '/:id',
    handle(async (req, res) => {
      await service.remove(req.params.id);
      res.status(204).end();
    })
  );

  return router;
};
