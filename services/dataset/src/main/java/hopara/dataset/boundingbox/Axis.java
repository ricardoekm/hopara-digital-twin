package hopara.dataset.boundingbox;

import hopara.dataset.column.Column;
import hopara.dataset.column.ColumnType;
import hopara.dataset.filter.Operator;

public enum Axis {
    X(Operator.MIN_X, Operator.MAX_X), 
    Y(Operator.MIN_Y, Operator.MAX_Y);

    private Operator minOperator;
    private Operator maxOperator;
	
	Axis(Operator minOperator, Operator maxOperator){
		this.minOperator = minOperator;
        this.maxOperator = maxOperator;
	}
	
	public String getMinFunction(Column column) {
        if ( column.isType(ColumnType.GEOMETRY) ) {
            return Operator.MIN.getSqlOperator() + "(" + minOperator.getSqlOperator() + "(" + column.getSqlName() + "))";
        }

        return Operator.MIN.getSqlOperator() + "(" + column.getSqlName() + ")";
	}

    public String getMaxFunction(Column column) {
        if ( column.isType(ColumnType.GEOMETRY)  ) {
            return Operator.MAX.getSqlOperator() + "(" + maxOperator.getSqlOperator() + "(" + column.getSqlName() + "))";
        }

        return Operator.MAX.getSqlOperator() + "(" + column.getSqlName() + ")"; 
    }
}
