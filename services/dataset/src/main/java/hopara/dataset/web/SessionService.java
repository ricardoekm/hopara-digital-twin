package hopara.dataset.web;

import org.springframework.stereotype.Component;

@Component
public class SessionService {
    private static final ThreadLocal<String> sessionIdMap =  new ThreadLocal<String>();

    public String getCurrentSessionId() {
        return sessionIdMap.get();
    }

    public void setCurrentSessionId(String sessionId) {
        sessionIdMap.set(sessionId);
    }
}
