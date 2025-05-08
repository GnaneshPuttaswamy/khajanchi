import React from 'react';
import { Select, Tag } from 'antd';
import type { SelectProps } from 'antd';
import { categoryColors } from '../transactions-table/TransactionsTable';

type TagRender = SelectProps['tagRender'];

const tagRender: TagRender = (props) => {
  const { label, value, closable, onClose } = props;
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Tag
      color={categoryColors[value]}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginInlineEnd: 4 }}
    >
      {label}
    </Tag>
  );
};

interface CategoryFilterProps {
  allUniqueCategories: string[];
  onCategoryFilterChange: (categories: string[]) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  allUniqueCategories,
  onCategoryFilterChange,
}) => (
  <Select
    mode="multiple"
    tagRender={tagRender}
    defaultValue={allUniqueCategories}
    style={{ width: 258 }}
    options={allUniqueCategories.map((category) => ({
      value: category,
      label: category,
    }))}
    variant="filled"
    maxTagCount="responsive"
    size="small"
    placeholder="Filter by category"
    onChange={onCategoryFilterChange}
  />
);

export default CategoryFilter;
