import {
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  message,
  Pagination,
  Popconfirm,
  Space,
  Table,
  TableProps,
  Tag,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { Transaction } from '../../types/types';
import { ACTION_COLUMN_FIELDS, TRANSACTION_COLUMN_FIELDS } from '../../constants/TransactionTableConstants';
import dayjs from 'dayjs';
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

const categoryColors: Record<string, string> = {
  food: 'green',
  entertainment: 'blue',
  groceries: 'gold',
  clothing: 'orange',
  travel: 'purple',
  utilities: 'red',
  shopping: 'magenta',
  health: 'geekblue',
  education: 'cyan',
};

const baseColumns: TableProps<Transaction>['columns'] = [
  {
    title: 'Date',
    dataIndex: TRANSACTION_COLUMN_FIELDS.DATE,
    width: '15%',
    minWidth: 120,
    render: (text: string) => dayjs(text).format('Do, MMM YYYY'),
  },
  {
    title: 'Amount',
    dataIndex: TRANSACTION_COLUMN_FIELDS.AMOUNT,
    width: '10%',
    minWidth: 100,
  },
  {
    title: 'Category',
    dataIndex: TRANSACTION_COLUMN_FIELDS.CATEGORY,
    width: '15%',
    minWidth: 120,
    render: (text: string) => {
      const color = categoryColors[text.toLowerCase()] || '';
      return <Tag color={color}>{text}</Tag>;
    },
  },
  {
    title: 'Description',
    dataIndex: TRANSACTION_COLUMN_FIELDS.DESCRIPTION,
    minWidth: 200,
  },
];

interface MyTableProps {
  transactions: Transaction[];
  isConfirmedTransactions: boolean;
  isCompact: boolean;
  deleteTransaction: (id: React.Key) => Promise<void>;
  updateTransaction: (id: React.Key, updatedTransaction: Partial<Omit<Transaction, 'id'>>) => Promise<void>;
}

function TransactionsTable({
  transactions,
  isConfirmedTransactions,
  isCompact,
  deleteTransaction,
  updateTransaction,
}: MyTableProps) {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (err) {
      messageApi.error({
        content: err,
        onClose: () => {
          setErr(null);
        },
      });
    }
  }, [err, messageApi]);

  // Only one transaction can be edited at a time.
  const [currentlyEditingId, setCurrentlyEditingId] = useState<React.Key | null>(null);

  // Disables form fields when a transaction is being saved.
  const [isFormDisabled, setIsFormDisabled] = useState<boolean>(false);

  // Tracks IDs of transactions that are being confirmed, deleted, or saved.
  // Used to disable buttons and show loading indicators for transactions being confirmed, deleted, or saved.
  const [confirmingTransactionIds, setConfirmingTransactionIds] = useState<React.Key[]>([]);
  const [deletingTransactionIds, setDeletingTransactionIds] = useState<React.Key[]>([]);
  const [savingTransactionIds, setSavingTransactionIds] = useState<React.Key[]>([]);

  // Manages the confirmation process for transactions.
  // 1. Resets the editing state if the transaction is being edited.
  // 2. Adds the transaction ID to the list of confirming transactions.
  // 3. Updates the transaction status via the API.
  // 4. Removes the transaction ID from the confirming list, regardless of success or failure.
  const onConfirm = async (transactionId: React.Key) => {
    try {
      if (confirmingTransactionIds.includes(transactionId)) {
        setCurrentlyEditingId(null);
      }

      setConfirmingTransactionIds((prev) => [...prev, transactionId]);

      await updateTransaction(transactionId, { isConfirmed: true });
    } catch (error) {
      console.log('Error while deleting transaction => ', error);
      setConfirmingTransactionIds((prev) => prev.filter((id) => id !== transactionId));
      setErr('Error while deleting transaction');
    } finally {
      setConfirmingTransactionIds((prev) => prev.filter((id) => id !== transactionId));
    }
  };

  // Switches a transaction to edit state.
  // 1. Populates the form fields with the transaction's current values.
  // 2. Updates the state to indicate that the transaction is being edited.
  const onEdit = (transactionToEdit: Transaction) => {
    form.setFieldsValue({
      [TRANSACTION_COLUMN_FIELDS.DATE]: dayjs(transactionToEdit.date),
      [TRANSACTION_COLUMN_FIELDS.AMOUNT]: transactionToEdit.amount,
      [TRANSACTION_COLUMN_FIELDS.CATEGORY]: transactionToEdit.category,
      [TRANSACTION_COLUMN_FIELDS.DESCRIPTION]: transactionToEdit.description,
    });

    setCurrentlyEditingId(transactionToEdit.id);
  };

  // Deletes a transaction.
  // 1. Adds the transaction ID to the list of deleting transactions.
  // 2. Deletes the transaction via the API.
  // 3. Removes the transaction ID from the deleting list, regardless of success or failure.
  const onDelete = async (transactionId: React.Key) => {
    try {
      setDeletingTransactionIds((prev) => [...prev, transactionId]);
      await deleteTransaction(transactionId);
    } catch (error) {
      console.log('Error while deleting transaction => ', error);
      setDeletingTransactionIds((prev) => prev.filter((id) => id !== transactionId));
      setErr('Error while deleting transaction');
    } finally {
      setDeletingTransactionIds((prev) => prev.filter((id) => id !== transactionId));
    }
  };

  // Resets the editing state.
  const onCancel = () => {
    form.resetFields();
    setCurrentlyEditingId(null);
  };

  // Saves the edited transaction with the new values.
  // 1. Adds the transaction ID to the list of saving transactions.
  // 2. Disables the form fields.
  // 3. Validates the form fields.
  // 4. Updates the transaction via the API.
  // 5. Resets the form fields.
  // 6. Removes the transaction ID from the saving list, regardless of success or failure.
  // 7. Resets the current editing state.
  const onSave = async (transactionId: React.Key) => {
    try {
      setSavingTransactionIds((prev) => [...prev, transactionId]);
      setIsFormDisabled(true);
      const newValues = await form.validateFields();
      await updateTransaction(transactionId, newValues);
      form.resetFields();
      setCurrentlyEditingId(null);
    } catch (error) {
      console.log(`Error while saving the record with id=${transactionId}`, error);
      setErr('Error while saving the record');
    } finally {
      setSavingTransactionIds((prev) => prev.filter((id) => id !== transactionId));
      setIsFormDisabled(false);
    }
  };

  const confirmColumn = {
    title: 'Confirm',
    dataIndex: ACTION_COLUMN_FIELDS.CONFIRMATION,
    width: '12.5%',
    render: (_: unknown, record: Transaction) => {
      return (
        <ConfirmButton
          transactionId={record.id}
          confirmingTransactionIds={confirmingTransactionIds}
          deletingTransactionIds={deletingTransactionIds}
          savingTransactionIds={savingTransactionIds}
          onConfirm={onConfirm}
        />
      );
    },
  };

  const modifyColumn = {
    title: 'Modify',
    dataIndex: ACTION_COLUMN_FIELDS.MODIFY,
    width: '12.5%',
    render: (_: unknown, record: Transaction) => {
      const isEditing = currentlyEditingId === record.id;

      return isEditing ? (
        <Space>
          <SaveButton transactionId={record.id} savingTransactionIds={savingTransactionIds} onSave={onSave} />
          <CancelButton transactionId={record.id} savingTransactionIds={savingTransactionIds} onCancel={onCancel} />
        </Space>
      ) : (
        <Space size={10}>
          <EditButton
            transactionToEdit={record}
            confirmingTransactionIds={confirmingTransactionIds}
            deletingTransactionIds={deletingTransactionIds}
            savingTransactionIds={savingTransactionIds}
            onEdit={onEdit}
          />
          <DeleteButton
            transactionId={record.id}
            confirmingTransactionIds={confirmingTransactionIds}
            deletingTransactionIds={deletingTransactionIds}
            savingTransactionIds={savingTransactionIds}
            onDelete={onDelete}
          />
        </Space>
      );
    },
  };

  let columns: TableProps<Transaction>['columns'] = [];

  if (isConfirmedTransactions) {
    columns = [
      ...baseColumns!,
      {
        ...modifyColumn,
        align: 'center' as const,
      },
    ];
  } else {
    columns = [
      ...baseColumns!,
      {
        ...confirmColumn,
        align: 'center' as const,
      },
      {
        ...modifyColumn,
        align: 'center' as const,
      },
    ];
  }

  // Transforming the columns to include additional props in each cell
  const mergedColumns: TableProps<Transaction>['columns'] = columns!.map((col) => {
    if (!('dataIndex' in col)) {
      return col;
    }

    if (col.dataIndex !== ACTION_COLUMN_FIELDS.CONFIRMATION && col.dataIndex !== ACTION_COLUMN_FIELDS.MODIFY) {
      return {
        ...col,
        onCell: (record: Transaction) => ({
          editing: currentlyEditingId === record.id, // To change the editing state of the cell
          dataIndex: col.dataIndex, // To select the input type
          title: col.title, // To display the title of the cell in error message
          // isMobile: false, // To check if the device is mobile and then make the input read only for date picker
          disabled: isFormDisabled,
        }),
      } as typeof col;
    }

    return col;
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  return (
    <>
      {contextHolder}
      <Form form={form} component={false}>
        <Table
          components={{ body: { cell: EditableCell } }}
          columns={mergedColumns}
          dataSource={transactions}
          style={{
            flex: 1,
          }}
          size="small"
          pagination={false}
          rowKey="id"
          scroll={{
            x: 'max-content',
            y: isConfirmedTransactions
              ? `calc(100vh - ${isCompact ? 230 : 280}px)`
              : `calc(100vh - ${isCompact ? 440 : 550}px)`,
          }}
        ></Table>
      </Form>
      {isConfirmedTransactions && (
        <Flex vertical={false} justify="flex-end">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            size="small"
            total={transactions.length}
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size || 20);
            }}
            showSizeChanger
            showTotal={(total) => `Total ${total} items`}
          />
        </Flex>
      )}
    </>
  );
}

export default TransactionsTable;

// Confirming an transaction
interface ConfirmButtonProps {
  transactionId: React.Key;
  confirmingTransactionIds: React.Key[];
  deletingTransactionIds: React.Key[];
  savingTransactionIds: React.Key[];
  onConfirm: (transactionId: React.Key) => Promise<void>;
}

function ConfirmButton({
  transactionId,
  confirmingTransactionIds,
  deletingTransactionIds,
  savingTransactionIds,
  onConfirm,
}: ConfirmButtonProps) {
  const handeConfirm = async (e) => {
    e?.preventDefault();
    await onConfirm(transactionId);
  };

  const isLoading = confirmingTransactionIds.includes(transactionId);
  const isDisabled =
    confirmingTransactionIds.includes(transactionId) ||
    deletingTransactionIds.includes(transactionId) ||
    savingTransactionIds.includes(transactionId);

  return (
    <Button loading={isLoading} disabled={isDisabled} onClick={handeConfirm}>
      Confirm
    </Button>
  );
}

// Transition to edit an transaction
interface EditButtonProps {
  transactionToEdit: Transaction;
  confirmingTransactionIds: React.Key[];
  deletingTransactionIds: React.Key[];
  savingTransactionIds: React.Key[];
  onEdit: (transactionToEdit: Transaction) => void;
}

function EditButton({
  transactionToEdit,
  confirmingTransactionIds,
  deletingTransactionIds,
  savingTransactionIds,
  onEdit,
}: EditButtonProps) {
  const handleEdit: React.MouseEventHandler<HTMLElement> = (e) => {
    e.preventDefault();
    onEdit(transactionToEdit);
  };

  const isDisabled =
    confirmingTransactionIds.includes(transactionToEdit.id) ||
    deletingTransactionIds.includes(transactionToEdit.id) ||
    savingTransactionIds?.length > 0;

  return <Button icon={<EditOutlined />} onClick={handleEdit} disabled={isDisabled} />;
}

// Deleting an transaction
interface DeleteButtonProps {
  transactionId: React.Key;
  confirmingTransactionIds: React.Key[];
  deletingTransactionIds: React.Key[];
  savingTransactionIds: React.Key[];
  onDelete: (transactionId: React.Key) => Promise<void>;
}

function DeleteButton({
  transactionId,
  confirmingTransactionIds,
  deletingTransactionIds,
  savingTransactionIds,
  onDelete,
}: DeleteButtonProps) {
  const [visible, setVisible] = useState(false);

  const handleDelete = async (e) => {
    setVisible(false);
    e?.preventDefault();
    await onDelete(transactionId);
  };

  const isLoading = deletingTransactionIds.includes(transactionId);
  const isDisabled =
    confirmingTransactionIds.includes(transactionId) ||
    deletingTransactionIds.includes(transactionId) ||
    savingTransactionIds?.includes(transactionId);

  return (
    <Popconfirm title="Are you sure to delete?" onConfirm={handleDelete} open={visible} onOpenChange={setVisible}>
      <Button icon={<DeleteOutlined />} loading={isLoading} disabled={isDisabled} />
    </Popconfirm>
  );
}

// Button for cancelling editing of an transaction
interface CancelButtonProps {
  transactionId: React.Key;
  savingTransactionIds: React.Key[];
  onCancel: () => void;
}

function CancelButton({ transactionId, savingTransactionIds, onCancel }: CancelButtonProps) {
  const handleCancel: React.MouseEventHandler<HTMLElement> = (e) => {
    e.preventDefault();
    onCancel();
  };

  const isDisabled = savingTransactionIds?.includes(transactionId);

  return <Button onClick={handleCancel} icon={<CloseOutlined />} disabled={isDisabled} />;
}

// Button to save the edited state of the transaction
interface SaveButtonProps {
  transactionId: React.Key;
  savingTransactionIds: React.Key[];
  onSave: (transactionId: React.Key) => Promise<void>;
}

function SaveButton({ transactionId, savingTransactionIds, onSave }: SaveButtonProps) {
  const handleSave: React.MouseEventHandler<HTMLElement> = async (e) => {
    e?.preventDefault();
    await onSave(transactionId);
  };

  const isLoading = savingTransactionIds?.includes(transactionId);
  const isDisabled = savingTransactionIds?.includes(transactionId);

  return <Button icon={<CheckOutlined />} onClick={handleSave} loading={isLoading} disabled={isDisabled} />;
}

// Custom cell for table

// // Basic version of the custom cell for Table, have kept it commented to understand how it works
/**
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({ editing, children, ...restProps }) => {
  return <td {...restProps}>{editing ? <>Editing</> : children}</td>;
};
*/

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: keyof Transaction;
  title: string;
  disabled: boolean;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  editing,
  dataIndex,
  title,
  children,
  disabled,
  ...restProps
}) => {
  let inputNode;

  switch (dataIndex) {
    case TRANSACTION_COLUMN_FIELDS.AMOUNT:
      inputNode = <InputNumber disabled={disabled} />;
      break;
    case TRANSACTION_COLUMN_FIELDS.DATE:
      inputNode = <DatePicker disabled={disabled} />;
      break;
    default:
      inputNode = <Input disabled={disabled} />;
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
          validateTrigger="onSubmit"
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
