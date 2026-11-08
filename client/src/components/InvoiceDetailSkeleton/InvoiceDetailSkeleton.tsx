import { Skeleton } from '../Skeleton/Skeleton'

export const InvoiceDetailSkeleton = () => (
  <div aria-busy="true" aria-label="Loading invoice">
    <Skeleton width="96px" />
    <Skeleton width="180px" height={22} />
    <Skeleton width="240px" />
    <div>
      {['60%', '80%', '90%', '50%', '65%', '40%'].map((width, index) => (
        <div key={index}>
          <Skeleton width="70px" height={8} />
          <Skeleton width={width} />
        </div>
      ))}
    </div>
    <div>
      {['42%', '55%', '34%'].map((width, index) => (
        <Skeleton key={index} width={width} />
      ))}
    </div>
  </div>
)
