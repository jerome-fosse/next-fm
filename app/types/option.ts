// Types internes
type Some<T> = { readonly _tag: 'Some'; readonly value: T };
type None = { readonly _tag: 'None' };

// API publique
export type Option<T> = Some<T> | None;

export const some = <T>(value: T): Option<T> => ({ _tag: 'Some', value });
export const none = <T = never>(): Option<T> => ({ _tag: 'None' });

export const isSome = <T>(option: Option<T>): option is Some<T> => option._tag === 'Some';
export const isNone = <T>(option: Option<T>): option is None => option._tag === 'None';
