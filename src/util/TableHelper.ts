export class TableHelper {

  public static takePage<T>(fullList: T[], page: number, pageSize: number): T[]{
    let offset = pageSize * page;
    return fullList.slice(offset, offset+pageSize);
  }

  public static calcPageCount(totalRows: number, pageSize: number): number{
    if (totalRows == 0) {
      return 0;
    } else if (totalRows % pageSize == 0) {
      return totalRows / pageSize;
    } else {
      return Math.floor(totalRows / pageSize)+1;
    }
  }

}
