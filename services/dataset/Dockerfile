FROM azul/zulu-openjdk:23

RUN apt-get update && apt-get install -y --no-install-recommends wget && rm -rf /var/lib/apt/lists/*

RUN adduser --system --group --home /home/spring spring
USER spring:spring

COPY build/libs/dataset-*.jar app.jar
COPY agents/* /
ENTRYPOINT ["java", \
            "-javaagent:jmx_prometheus_javaagent-1.0.1.jar=10005:config.yaml", \
            "-Dspring.main.allow-bean-definition-overriding=true", \
            "-Dspring.jmx.enabled=false", \
            "-Dspring.jdbc.getParameterType.ignore=true", \
            "-Dcom.sun.management.jmxremote", \
            "-Dcom.sun.management.jmxremote.port=9010", \
            "-Dcom.sun.management.jmxremote.rmi.port=9010", \
            "-Dcom.sun.management.jmxremote.local.only=false", \
            "-Dcom.sun.management.jmxremote.authenticate=false", \
            "-Dcom.sun.management.jmxremote.ssl=false", \
            "-Djava.rmi.server.hostname=127.0.0.1", \
            "--add-opens=java.base/java.nio=ALL-UNNAMED", \
            "-Duser.timezone=GMT", \            
            "-Ddd.http.server.error.statuses=403", \
            "-Xms1g","-Xmx4g","-XX:+HeapDumpOnOutOfMemoryError", \
            "-XX:HeapDumpPath=memoryDump.dmp","-jar","/app.jar"]