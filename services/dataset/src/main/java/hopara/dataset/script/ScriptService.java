package hopara.dataset.script;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ScriptService {

    @Autowired
    ScriptRepository scriptRepository;

    public void run(String script) {
        scriptRepository.run(script);
    }
}
