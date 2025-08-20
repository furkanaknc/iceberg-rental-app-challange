import { PrismaFindManyArgs, PrismaModelName } from './prisma.type';

export type OrderByParams<T extends PrismaModelName> = PrismaFindManyArgs<T>['orderBy'];
