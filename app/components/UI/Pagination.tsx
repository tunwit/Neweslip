import React from "react";
import { IconButton, Button, Box } from "@mui/joy";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}
export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const generatePageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let prev;

    const left = Math.max(2, page - delta);
    const right = Math.min(totalPages - 1, page + delta);

    range.push(1);

    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    if (totalPages > 1) {
      range.push(totalPages);
    }

    for (let i of range) {
      if (prev !== undefined) {
        if (i - prev === 2) {
          rangeWithDots.push(prev + 1);
        } else if (i - prev > 2) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      prev = i;
    }

    return rangeWithDots;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <Box
      display="flex"
      gap={1}
      justifyContent="center"
      alignItems="center"
      mt={2}
    >
      <IconButton
        size="sm"
        variant="outlined"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ArrowBackIcon fontSize="small" />
      </IconButton>

      {pageNumbers.map((p, index) => (
        <Button
          key={index}
          variant={p === page ? "solid" : "outlined"}
          color="neutral"
          size="sm"
          disabled={p === "..."}
          onClick={() => typeof p === "number" && onPageChange(p)}
        >
          {p}
        </Button>
      ))}

      <IconButton
        size="sm"
        variant="outlined"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ArrowForwardIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}
