package hopara.dataset.bean;

import java.util.List;

import org.duckdb.DuckDBArray;

import com.fasterxml.jackson.databind.util.StdConverter;

import hopara.pg.SqlArrayToList;

public class SqlArrayConverter extends StdConverter<DuckDBArray, List<Object>>{

    @Override
    public List<Object> convert(DuckDBArray value) {
        return SqlArrayToList.convert(value);
    }
    
}
