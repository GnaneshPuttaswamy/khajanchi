import { Form, message, Space, Table, TableProps, Tag } from 'antd';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Transaction } from '../../types/types';
import {
  ACTION_COLUMN_FIELDS,
  TRANSACTION_COLUMN_FIELDS,
} from '../../constants/TransactionTableConstants';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {
  CancelButton,
  ConfirmButton,
  DeleteButton,
  EditButton,
  SaveButton,
} from './TransactionActionButtons';
import EditableCell from './EditableCell';
import {
  TransactionsTableActionType,
  transactionsTableReducer,
  TransactionsTableState,
} from '../../reducers/transactionsTableReducer';
import { CompactModeContext } from '../../context/CompactModeContext';
import { convertPaiseToRupees } from '../../utils/currencyFormatter';
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

dayjs.extend(utc);

const baseColumns: TableProps<Transaction>['columns'] = [
  {
    title: 'Date',
    dataIndex: TRANSACTION_COLUMN_FIELDS.DATE,
    width: '15%',
    minWidth: 120,
    render: (text: string) => dayjs.utc(text).local().format('Do, MMM YYYY'),
    sorter: (a, b) => dayjs(a.date).diff(dayjs(b.date)),
  },
  {
    title: 'Amount',
    dataIndex: TRANSACTION_COLUMN_FIELDS.AMOUNT,
    width: '10%',
    minWidth: 100,
    render: (text: number) => convertPaiseToRupees(text),
    sorter: (a, b) => a.amount - b.amount,
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
    sorter: (a, b) => a.category.localeCompare(b.category),
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
  deleteTransaction: (id: React.Key) => Promise<void>;
  updateTransaction: (
    id: React.Key,
    updatedTransaction: Partial<Omit<Transaction, 'id'>>
  ) => Promise<void>;
  refreshTransactions: (isConfirmed: boolean) => void;
}

const initialState: TransactionsTableState = {
  currentlyEditingId: null,
  isFormDisabled: false,
  confirmingTransactionIds: [],
  deletingTransactionIds: [],
  savingTransactionIds: [],
};

function TransactionsTable({
  transactions,
  isConfirmedTransactions,
  deleteTransaction,
  refreshTransactions,
  updateTransaction,
}: MyTableProps) {
  const { isCompact } = useContext(CompactModeContext);
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

  const [transactionsTableState, dispatch] = useReducer(
    transactionsTableReducer,
    initialState
  );
  const {
    currentlyEditingId,
    isFormDisabled,
    confirmingTransactionIds,
    deletingTransactionIds,
    savingTransactionIds,
  } = transactionsTableState;

  // Manages the confirmation process for transactions.
  // 1. Resets the editing state if the transaction is being edited.
  // 2. Adds the transaction ID to the list of confirming transactions.
  // 3. Updates the transaction status via the API.
  // 4. Removes the transaction ID from the confirming list, regardless of success or failure.
  const onConfirm = async (transactionId: React.Key) => {
    try {
      if (confirmingTransactionIds.includes(transactionId)) {
        dispatch({ type: TransactionsTableActionType.CLEAR_EDITING_ID });
      }

      // setConfirmingTransactionIds((prev) => [...prev, transactionId]);
      dispatch({
        type: TransactionsTableActionType.ADD_CONFIRMING_TRANSACTION_ID,
        payload: { id: transactionId },
      });

      await updateTransaction(transactionId, { isConfirmed: true });
      await refreshTransactions(false);
    } catch (error) {
      console.error(
        'TransactionsTable :: onConfirm() :: Error while confirming transaction =>',
        error
      );
      // setConfirmingTransactionIds((prev) => prev.filter((id) => id !== transactionId));
      dispatch({
        type: TransactionsTableActionType.REMOVE_CONFIRMING_TRANSACTION_ID,
        payload: { id: transactionId },
      });
      setErr('Error while deleting transaction');
    } finally {
      // setConfirmingTransactionIds((prev) => prev.filter((id) => id !== transactionId));
      dispatch({
        type: TransactionsTableActionType.REMOVE_CONFIRMING_TRANSACTION_ID,
        payload: { id: transactionId },
      });
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

    dispatch({
      type: TransactionsTableActionType.SET_EDITING_ID,
      payload: { id: transactionToEdit.id },
    });
  };

  // Deletes a transaction.
  // 1. Adds the transaction ID to the list of deleting transactions.
  // 2. Deletes the transaction via the API.
  // 3. Removes the transaction ID from the deleting list, regardless of success or failure.
  const onDelete = async (transactionId: React.Key) => {
    try {
      dispatch({
        type: TransactionsTableActionType.ADD_DELETING_TRANSACTION_ID,
        payload: { id: transactionId },
      });
      await deleteTransaction(transactionId);
      await refreshTransactions(isConfirmedTransactions);
    } catch (error) {
      console.error(
        'TransactionsTable :: onDelete() :: Error while deleting transaction =>',
        error
      );
      dispatch({
        type: TransactionsTableActionType.REMOVE_DELETING_TRANSACTION_ID,
        payload: { id: transactionId },
      });
      setErr('Error while deleting transaction');
    } finally {
      dispatch({
        type: TransactionsTableActionType.REMOVE_DELETING_TRANSACTION_ID,
        payload: { id: transactionId },
      });
    }
  };

  // Resets the editing state.
  const onCancel = () => {
    form.resetFields();
    dispatch({ type: TransactionsTableActionType.CLEAR_EDITING_ID });
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
      dispatch({
        type: TransactionsTableActionType.ADD_SAVING_TRANSACTION_ID,
        payload: { id: transactionId },
      });
      dispatch({ type: TransactionsTableActionType.SET_FORM_DISABLED });
      const formValues = await form.validateFields();

      // Convert dayjs object to ISO string for API
      const newValues = {
        ...formValues,
        [TRANSACTION_COLUMN_FIELDS.DATE]: formValues[
          TRANSACTION_COLUMN_FIELDS.DATE
        ]
          ? dayjs(formValues[TRANSACTION_COLUMN_FIELDS.DATE]).utc().format()
          : undefined,
      };
      await updateTransaction(transactionId, newValues);
      form.resetFields();
      dispatch({ type: TransactionsTableActionType.CLEAR_EDITING_ID });
    } catch (error) {
      console.error(
        `TransactionsTable :: onSave() :: Error while saving the record with id=${transactionId}`,
        error
      );
      setErr('Error while saving the record');
    } finally {
      dispatch({
        type: TransactionsTableActionType.REMOVE_SAVING_TRANSACTION_ID,
        payload: { id: transactionId },
      });
      dispatch({ type: TransactionsTableActionType.CLEAR_FORM_DISABLED });
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
          <SaveButton
            transactionId={record.id}
            savingTransactionIds={savingTransactionIds}
            onSave={onSave}
          />
          <CancelButton
            transactionId={record.id}
            savingTransactionIds={savingTransactionIds}
            onCancel={onCancel}
          />
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
  const mergedColumns: TableProps<Transaction>['columns'] = columns!.map(
    (col) => {
      if (!('dataIndex' in col)) {
        return col;
      }

      if (
        col.dataIndex !== ACTION_COLUMN_FIELDS.CONFIRMATION &&
        col.dataIndex !== ACTION_COLUMN_FIELDS.MODIFY
      ) {
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
    }
  );

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
              ? `calc(100vh - ${isCompact ? 244 : 283}px)`
              : `calc(100vh - ${isCompact ? 499 : 598}px)`,
          }}
        ></Table>
      </Form>
    </>
  );
}

export default TransactionsTable;
