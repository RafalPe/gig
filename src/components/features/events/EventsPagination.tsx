'use client';

import { Pagination, PaginationItem, Box, Select, SelectChangeEvent, FormControl, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

type Props = {
  count: number;
  page: number;
  limit: number;
  currentSearch?: string | null;
};

export default function EventsPagination({ count, page, limit, currentSearch }: Props) {
  const router = useRouter();

  const handleLimitChange = (event: SelectChangeEvent) => {
    const newLimit = event.target.value;
    const searchPart = currentSearch ? `&search=${currentSearch}` : '';
    router.push(`/?page=1&limit=${newLimit}${searchPart}`);
  };

useEffect(() => {
    const searchPart = currentSearch ? `&search=${currentSearch}` : '';
    const limitPart = `&limit=${limit}`;

    if (page < count) {
      const nextPageUrl = `/?page=${page + 1}${limitPart}${searchPart}`;
      router.prefetch(nextPageUrl);
    }

    if (page > 1) {
      const prevPageUrl = `/?page=${page - 1}${limitPart}${searchPart}`;
      router.prefetch(prevPageUrl);
    }
  }, [page, count, limit, currentSearch, router]);

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        my: 4,
        gap: 2,
        flexWrap: 'wrap'
      }}
    >
      <Pagination
        page={page}
        count={count}
        color="primary"
        size="large"
        renderItem={(item) => (
          <PaginationItem
            component={Link}
            href={`/?page=${item.page}&limit=${limit}${currentSearch ? `&search=${currentSearch}` : ''}`}
            {...item}
          />
        )}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">Na stronie:</Typography>
        <FormControl size="small" variant="outlined">
          <Select
            native
            value={String(limit)}
            onChange={handleLimitChange}
            sx={{ height: 40, borderRadius: 4, minWidth: 70 }}
            inputProps={{
              name: 'limit',
              id: 'limit-select',
            }}
          >
            <option value={9}>9</option>
            <option value={18}>18</option>
            <option value={30}>30</option>
            <option value={60}>60</option>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}