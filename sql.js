const { BadRequestError } = require("../expressError");

/** Formats update data for SQL queries,
 * adding sanitized input syntax and formatting colum names as needed:
 * {firstName: 'Aliya', age: 32}, {firstName: "first_name"} =>
 *
 * {
 *  setCols: ['"first_name"=$1', '"age"=$2'],
 *  values: ["Aliya", 32]
 * }
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map(
    //use alt colName if given; add sanitized variable
    (colName, idx) => `"${jsToSql[colName] || colName}"=$${idx + 1}`
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };