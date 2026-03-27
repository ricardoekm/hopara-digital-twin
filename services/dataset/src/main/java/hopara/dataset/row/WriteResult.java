package hopara.dataset.row;

import org.springframework.util.StringUtils;

public class WriteResult {
	private Integer total = 0;
	private Integer sucessCount = 0;
	private String errorMessage = "";

    public WriteResult() { }
	
	public WriteResult(Integer total) {
		this.total = total;
	}
	
	public Integer getFailureCount() {
		return total - sucessCount;
	}
	
	public Integer getSuccessCount() {
		return sucessCount;
	}

	public void setSuccessCount(int sucessCount) {
		this.sucessCount = sucessCount;
	}

    public void setTotal(Integer total) {
        this.total = total;
    }
	
	public Integer getTotal() {
		return total;
	}
	
	public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
	
	public String getErrorMessage() {
        return errorMessage;
    }

	public Boolean hasErrorMessage() {
		return StringUtils.hasText(errorMessage);
	}
}
