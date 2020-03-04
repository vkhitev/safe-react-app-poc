import memoize from 'memoize-one'
import equal from 'lodash.isequal'

export const memoizeDeep = <
  ResultFn extends (this: any, ...newArgs: any[]) => ReturnType<ResultFn>
>(
  resultFn: ResultFn,
): ResultFn => memoize(resultFn, equal)
