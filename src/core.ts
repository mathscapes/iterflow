export class IterflowError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'IterflowError';
  }
}

export class EmptySequenceError extends IterflowError {
  constructor(readonly op: string) {
    super(`Cannot compute ${op} of empty sequence`);
    this.name = 'EmptySequenceError';
  }
}

export type Predicate<T> = (v: T, i: number) => boolean;
export type Mapper<T, U> = (v: T, i: number) => U;
export type Reducer<T, U> = (acc: U, v: T, i: number) => U;
export type FlatMapper<T, U> = (v: T, i: number) => Iterable<U>;

export const isIterable = (v: unknown): v is Iterable<unknown> =>
  v != null && typeof v === 'object' && Symbol.iterator in v;
