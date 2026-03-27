package hopara.dataset.boundingbox;

import hopara.dataset.column.Column;
import hopara.dataset.view.View;

public class SpatialView {
    View view;
    Column x;
    Column y;

    public SpatialView(View view, Column x, Column y) {
        this.view = view;
        this.x = x;
        this.y = y;
    }

    public View getView() {
        return view;
    }

    public Column getX() {
        return x;
    }

    public Column getY() {
        return y;
    }
}
