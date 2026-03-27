CREATE TABLE pt_workflows_process (
	workflow_id int4 NOT NULL,
	"name" varchar(50) NULL,
	CONSTRAINT pt_workflows_process_pk PRIMARY KEY (workflow_id)
);

CREATE TABLE pt_workflows_process_sample_pos (
	id text NULL,
	point_2d geometry NULL,
	point_3d geometry NULL,
	line geometry NULL,
	rectangle geometry NULL,
	polygon geometry NULL,
	floor text NULL,
	hopara_scope text NULL,
    hopara_size integer NULL,
    hopara_size_reference_zoom numeric(24,8) NULL,
    hopara_color text NULL,
    hopara_scale integer NULL
);

CREATE INDEX pt_workflows_process_sample_pos_id ON pt_workflows_process_sample_pos USING btree (id);
CREATE INDEX pt_workflows_process_sample_pos_line_spatial ON pt_workflows_process_sample_pos USING gist (line);
CREATE INDEX pt_workflows_process_sample_pos_point_2d_spatial ON pt_workflows_process_sample_pos USING gist (point_2d);
CREATE INDEX pt_workflows_process_sample_pos_point_3d_spatial ON pt_workflows_process_sample_pos USING gist (point_3d);
CREATE INDEX pt_workflows_process_sample_pos_polygon_spatial ON pt_workflows_process_sample_pos USING gist (polygon);
CREATE INDEX pt_workflows_process_sample_pos_rectangle_spatial ON pt_workflows_process_sample_pos USING gist (rectangle);
CREATE INDEX pt_workflows_process_sample_pos_hopara_scope ON pt_workflows_process_sample_pos USING btree (hopara_scope);


CREATE TABLE pt_assets_process (
	asset_id int4 NOT NULL,
	"name" varchar(50) NULL,
    image_name varchar(50) NULL,
	CONSTRAINT pt_assets_process_pk PRIMARY KEY (asset_id)
);

CREATE TABLE pt_assets_process_sample_pos (
	id text NULL,
	point_2d geometry NULL,
	point_3d geometry NULL,
	line geometry NULL,
	rectangle geometry NULL,
	polygon geometry NULL,
	floor text NULL,
	hopara_scope text NULL,
    hopara_size integer NULL,
    hopara_size_reference_zoom numeric(24,8) NULL,
    hopara_color text NULL,
    hopara_scale integer NULL
);

CREATE INDEX pt_assets_process_sample_pos_id ON pt_assets_process_sample_pos USING btree (id);
CREATE INDEX pt_assets_process_sample_pos_line_spatial ON pt_assets_process_sample_pos USING gist (line);
CREATE INDEX pt_assets_process_sample_pos_point_2d_spatial ON pt_assets_process_sample_pos USING gist (point_2d);
CREATE INDEX pt_assets_process_sample_pos_point_3d_spatial ON pt_assets_process_sample_pos USING gist (point_3d);
CREATE INDEX pt_assets_process_sample_pos_polygon_spatial ON pt_assets_process_sample_pos USING gist (polygon);
CREATE index pt_assets_process_sample_pos_rectangle_spatial ON pt_assets_process_sample_pos USING gist (rectangle);
CREATE INDEX pt_assets_process_sample_pos_hopara_scope ON pt_assets_process_sample_pos USING btree (hopara_scope);

CREATE TABLE pt_texts_process (
	text_id int4 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE) NOT NULL,
	"name" varchar(50) NULL,
	CONSTRAINT pt_texts_process_pk PRIMARY KEY (text_id)
);

CREATE TABLE pt_texts_process_sample_pos (
	id text NULL,
	point_2d geometry NULL,
	point_3d geometry NULL,
	line geometry NULL,
	rectangle geometry NULL,
	polygon geometry NULL,
	floor text NULL,
	hopara_scope text NULL,
    hopara_size integer NULL,
    hopara_size_reference_zoom numeric(24,8) NULL,
    hopara_color text NULL,
    hopara_scale integer NULL
);

CREATE INDEX pt_texts_process_sample_pos_id ON pt_texts_process_sample_pos USING btree (id);
CREATE INDEX pt_texts_process_sample_pos_line_spatial ON pt_texts_process_sample_pos USING gist (line);
CREATE INDEX pt_texts_process_sample_pos_point_2d_spatial ON pt_texts_process_sample_pos USING gist (point_2d);
CREATE INDEX pt_texts_process_sample_pos_point_3d_spatial ON pt_texts_process_sample_pos USING gist (point_3d);
CREATE INDEX pt_texts_process_sample_pos_polygon_spatial ON pt_texts_process_sample_pos USING gist (polygon);
CREATE index pt_texts_process_sample_pos_rectangle_spatial ON pt_texts_process_sample_pos USING gist (rectangle);
CREATE INDEX pt_texts_process_sample_pos_hopara_scope ON pt_texts_process_sample_pos USING btree (hopara_scope);

CREATE TABLE pt_pipes_process (
	pipe_id int4 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE) NOT NULL,
	"name" varchar(50) NULL,
	CONSTRAINT pt_pipes_process_pk PRIMARY KEY (pipe_id)
);

CREATE TABLE pt_pipes_process_sample_pos (
	id text NULL,
	point_2d geometry NULL,
	point_3d geometry NULL,
	line geometry NULL,
	rectangle geometry NULL,
	polygon geometry NULL,
	floor text NULL,
	hopara_scope text NULL,
    hopara_size integer NULL,
    hopara_size_reference_zoom numeric(24,8) NULL,
    hopara_color text NULL,
    hopara_scale integer NULL
);

CREATE INDEX pt_pipes_process_sample_pos_id ON pt_pipes_process_sample_pos USING btree (id);
CREATE INDEX pt_pipes_process_sample_pos_line_spatial ON pt_pipes_process_sample_pos USING gist (line);
CREATE INDEX pt_pipes_process_sample_pos_point_2d_spatial ON pt_pipes_process_sample_pos USING gist (point_2d);
CREATE INDEX pt_pipes_process_sample_pos_point_3d_spatial ON pt_pipes_process_sample_pos USING gist (point_3d);
CREATE INDEX pt_pipes_process_sample_pos_polygon_spatial ON pt_pipes_process_sample_pos USING gist (polygon);
CREATE INDEX pt_pipes_process_sample_pos_rectangle_spatial ON pt_pipes_process_sample_pos USING gist (rectangle);
CREATE INDEX pt_pipes_process_sample_pos_hopara_scope ON pt_pipes_process_sample_pos USING btree (hopara_scope);


CREATE TABLE pt_sensors_process (
	sensor_id int4 NOT NULL,
	asset_id int4 NULL,
	alert int4 NULL,
	"type" varchar(50) NULL,
	CONSTRAINT pt_sensors_process_pk PRIMARY KEY (sensor_id)
);

CREATE TABLE pt_sensors_process_sample_pos (
	id text NULL,
	point_2d geometry NULL,
	point_3d geometry NULL,
	line geometry NULL,
	rectangle geometry NULL,
	polygon geometry NULL,
	floor text NULL,
	hopara_scope text NULL,
    hopara_size integer NULL,
    hopara_size_reference_zoom numeric(24,8) NULL,
    hopara_color text NULL,
    hopara_scale integer NULL
);

CREATE INDEX pt_sensors_process_sample_pos_id ON pt_sensors_process_sample_pos USING btree (id);
CREATE INDEX pt_sensors_process_sample_pos_line_spatial ON pt_sensors_process_sample_pos USING gist (line);
CREATE INDEX pt_sensors_process_sample_pos_point_2d_spatial ON pt_sensors_process_sample_pos USING gist (point_2d);
CREATE INDEX pt_sensors_process_sample_pos_point_3d_spatial ON pt_sensors_process_sample_pos USING gist (point_3d);
CREATE INDEX pt_sensors_process_sample_pos_polygon_spatial ON pt_sensors_process_sample_pos USING gist (polygon);
CREATE INDEX pt_sensors_process_sample_pos_rectangle_spatial ON pt_sensors_process_sample_pos USING gist (rectangle);
CREATE INDEX pt_sensors_process_sample_pos_hopara_scope ON pt_sensors_process_sample_pos USING btree (hopara_scope);

CREATE TABLE pt_assets_views (
	asset_id int4 NOT NULL,
	"name" varchar(50) NULL,
	image_view_name varchar(50) NULL,
	CONSTRAINT pt_assets_views_pk PRIMARY KEY (asset_id)
);

CREATE TABLE pt_assets_views_sample_pos (
	id text NULL,
	point_2d geometry NULL,
	point_3d geometry NULL,
	line geometry NULL,
	rectangle geometry NULL,
	polygon geometry NULL,
	floor text NULL,
	hopara_scope text NULL,
    hopara_size integer NULL,
    hopara_size_reference_zoom numeric(24,8) NULL,
    hopara_color text NULL,
    hopara_scale integer NULL
);

CREATE INDEX pt_assets_views_sample_pos_id ON pt_assets_views_sample_pos USING btree (id);
CREATE INDEX pt_assets_views_sample_pos_line_spatial ON pt_assets_views_sample_pos USING gist (line);
CREATE INDEX pt_assets_views_sample_pos_point_2d_spatial ON pt_assets_views_sample_pos USING gist (point_2d);
CREATE INDEX pt_assets_views_sample_pos_point_3d_spatial ON pt_assets_views_sample_pos USING gist (point_3d);
CREATE INDEX pt_assets_views_sample_pos_polygon_spatial ON pt_assets_views_sample_pos USING gist (polygon);
CREATE index pt_assets_views_sample_pos_rectangle_spatial ON pt_assets_views_sample_pos USING gist (rectangle);
CREATE INDEX pt_assets_views_sample_pos_hopara_scope ON pt_assets_views_sample_pos USING btree (hopara_scope);

CREATE TABLE pt_sensors_views1 (
	sensor_id int4 NOT NULL,
	asset_id int4 NULL,
	alert int4 NULL,
	"type" varchar(50) NULL,
	CONSTRAINT pt_sensors_views1_pk PRIMARY KEY (sensor_id)
);

CREATE TABLE pt_sensors_views1_sample_pos (
	id text NULL,
	point_2d geometry NULL,
	point_3d geometry NULL,
	line geometry NULL,
	rectangle geometry NULL,
	polygon geometry NULL,
	floor text NULL,
	hopara_scope text NULL,
    hopara_size integer NULL,
    hopara_size_reference_zoom numeric(24,8) NULL,
    hopara_color text NULL,
    hopara_scale integer NULL
);

CREATE INDEX pt_sensors_views1_sample_pos_id ON pt_sensors_views1_sample_pos USING btree (id);
CREATE INDEX pt_sensors_views1_sample_pos_line_spatial ON pt_sensors_views1_sample_pos USING gist (line);
CREATE INDEX pt_sensors_views1_sample_pos_point_2d_spatial ON pt_sensors_views1_sample_pos USING gist (point_2d);
CREATE INDEX pt_sensors_views1_sample_pos_point_3d_spatial ON pt_sensors_views1_sample_pos USING gist (point_3d);
CREATE INDEX pt_sensors_views1_sample_pos_polygon_spatial ON pt_sensors_views1_sample_pos USING gist (polygon);
CREATE INDEX pt_sensors_views1_sample_pos_rectangle_spatial ON pt_sensors_views1_sample_pos USING gist (rectangle);
CREATE INDEX pt_sensors_views1_sample_pos_hopara_scope ON pt_sensors_views1_sample_pos USING btree (hopara_scope);

CREATE TABLE pt_sensors_views2 (
	sensor_id int4 NOT NULL,
	asset_id int4 NULL,
	alert int4 NULL,
	"type" varchar(50) NULL,
	CONSTRAINT pt_sensors_views2_pk PRIMARY KEY (sensor_id)
);

CREATE TABLE pt_sensors_views2_sample_pos (
	id text NULL,
	point_2d geometry NULL,
	point_3d geometry NULL,
	line geometry NULL,
	rectangle geometry NULL,
	polygon geometry NULL,
	floor text NULL,
	hopara_scope text NULL,
    hopara_size integer NULL,
    hopara_size_reference_zoom numeric(24,8) NULL,
    hopara_color text NULL,
    hopara_scale integer NULL
);

CREATE INDEX pt_sensors_views2_sample_pos_id ON pt_sensors_views2_sample_pos USING btree (id);
CREATE INDEX pt_sensors_views2_sample_pos_line_spatial ON pt_sensors_views2_sample_pos USING gist (line);
CREATE INDEX pt_sensors_views2_sample_pos_point_2d_spatial ON pt_sensors_views2_sample_pos USING gist (point_2d);
CREATE INDEX pt_sensors_views2_sample_pos_point_3d_spatial ON pt_sensors_views2_sample_pos USING gist (point_3d);
CREATE INDEX pt_sensors_views2_sample_pos_polygon_spatial ON pt_sensors_views2_sample_pos USING gist (polygon);
CREATE INDEX pt_sensors_views2_sample_pos_rectangle_spatial ON pt_sensors_views2_sample_pos USING gist (rectangle);
CREATE INDEX pt_sensors_views2_sample_pos_hopara_scope ON pt_sensors_views2_sample_pos USING btree (hopara_scope);


--process_insert_workflow:
INSERT INTO pt_workflows_process (workflow_id, "name") 
VALUES
(1, 'process');


INSERT INTO pt_workflows_process_sample_pos (id, rectangle , hopara_scope)
VALUES
('1', 'POLYGON ((-143.6650256559497 99.6823701822022, -143.79548788299158 172.27063579866783, -18.343363003226514 172.49610975730224, -18.212900776184625 99.90784414083663, -143.6650256559497 99.6823701822022))'::public.geometry,'WHITEBOARD');

--process_insert_assets:
INSERT INTO pt_assets_process (asset_id, "name", image_name)  
VALUES
    (1, 'Hydrapulper', 'hydrapulper'),
    (2, 'Plodder', 'plodder'),
    (3, 'Paper machine','paper_machine'),
    (4, 'Separator','separator'),
    (5, 'Printer', NULL),
    (6, 'Log cutter', NULL),
    (8, 'Coil deposit', NULL),
    (9, 'Sealer', NULL),
    (10, 'Paper towel', NULL);


INSERT INTO pt_assets_process_sample_pos (id, polygon, rectangle, point_2d,hopara_scope) 
VALUES
    ('1', 'POLYGON ((-119.31144570655438 155.590005636381, -119.30328480076763 156.17487883078115, -118.98772515013158 156.19120082499472, -118.98102987823283 158.72075402023327, -118.13504368773631 158.71721433950034, -118.13289913167087 161.70906789921455, -117.34350278672167 161.71342520185001, -117.34983695900607 162.16103634584223, -116.92333952180915 162.1631477129779, -116.91707830771063 161.71149070099017, -116.10419947977178 161.71782487327457, -116.08932676802213 158.71849238401364, -115.28917526255566 158.68885692199606, -115.26391545409574 162.77908445933, -114.91686504973151 162.76623077261215, -114.74910329564415 163.56258206665598, -114.92971873644936 163.89735854783913, -115.19468945529256 168.6887354060522, -106.92504576037788 168.70750356341335, -107.17738461927452 163.88384913191544, -107.32972377985469 163.5220438310076, -107.15946351182245 162.7648305847852, -106.83302271435076 162.75938992004734, -106.8245435324923 156.28488009918027, -106.40617931278494 156.2733286627521, -106.40617931278494 155.58759556381818, -119.31144570655438 155.590005636381))'::public.geometry, 'POLYGON ((-119.77887313161689 155.13711914175542, -119.77887313161689 169.11225429486765, -105.8037379785046 169.11225429486765, -105.8037379785046 155.13711914175542, -119.77887313161689 155.13711914175542))'::public.geometry, NULL,'WHITEBOARD'),
    ('2', 'POLYGON ((-117.79434189928979 138.29579219275223, -117.78664928672414 143.1785291742046, -110.78847953661736 143.1928826577363, -110.77915047123194 142.76497122979794, -106.40415588678789 142.77016103011795, -106.40338759658329 143.3646681861462, -105.96972345724704 143.35974786689215, -105.96888890091437 140.4086773058613, -106.39789151655295 140.41620364537644, -106.39518516623068 140.74483663389438, -108.25651162685324 140.73585288005302, -108.24761399166921 138.29641819582412, -108.51001961285648 138.29641819582412, -108.51132515357763 138.12931411101894, -109.18386951969228 138.1255985406981, -109.18788274657076 138.29214792768184, -116.77936865518039 138.2982510521735, -116.78015247966943 138.12482649615083, -117.4543878938656 138.12873219973469, -117.45231317533384 138.29510830266912, -117.79434189928979 138.29579219275223))'::public.geometry, 'POLYGON ((-118.19258267064903 138.08559580314426, -118.19258267064903 143.5272342038368, -105.57143267674385 143.5272342038368, -105.57143267674385 138.08559580314426, -118.19258267064903 138.08559580314426))'::public.geometry, NULL,'WHITEBOARD'),
    ('3', 'POLYGON ((-97.97687651514106 137.949269854313, -97.97412934719814 142.6773669585831, -96.88057303203202 142.66798747277878, -96.88277895218587 142.84860869974673, -96.71041724451939 142.84637020527023, -96.70915142176001 143.33207770309875, -97.2175440512319 143.33164569642707, -97.21779010600696 143.6079629184648, -96.66041940761005 143.60348032987042, -96.7056132524624 144.09059255118956, -96.95977409492647 144.0883920311304, -96.96184627348508 144.27509829037479, -95.85987041316586 144.2712940497144, -95.86781253928926 143.58737859058536, -95.52533432807549 143.57910969376837, -95.34981162611903 143.74454491136436, -94.9255341464299 143.7536778638488, -94.41832347176846 144.1778559017729, -94.41904079218443 145.69143212854226, -94.17382269486872 145.69481446533172, -94.18371455379493 146.4549165568857, -93.5816915257108 146.4490734289466, -93.57774058265849 146.10954899908, -93.41461909729637 146.11340305430718, -93.41681961735542 146.36976441683046, -92.06840380551152 146.37907147619956, -92.03672422318718 145.5340194357594, -92.31640218404648 145.36221728471156, -92.30042063226809 144.59909590720392, -84.47784830645448 144.59772639629094, -84.48085278767472 144.7649745173224, -84.30959877012774 144.76297155225498, -84.28228047654233 144.94657725921167, -84.23994143549884 145.0877074591918, -84.16937643026182 145.18085342528968, -84.0621173873141 145.2711767949683, -83.98308449806592 145.31351583601173, -83.88147064795696 145.3530323280122, -83.76698036463497 145.3617631667827, -83.61455977897741 145.34482754089007, -83.46778438615857 145.27990763373873, -83.34358976469468 145.16700339795224, -83.27584726112396 145.04845406408006, -82.93778664903773 145.05385898383253, -82.93751711720388 144.77592909411655, -83.19558154321096 144.77234487711834, -83.19643628144975 144.7042702871681, -82.93512763920505 144.7126077667209, -82.93915465493569 144.5461478064578, -78.81033826755682 144.54568575335298, -78.81262851358296 145.18239744473473, -78.4734360870004 145.1680077604078, -78.48717817823614 144.54274772202365, -78.38182301679038 144.37326328841502, -77.96941554523144 144.459934254501, -77.45157920671642 144.48271947624337, -77.54477625540106 145.04169978915536, -77.0415578592106 146.19964390248003, -77.46902313985544 146.50806830051863, -77.4485888737401 146.67813112200275, -76.88633001282513 146.6768358444919, -76.67071128207128 147.28801558863472, -75.65024753249233 147.88190910435986, -72.4490179551643 147.86271465403988, -72.05627953313956 147.67019593629652, -71.97157126631143 147.4391733198992, -71.97340925225137 147.18423698278914, -72.99229002964618 147.18891105876247, -72.99742452095757 145.1517428628317, -72.58264041098239 145.16524149115207, -72.8453935471926 145.34147825766846, -72.74606004710256 145.59461845196088, -72.34872604674241 145.68113468719665, -72.07956453357534 145.424790223751, -71.87436909800027 145.42018562844316, -71.53471264158051 145.27919617220348, -71.3873145932511 145.1638411381059, -71.15019604053266 145.16704543415077, -70.33180476784267 145.94346712336028, -69.99075663613093 146.66740944389443, -69.71563901817348 146.66819277090275, -69.7082233846246 148.770137316255, -57.64486883375658 148.76578023007073, -57.62494841078288 146.76973797501807, -54.0264952215575 146.73114990340883, -54.0125557188538 148.76887039818715, -46.083108581772855 148.76711738175538, -46.07903418854418 145.91074056428266, -44.48042667728674 145.91074056428266, -44.48042667728674 146.9301425907788, -43.462208848452 146.91369493989413, -43.46858895412565 145.825883656344, -43.20304237764536 145.82768534543618, -43.20584318831821 144.5412728075054, -43.046339903947235 144.54446296743052, -43.04314995819869 146.33727801614063, -42.63163175010051 146.33727801614063, -42.624146077848096 144.55649118022353, -42.38814535763428 144.55604467582575, -42.40563149428639 144.61964475480178, -42.40426783447553 144.66873666821317, -42.39404036300546 144.72396505077336, -42.36338751958511 144.76707459414135, -42.31411236783158 144.79182266229887, -42.2555574427903 144.7909354691724, -42.21938465640673 144.78222718479498, -42.18833277785061 144.76049089363175, -42.166596501578674 144.73653660476108, -42.04237779203265 144.8435921821073, -42.1202340846371 145.03947842663467, -42.03163773948431 145.31815416387897, -41.90438118082394 145.32459751477194, -41.86411007551818 145.4840709630844, -41.18278367938071 145.4849640714323, -41.17748444741856 144.9613971805963, -40.990120447741965 144.89472099975978, -40.91010480089634 144.83846000725237, -40.8901008682 144.7784482511332, -40.88134914239912 144.64717261593918, -40.733766310560675 144.90665472517318, -40.5067649976356 145.1200359959001, -40.24344326737073 145.26531697943355, -40.01644195444565 145.3197973006318, -39.880241227652895 145.2970971540987, -39.68661474110111 145.36565260013654, -39.3778928701758 145.40651287913664, -39.07371116572226 145.36565260013654, -38.86486990906136 145.28393211833915, -38.669648542192874 145.1522713294096, -38.54706801000396 144.9933703798809, -38.465347452003726 144.84808947255033, -38.41086697839976 144.6755684808235, -38.38816706047527 144.45310702955874, -38.41086697839976 144.25334580102992, -38.483507508267905 144.0308845021709, -38.56976792792846 143.87652356670822, -38.71958884932507 143.7312425069719, -38.85578988092927 143.65406211544345, -38.97383055145785 143.59050191851884, -38.994254847566594 142.84711831161846, -38.912512678236865 142.61573858606104, -38.55892221477983 142.6215036956464, -38.566917961969985 141.5187311332261, -41.6115823275826 141.5368697599883, -41.585543792852064 137.88111616458073, -56.29054589900925 137.86178274328725, -56.30135451458871 140.58292481090118, -58.04879927278979 140.58918250890764, -58.050698205147405 137.87115015448114, -71.47632948146341 137.86393470955485, -71.47794231739607 141.544413580687, -75.09947336850709 141.51916113770915, -75.36899962504953 141.34974460405283, -75.34983431836991 137.88420480891884, -78.12077887991073 137.89803670268532, -78.11398558632628 141.26429147096928, -78.41334165255887 141.50468349123364, -83.26538034774129 141.49260125570723, -83.28228611779763 137.88813464122728, -84.04533614339088 137.88193503478672, -84.03613064088168 141.52348856173214, -90.20230018775938 141.53619242808503, -90.21272238290332 137.9125663284382, -91.05575165342582 137.90857080637065, -91.06240985500172 141.5512076364703, -97.18102333510755 141.51465241048146, -97.20679396425749 137.9367170463887, -97.97687651514106 137.949269854313))'::public.geometry, 'POLYGON ((-99.24573813031174 136.3464657913514, -99.24573813031174 150.1408331519191, -37.17108500775965 150.1408331519191, -37.17108500775965 136.34646579135142, -99.24573813031174 136.3464657913514))'::public.geometry, NULL,'WHITEBOARD'),
    ('4', 'POLYGON ((-107.3393039066495 103.6913749657226, -107.3394398799215 106.9067186295563, -104.28815141876625 106.90846805494597, -104.28810631791538 111.96285735106937, -92.88646821526355 111.98254342550379, -92.89793580361258 110.19513879336289, -93.57464445481556 110.19865415225146, -93.56748812662181 103.68539370694307, -94.08122018616862 103.68539370694307, -94.08681089062696 105.89375184437414, -95.85355275216718 105.89377684144577, -95.84989409486874 103.6850516020897, -96.36090134154207 103.68671367928549, -96.35914301222334 105.88667800579401, -96.60499157982119 105.88826127459839, -96.61176717134418 103.6875296332228, -97.11624807725215 103.68917048316158, -97.11714156307357 105.87854270288506, -98.22280407423918 105.89355165065274, -98.20092513447841 104.40741860739367, -97.44742627564574 103.6946056381965, -99.30410350735623 103.69628659480524, -98.63830605628362 104.37997933443194, -98.62922266473416 105.9060452227088, -100.0553669768825 105.88787782974067, -100.0553669768825 103.68961657203523, -100.58222320256597 103.68053318048575, -100.57493776673864 105.88808025613505, -102.35571175029717 105.86893220638257, -102.35187642932968 103.68598538817456, -102.8651895618766 103.69679213127475, -102.85374551033604 105.87845926206148, -106.82479088371093 105.86654283356762, -106.82599059271747 103.69677824658014, -107.3393039066495 103.6913749657226))'::public.geometry, 'POLYGON ((-107.63695572034081 103.02561980574372, -107.6369557203408 112.58988669570215, -92.61001395537347 112.58988669570215, -92.61001395537347 103.02561980574372, -107.63695572034081 103.02561980574372))'::public.geometry, NULL,'WHITEBOARD'),
    ('5', NULL, NULL, NULL,'WHITEBOARD'),
    ('6', NULL, NULL, NULL,'WHITEBOARD'),
    ('8', NULL,  NULL, NULL,'WHITEBOARD'),
    ('9', NULL, NULL, NULL,'WHITEBOARD'),
    ('10', NULL, NULL, NULL,'WHITEBOARD');

--process_insert_text:
INSERT INTO pt_texts_process ("name")  
VALUES
    ('Hydrapulper'),
    ('Plodder'),
    ('Paper machine'),
    ('Separator'),
    ('Printer'),
    ('Log cutter'),
    ('Coil deposit'),
    ('Sealer'),
    ('Paper towel');


INSERT INTO pt_texts_process_sample_pos (id,point_2d,hopara_scope) 
VALUES
    ('1', 'POINT (-114.30033291505164 154.22211911510766)'::public.geometry,'WHITEBOARD'),
    ('2', 'POINT (-112.144152514103 136.65163671148974)'::public.geometry,'WHITEBOARD'),
    ('3', 'POINT (-68.90978470653013 136.56905418408184)'::public.geometry,'WHITEBOARD'),
    ('4', 'POINT (-99.65751130662899 102.09489110206893)'::public.geometry,'WHITEBOARD'),
    ('5', 'POINT (-76.10771549742321 119.6541615452718)'::public.geometry,'WHITEBOARD'),
    ('6', 'POINT (-104.75279703769922 119.6932192176139)'::public.geometry,'WHITEBOARD'),
    ('7', 'POINT (-45.576680214053596 119.68391535929118)'::public.geometry,'WHITEBOARD'),
    ('8', 'POINT (-76.87338486019355 102.26411633733072)'::public.geometry,'WHITEBOARD'),
    ('9', 'POINT (-44.20758011500031 102.23223556545904)'::public.geometry,'WHITEBOARD');    

--process_insert_pipes:
INSERT INTO pt_pipes_process ("name")
VALUES
    ('Pulp conveyor'),
    ('Water pipe'),
    ('Hydrapulper to plodder'),
    ('Plodder to paper machine'),
    ('Paper machine to coil stock'),
    ('Printer to log cutter'),
    ('Log cutter to separator'),
    ('Packer to paper towel stock'),
    ('Coil stock to printer');

INSERT INTO pt_pipes_process_sample_pos (id, line, hopara_scope)
VALUES
    ('1', 'LINESTRING (-116.5223569914572 171.02880330864363, -116.51714750491236 169.69512600385383, -114.83442144149046 169.69512600385383)'::public.geometry,'WHITEBOARD'),
    ('2', 'LINESTRING (-107.6580533485483 171.06131672168956, -107.65466384411882 169.33950109473656)'::public.geometry,'WHITEBOARD'),
    ('3', 'LINESTRING (-111.0097103632756 155.24916879876668, -111.02975957364444 143.52992417873318)'::public.geometry,'WHITEBOARD'),
    ('4', 'LINESTRING (-105.63763651999565 142.0894147163306, -98.295829065883 142.10568425701976)'::public.geometry,'WHITEBOARD'),
    ('5', 'LINESTRING (-38.22568823878753 141.8777669900489, -35.57335227309512 141.86920017949427, -35.62227438108275 125.4418875710507, -38.395440640515204 125.45124054892293)'::public.geometry,'WHITEBOARD'),
    ('6', 'LINESTRING (-53 125.78995373344917, -66.25 125.78995373344917)'::public.geometry,'WHITEBOARD'),
    ('7', 'LINESTRING (-82.5996633464816 125.78995373344917, -95.92292503489155 125.7963168318641)'::public.geometry,'WHITEBOARD'),
    ('8', 'LINESTRING (-119.1498295402162 123.2756362728275, -121.22567721564123 123.25481832835472, -121.315448822117 106.13629527890926, -107.6763035214793 106.1499382805716)'::public.geometry,'WHITEBOARD'),
    ('9', 'LINESTRING (-67.28169422629121 106.1444104202541, -50.1276254745842 106.13651239106862)'::public.geometry,'WHITEBOARD');
    
    
--process_insert_sensors:
INSERT INTO pt_sensors_process (sensor_id, asset_id, alert, "type")
VALUES
    (1, 1, 0, 'temperature-and-vibration'),
    (2, 1, 0, 'temperature-and-vibration'),
    (3, 1, 0, 'temperature-and-vibration'),
    (4, 1, 0, 'temperature-and-vibration'),
    (5, 1, 0, 'vibration'),
    (6, 1, 1, 'vibration'),
    (7, 1, 0, 'vibration'),
    (8, 1, 1, 'vibration'),
    (17, 3, 0, 'pressure'),
    (18, 3, 0, 'pressure'),
    (19, 3, 2, 'temperature'),
    (20, 3, 2, 'temperature'),
    (21, 3, 2, 'temperature'),
    (22, 3, 0, 'temperature'),
    (23, 3, 0, 'temperature'),
    (24, 3, 0, 'temperature'),
    (25, 3, 0, 'temperature'),
    (26, 3, 1, 'temperature'),
    (27, 3, 1, 'temperature'),
    (28, 3, 1, 'temperature'),
    (29, 3, 2, 'electric'),
    (30, 3, 0, 'electric'),
    (31, 3, 0, 'electric'),
    (32, 3, 0, 'electric'),
    (33, 4, 0, 'deflection'),
    (34, 4, 0, 'deflection'),
    (35, 4, 1, 'deflection'),
    (36, 4, 0, 'deflection'),
    (37, 4, 0, 'vibration'),
    (38, 4, 0, 'vibration'),
    (39, 4, 0, 'vibration'),
    (12, 2, 0, 'temperature-and-vibration'),
    (15, 2, 0, 'temperature-and-vibration'),
    (16, 2, 0, 'temperature-and-vibration'),
    (13, 2, 0, 'temperature-and-vibration'),
    (14, 2, 0, 'temperature-and-vibration'),
    (11, 2, 0, 'temperature-and-vibration'),
    (9, 2, 0, 'temperature-and-vibration'),
    (10, 2, 0, 'temperature-and-vibration');

INSERT INTO pt_sensors_process_sample_pos (id,point_2d,hopara_scope)
VALUES
    ('1','POINT (-116.2650598412354 159.00432780501833)'::public.geometry,'WHITEBOARD'),
    ('2', 'POINT (-118.39890937548431 159.06051755243595)'::public.geometry,'WHITEBOARD'),
    ('3', 'POINT (-111.90790334094176 162.5275795324938)'::public.geometry,'WHITEBOARD'),
    ('4', 'POINT (-110.37154219848284 162.5678627140345)'::public.geometry,'WHITEBOARD'),
    ('5', 'POINT (-111.34990581687364 158.66205607491094)'::public.geometry,'WHITEBOARD'),
    ('6', 'POINT (-117.36006157591576 159.06051755243595)'::public.geometry,'WHITEBOARD'),
    ('7', 'POINT (-114.35582604743375 158.35814570971576)'::public.geometry,'WHITEBOARD'),
    ('8', 'POINT (-108.04484355893172 158.14665294723332)'::public.geometry,'WHITEBOARD'),
    ('17','POINT (-69.54857427293895 144.21992189206662)'::public.geometry,'WHITEBOARD'),
    ('18','POINT (-69.56140296274059 144.23863444402153)'::public.geometry,'WHITEBOARD'),
    ('19','POINT (-56.87115652111436 145.67332242841516)'::public.geometry,'WHITEBOARD'),
    ('20','POINT (-39.81441784398414 144.17748693218215)'::public.geometry,'WHITEBOARD'),
    ('21','POINT (-51.85058073289361 141.56828525051012)'::public.geometry,'WHITEBOARD'),
    ('22','POINT (-55.22024565972054 144.26081310235497)'::public.geometry,'WHITEBOARD'),
    ('23','POINT (-50.968484382599236 144.79280930175554)'::public.geometry,'WHITEBOARD'),
    ('24','POINT (-94.10844140783668 144.08396340690416)'::public.geometry,'WHITEBOARD'),
    ('25','POINT (-46.974044443072756 145.8833388864294)'::public.geometry,'WHITEBOARD'),
    ('26','POINT (-49.35832922563715 140.85477918114253)'::public.geometry,'WHITEBOARD'),
    ('27','POINT (-60.97520355747263 147.1605917378536)'::public.geometry,'WHITEBOARD'),
    ('28','POINT (-95.87150961205154 142.61510592586347)'::public.geometry,'WHITEBOARD'),
    ('29','POINT (-65.40623747811888 140.78381067594452)'::public.geometry,'WHITEBOARD'),
    ('30','POINT (-78.67453938911696 144.51676744293223)'::public.geometry,'WHITEBOARD'),
    ('31','POINT (-62.56663433911072 143.86610000289681)'::public.geometry,'WHITEBOARD'),
    ('32','POINT (-83.24770807468633 144.90964585159634)'::public.geometry,'WHITEBOARD'),
    ('33','POINT (-105.86352890302994 106.52071623023528)'::public.geometry,'WHITEBOARD'),
    ('34','POINT (-104.64136729411817 106.54912171492052)'::public.geometry,'WHITEBOARD'),
    ('35','POINT (-103.58973986319408 106.52071623023528)'::public.geometry,'WHITEBOARD'),
    ('36','POINT (-100.34959048142798 106.49231074555003)'::public.geometry,'WHITEBOARD'),
    ('37','POINT (-96.51257147670496 106.46390526086479)'::public.geometry,'WHITEBOARD'),
    ('38','POINT (-95.86980202999094 107.21918198883121)'::public.geometry,'WHITEBOARD'),
    ('39','POINT (-94.46444748956264 107.7920782988456)'::public.geometry,'WHITEBOARD'),
    ('12','POINT (-114.36026340582478 140.95519019983158)'::public.geometry,'WHITEBOARD'),
    ('15','POINT (-116.44973031557188 140.85326066904008)'::public.geometry,'WHITEBOARD'),
    ('16','POINT (-115.39551965640153 141.18299945956204)'::public.geometry,'WHITEBOARD'),
    ('13','POINT (-114.42753418310694 141.8845985488328)'::public.geometry,'WHITEBOARD'),
    ('14','POINT (-116.457612105701 141.92258928406994)'::public.geometry,'WHITEBOARD'),
    ('11','POINT (-113.89970673398922 139.6875117825829)'::public.geometry,'WHITEBOARD'),
    ('9','POINT (-112.09843251032756 138.81788251362903)'::public.geometry,'WHITEBOARD'),
    ('10','POINT (-113.35451779428836 138.83319153035228)'::public.geometry,'WHITEBOARD');

-- views   

--process_insert_assets_views:
INSERT INTO pt_assets_views (asset_id, "name", image_view_name) 
VALUES
    (1, 'Hydrapulper', 'hydrapulper_view'),
    (2, 'Plodder', 'plodder_view'),
    (3, 'Paper machine','paper_machine_view'),
    (4, 'Separator', 'separator'),
    (5, 'Printer',NULL),
    (6, 'Log cutter', NULL),
    (8, 'Coil deposit', NULL),
    (9, 'Sealer',NULL),
    (10, 'Paper towel', NULL);
    
INSERT INTO pt_assets_views_sample_pos (id,rectangle,hopara_scope) 
VALUES
    ('1', 'POLYGON ((-471.98948508211726 -383.93598101822647, -471.98948508211754 406.42988416293167, 318.3763800990405 406.42988416293167, 318.37638009904003 -383.93598101822624, -471.98948508211726 -383.93598101822647))'::public.geometry, 'WHITEBOARD'),
    ('2', 'POLYGON ((-583.5927250637938 -176.3041284026733, -583.5927250637947 241.05791314640555, 668.7991593208442 241.0579131464052, 668.799159320844 -176.30412840267297, -583.5927250637938 -176.3041284026733))'::public.geometry, 'WHITEBOARD'),
    ('3', 'POLYGON ((-680.2852768520146 -150.98241416848848, -680.2852768520146 344.34450027976214, 593.4125031577729 344.34450027976226, 593.4125031577729 -150.98241416848836, -680.2852768520146 -150.98241416848848))'::public.geometry, 'WHITEBOARD'),
    ('4', 'POLYGON ((-441.6741453027241 -219.5081855180954, -441.67414530272384 296.805069068621, 369.5337913245087 296.80506906862104, 369.5337913245089 -219.50818551809584, -441.6741453027241 -219.5081855180954))'::public.geometry, 'WHITEBOARD'),
    ('5', NULL,'WHITEBOARD'),
    ('6', NULL,'WHITEBOARD'),
    ('8', NULL,'WHITEBOARD'),
    ('9', NULL,'WHITEBOARD'),
    ('10', NULL,'WHITEBOARD');

--process_insert_sensors_views1:    
INSERT INTO pt_sensors_views1 (sensor_id, asset_id, alert, "type")
VALUES
    (1, 1, 0, 'temperature-and-vibration'),
    (2, 1, 0, 'temperature-and-vibration'),
    (3, 1, 0, 'temperature-and-vibration'),
    (4, 1, 0, 'temperature-and-vibration'),
    (5, 1, 0, 'vibration'),
    (6, 1, 1, 'vibration'),
    (7, 1, 0, 'vibration'),
    (8, 1, 1, 'vibration'),
    (17, 3, 0, 'pressure'),
    (18, 3, 0, 'pressure'),
    (19, 3, 2, 'temperature'),
    (20, 3, 2, 'temperature'),
    (21, 3, 2, 'temperature'),
    (22, 3, 0, 'temperature'),
    (23, 3, 0, 'temperature'),
    (24, 3, 0, 'temperature'),
    (25, 3, 0, 'temperature'),
    (26, 3, 1, 'temperature'),
    (27, 3, 1, 'temperature'),
    (28, 3, 1, 'temperature'),
    (29, 3, 2, 'electric'),
    (30, 3, 0, 'electric'),
    (31, 3, 0, 'electric'),
    (32, 3, 0, 'electric'),
    (33, 4, 0, 'deflection'),
    (34, 4, 0, 'deflection'),
    (35, 4, 1, 'deflection'),
    (36, 4, 0, 'deflection'),
    (37, 4, 0, 'vibration'),
    (38, 4, 0, 'vibration'),
    (39, 4, 0, 'vibration'),
    (12, 2, 0, 'temperature-and-vibration'),
    (15, 2, 0, 'temperature-and-vibration'),
    (16, 2, 0, 'temperature-and-vibration'),
    (13, 2, 0, 'temperature-and-vibration'),
    (14, 2, 0, 'temperature-and-vibration'),
    (11, 2, 0, 'temperature-and-vibration'),
    (9, 2, 0, 'temperature-and-vibration'),
    (10, 2, 0, 'temperature-and-vibration');
   
--process_insert_sensors_views2:   
INSERT INTO pt_sensors_views1_sample_pos (id,point_2d,hopara_scope)
VALUES
    ('1', 'POINT (-239.42595459664 -94.72359267247185)'::public.geometry, 'WHITEBOARD'),
    ('2', 'POINT (-333.112882569734 -104.11198583915166)'::public.geometry, 'WHITEBOARD'),
    ('3', 'POINT (-149.2932745505876 56.728384144185554)'::public.geometry, 'WHITEBOARD'),
    ('4', 'POINT (-86.40761917561642 66.40299286498782)'::public.geometry, 'WHITEBOARD'),
    ('5', 'POINT (-92.45431680782517 -43.645681334137464)'::public.geometry,'WHITEBOARD'),
    ('6', 'POINT (-325.85684541108344 -60.576246595541534)'::public.geometry,'WHITEBOARD'),
    ('7', 'POINT (-100.18926716160541 -136.25834055934797)'::public.geometry,'WHITEBOARD'),
    ('8', 'POINT (75.6438773675784 -40.01770306383668)'::public.geometry, 'WHITEBOARD'),
    ('17','POINT (-86.99793222569502 232.5360876361904)'::public.geometry,'WHITEBOARD'),
    ('18', 'POINT (-78.3651786359128 24.704821947118376)'::public.geometry,'WHITEBOARD'),
    ('19', 'POINT (182.6010535583448 46.35578704648472)'::public.geometry, 'WHITEBOARD'),
    ('20', 'POINT (527.3269266506818 11.332028755556792)'::public.geometry,'WHITEBOARD'),
    ('21', 'POINT (285.3453373488702 -30.1205181947156)'::public.geometry, 'WHITEBOARD'),
    ('22', 'POINT (215.81671789814948 19.057344460330427)'::public.geometry, 'WHITEBOARD'),
    ('23', 'POINT (300.5633505699908 29.27360029227134)'::public.geometry, 'WHITEBOARD'),
    ('24', 'POINT (-580.5596149328937 7.952634681558038)'::public.geometry, 'WHITEBOARD'),
    ('25', 'POINT (375.13161535348206 53.64041813308643)'::public.geometry, 'WHITEBOARD'),
    ('26', 'POINT (335.56478097856836 -45.34977934522499)'::public.geometry, 'WHITEBOARD'),
    ('27', 'POINT (95.68972018518022 74.04346601305961)'::public.geometry, 'WHITEBOARD'),
    ('28', 'POINT (-607.3235686591496 -11.871842006482183)'::public.geometry, 'WHITEBOARD'),
    ('29', 'POINT (9.297918176660431 -54.01897424248378)'::public.geometry, 'WHITEBOARD'),
    ('30', 'POINT (-256.3568729995379 25.95250743608335)'::public.geometry, 'WHITEBOARD'),
    ('31', 'POINT (56.27346051879306 14.064854754134217)'::public.geometry, 'WHITEBOARD'),
    ('32', 'POINT (-343.288623770611 26.49285528526289)'::public.geometry, 'WHITEBOARD'),
    ('33', 'POINT (-385.7648789221604 -28.908783779649752)'::public.geometry,'WHITEBOARD'),
    ('34', 'POINT (-314.2402167828934 -28.908783779649752)'::public.geometry, 'WHITEBOARD'),
    ('35', 'POINT (-247.28095860996262 -25.862931549547852)'::public.geometry,'WHITEBOARD'),
    ('36', 'POINT (-38.794177480610074 -24.340005434496902)'::public.geometry, 'WHITEBOARD'),
    ('37', 'POINT (134.69117324016509 -38.04634046995534)'::public.geometry, 'WHITEBOARD'),
    ('38', 'POINT (169.69260364874265 12.2102213267259)'::public.geometry, 'WHITEBOARD'),
    ('39', 'POINT (241.2172657880095 35.054113052490095)'::public.geometry, 'WHITEBOARD'),
    ('12', 'POINT (113.24713681271214 28.722470753796017)'::public.geometry, 'WHITEBOARD'),
    ('15', 'POINT (-28.02434035161677 28.754008519680127)'::public.geometry, 'WHITEBOARD'),
    ('16', 'POINT (41.518894392444395 55.9607143060292)'::public.geometry, 'WHITEBOARD'),
    ('13', 'POINT (107.4875577974141 99.01758171796897)'::public.geometry, 'WHITEBOARD'),
    ('14', 'POINT (-26.03320481571174 102.54548364601348)'::public.geometry,'WHITEBOARD'),
    ('11', 'POINT (114.03386585127653 -46.30926406860661)'::public.geometry, 'WHITEBOARD'),
    ('9', 'POINT (249.2153605734496 -96.55671726586112)'::public.geometry, 'WHITEBOARD'),
    ('10', 'POINT (176.58381328017623 -95.58602142824287)'::public.geometry,'WHITEBOARD');
    

INSERT INTO pt_sensors_views2 (sensor_id, asset_id, alert, "type")
VALUES
    (1, 1, 0, 'temperature-and-vibration'),
    (2, 1, 0, 'temperature-and-vibration'),
    (3, 1, 0, 'temperature-and-vibration'),
    (4, 1, 0, 'temperature-and-vibration'),
    (5, 1, 0, 'vibration'),
    (6, 1, 1, 'vibration'),
    (7, 1, 0, 'vibration'),
    (8, 1, 1, 'vibration'),
    (17, 3, 0, 'pressure'),
    (18, 3, 0, 'pressure'),
    (19, 3, 2, 'temperature'),
    (20, 3, 2, 'temperature'),
    (21, 3, 2, 'temperature'),
    (22, 3, 0, 'temperature'),
    (23, 3, 0, 'temperature'),
    (24, 3, 0, 'temperature'),
    (25, 3, 0, 'temperature'),
    (26, 3, 1, 'temperature'),
    (27, 3, 1, 'temperature'),
    (28, 3, 1, 'temperature'),
    (29, 3, 2, 'electric'),
    (30, 3, 0, 'electric'),
    (31, 3, 0, 'electric'),
    (32, 3, 0, 'electric'),
    (33, 4, 0, 'deflection'),
    (34, 4, 0, 'deflection'),
    (35, 4, 1, 'deflection'),
    (36, 4, 0, 'deflection'),
    (37, 4, 0, 'vibration'),
    (38, 4, 0, 'vibration'),
    (39, 4, 0, 'vibration'),
    (12, 2, 0, 'temperature-and-vibration'),
    (15, 2, 0, 'temperature-and-vibration'),
    (16, 2, 0, 'temperature-and-vibration'),
    (13, 2, 0, 'temperature-and-vibration'),
    (14, 2, 0, 'temperature-and-vibration'),
    (11, 2, 0, 'temperature-and-vibration'),
    (9, 2, 0, 'temperature-and-vibration'),
    (10, 2, 0, 'temperature-and-vibration');
   
INSERT INTO pt_sensors_views2_sample_pos (id,point_2d,hopara_scope)
VALUES
    ('1',NULL,'WHITEBOARD'),
    ('2', NULL,'WHITEBOARD'),
    ('3', NULL,'WHITEBOARD'),
    ('4', NULL,'WHITEBOARD'),
    ('5', NULL,'WHITEBOARD'),
    ('6', NULL,'WHITEBOARD'),
    ('7', NULL,'WHITEBOARD'),
    ('8', NULL,'WHITEBOARD'),
    ('17',NULL,'WHITEBOARD'),
    ('18','POINT (-88.97809129770758 154.2619931162584)'::public.geometry,'WHITEBOARD'),
    ('19','POINT (186.26401971203722 224.60959705189362)'::public.geometry,'WHITEBOARD'),
    ('20', NULL,'WHITEBOARD'),
    ('21','POINT (273.3910188805896 293.96638966449154)'::public.geometry,'WHITEBOARD'),
    ('22','POINT (223.88704208027576 231.5452763131534)'::public.geometry,'WHITEBOARD'),
    ('23','POINT (295.17276867272767 237.49014425137608)'::public.geometry,'WHITEBOARD'),
    ('24', NULL,'WHITEBOARD'),
    ('25','POINT (365.46841572917333 165.16091766966673)'::public.geometry,'WHITEBOARD'),
    ('26', 'POINT (329.82555243294735 237.49014425137608)'::public.geometry,'WHITEBOARD'),
    ('27', 'POINT (67.45447539128406 164.17010634662955)'::public.geometry,'WHITEBOARD'),
    ('28', NULL,'WHITEBOARD'),
    ('29', 'POINT (13.00010091093884 167.14254031574092)'::public.geometry,'WHITEBOARD'),
    ('30', 'POINT (-255.31145334676216 230.55446499011614)'::public.geometry,'WHITEBOARD'),
    ('31', 'POINT (53.59336188719624 220.64635175974504)'::public.geometry,'WHITEBOARD'),
    ('32', 'POINT (-364.22020230745255 284.05827643412033)'::public.geometry,'WHITEBOARD'),
    ('33', NULL,'WHITEBOARD'),
    ('34', NULL,'WHITEBOARD'),
    ('35', NULL,'WHITEBOARD'),
    ('36', NULL,'WHITEBOARD'),
    ('37', NULL,'WHITEBOARD'),
    ('38', NULL,'WHITEBOARD'),
    ('39', NULL,'WHITEBOARD'),
    ('12', 'POINT (-420.80661183726806 32.236761515320836)'::public.geometry,'WHITEBOARD'),
    ('15', 'POINT (-420.80661183726806 32.236761515320836)'::public.geometry,'WHITEBOARD'),
    ('16', 'POINT (-418.05201293981656 64.64454735248536)'::public.geometry,'WHITEBOARD'),
    ('13', 'POINT (-418.4464247215749 96.72562405314878)'::public.geometry,'WHITEBOARD'),
    ('14', 'POINT (-418.44642472157483 96.72562405314878)'::public.geometry,'WHITEBOARD'),
    ('11', 'POINT (-419.2331537601393 -50.34044051482471)'::public.geometry,'WHITEBOARD'),
    ('9', NULL,'WHITEBOARD'),
    ('10', NULL,'WHITEBOARD');