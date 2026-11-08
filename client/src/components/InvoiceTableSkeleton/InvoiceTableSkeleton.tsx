import { Skeleton } from '../Skeleton/Skeleton'

interface InvoiceTableSkeletonProp {
  rows?: number
}

// vary the bar widths a little so it reads like real content
const widths = ['62%', '48%', '70%', '55%', '66%']

export const InvoiceTableSkeleton = ({ rows = 5 }: InvoiceTableSkeletonProp) => (
  <div aria-busy="true" aria-label="Loading invoices">
    <table>
      <tbody>
        {Array.from({ length: rows }, (_, index) => (
          <tr key={index}>
            <td>
              <Skeleton width="110px" />
              <Skeleton width={widths[index % widths.length]} height={8} />
            </td>
            <td>
              <Skeleton width="120px" />
            </td>
            <td>
              <Skeleton width="84px" />
            </td>
            <td>
              <Skeleton width="96px" />
            </td>
            <td>
              <Skeleton width="64px" height={20} />
            </td>
            <td>
              <Skeleton width="90px" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
