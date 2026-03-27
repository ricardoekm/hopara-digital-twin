package hopara.dataset.web.debug;

import java.util.Map;

public class Debugger {
    private static final ThreadLocal<Boolean> isDebuggingRepository = new ThreadLocal<Boolean>();
    private static final ThreadLocal<String> queryRepository =  new ThreadLocal<String>();
    private static final ThreadLocal<Map<String, Object>> paramsRepository =  new ThreadLocal<Map<String, Object>>();

    public static void clear() {
        isDebuggingRepository.set(null);
        queryRepository.set(null);
        paramsRepository.set(null);
    }

    public static Boolean isDebugging() {
        if ( isDebuggingRepository.get() == null ) {
            return false;
        }
        
        return isDebuggingRepository.get();
    }

    public static void setDebugging(Boolean isDebugging) {
        isDebuggingRepository.set(isDebugging);
    }

    public static Boolean hasQuery() {
        return getQuery() != null;
    }

    public static void setQuery(String query) {
        queryRepository.set(query);
    }

    public static String getQuery() {
        if ( queryRepository.get() == null ) {
            return "";
        }

        return queryRepository.get().replace("\n", " ").replace("\r", " ");
    }

    public static void setParams(Map<String, Object> params) {
        paramsRepository.set(params);
    }

    public static Map<String, Object> getParams() {
        return paramsRepository.get();
    }
}
