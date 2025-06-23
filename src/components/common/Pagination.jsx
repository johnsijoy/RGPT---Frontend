import { Pagination as MUIPagination } from '@mui/material';

const Pagination = ({ count, page, onChange, size = 'small' }) => {
  return (
    <MUIPagination
      count={count}
      page={page}
      onChange={(_, value) => onChange(value)}
      size={size}
      color="primary"
      sx={{
        '& .MuiPaginationItem-root': {
          fontSize: '0.7rem',
          minWidth: '24px',
          height: '24px',
          borderRadius: '6px',
          color: '#122E3E',
          border: '1px solid #122E3E',
        },
        '& .Mui-selected': {
          backgroundColor: '#122E3E !important',
          color: '#fff !important',
        },
        '& .MuiPagination-ul': {
          justifyContent: 'flex-end',
        },
      }}
    />
  );
};

export default Pagination;

