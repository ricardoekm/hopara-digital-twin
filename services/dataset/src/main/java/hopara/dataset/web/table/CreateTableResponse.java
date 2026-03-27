package hopara.dataset.web.table;

import hopara.dataset.web.Response;

public class CreateTableResponse extends Response{
	
	String name;
	
	public CreateTableResponse(Boolean success,String message, String tableName) {
		super(success,message);
		this.name = tableName;
	}

	public String getName() {
		return name;
	}

}
