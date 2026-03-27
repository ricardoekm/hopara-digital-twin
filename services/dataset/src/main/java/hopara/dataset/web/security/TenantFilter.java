package hopara.dataset.web.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import hopara.dataset.web.TenantService;

import java.io.IOException;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class TenantFilter implements Filter {
    @Autowired
    TenantService tenantService;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        try {
            var httpRequest = (HttpServletRequest) request;
            tenantService.setCurrentTenant(httpRequest.getHeader("tenant"));            
            chain.doFilter(request, response);
        }        
        finally {
            tenantService.setCurrentTenant(null);
        }
    }    
}