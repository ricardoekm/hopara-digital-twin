package hopara.dataset.sqlquery;

public class QueryParseError extends RuntimeException {
	private static final long serialVersionUID = 1L;

	public QueryParseError(String parseError) {
		super(parseError);
	}
}
