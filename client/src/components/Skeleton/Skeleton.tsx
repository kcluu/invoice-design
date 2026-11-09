import { Bar } from './Skeleton.styled';

interface SkeletonProp {
  width?: string;
  height?: number;
  radius?: string;
}

// grey pill placeholder shown while data loads
export const Skeleton = ({ width = '100%', height = 10, radius = '999px' }: SkeletonProp) => (
  <Bar aria-hidden="true" $width={width} $height={height} $radius={radius} />
);
