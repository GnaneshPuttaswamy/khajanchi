import { Button, Form, Input, Card, message } from 'antd';
import React, { useContext, useState } from 'react';
import { Transaction } from '../../../types/types';
import { IsMobileContext } from '../../../context/IsMobileContext';
import { axiosInstance } from '../../../utils/httpUtil';

const placeholderText = `Describe your transactions in natural language. For example: 
'₹90 at grocery store, ₹45 for bus pass
₹160 for electricity bill'`;

const validationMessage = 'Please enter your transaction details';

interface AddExpenseFormProps {
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  refreshTransactions: (isConfirmed: boolean) => void;
}

const parseTransactionText = async (
  transactionText: string
): Promise<Omit<Transaction, 'id'>[]> => {
  try {
    const response = await axiosInstance.post('/parse-transactions', {
      transactionsDescription: transactionText,
    });

    return response.data.data.transactions || [];
  } catch (error) {
    console.error(
      'AddExpenseForm :: parseTransactionText() :: Error parsing transactions =>',
      error
    );
    throw error;
  }
};

function AddExpenseForm({
  addTransaction,
  refreshTransactions,
}: AddExpenseFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { isMobile } = useContext(IsMobileContext);

  const handleFinish = async (values: { transactionText: string }) => {
    try {
      setLoading(true);
      const { transactionText } = values;
      const parsedTransactions = await parseTransactionText(transactionText);

      for await (const transaction of parsedTransactions) {
        await addTransaction(transaction);
      }

      await refreshTransactions(false);
      form.resetFields();
      setLoading(false);
      messageApi.success(
        `Successfully parsed ${parsedTransactions.length} transaction(s)!`
      );
    } catch (error) {
      console.error(
        'AddExpenseForm :: handleFinish() :: Error parsing transactions =>',
        error
      );
      messageApi.error('Failed to parse transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    form.setFields([{ name: 'transactionText', errors: [] }]);
  };

  return (
    <Card title="Add Expense">
      {contextHolder}
      <Form
        name="addExpenseForm"
        autoComplete="off"
        onFinish={handleFinish}
        form={form}
        disabled={loading}
      >
        <Form.Item
          name="transactionText"
          rules={[{ required: true, message: validationMessage }]}
          validateTrigger={'onSubmit'}
        >
          <Input.TextArea
            autoSize={{
              minRows: isMobile ? 4 : 6,
              maxRows: isMobile ? 4 : 6,
            }}
            placeholder={placeholderText}
            onChange={clearError}
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
