package hopara.dataset.datasource.password;

import org.springframework.util.StringUtils;

public class Secret {
    String name;
    String value;
    
    public Secret() { }
    
    public String keepAlphanumeric(String string) {
        return string.replaceAll("[^a-zA-Z0-9_]", "");
    }

    public Secret(String name) {
        setName(name);
    }

    public Secret(String name, String value) {
        this.value = value;
        setName(name);
    }

    private String getPrefix(String env) {
        return "dataset_" + env + "_";
    }

    public String getKey(String env) {
        return getPrefix(env) + keepAlphanumeric(name);
    }

    public void setName(String name) {
        if (  !StringUtils.hasText(keepAlphanumeric(name)) ) {
            throw new IllegalArgumentException("Data source name should have alphanumeric characters.");
        }

        this.name = name;
    }
    
    public String getName() {
        return name;
    }
    
    public String getValue() {
        return value;
    }
}
