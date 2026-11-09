import { createApp } from './app';
import { config } from './config';
import { pool } from './db/pool';
import { loadSeed } from './db/seedData';
import { createPgRepository } from './invoices/invoice.repository';
import { createClaudeDrafter } from './invoices/invoice.llmDraft';
import { createInvoiceService } from './invoices/invoice.service';

const seed = loadSeed();
const asOfDate = config.asOfDate ?? seed.currentDate;

const drafter = config.anthropicApiKey ? createClaudeDrafter({ apiKey: config.anthropicApiKey, model: config.draftModel }) : undefined;
const service = createInvoiceService(createPgRepository(pool), { asOfDate, drafter });
const app = createApp({
  service,
  meta: { companyName: seed.company.name, baseCurrency: seed.company.baseCurrency, asOfDate },
  draftExamples: seed.examples,
});

app.listen(config.port, () => {
  console.log(`invoice api listening on http://localhost:${config.port} (as of ${asOfDate})`);
  console.log(
    drafter ? `draft from text: claude (${config.draftModel})` : 'draft from text: rule based, set ANTHROPIC_API_KEY to use claude'
  );
});
