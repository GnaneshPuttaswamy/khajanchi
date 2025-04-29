import { Card, DatePicker, Flex } from 'antd';
import React, { useContext } from 'react';
import { CompactModeContext } from '../../context/CompactModeContext';
import CategoryFilter from '../common/CategoryFilter';

function Dashboard() {
  const { isCompact } = useContext(CompactModeContext);

  return (
    <Card
      title={
        <Flex justify="space-between" align="center">
          <span
            style={{
              flex: 1,
            }}
          >
            All Transactions
          </span>
          <Flex gap="small" flex={1} justify="flex-end">
            <DatePicker.RangePicker variant="filled" size="small" />
            <CategoryFilter />
          </Flex>
        </Flex>
      }
      styles={{
        body: {
          height: `calc(100vh - ${isCompact ? '178px' : '90px'})`,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    ></Card>
  );
}

export default Dashboard;
