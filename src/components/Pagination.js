import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useData } from './providers';

export function Pagination() {
  const [pages, setPages] = useState([]);
  const { apiURL, info, activePage, setActivePage, setApiURL } = useData();

  const pageClickHandler = (index) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActivePage(index + 1);
    setApiURL(pages[index]);
  };

  useEffect(() => {
    if (!apiURL || !info.pages) {
      setPages([]);

      return;
    }

    let createdPages = [];
    try {
      createdPages = Array.from({ length: info.pages }, (_, i) => {
        const URLWithPage = new URL(apiURL);
        URLWithPage.searchParams.set('page', i + 1);

        return URLWithPage.toString();
      });
    } catch (e) {
      console.error('Invalid apiURL in Pagination:', apiURL, e);
      createdPages = [];
    }

    setPages(createdPages);
  }, [info.pages, apiURL]);

  if (pages.length <= 1) return null;

  return (
    <StyledPagination>
      {pages[activePage - 2] && (
        <>
          {activePage - 2 !== 0 && (
            <>
              <Page onClick={() => pageClickHandler(0)}>« First</Page>
              <Ellipsis>...</Ellipsis>
            </>
          )}

          <Page onClick={() => pageClickHandler(activePage - 2)}>
            {activePage - 1}
          </Page>
        </>
      )}

      <Page active>{activePage}</Page>

      {pages[activePage] && (
        <>
          <Page onClick={() => pageClickHandler(activePage)}>
            {activePage + 1}
          </Page>

          {activePage !== pages.length - 1 && (
            <>
              <Ellipsis>...</Ellipsis>
              <Page onClick={() => pageClickHandler(pages.length - 1)}>
                Last »
              </Page>
            </>
          )}
        </>
      )}
    </StyledPagination>
  );
}

const StyledPagination = styled.div`
  width: 100%;
  text-align: center;
`;

const Page = styled.span`
  color: #fff;
  font-size: 18px;
  padding: 5px;
  cursor: pointer;
  transition: color 0.2s;
  ${({ active }) => active && 'color: #83bf46'};

  &:hover {
    color: #83bf46;
  }
`;

const Ellipsis = styled(Page)`
  cursor: default;

  &:hover {
    color: #fff;
  }
`;
