#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/3ef2413896b53ce52facc66753116a2a6fe6cdce52d13e672ff1aa692dd6a694/contract';
import endContract from '../../snapshots/3ef2413896b53ce52facc66753116a2a6fe6cdce52d13e672ff1aa692dd6a694/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/e3538fac3e614dcdcd5129d92ce4f25e8013d8463227b5a8d6f049e8a55512a1/contract';
import startContract from '../../snapshots/e3538fac3e614dcdcd5129d92ce4f25e8013d8463227b5a8d6f049e8a55512a1/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropDefault({ schema: 'public', table: 'Customer', column: 'updatedAt' }),
      this.dropDefault({ schema: 'public', table: 'Doctor', column: 'updatedAt' }),
      this.dropDefault({ schema: 'public', table: 'Schedule', column: 'updatedAt' }),
      this.dropDefault({ schema: 'public', table: 'User', column: 'updatedAt' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
