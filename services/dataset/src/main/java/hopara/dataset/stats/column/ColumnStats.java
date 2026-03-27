package hopara.dataset.stats.column;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class ColumnStats implements Serializable {

    private String name;
    private Double minX;
    private Double maxX;
    private Double minY;
    private Double maxY;
    private Set<BigDecimal> percentiles;
    private Set<String> values;
    
    public ColumnStats(String name) {
        this.name = name;
    }

    public ColumnStats(String name, Double minX, Double maxX) {
        this.name = name;
        this.minX = minX;
        this.maxX = maxX;
    }
    
    public void setMinY(Double minY) {
        this.minY = minY;
    }
    
    public void setMaxY(Double maxY) {
        this.maxY = maxY;
    }
    
    public void setPercentiles(Set<BigDecimal> percentiles) {
        this.percentiles = percentiles;
    }
    
    public Set<BigDecimal> getPercentiles() {
        return this.percentiles;
    }

    public void setValues(Set<String> values) {
        this.values = values;
    }

    public Set<String> getValues() {
        return values;
    }
    
    @JsonIgnore
    public Double getMinX() {
        return minX;
    }

    @JsonIgnore
    public Double getMaxX() {
        return maxX;
    }

    public Double getMinY() {
        return minY;
    }

    public Double getMaxY() {
        return maxY;
    }

    public Double getMin() {
        return this.minX;
    }

    public Double getMax() {
        return this.maxX;
    }

    @JsonIgnore
    public String getName() {
        return name;
    }

    public Boolean hasSameName(String name) {
		return this.name.equalsIgnoreCase(name);
	}

    @Override
    public String toString() {
        return "ColumnStats [name=" + name + ", minX=" + minX + ", maxX=" + maxX + ", minY=" + minY + ", maxY=" + maxY
                + ", percentiles=" + percentiles + ", values=" + values + "]";
    }
}
