import { cpSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const source = resolve('prisma/contract.d.ts');
const destination = resolve('dist/prisma/contract.d.ts');

mkdirSync(dirname(destination), { recursive: true });
cpSync(source, destination);
