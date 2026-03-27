package hopara.dataset.bean;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;

import hopara.dataset.column.ColumnRowMapper;
import hopara.dataset.stats.column.ColumnStatsRowMapper;
import hopara.dataset.view.ViewRowMapper;
import hopara.dataset.view.ViewColumnsMapper;

@Configuration
@Lazy
public class ViewBeanFactory {
	@Autowired
	ViewRowMapper viewRowMapper;

	@Autowired
	ViewRowMapper simpleViewRowMapper;

	@Autowired
	ColumnRowMapper columnRowMapper;

	@Autowired
	ColumnStatsRowMapper columnStatsRowMapper;

    @Bean
	public ViewColumnsMapper viewColumnsMapper() {
		return new ViewColumnsMapper(viewRowMapper,columnRowMapper, columnStatsRowMapper);
	}
}
