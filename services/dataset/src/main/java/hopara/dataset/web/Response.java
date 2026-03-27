package hopara.dataset.web;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Response {
	private Boolean success;
	private String message;
	
	public Response(Boolean success) {
		this.success = success;
	}
	
	public Response(Boolean success,String message) {
		this.success = success;
		this.message = message;
	}
	
   public Response(String message) {
        this.message = message;
    }
    
	
	public Response() {
		this.success = false;
	}	
	
	public void appendMessage(String message) {
        this.message = this.message += message;
    }
	
	public String getMessage() {
		return message;
	}
	
	public Boolean getSuccess() {
		return success;
	}
}
