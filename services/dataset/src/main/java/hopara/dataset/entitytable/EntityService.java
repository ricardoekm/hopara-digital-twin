package hopara.dataset.entitytable;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import hopara.dataset.view.ViewService;
import hopara.dataset.view.Views;

@Component
@Transactional
public class EntityService {
    @Autowired
    EntityRepository entityTableRepository;

    @Autowired
    ViewService viewService;

    public Views save(String name, Boolean createView) {
        entityTableRepository.save(new EntityTable(name));

        if ( createView ) {
            var entityView = new EntityView(name);
            return viewService.save(entityView);
        }

        return new Views();
    }

    @Transactional(readOnly = true)
    public List<EntityTable> find() {
        return entityTableRepository.find();
    }

    public void delete(String name) {
        entityTableRepository.delete(name);
    }    
}
