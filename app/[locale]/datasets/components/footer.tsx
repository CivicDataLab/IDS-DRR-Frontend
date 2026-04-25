import React from 'react';
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { IconButton, Select, Text } from 'opub-ui';

const pageSizeOptions = [5, 10, 20];

interface FooterProps {
  totalRows: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (pageNumber: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const Footer: React.FC<FooterProps> = ({
  totalRows,
  pageSize,
  currentPage,
  onPageChange,
  onPageSizeChange,
}) => {
  const t = useTranslations('datasets.pagination');
  const totalPages = Math.ceil(totalRows / pageSize);

  const handlePrevClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageSizeChange = (event: any) => {
    const newSize = parseInt(event as string);
    if (!isNaN(newSize) && newSize > 0) {
      onPageSizeChange(newSize);
    }
  };

  return (
    <div className="flex w-auto items-center gap-8 overflow-x-auto  bg-baseGraySlateSolid3 px-4 py-2 sm:px-6 sm:py-4 md:justify-end lg:justify-end">
      <Select
        labelInline
        label={t('rows')}
        options={pageSizeOptions.map((value) => ({
          value: String(value),
          label: String(value),
        }))}
        value={String(pageSize)}
        onChange={(e) => {
          handlePageSizeChange(e);
        }}
        name={''}
      />

      <div className="hidden md:block lg:block">
        <Text noBreak variant="bodyMd">
          {t('page', { current: currentPage, total: totalPages })}
        </Text>
      </div>
      <div className="md:hidden lg:hidden">
        <Text noBreak variant="bodyMd">{`${currentPage}/${totalPages}`}</Text>
      </div>
      <div className="flex">
        <IconButton
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          icon={IconChevronsLeft}
        >
          {t('first')}
        </IconButton>
        <IconButton
          onClick={handlePrevClick}
          disabled={currentPage === 1}
          icon={IconChevronLeft}
        >
          {t('previous')}
        </IconButton>
        <IconButton
          onClick={handleNextClick}
          disabled={currentPage === totalPages}
          icon={IconChevronRight}
        >
          {t('next')}
        </IconButton>
        <IconButton
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          icon={IconChevronsRight}
        >
          {t('last')}
        </IconButton>
      </div>
    </div>
  );
};

export default Footer;
