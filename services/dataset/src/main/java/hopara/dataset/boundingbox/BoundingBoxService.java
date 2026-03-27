package hopara.dataset.boundingbox;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import hopara.dataset.NotFoundException;
import hopara.dataset.filter.Filters;
import hopara.dataset.view.ViewKey;
import hopara.dataset.view.ViewRepository;

@Component
@Transactional(readOnly = true)
public class BoundingBoxService {
    @Autowired
    BoundingBoxRepository boundingBoxRepository;

    @Autowired
    ViewRepository viewRepository;

    public BoundingBox getBoundingBox(ViewKey viewKey, String xColumnName, String yColumnName, Filters filters) {
        var view = viewRepository.find(viewKey);
        var xColumn = view.getColumns().get(xColumnName);
        if ( xColumn == null ) {
            throw new NotFoundException("Column not found: " + xColumnName);
        }

        var yColumn = view.getColumns().get(yColumnName);
        if ( yColumn == null ) {
            throw new NotFoundException("Column not found: " + yColumnName);
        }

        var spatialView = new SpatialView(view, xColumn, yColumn);
        return boundingBoxRepository.getBoundingBox(spatialView, filters);
    }
}
