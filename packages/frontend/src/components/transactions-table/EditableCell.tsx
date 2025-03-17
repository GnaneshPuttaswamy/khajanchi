// Custom cell for table

import { DatePicker, Form, Input, InputNumber } from 'antd';
import { TRANSACTION_COLUMN_FIELDS } from '../../constants/TransactionTableConstants';
import { Transaction } from '../../types/types';

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

export default EditableCell;
