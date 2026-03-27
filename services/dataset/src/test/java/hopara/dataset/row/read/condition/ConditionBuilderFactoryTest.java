package hopara.dataset.row.read.condition;

import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

import hopara.dataset.column.Column;
import hopara.dataset.column.ColumnType;
import hopara.dataset.database.Postgres;
import hopara.dataset.filter.Operator;
import hopara.dataset.filter.Filter;

public class ConditionBuilderFactoryTest {

    @Test
    public void checks_supported_comparison_types() {
        var greaterThanFilter = Filter.unsafeCreate("myFilter");
        greaterThanFilter.setComparisonType(Operator.GREATER_EQUALS_THAN);
        
        var stringColumn = new Column("myColumn", ColumnType.STRING);
        
        var conditionBuilderFactory = new ConditionBuilderFactory();
        conditionBuilderFactory.setDatabase(new Postgres());
        
        assertThrows(IllegalArgumentException.class, () -> { conditionBuilderFactory.getBuilder(stringColumn, greaterThanFilter); });
    }
}
