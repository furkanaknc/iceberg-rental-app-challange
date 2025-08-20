import { PrismaFindManyArgs, PrismaModelName } from './prisma.type';

export type SearchParams<T extends PrismaModelName> = PrismaFindManyArgs<T>['where'];
