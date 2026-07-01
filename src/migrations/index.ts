import * as migration_20260701_033504_initial from './20260701_033504_initial';

export const migrations = [
  {
    up: migration_20260701_033504_initial.up,
    down: migration_20260701_033504_initial.down,
    name: '20260701_033504_initial'
  },
];
