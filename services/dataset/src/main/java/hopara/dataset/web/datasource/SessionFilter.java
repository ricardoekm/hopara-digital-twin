package hopara.dataset.web.datasource;

import java.io.IOException;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import hopara.dataset.web.SessionService;

@Component
public class SessionFilter implements Filter {

    @Autowired
    SessionService sessionService;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        sessionService.setCurrentSessionId(httpRequest.getHeader("Session-Id"));
        chain.doFilter(request, response);
    }    
}
