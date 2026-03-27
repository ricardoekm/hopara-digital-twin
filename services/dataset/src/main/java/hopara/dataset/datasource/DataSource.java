package hopara.dataset.datasource;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

import javax.validation.constraints.AssertTrue;
import javax.validation.constraints.NotNull;

import org.springframework.util.StringUtils;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import hopara.dataset.database.DatabaseType;
import io.swagger.v3.oas.annotations.media.Schema;

public class DataSource {

    String name;
    String username;
    Integer port;
    String password;
    String database;
    String host;
    String annotation;
    @NotNull DatabaseType type;
    String schema;
    Integer maxConnections;
    Boolean quoteIdentifiers = false;
    public static String DEFAULT_NAME = "hopara";
    
    public void setQuoteIdentifiers(Boolean quoteIdentifiers) {
        this.quoteIdentifiers = quoteIdentifiers;
    }

    public Boolean shouldQuoteIdentifiers() {
        if ( type == DatabaseType.DUCKDB ) {
            return true;
        }

        if ( type == DatabaseType.MYSQL ) {
            return false;
        }

        return quoteIdentifiers;
    }

    public void setAnnotation(String annotation) {
        this.annotation = annotation;
    }

    public String getAnnotation() {
        return annotation;
    }

    public void setMaxConnections(Integer maxConnections) {
        this.maxConnections = maxConnections;
    }

    public Integer getMaxConnections() {
        if ( type.equals(DatabaseType.DUCKDB) ) {
            return 1;
        }

        return maxConnections;
    }

    public Integer getMinConnections() {
        if ( type.equals(DatabaseType.DUCKDB) ) {
            return 1;
        }

        return 3;
    }

    public Boolean hasMaxConnections() {
        return getMaxConnections() != null;
    }

    public void setSchema(String schema) {
        this.schema = schema;
    }
    
    public String getSchema() {
        return schema;
    }

    public Integer getPort() {
        return port;
    }

    public void setPort(Integer port) {
        this.port = port;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
    
    public Boolean hasSchema() {
        return StringUtils.hasText(schema);
    }

    public Boolean hasPort() {
        return port != null;
    }

    public Boolean hasPassword() {
        return StringUtils.hasText(password);
    }

    public Boolean requiresPassword() {
        return type != DatabaseType.DUCKDB;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getUsername() {
        return username;
    }

    @JsonProperty("password")
    public void setPassword(String password) {
        this.password = password;
    }
    
    @JsonIgnore
    public String getPassword() {
        return password;
    }

    public void setDatabase(String database) {
        this.database = database;
    }
    
    public String getDatabase() {
        return database;
    }

    public void setHost(String server) {
        this.host = server;
    }
    
    public String getHost() {
        return host;
    }

    public void setType(DatabaseType databaseType) {
        this.type = databaseType;
    }
    
    public DatabaseType getType() {
        return type;
    }      
    
    @AssertTrue(message = "Required fields not present")
    private boolean isValid() {
        if ( DatabaseType.DUCKDB.equals(type) ) {
            return true;
        }

        return StringUtils.hasText(username) &&
               StringUtils.hasText(host) && StringUtils.hasText(database);
    }

    @Override
    public int hashCode() {
        return Objects.hash(database, password, schema, host, type, username, name, port, maxConnections, annotation);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        DataSource other = (DataSource) obj;
        return Objects.equals(name, other.name) &&
                Objects.equals(database, other.database) && Objects.equals(password, other.password)
                && Objects.equals(schema, other.schema) && Objects.equals(host, other.host) && type == other.type
                && Objects.equals(port, other.port)
                && Objects.equals(maxConnections, other.maxConnections)
                && Objects.equals(username, other.username)
                && Objects.equals(quoteIdentifiers, other.quoteIdentifiers)
                && Objects.equals(annotation, other.annotation);
    }

    @Override
    public String toString() {
        return "DataSource [username=" + username + ", database=" + database + ", server="
                + host + ", databaseType=" + type + ", port=" + port + ", maxConnections=" + maxConnections
                + ", quoteIdentifiers=" + quoteIdentifiers + ", annotation=" + annotation + ", name=" + name + "]";
    }

    @Schema(hidden = true)
    public Boolean isDefault() {
        return DEFAULT_NAME.equalsIgnoreCase(name);
    }

    public List<String> getSchemas() {
        var schemas = new ArrayList<String>();
        if ( !StringUtils.hasText(schema) ) {
            return schemas;
        }
        
        return Arrays.asList(schema.split(","));
    }
}
