import styled from 'styled-components';
import { Logo } from './Logo';
import { Filter } from './Filter';

export function Header() {
  return (
    <HeaderContainer>
      <Logo />
      <Filter />
    </HeaderContainer>
  );
}

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  @media screen and (max-width: 950px) {
    flex-direction: column;
    gap: 30px;
  }
`;
