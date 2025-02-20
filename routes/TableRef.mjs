/*
 * Purpose: To provide an easy syntax for getting references to tables.
 *
 * Details: Table references are joined using inner joins.
 */

class TableRef {
  /*
   * Purpose: Creates a TableRef based on the given tableName.
   */
  constructor(tableName) {
    this.tableName = tableName;
    this._inner = [];
  }

  /*
   * Purpose: Adds a nested TableRef.
   */
  addInnerRef(tableName) {
    this._inner.push(new TableRef(tableName));
    return this;
  }

  /*
   * Purpose: Returns an array of inner TableRefs.
   */
  getInnerRefs() {
    return [...this._inner];
  }

  /*
   * Purpose: To provide the syntax for table referencing in a form supported by
   * the Supabase query builder.
   *
   * Returns: A string representation of the table references.
   */
  getSupabaseRep() {
    let representation = `${this.tableName}!inner(`;
    let addComma = false;

    this._inner.forEach((innerRef) => {
      if (addComma) {
        representation += ", ";
      }
      representation += innerRef.getSupabaseRep();

      addComma = true;
    });

    representation += ")";

    return representation;
  }
}

export { TableRef };
