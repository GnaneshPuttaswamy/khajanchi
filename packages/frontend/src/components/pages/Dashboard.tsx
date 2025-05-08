import {
  Card,
  Col,
  DatePicker,
  Empty,
  Flex,
  List,
  Row,
  Space,
  Statistic,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import React, { useContext } from 'react';
import { CompactModeContext } from '../../context/CompactModeContext';
import CategoryFilter from '../common/CategoryFilter';
import { convertPaiseToRupees } from '../../utils/currencyFormatter';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  YAxis,
  XAxis,
  CartesianGrid,
  Legend,
  Tooltip as RechartsTooltip,
} from 'recharts';
import { ThemeContext } from '../../context/ThemeContext';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

function PChart() {
  const data = [
    { name: 'Groceries', value: 35000 },
    { name: 'Dining Out', value: 25000 },
    { name: 'Transportation', value: 15000 },
    { name: 'Utilities', value: 20000 },
    { name: 'Entertainment', value: 18000 },
    { name: 'Other', value: 10000 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA00FF'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6; // Adjust label position
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const textAnchor = x > cx ? 'start' : 'end';

    return (
      <Tooltip title={`${name}: ${(percent * 100).toFixed(0)}%`}>
        <text
          x={x}
          y={y}
          fill="white" // Consider contrast, maybe use darker text on light slices?
          textAnchor={textAnchor}
          dominantBaseline="central"
          fontSize="12" // Adjust font size
          fontWeight="bold"
        >
          {`${(percent * 100).toFixed(0)}%`}
          {/* Optionally add name if space allows: {name} */}
        </text>
      </Tooltip>
    );
  };

  return (
    // Ensure the container has a defined height or aspect ratio
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius="80%" // Use percentage for responsiveness
          fill="#8884d8"
          dataKey="value"
          // Add stroke for better separation
          stroke="#fff"
          strokeWidth={1}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        {/* Add Recharts Tooltip for hover details */}
        <RechartsTooltip
          formatter={(value, name) => [
            convertPaiseToRupees(value * 1000),
            name,
          ]}
        />
        {/* Simple Legend - Consider custom legend if needed */}
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

function LChart() {
  // Example: Monthly spending data
  const data = [
    { name: 'Jan', Expenses: 4500000 },
    { name: 'Feb', Expenses: 3800000 },
    { name: 'Mar', Expenses: 5200000 },
    { name: 'Apr', Expenses: 4700000 },
    { name: 'May', Expenses: 6100000 },
    { name: 'Jun', Expenses: 5800000 },
  ];
  return (
    // Ensure the container has a defined height or aspect ratio
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20, // Adjust left margin if Y-axis labels get cut off
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        {/* Format Y-axis ticks */}
        <YAxis tickFormatter={(value) => convertPaiseToRupees(value)} />
        {/* Use Recharts Tooltip */}
        <RechartsTooltip
          formatter={(value) => [convertPaiseToRupees(value), 'Expenses']}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="Expenses" // Use meaningful data key
          stroke="#8884d8"
          strokeWidth={2}
          activeDot={{ r: 8 }}
          dot={{ r: 4 }}
        />
        {/* Add another line if comparing, e.g., Income or Budget */}
        {/* <Line type="monotone" dataKey="Income" stroke="#82ca9d" /> */}
      </LineChart>
    </ResponsiveContainer>
  );
}

const recentTransactionsData = [
  {
    id: 1,
    date: dayjs().subtract(1, 'day').toDate(),
    amount: 125000,
    category: 'Groceries',
    description: 'Weekly grocery shopping',
  },
  {
    id: 2,
    date: dayjs().subtract(2, 'days').toDate(),
    amount: 35000,
    category: 'Transportation',
    description: 'Metro card top-up',
  },
  {
    id: 3,
    date: dayjs().subtract(2, 'days').toDate(),
    amount: 80000,
    category: 'Dining Out',
    description: 'Dinner with friends',
  },
  {
    id: 4,
    date: dayjs().subtract(3, 'days').toDate(),
    amount: 25000,
    category: 'Entertainment',
    description: 'Movie ticket',
  },
  {
    id: 5,
    date: dayjs().subtract(4, 'days').toDate(),
    amount: 60000,
    category: 'Shopping',
    description: 'New headphones',
  },
  {
    id: 6,
    date: dayjs().subtract(5, 'days').toDate(),
    amount: 150000,
    category: 'Utilities',
    description: 'Internet bill',
  },
];

function Dashboard() {
  const { isCompact } = useContext(CompactModeContext);
  const { isDark } = useContext(ThemeContext);

  // Placeholder data for Top Expenses List
  const topExpensesData = [
    { category: 'Groceries', amount: 3500000, percentage: 29 },
    { category: 'Dining Out', amount: 2500000, percentage: 21 },
    { category: 'Utilities', amount: 2000000, percentage: 17 },
    { category: 'Entertainment', amount: 1800000, percentage: 15 },
    { category: 'Transportation', amount: 1500000, percentage: 12 },
    { category: 'Other', amount: 1000000, percentage: 8 },
  ];

  // Calculate Total Expenses from topExpensesData
  const totalExpensesValue = topExpensesData.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  // Calculate Avg Daily Spend (assuming a 30-day month for simplicity)
  const avgDailySpendValue = totalExpensesValue / 30;

  // Determine Highest Spending Category
  const highestCategoryData = topExpensesData.reduce(
    (max, item) => (item.amount > max.amount ? item : max),
    topExpensesData[0] || { category: 'N/A', amount: 0 }
  );

  // Example dynamic value for Month-over-Month change
  const momChange = 7.2;

  return (
    // Main Card acting as the page container

    <Card
      title={
        <Flex justify="space-between" align="center">
          <span style={{ flex: 1 }}>Dashboard</span>
          <Flex gap="small" flex={1} justify="flex-end">
            <DatePicker.RangePicker variant="filled" size="small" />
            <CategoryFilter
              allUniqueCategories={[]}
              onCategoryFilterChange={() => {}}
            />
          </Flex>
        </Flex>
      }
      styles={{
        body: {
          height: `calc(100vh - ${isCompact ? '127px' : '145px'})`,
        },
      }}
    >
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Row gutter={[16, 16]}>
          {' '}
          <Col xs={24} sm={12} md={6} lg={6}>
            <Card
              variant={isDark ? 'outlined' : 'borderless'}
              style={{ textAlign: 'center' }}
            >
              <Statistic
                title="Total Expenses"
                value={convertPaiseToRupees(totalExpensesValue)}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6} lg={6}>
            <Card
              variant={isDark ? 'outlined' : 'borderless'}
              style={{ textAlign: 'center' }}
            >
              <Statistic
                title="Avg Daily Spend"
                value={convertPaiseToRupees(avgDailySpendValue)}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6} lg={6}>
            <Card
              variant={isDark ? 'outlined' : 'borderless'}
              style={{ textAlign: 'center' }}
            >
              <Statistic
                title="Highest Category" // Changed from Highest Expense
                value={highestCategoryData.category} // Display category name
                // Optionally add amount below or in tooltip
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6} lg={6}>
            <Card
              variant={isDark ? 'outlined' : 'borderless'}
              style={{ textAlign: 'center' }}
            >
              <Statistic
                title="MoM Change" // Abbreviated title
                value={Math.abs(momChange)} // Use absolute value
                precision={2}
                valueStyle={{ color: momChange >= 0 ? '#3f8600' : '#cf1322' }} // Green for up, Red for down
                prefix={
                  momChange >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />
                }
                suffix="%"
              />
            </Card>
          </Col>
        </Row>

        {/* --- Row 2: Charts --- */}
        <Row gutter={[16, 16]}>
          {/* Line Chart - Taking more space */}
          <Col xs={24} lg={16}>
            <Card
              title="Spending Trend"
              variant={isDark ? 'outlined' : 'borderless'}
            >
              <LChart />
            </Card>
          </Col>
          {/* Pie Chart - Taking less space */}
          <Col xs={24} lg={8}>
            <Card
              title="Expense Categories"
              variant={isDark ? 'outlined' : 'borderless'}
            >
              <PChart />
            </Card>
          </Col>
        </Row>

        {/* --- Row 3: Lists (Top Expenses & Recent Transactions) --- */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card
              title="Top Spending Categories"
              variant={isDark ? 'outlined' : 'borderless'}
              styles={{
                body: {
                  height: `calc(100vh - ${isCompact ? '670px' : '790px'})`,
                },
              }}
            >
              <List
                size="small"
                dataSource={topExpensesData}
                locale={{
                  emptyText: <Empty description="No spending data yet" />,
                }}
                style={{
                  maxHeight: '100%',
                  overflow: 'auto',
                }}
                renderItem={(item) => (
                  <List.Item
                    style={{ padding: '8px 16px 8px 0' }} // Reduced padding slightly
                  >
                    <Flex
                      justify="space-between"
                      align="center" // Align items vertically
                      style={{ width: '100%' }}
                      gap="middle"
                    >
                      <Space>
                        {/* Consider using color-coded tags based on category */}
                        <Tag color="blue">{`${item.percentage}%`}</Tag>
                        <Typography.Text>{item.category}</Typography.Text>
                      </Space>
                      <Typography.Text strong>
                        {' '}
                        {/* Make amount bold */}
                        {convertPaiseToRupees(item.amount)}
                      </Typography.Text>
                    </Flex>
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card
              title="Recent Transactions"
              variant={isDark ? 'outlined' : 'borderless'}
              styles={{
                body: {
                  height: `calc(100vh - ${isCompact ? '670px' : '790px'})`,
                },
              }}
            >
              <List
                size="small"
                dataSource={recentTransactionsData}
                locale={{
                  emptyText: <Empty description="No recent transactions" />,
                }}
                style={{
                  maxHeight: '100%',
                  overflow: 'auto',
                }}
                renderItem={(item) => (
                  <List.Item style={{ padding: '10px 0' }}>
                    <Flex
                      justify="space-between"
                      align="center"
                      style={{ width: '100%' }}
                      gap="small"
                    >
                      {/* <Flex gap="small" align="center"> */}
                      <Flex vertical gap={0}>
                        <Typography.Text
                          strong
                          ellipsis
                          style={{ maxWidth: '180px' }}
                        >
                          {item.description}
                        </Typography.Text>{' '}
                        {/* Limit description width */}
                        <Space size="middle">
                          <Typography.Text
                            type="secondary"
                            style={{ fontSize: '12px' }}
                          >
                            {dayjs
                              .utc(item.date)
                              .local()
                              .format('Do, MMM YYYY')}
                          </Typography.Text>

                          <Typography.Text
                            type="secondary"
                            style={{ fontSize: '12px' }}
                          >
                            <Tag>food</Tag>
                          </Typography.Text>
                        </Space>
                      </Flex>
                      {/* </Flex> */}
                      <Typography.Text
                        strong
                        style={{ color: isDark ? '#ff7a45' : '#cf1322' }}
                      >
                        {' '}
                        {/* Example: Red color for expenses */}-
                        {convertPaiseToRupees(item.amount)}{' '}
                        {/* Show negative sign */}
                      </Typography.Text>
                    </Flex>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </Space>
    </Card>
  );
}

export default Dashboard;
