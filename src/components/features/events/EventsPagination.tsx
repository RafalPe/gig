'use client';

import { Pagination, PaginationItem, Box } from '@mui/material';
import Link from 'next/link';

type Props = {
  count: number;
  page: number;
  currentSearch?: string | null;
};

export default function EventsPagination({ count, page, currentSearch }: Props) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
      <Pagination
        page={page}
        count={count}
        color="primary"
        size="large"
        renderItem={(item) => (
          <PaginationItem
            component={Link}
            href={`/?page=${item.page}${currentSearch ? `&search=${currentSearch}` : ''}`}
            {...item}
          />
        )}
      />
    </Box>
  );
}