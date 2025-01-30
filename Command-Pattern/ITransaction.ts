export interface ITransaction {
  validate(): boolean;
  execute(): void;
}
