package hopara.dataset.web.debug;

import java.io.IOException;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;

import org.springframework.stereotype.Component;

@Component
public class DebugFilter implements Filter {

    private Boolean isTrue(String booleanStr) {
        if ( booleanStr == null ) {
            return false;
        }

        try {
            return Boolean.parseBoolean(booleanStr);
        }
        catch (Exception e) {
            return false;
        }
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        Debugger.clear();
        Debugger.setDebugging(isTrue(request.getParameter("debug")));

        chain.doFilter(request, response);
    }    
}
