export interface TransactionsTableState {
  // Only one transaction can be edited at a time.
  currentlyEditingId: string | null;

  // Disables form fields when a transaction is being saved.
  isFormDisabled: boolean;

  // Tracks IDs of transactions that are being confirmed, deleted, or saved.
  // Used to disable buttons and show loading indicators for transactions being confirmed, deleted, or saved.
  confirmingTransactionIds: React.Key[];
  deletingTransactionIds: React.Key[];
  savingTransactionIds: React.Key[];
}

export enum TransactionsTableActionType {
  SET_EDITING_ID = 'SET_EDITING_ID',
  CLEAR_EDITING_ID = 'CLEAR_EDITING_ID',
  SET_FORM_DISABLED = 'SET_FORM_DISABLED',
  CLEAR_FORM_DISABLED = 'CLEAR_FORM_DISABLED',
  ADD_CONFIRMING_TRANSACTION_ID = 'ADD_CONFIRMING_TRANSACTION_ID',
  REMOVE_CONFIRMING_TRANSACTION_ID = 'REMOVE_CONFIRMING_TRANSACTION_ID',
  ADD_DELETING_TRANSACTION_ID = 'ADD_DELETING_TRANSACTION_ID',
  REMOVE_DELETING_TRANSACTION_ID = 'REMOVE_DELETING_TRANSACTION_ID',
  ADD_SAVING_TRANSACTION_ID = 'ADD_SAVING_TRANSACTION_ID',
  REMOVE_SAVING_TRANSACTION_ID = 'REMOVE_SAVING_TRANSACTION_ID',
}

export interface SetEditingIdAction {
  type: TransactionsTableActionType.SET_EDITING_ID;
  payload: {
    id: string;
  };
}

export interface ClearEditingIdAction {
  type: TransactionsTableActionType.CLEAR_EDITING_ID;
}

export interface SetFormDisabledAction {
  type: TransactionsTableActionType.SET_FORM_DISABLED;
}

export interface ClearFormDisabledAction {
  type: TransactionsTableActionType.CLEAR_FORM_DISABLED;
}

export interface AddConfirmingTransactionIdAction {
  type: TransactionsTableActionType.ADD_CONFIRMING_TRANSACTION_ID;
  payload: {
    id: React.Key;
  };
}

export interface RemoveConfirmingTransactionIdAction {
  type: TransactionsTableActionType.REMOVE_CONFIRMING_TRANSACTION_ID;
  payload: {
    id: React.Key;
  };
}

export interface AddDeletingTransactionIdAction {
  type: TransactionsTableActionType.ADD_DELETING_TRANSACTION_ID;
  payload: {
    id: React.Key;
  };
}

export interface RemoveDeletingTransactionIdAction {
  type: TransactionsTableActionType.REMOVE_DELETING_TRANSACTION_ID;
  payload: {
    id: React.Key;
  };
}

export interface AddSavingTransactionIdAction {
  type: TransactionsTableActionType.ADD_SAVING_TRANSACTION_ID;
  payload: {
    id: React.Key;
  };
}

export interface RemoveSavingTransactionIdAction {
  type: TransactionsTableActionType.REMOVE_SAVING_TRANSACTION_ID;
  payload: {
    id: React.Key;
  };
}

export type TransactionsTableAction =
  | SetEditingIdAction
  | ClearEditingIdAction
  | SetFormDisabledAction
  | ClearFormDisabledAction
  | AddConfirmingTransactionIdAction
  | RemoveConfirmingTransactionIdAction
  | AddDeletingTransactionIdAction
  | RemoveDeletingTransactionIdAction
  | AddSavingTransactionIdAction
  | RemoveSavingTransactionIdAction;

export const transactionsTableReducer = (
  state: TransactionsTableState,
  action: TransactionsTableAction
): TransactionsTableState => {
  switch (action.type) {
    case TransactionsTableActionType.SET_EDITING_ID: {
      return { ...state, currentlyEditingId: action.payload.id };
    }

    case TransactionsTableActionType.CLEAR_EDITING_ID: {
      return { ...state, currentlyEditingId: null };
    }

    case TransactionsTableActionType.SET_FORM_DISABLED: {
      return { ...state, isFormDisabled: true };
    }

    case TransactionsTableActionType.CLEAR_FORM_DISABLED: {
      return { ...state, isFormDisabled: false };
    }

    case TransactionsTableActionType.ADD_CONFIRMING_TRANSACTION_ID: {
      return { ...state, confirmingTransactionIds: [...state.confirmingTransactionIds, action.payload.id] };
    }

    case TransactionsTableActionType.REMOVE_CONFIRMING_TRANSACTION_ID: {
      return {
        ...state,
        confirmingTransactionIds: state.confirmingTransactionIds.filter((id) => id !== action.payload.id),
      };
    }

    case TransactionsTableActionType.ADD_DELETING_TRANSACTION_ID: {
      return { ...state, deletingTransactionIds: [...state.deletingTransactionIds, action.payload.id] };
    }

    case TransactionsTableActionType.REMOVE_DELETING_TRANSACTION_ID: {
      return {
        ...state,
        deletingTransactionIds: state.deletingTransactionIds.filter((id) => id !== action.payload.id),
      };
    }

    case TransactionsTableActionType.ADD_SAVING_TRANSACTION_ID: {
      return { ...state, savingTransactionIds: [...state.savingTransactionIds, action.payload.id] };
    }

    case TransactionsTableActionType.REMOVE_SAVING_TRANSACTION_ID: {
      return {
        ...state,
        savingTransactionIds: state.savingTransactionIds.filter((id) => id !== action.payload.id),
      };
    }

    default:
      return state;
  }
};
