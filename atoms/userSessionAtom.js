import { atom } from 'recoil';

export const userSessionId = atom({
  key: 'userId',
  default: null,
});
