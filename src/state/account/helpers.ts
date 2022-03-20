import { memoizeOne } from 'utils/memoizeOne';
import { load, save } from 'utils/storage';

export const SELECTED_ADDRESS_LABEL = 'EXTENSION_SELECTED_ADDRESS';

export const saveSelectedAddress = memoizeOne((address: string) => save(SELECTED_ADDRESS_LABEL, address));

export const loadSelectedAddress = () => {
  try {
    const address = load(SELECTED_ADDRESS_LABEL);

    if (typeof address !== 'string') {
      return '';
    }

    return address;
  } catch (error) {
    console.log(error);
    return '';
  }
};
