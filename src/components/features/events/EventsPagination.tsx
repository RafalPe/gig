"use client";
import {
  Pagination,
  PaginationItem,
  Box,
  Select,
  SelectChangeEvent,
  FormControl,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

type Props = {
  count: number;
  page: number;
  limit: number;
  currentSearch?: string | null;
  filter: string;
};

export default function EventsPagination({
  count,
  page,
  limit,
  currentSearch,
  filter,
}: Props) {
  const router = useRouter();

  const searchPart = currentSearch ? `&search=${currentSearch}` : "";
  const filterPart = `&filter=${filter}`;

  const handleLimitChange = (event: SelectChangeEvent) => {
    const newLimit = event.target.value;
    router.push(`/?page=1&limit=${newLimit}${searchPart}${filterPart}`);
  };

  useEffect(() => {
    const limitPart = `&limit=${limit}`;

    if (page < count) {
      const nextPageUrl = `/?page=${
        page + 1
      }${limitPart}${searchPart}${filterPart}`;
      router.prefetch(nextPageUrl);
    }

    if (page > 1) {
      const prevPageUrl = `/?page=${
        page - 1
      }${limitPart}${searchPart}${filterPart}`;
      router.prefetch(prevPageUrl);
    }
  }, [
    page,
    count,
    limit,
    currentSearch,
    filter,
    router,
    searchPart,
    filterPart,
  ]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        my: 4,
        gap: 2,
        flexWrap: "wrap",
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
            href={`/?page=${item.page}&limit=${limit}${searchPart}${filterPart}`}
            {...item}
          />
        )}
      />

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Na stronie:
        </Typography>
        <FormControl size="small" variant="outlined">
          <Select
            native
            value={String(limit)}
            onChange={handleLimitChange}
            sx={{
              height: 40,
              minWidth: 80,
              borderRadius: 2,
              bgcolor: "background.paper",
              "& .MuiNativeSelect-select": {
                paddingTop: 1,
                paddingBottom: 1,
                fontWeight: 500,
                color: "text.primary",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "primary.main",
              },
            }}
            inputProps={{
              name: "limit",
              id: "limit-select",
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
