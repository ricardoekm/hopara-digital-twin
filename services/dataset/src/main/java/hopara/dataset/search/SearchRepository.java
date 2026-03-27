package hopara.dataset.search;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import hopara.dataset.column.ColumnType;
import hopara.dataset.column.Columns;
import hopara.dataset.filter.Operator;
import hopara.dataset.filter.FilterFactory;
import hopara.dataset.filter.Filters;
import hopara.dataset.row.read.LogicalOperator;
import hopara.dataset.row.read.Pagination;
import hopara.dataset.row.read.RowReadViewRepository;
import hopara.dataset.view.View;

@Component
public class SearchRepository {

    @Autowired
    FilterFactory filterFactory;

    @Autowired
    RowReadViewRepository rowReadRepository;

    public Columns getSearchableColumns(View view) {
        var columns = new Columns();
        for ( var column : view.getColumns() ) {
            if ( column.isType(ColumnType.INTEGER) || column.isType(ColumnType.STRING) ) {
                columns.add(column);
            }
        }
        return columns;
    }

    @SuppressWarnings("rawtypes")
    public List search(View view, String term, Filters filters, Pagination pagination) {
        if ( !StringUtils.hasText(term) ) {
            return rowReadRepository.find(view, filters, pagination);
        }

        term = term.trim();
        
        if ( StringUtils.hasText(term) ) {
            for ( var column : getSearchableColumns(view) ) {
                var filter = filterFactory.create(column.getName(), term, Operator.PARTIAL_MATCH);
                filter.setLogicalOperator(LogicalOperator.OR);
                filters.add(filter);
            }       
        }

        if ( filters.size() == 0 ) {
            return new ArrayList();
        }

        return rowReadRepository.find(view, filters, pagination);
    }
}
