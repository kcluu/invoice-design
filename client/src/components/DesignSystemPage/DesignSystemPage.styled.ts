import styled from 'styled-components';

export const Page = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 1080px;
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.font.size.xxl};
  font-weight: 600;
  letter-spacing: -0.01em;

  &:focus {
    outline: none;
  }
`;

export const Subtitle = styled.p`
  margin-top: 4px;
  color: ${({ theme }) => theme.color.textMuted};
`;

export const Section = styled.section`
  padding: 18px 20px;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  min-width: 0;
`;

export const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: 600;
`;

export const Lede = styled.p`
  margin: 4px 0 14px;
  color: ${({ theme }) => theme.color.textMuted};
`;

export const GroupTitle = styled.h3`
  margin: 16px 0 8px;
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.color.textMuted};
`;

export const Muted = styled.span`
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.color.textMuted};
`;

export const Mono = styled.code`
  display: block;
  font:
    500 11px ui-monospace,
    Menlo,
    monospace;
  color: ${({ theme }) => theme.color.textSecondary};
`;

export const Cols = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
`;

export const Grid = styled.div<{ $min: string }>`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(${({ $min }) => $min}, 1fr));
  gap: 10px;
`;

export const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding: 8px 0;

  & + & {
    border-top: 1px solid ${({ theme }) => theme.color.divider};
  }
`;

export const Principles = styled.ul`
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 14px;

  li {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    text-align: left;
    padding: 0 12px 8px 0;
    font-size: ${({ theme }) => theme.font.size.xs};
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: ${({ theme }) => theme.color.textMuted};
  }

  td {
    padding: 9px 12px 9px 0;
    border-top: 1px solid ${({ theme }) => theme.color.divider};
    vertical-align: top;
  }
`;

export const Lifecycle = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;

  > div {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
`;

export const Node = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 120px;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg};
`;

export const Arrow = styled.span`
  padding: 0 4px;
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.color.textMuted};
  white-space: nowrap;
`;

export const Swatch = styled.div`
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 9px;
  overflow: hidden;

  > span {
    display: block;
    height: 40px;
    border-bottom: 1px solid ${({ theme }) => theme.color.border};
  }

  > div {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 8px 10px;
  }
`;

export const IconTile = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 9px;
  color: ${({ theme }) => theme.color.textSecondary};
`;
