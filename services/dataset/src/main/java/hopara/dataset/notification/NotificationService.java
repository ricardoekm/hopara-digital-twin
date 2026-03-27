package hopara.dataset.notification;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import hopara.dataset.column.ColumnType;
import hopara.dataset.position.PositionView;
import hopara.dataset.row.Row;
import hopara.dataset.view.View;
import hopara.dataset.web.SessionService;
import hopara.dataset.web.TenantService;

@Component
public class NotificationService {
    private Log log = LogFactory.getLog(NotificationService.class);
    
	@Autowired
	RestTemplate restTemplate;	
	
	@Value("${notificationEndpoint:#{null}}")
	String notificationEndpoint;

	@Autowired
	TenantService tenantService;

    @Autowired
    SessionService sessionService;

    @Value("${ignoreNotificationTenants:#{null}}")
    String ignoreNotificationTenants;

	private void notify(Notification notification) {
        var headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("tenant", tenantService.getRawTenant());
        headers.set("Session-Id", sessionService.getCurrentSessionId());
        
        var entity = new HttpEntity<Notification>(notification, headers);
        var builder = UriComponentsBuilder.fromHttpUrl(notificationEndpoint)
                                          .pathSegment("notify", notification.getEvent());
		try {
            log.debug("Notifying " + notification);
        	restTemplate.put(builder.toUriString(), entity,String.class);
		} catch(Exception e) {
			log.error("Error when notifiying query change, ignoring...", e);
		}    
	}

	@Async
	public void notify(View view, Row row) {
        if ( ignoreNotificationTenants != null ) {
            for ( var tenant : ignoreNotificationTenants.split(",") ) {
                if ( tenantService.getTenant().equals(tenant.trim()) ) {
                    return;
                }
            }
        }

        if ( PositionView.isPositionView(view.getKey()) ) {
            if ( view.getColumns().hasType(ColumnType.GEOMETRY) ) {
                notify(new PositionUpdateNotification(view.getKey(), row));
            }
        }
        else {
            notify(new RowUpdateNotification(view.getKey(), row));
        }

	}

	@Async
    public void notifyQueryChanged() {
		notify(new QueryUpdateNotification());
    }
}
