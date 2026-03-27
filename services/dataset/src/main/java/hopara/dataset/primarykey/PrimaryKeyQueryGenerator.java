package hopara.dataset.primarykey;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import hopara.dataset.column.Column;
import hopara.dataset.column.ColumnType;
import hopara.dataset.column.Columns;
import hopara.dataset.row.read.ViewSqlBuilder;
import hopara.dataset.view.View;

@Component
public class PrimaryKeyQueryGenerator {
    @Autowired
    ViewSqlBuilder viewSqlBuilder;

    public static final String TOTAL_COLUMN_NAME = "random_prefix_total";

    private String getColumnCountQuery(Column column) {
        return "count(distinct " + column.getSqlName() + ") AS " + column.getSqlName();
    }

    private String getTotalCountQuery() {
        return "count(*) AS " + TOTAL_COLUMN_NAME;
    }

    private Columns getCandidateColumns(Columns columns) {
        var candidateColumns = new Columns();
        
        // We run twice to prioritize integer columns for primary key suggestion
        for ( var column : columns ) {
            if ( column.isType(ColumnType.INTEGER) ) {
                candidateColumns.add(column);
            }
        } 

        for ( var column : columns ) {
            if ( column.isType(ColumnType.STRING) ) {
                candidateColumns.add(column);
            }
        } 

        return candidateColumns;
    }

    private String getCountQuery(View view) {
        var aggregations = new ArrayList<String>();
        for ( var column : getCandidateColumns(view.getColumns())) {
            aggregations.add(getColumnCountQuery(column));
        }
        aggregations.add(getTotalCountQuery());
        return "SELECT " + String.join(",", aggregations) + " FROM " + view.getQueryName();
    }

    public String getQuery(View view) {
        return viewSqlBuilder.getCteQuery(view, getCountQuery(view), null);
    }
}
