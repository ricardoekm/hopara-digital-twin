package hopara.dataset.row.read.condition;

import java.util.List;
import java.util.Map;

import hopara.dataset.filter.Operator;
import hopara.dataset.filter.Filter;

public interface ConditionBuilder {
	public String getCondition(Filter filter, String sourceName);
	public Map<String,Object> getParams(Filter filter);
	public List<Operator> getSupportedComparions();
}
