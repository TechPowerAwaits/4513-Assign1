/*
 * Purpose: Manages the retrieval of data from a database.
 */

import { TableRef } from "./tableRef.mjs";

/*
 * Purpose: Provides the ability to get data from fields in a database.
 */
class DataGetter {
  constructor(db, tableName, fields) {
    this.db = db;
    this.defaultFields = fields;
    this.tableName = tableName;
    this.tableRefs = [];
  }

  /*
   * Purpose: Adds references to the tables to any query builder returned by
   * future function calls.
   *
   * Details: Any tableRefs specified will allow that table to be used within
   * filters without adjusting the fields shown.
   */
  addRefs(...tableRefs) {
    this.tableRefs.push(...tableRefs);
  }

  /*
   * Purpose: Gets the data from the database.
   *
   * Details: Any tableRefs specified will allow that table to be used within
   * filters without adjusting the fields shown.
   *
   * Returns: A Supabase Query Builder.
   */
  get(fields = this.defaultFields, ...tableRefs) {
    const allTableRefs = Array.from(this.tableRefs);
    allTableRefs.push(...tableRefs);

    return this.db
      .from(this.tableName)
      .select(TableRef.appendSupabaseSel(fields, ...allTableRefs));
  }
}

export { DataGetter };
