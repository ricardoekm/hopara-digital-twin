package hopara.dataset.transform;

import hopara.dataset.column.Column;
import hopara.dataset.column.ColumnType;
import hopara.dataset.column.Columns;
import hopara.dataset.row.read.SortOrder;

import static hopara.dataset.Format.format;

public class UnitTransform extends QueryProcessingTransform {
    String groupColumnName;
    Integer groupLimit;
    String sortColumnName;    
    SortOrder sortOrder;

    @Override
    public TransformType getType() {
        return TransformType.UNIT;
    }

    public void setGroupColumn(String groupField) {
        this.groupColumnName = groupField;
    }

    public void setSortColumn(String sortField) {
        this.sortColumnName = sortField;
    }

    public void setSortOrder(SortOrder sortOrder) {
        this.sortOrder = sortOrder;
    }

    private String getStringSortOrder() {
        if ( this.sortOrder == null ) {
            return SortOrder.ASC.toString();
        }

        return this.sortOrder.toString();
    }

    private String getIndexSort(Columns columns) {
        if ( this.sortColumnName == null ) {
            return "";
        }

        var sortColumn = columns.get(this.sortColumnName);
        if ( sortColumn == null ) {
            throw new IllegalArgumentException("Sort column not found: " + this.sortColumnName);
        }

        return format("ORDER BY %s %s", sortColumn.getSqlName(), this.getStringSortOrder());
    }

    private String getIndexSelect(Columns columns, String baseCteName) {
        var groupColumn = columns.get(this.groupColumnName);
        if ( groupColumn == null ) {
            throw new IllegalArgumentException("Group column not found: " + this.groupColumnName);
        }

        return format("ROW_NUMBER() OVER (PARTITION BY %s.%s %s) - 1 as _index",
                      baseCteName, groupColumn.getSqlName(), getIndexSort(columns));
    }

    private String getGroupLimitClause() {
        if ( this.groupLimit == null ) {
            return "";
        }

        return "LIMIT " + this.groupLimit;
    }

    @Override
    public String getQuery(Columns columns, String baseCteName) {
        if ( this.groupColumnName == null ) {
            throw new IllegalArgumentException("Required transform param not found: groupColumn");
        }

        var groupColumn = columns.get(this.groupColumnName);
        return format("SELECT %s.*, count, %s FROM %s " +
                      "INNER JOIN (" +
                           "SELECT count(*) as count, %s FROM %s GROUP BY %s ORDER BY count DESC " + getGroupLimitClause() +
                       ") AS subquery ON subquery.%s = %s.%s " +
                       "ORDER BY count DESC",
                       baseCteName, getIndexSelect(columns, baseCteName), baseCteName, groupColumn.getSqlName(), baseCteName,
                       groupColumn.getSqlName(), groupColumn.getSqlName(), baseCteName, groupColumn.getSqlName()); // Java is so nice
    }

    @Override
    public Columns getColumns(Columns viewColumns) {
        var columns = new Columns();
        columns.addAll(viewColumns);
        columns.add(new Column("count", ColumnType.INTEGER));
        return columns;
    }

    public void setGroupLimit(Integer groupLimit) {
        this.groupLimit = groupLimit;
    }
}
