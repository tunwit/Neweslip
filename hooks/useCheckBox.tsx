import { create } from "zustand";

interface CheckBoxState<T extends string | number> {
  checked: Record<string, T[]>;
  isChecked: (groupId: string, id: T) => boolean;
  toggle: (groupId: string, id: T) => void;
  uncheckall: (groupId: string) => void;
  checkall: (groupId: string, ids: T[]) => void;
}

export interface UseCheckBoxResult<T extends string | number> {
  checked: T[];
  isChecked: (id: T) => boolean;
  toggle: (id: T) => void;
  uncheckall: () => void;
  checkall: (ids: T[]) => void;
  isAllChecked: (itemLength: number) => boolean;
  isNoneChecked: () => boolean;
  isSomeChecked: (itemLength: number) => boolean;
}

const useCheckBoxStore = create<CheckBoxState<string | number>>(set => ({
  checked: {},
  
  isChecked: (groupId, id) => {
    const state: CheckBoxState<string | number> = useCheckBoxStore.getState();
    return state.checked[groupId]?.includes(id) || false;
  },

  toggle: (groupId, id) =>
    set(state => ({
      checked: {
        ...state.checked,
        [groupId]: state.checked[groupId]?.includes(id)
          ? state.checked[groupId].filter(x => x !== id)
          : [...(state.checked[groupId] || []), id],
      },
    })),

  uncheckall: (groupId) =>
    set(state => ({
      checked: { ...state.checked, [groupId]: [] },
    })),

  checkall: (groupId, ids) =>
    set(state => ({
      checked: { ...state.checked, [groupId]: ids },
    }))
}));


export const useCheckBox = <T extends string | number>(groupId: string):UseCheckBoxResult<T> => {
  const store = useCheckBoxStore();
  if (!store.checked[groupId]) {
    store.checkall(groupId, []); // create empty array for this group
  }

  const checked = (store.checked[groupId] ?? []) as unknown as T[];

  const isChecked = (id: T) => store.isChecked(groupId, id);
  const toggle = (id: T) => store.toggle(groupId, id);
  const uncheckall = () => store.uncheckall(groupId);
  const checkall = (ids: T[]) => store.checkall(groupId, ids);
  const isAllChecked = (itemLength: number) => itemLength > 0 && checked.length === itemLength;
  const isNoneChecked = () => checked.length === 0;
  const isSomeChecked = (itemLength: number) => checked.length > 0 && checked.length < itemLength;

  return { checked, isChecked, toggle, uncheckall, checkall, isAllChecked, isNoneChecked, isSomeChecked };
};
