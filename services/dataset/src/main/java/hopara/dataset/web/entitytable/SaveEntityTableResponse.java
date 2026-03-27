package hopara.dataset.web.entitytable;

import hopara.dataset.view.Views;
import hopara.dataset.web.Response;

public class SaveEntityTableResponse extends Response {
    private Views createdViews;

    public SaveEntityTableResponse(boolean success, String message, Views createdViews) {
        super(success, message);
        this.createdViews = createdViews;
    }

    public Views getCreatedViews() {
        return createdViews;
    }
}
