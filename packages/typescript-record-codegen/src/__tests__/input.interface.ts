/**
 * @tsRecord
 */
export interface IInput {
  simple: boolean;
  simpleOptional?: symbol;
  nullable?: string | null;
  hasUndefinedUnion: number | undefined;
}
