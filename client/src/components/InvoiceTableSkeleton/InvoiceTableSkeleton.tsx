import { Skeleton } from '../Skeleton/Skeleton';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden';
import { Cell, Table, Wrap } from './InvoiceTableSkeleton.styled';

interface InvoiceTableSkeletonProp {
  rows?: number;
}

// vary the bar widths a little so it reads like real content
const widths = ['62%', '48%', '70%', '55%', '66%'];

export const InvoiceTableSkeleton = ({ rows = 5 }: InvoiceTableSkeletonProp) => (
  <Wrap role="status">
    <VisuallyHidden>Loading invoices…</VisuallyHidden>
    <Table aria-hidden="true">
      <tbody>
        {Array.from({ length: rows }, (_, index) => (
          <tr key={index}>
            <Cell>
              <Skeleton width="110px" />
              <Skeleton width={widths[index % widths.length]} height={8} />
            </Cell>
            <Cell>
              <Skeleton width="120px" />
              <Skeleton width="60px" height={8} />
            </Cell>
            <Cell>
              <Skeleton width="84px" />
            </Cell>
            <Cell>
              <Skeleton width="96px" />
              <Skeleton width="70px" height={8} />
            </Cell>
            <Cell>
              <Skeleton width="64px" height={20} />
            </Cell>
            <Cell>
              <Skeleton width="90px" />
              <Skeleton width="60px" height={8} />
            </Cell>
            <Cell>
              <Skeleton width="20px" height={6} />
            </Cell>
          </tr>
        ))}
      </tbody>
    </Table>
  </Wrap>
);
