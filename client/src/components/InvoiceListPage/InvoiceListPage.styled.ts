import styled from 'styled-components';

export const Page = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
`;

export const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.font.size.xxl};
  font-weight: 600;
  letter-spacing: -0.01em;
`;

export const Subtitle = styled.p`
  color: ${({ theme }) => theme.color.textMuted};
`;

export const HeaderActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
`;

export const Search = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 280px;
  max-width: 100%;
  min-height: 34px;
  margin-bottom: 8px;
  padding: 0 10px;
  border: 1px solid ${({ theme }) => theme.color.borderStrong};
  border-radius: 7px;
  color: ${({ theme }) => theme.color.textMuted};

  &:focus-within {
    border-color: ${({ theme }) => theme.color.accent};
  }

  input {
    flex: 1;
    min-width: 0;
    border: 0;
    outline: none;
    background: transparent;
    color: ${({ theme }) => theme.color.text};
  }
`;

export const FocusNote = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-top: -8px;
  color: ${({ theme }) => theme.color.textSecondary};
`;

export const FocusChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radius.pill};
  border: 1px solid ${({ theme }) => theme.color.borderStrong};
  background: ${({ theme }) => theme.color.surfaceMuted};
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.color.text};
`;

export const LinkButton = styled.button`
  all: unset;
  cursor: pointer;
  min-height: 32px;
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => theme.color.accent};
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
`;

export const Banner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 9px;
  background: ${({ theme }) => theme.color.dangerSoft};
  border: 1px solid ${({ theme }) => theme.color.dangerBorder};
  color: #8a2418;
`;
