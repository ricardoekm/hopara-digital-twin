package hopara.dataset.row;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import hopara.dataset.NotFoundException;
import hopara.dataset.column.Column;
import hopara.dataset.datasource.DataSourceRepository;
import hopara.dataset.entitytable.EntityTable;
import hopara.dataset.filter.Filter;
import hopara.dataset.filter.Filters;
import hopara.dataset.filter.Operator;
import hopara.dataset.notification.NotificationService;
import hopara.dataset.row.read.DistanceSort;
import hopara.dataset.row.read.Pagination;
import hopara.dataset.row.read.RowReadResponse;
import hopara.dataset.row.read.RowReadViewRepository;
import hopara.dataset.row.write.RowWriteRepository;
import hopara.dataset.stats.column.ColumnStatsList;
import hopara.dataset.stats.row.RowsStatsGenerator;
import hopara.dataset.table.Table;
import hopara.dataset.table.TableKey;
import hopara.dataset.table.TableRepository;
import hopara.dataset.transform.Transform;
import hopara.dataset.view.View;
import hopara.dataset.view.ViewKey;
import hopara.dataset.view.ViewService;
import hopara.dataset.web.security.JwtService;

@Component
@Transactional
public class RowService {

    @Autowired
    private RowReadViewRepository viewReadRepository;

    @Autowired
    private RowsStatsGenerator rowsStatsGenerator;

    @Autowired
    private ViewService viewService;

    @Autowired
    private RowWriteRepository writeRepository;

    @Autowired
    private DataSourceRepository dataSourceRepository;

    @Autowired
    private TableRepository tableRepository;

    @Autowired
    private NotificationService notifyService;

    @Autowired
    private JwtService jwtService;

    private Log logger = LogFactory.getLog(RowService.class);
    
    public WriteResult insert(Table table, Rows rows) {
        dataSourceRepository.setCurrentName(table.getDataSourceName());
        rows.castTypes(table.getColumns());
        return writeRepository.insert(table, rows);        
    }

    // To make sure the user will only be able to write on his scope
    private void addFilterValuesToRows(Rows rows, Filters filters) {
        for ( var filter : filters ) {
            if ( filter.hasNotNullValues() ) {
                rows.setValue(filter.getColumn(), filter.getValues().get(0));
            }
        }
    }

    public WriteResult insert(Table table, Rows rows, Filters filters) {
        dataSourceRepository.setCurrentName(table.getDataSourceName());
        rows.castTypes(table.getColumns());
        addFilterValuesToRows(rows, filters);
        return writeRepository.insert(table, rows);        
    }

    public List<Object> insert(Table table, Rows rows, Column returnColumn, Filters filters) {
        dataSourceRepository.setCurrentName(table.getDataSourceName());
        rows.castTypes(table.getColumns());
        addFilterValuesToRows(rows, filters);
        return writeRepository.insert(table, rows, returnColumn);        
    }

    public WriteResult insert(TableKey tableKey, Rows rows) {
        var table = tableRepository.find(tableKey);
        return insert(table, rows);
    }
    
    private void validateFilters(Filters filters) {
        for ( var filter : filters ) {
            if (!filter.hasValues()) {
                throw new IllegalArgumentException("Filter " + filter.getColumn() + " has no value");
            }
        }
    }

    @Transactional(readOnly = true)
    public RowReadResponse find(ViewKey viewKey, Transform transform, Filters filters, Pagination pagination, DistanceSort distanceSort, Boolean caclulateStats) {
        validateFilters(filters);
        var view = (View)viewService.findWithTables(viewKey);

        CompletableFuture<ColumnStatsList> stats = null;
        if ( caclulateStats ) {
            try {
                stats = rowsStatsGenerator.asyncGenerateStats(view, transform, filters);
            } catch(Exception e) {
                logger.error("Error generating stats", e);
            }
        }

        var rows = viewReadRepository.find(view, transform, filters, pagination, distanceSort);

        var response = new RowReadResponse();
        response.setRows(rows);
        response.setColumns(view.getColumns(transform));
        if ( stats != null ) {
            response.fillStats(stats.join());            
        }

        return response;
    }

    public Map<String,Object> find(ViewKey viewKey, Object rowId, Filters filters) {
        validateFilters(filters);
        var view = (View)viewService.findWithTables(viewKey);
        filters.add(getPrimaryKeyFilter(getPrimaryKeyColumn(viewKey), rowId));
        
        var rows = viewReadRepository.find(view, filters, new Pagination(1));
        if ( rows.size() == 0 ) {
            throw new RowNotFoundException("id = " + rowId);
        }

        return rows.get(0);
    }

    private Table getWriteTable(ViewKey viewKey) {
        if (!viewService.has(viewKey)) {
            throw new IllegalArgumentException("View not found " + viewKey);
        }

        var view = (View)viewService.find(viewKey);
        return tableRepository.find(view.getWriteTableKey());
    }

    public List<Object> insert(ViewKey viewKey, Rows rows, Filters filters) {
        var writeTable = getWriteTable(viewKey);
        var view = viewService.findWithTables(viewKey);

        return insert(writeTable, rows, view.getPrimaryKeyColumn(), filters);        
    }

    private Column getPrimaryKeyColumn(ViewKey viewKey) {
        var view = viewService.findWithTables(viewKey);
        var primaryKeyColumn = view.getPrimaryKeyColumn();

        if ( primaryKeyColumn == null ) {
            throw new IllegalArgumentException("Primary key not found in " + viewKey);
        }

        return primaryKeyColumn;
    }

    private Filter getPrimaryKeyFilter(Column primaryKeyColumn, Object id) {
        var idFilter = new Filter(primaryKeyColumn.getName(),id);
        idFilter.setOptional(false);
        return idFilter;
    }

    public WriteResult delete(ViewKey viewKey, Object id, Filters filters) {
        var writeTable = getWriteTable(viewKey);
        filters.add(getPrimaryKeyFilter(getPrimaryKeyColumn(viewKey), id));
        return writeRepository.delete(writeTable, filters);
    }

    private String getUser(Filters filters) {
        var user = (String)jwtService.getClaim("username");
        var userFilter = filters.get("userId");
        if ( userFilter != null && userFilter.getValues().size() > 0) {
            return user + '#' + userFilter.getValues().get(0);
        }

        return user;
    }

    private String getTenantId() {
        var tenant = (String)jwtService.getClaim("tenantId");
        if ( tenant == null ) {
            return "unknown";
        }

        return tenant;
    }

    public WriteResult save(Table table, Column primaryKeyColumn, Row row, Filters filters, Boolean upsert) {
        row.castTypes(table.getColumns());
        // We'll assume the primary key can be auto_increment, thus not accepting updates
        row.deleteValue(primaryKeyColumn.getName());
        filters.add(getPrimaryKeyFilter(primaryKeyColumn, row.getId()));

        var result = writeRepository.update(table, row, filters);
        if ( result.getSuccessCount() == 0 ) {
            if ( !upsert ) {
                throw new NotFoundException("Row not found: " + row.getId());
            }
            
            var rows = new Rows();
            rows.add(row);
            return insert(table, rows, filters);
        }

        return result;
    }

    public WriteResult save(TableKey tableKey, Row row, Filters filters) {
        logger.debug("Updating table: " + tableKey + ", row: " + row.getId());
        return save(tableRepository.find(tableKey), EntityTable.getIdColumn(), row, filters, true);
    }

    public WriteResult save(ViewKey viewKey, Row row, Filters filters) {
        logger.info("Updating view: " + viewKey + ", row: " + row.getId() + ", by: " + getUser(filters) + " in: " + getTenantId());
        var view = viewService.find(viewKey);

        if ( view.hasVersionColumn() ) {
            filters = new Filters(filters);
            filters.add(new Filter(view.getVersionColumnName(), row.getValue(view.getVersionColumnName()), Operator.LESS_EQUALS_THAN));
        }

        var result = save(getWriteTable(viewKey), getPrimaryKeyColumn(viewKey), row, filters, view.shouldUpsert());
        notifyService.notify(view, row);
        return result;
    }
}