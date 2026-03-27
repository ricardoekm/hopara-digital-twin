package hopara.dataset.boundingbox;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

import hopara.dataset.database.Database;
import hopara.dataset.filter.Filters;
import hopara.dataset.row.QueryFilterService;
import hopara.dataset.row.read.ViewSqlBuilder;

import static hopara.dataset.Format.format;

@Component
public class BoundingBoxRepository {
    @Autowired
    ViewSqlBuilder sqlBuilder;

    @Autowired
    Database database;

    @Autowired
    QueryFilterService filterService;

    @Autowired
    @Qualifier("dataNamedJdbcTemplate")
    NamedParameterJdbcTemplate jdbcTemplate;


    private String getQuery(SpatialView spatialView, Filters filters) {
        return format("SELECT %s as min_x, %s as min_y, %s as max_x, %s as max_Y FROM %s %s",
                      Axis.X.getMinFunction(spatialView.getX()), Axis.Y.getMinFunction(spatialView.getY()),
                      Axis.X.getMaxFunction(spatialView.getX()), Axis.Y.getMaxFunction(spatialView.getY()),
                      spatialView.getView().getQueryName(),
                      sqlBuilder.getWhereClause(spatialView.getView().getColumns(), filters, spatialView.getView().getQueryName()));
    }

    public BoundingBox getBoundingBox(SpatialView spatialView, Filters filters) {
	    var query = sqlBuilder.getFilteredCteQuery(spatialView.getView(), filters, getQuery(spatialView, filters), null);
        
        var params = filterService.getParams(spatialView.getView().getAllColumns(), filters);
        var result = jdbcTemplate.queryForMap(query.toString(), params);
        var minX = ((Number)result.get("min_x")).doubleValue();
        var minY = ((Number)result.get("min_y")).doubleValue();
        var maxX = ((Number)result.get("max_x")).doubleValue();
        var maxY = ((Number)result.get("max_y")).doubleValue();

        return new BoundingBox(minX, minY, maxX, maxY);
    }
}
