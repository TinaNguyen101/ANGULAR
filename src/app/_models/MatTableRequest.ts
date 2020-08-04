export class MatTableRequest {
  private sortColumn: string; // desc or asc
  private sortDir: string; // desc or asc
  private pageNumber: number;
  private pageSize: number;
  private filters: any;

    constructor(
      sortColumn: string,
      sortDir: string,
      pageNumber: number,
      pageSize: number,
      filters: any
      ) {
        this.sortColumn = sortColumn;
        this.sortDir = sortDir;
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
        this.filters = filters;
       }
  }
