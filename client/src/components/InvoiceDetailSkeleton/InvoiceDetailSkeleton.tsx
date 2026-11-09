import { Skeleton } from '../Skeleton/Skeleton';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden';
import { Buttons, Card, Columns, FieldGrid, Group, HeaderRow, Stack } from './InvoiceDetailSkeleton.styled';

export const InvoiceDetailSkeleton = () => (
  <Stack role="status">
    <VisuallyHidden>Loading invoice…</VisuallyHidden>
    <Skeleton width="96px" />
    <HeaderRow>
      <Group>
        <Skeleton width="180px" height={22} />
        <Skeleton width="240px" />
      </Group>
      <Buttons>
        <Skeleton width="72px" height={36} radius="8px" />
        <Skeleton width="96px" height={36} radius="8px" />
        <Skeleton width="130px" height={36} radius="8px" />
      </Buttons>
    </HeaderRow>
    <Columns>
      <Card $wide>
        <Skeleton width="70px" height={12} />
        <FieldGrid>
          {['60%', '80%', '90%', '50%', '65%', '40%'].map((width, index) => (
            <div key={index}>
              <Skeleton width="70px" height={8} />
              <Skeleton width={width} />
            </div>
          ))}
        </FieldGrid>
        {['42%', '55%', '34%'].map((width, index) => (
          <Skeleton key={index} width={width} />
        ))}
      </Card>
      <Card>
        <Skeleton width="80px" height={8} />
        <Skeleton width="150px" height={22} />
        <Skeleton width="60%" />
        <Skeleton width="80%" />
      </Card>
    </Columns>
  </Stack>
);
