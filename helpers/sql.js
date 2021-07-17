const { BadRequestError } = require("../expressError");

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
    /** Helper function for making selective update queries.
     *
     * Accepts:
     *      - dataToUpdate: {Object} {field1: newVal, field2: newVal, ...}
     *      - jsToSql: {Object} js-style data fields
     *
     * Returns {sqlSetCols, dataToUpdate}
     */
    const keys = Object.keys(dataToUpdate);
    if (keys.length === 0) throw new BadRequestError("No data.");

    const cols = keys.map(
        (colName, idx) => `"${jsToSql[colName] || colName}"=$${idx + 1}`
    );

    return {
        setCols: cols.join(", "),
        values: Object.values(dataToUpdate),
    };
}

module.exports = { sqlForPartialUpdate };
