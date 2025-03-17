import { Button, Popconfirm } from 'antd';
import { Transaction } from '../../types/types';
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useState } from 'react';

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

export { ConfirmButton, EditButton, DeleteButton, CancelButton, SaveButton };
