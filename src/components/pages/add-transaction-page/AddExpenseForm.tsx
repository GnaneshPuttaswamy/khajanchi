import { Button, Form, Input, Card, message } from 'antd';
import React, { useState } from 'react';
import { Transaction } from '../../../types/types';

const placeholderText = `Describe your transactions in natural language. For example: 
'₹90 at grocery store, ₹45 for bus pass
₹160 for electricity bill'`;

const validationMessage = 'Please enter your transaction details';

interface AddExpenseFormProps {
  isMobile: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  refreshTransactions: () => void;
}

const parseTransactionText = async (transactionText: string): Promise<Omit<Transaction, 'id'>[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/parse-transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transactionsDescription: transactionText,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.data.transactions || [];
  } catch (error) {
    console.error('Error parsing transactions:', error);
    throw error;
  }
};

function AddExpenseForm({ isMobile, addTransaction, refreshTransactions }: AddExpenseFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleFinish = async (values: { transactionText: string }) => {
    try {
      setLoading(true);
      const { transactionText } = values;
      const parsedTransactions = await parseTransactionText(transactionText);

      for await (const transaction of parsedTransactions) {
        await addTransaction(transaction);
      }

      await refreshTransactions();
      form.resetFields();
      setLoading(false);
      messageApi.success(`Successfully parsed ${parsedTransactions.length} transaction(s)!`);
    } catch (error) {
      console.error('Error parsing transactions:', error);
      messageApi.error('Failed to parse transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Add Expense">
      {contextHolder}
      <Form name="addExpenseForm" autoComplete="off" onFinish={handleFinish} form={form} disabled={loading}>
        <Form.Item
          name="transactionText"
          rules={[{ required: true, message: validationMessage }]}
          validateTrigger="onSubmit"
        >
          <Input.TextArea
            autoSize={{
              minRows: isMobile ? 4 : 6,
              maxRows: isMobile ? 4 : 6,
            }}
            placeholder={placeholderText}
          />
        </Form.Item>
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Parse Transactions
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default AddExpenseForm;
