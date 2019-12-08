/**
 * https://github.com/typeorm/typeorm/issues/873#issuecomment-424643086
 * https://github.com/typeorm/typeorm/issues/873#issuecomment-502294597
 */
export class ColumnNumericTransformer {
  public to(data: number): number {
    return data;
  }
  public from(data: string): number {
    return parseFloat(data);
  }
}
