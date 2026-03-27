package hopara.dataset.notification;

public class QueryUpdateNotification implements Notification {
    public String getEvent() {
        return "QUERY_CHANGE";
    }
}
