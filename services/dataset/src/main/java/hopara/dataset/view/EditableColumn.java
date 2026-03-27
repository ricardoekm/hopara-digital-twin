package hopara.dataset.view;

import java.io.Serializable;

public class EditableColumn implements Serializable {
    private String name;

    public EditableColumn(String name) {
        this.name = name;
    }

    public EditableColumn() {}

    public String getName() {
        return name;
    }
}
