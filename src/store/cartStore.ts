import { atom } from 'jotai';
import type { CartItem } from '../types';

export const cartItemsAtom = atom<CartItem[]>([]);
