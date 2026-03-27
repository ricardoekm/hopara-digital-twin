package hopara.dataset.web.view;

import hopara.dataset.web.Response;

public class CreateViewResponse extends Response{
	
	String name;
	
	public CreateViewResponse(Boolean success,String message, String tableName) {
		super(success,message);
		this.name = tableName;
	}

	public String getName() {
		return name;
	}

}
