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

// --- Recharts Components (PChart, LChart) remain the same as in your example ---
// (Assuming PChart and LChart are correctly implemented placeholder chart components)
function PChart() {
  const data = [
    { name: 'Food', value: 400 },
    { name: 'Transport', value: 300 },
    { name: 'Shopping', value: 300 },
    { name: 'Utilities', value: 200 },
    { name: 'Other', value: 150 },
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
    name, // Add name to display category
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
    { name: 'Jan', Expenses: 400000 },
    { name: 'Feb', Expenses: 300000 },
    { name: 'Mar', Expenses: 500000 },
    { name: 'Apr', Expenses: 450000 },
    { name: 'May', Expenses: 600000 },
    { name: 'Jun', Expenses: 550000 },
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
    date: new Date(2024, 5, 28),
    amount: 5500,
    category: 'Food',
    description: 'Lunch with colleagues',
  },
  {
    id: 2,
    date: new Date(2024, 5, 27),
    amount: 12000,
    category: 'Utilities',
    description: 'Electricity Bill',
  },
  {
    id: 3,
    date: new Date(2024, 5, 27),
    amount: 8500,
    category: 'Shopping',
    description: 'New T-shirt',
  },
  {
    id: 4,
    date: new Date(2024, 5, 26),
    amount: 3000,
    category: 'Transport',
    description: 'Metro card recharge',
  },
  {
    id: 5,
    date: new Date(2024, 5, 25),
    amount: 15000,
    category: 'Entertainment',
    description: 'Movie tickets',
  },
];

function Dashboard() {
  const { isCompact } = useContext(CompactModeContext);
  const { isDark } = useContext(ThemeContext);

  // Placeholder data for Top Expenses List
  const topExpensesData = [
    { category: 'Food & Dining', amount: 250000, percentage: 25 },
    { category: 'Shopping', amount: 180000, percentage: 18 },
    { category: 'Transportation', amount: 150000, percentage: 15 },
    { category: 'Utilities', amount: 120000, percentage: 12 },
    { category: 'Entertainment', amount: 100000, percentage: 10 },
    { category: 'Health & Wellness', amount: 80000, percentage: 8 },
    { category: 'Other', amount: 120000, percentage: 12 },
  ];

  // Example dynamic value for Month-over-Month change
  const momChange = -5.5; // Example: 5.5% decrease

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
                value={convertPaiseToRupees(1000000)} // Example value
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
                value={convertPaiseToRupees(92000)}
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
                value="Food & Dining" // Display category name
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
