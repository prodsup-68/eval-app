import PocketBase from 'pocketbase';

import { backendUrl } from './env';

export const pb = new PocketBase(backendUrl);
