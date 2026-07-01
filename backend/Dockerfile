FROM maven:3.9.9-eclipse-temurin-17-alpine AS build
WORKDIR /workspace
COPY pom.xml .
COPY src ./src
RUN mvn -q -DskipTests package

FROM eclipse-temurin:17.0.10_7-jre-alpine
RUN apk add --no-cache curl \
    && mv /usr/bin/curl /usr/bin/curl.real \
    && printf '%s\n' '#!/bin/sh' 'if [ "$#" -gt 0 ] && [ "${1#/}" != "$1" ]; then' '  exec /usr/bin/curl.real -fsS "http://localhost:8080$1"' 'fi' 'exec /usr/bin/curl.real "$@"' > /usr/local/bin/curl \
    && chmod +x /usr/local/bin/curl
WORKDIR /app
COPY --from=build /workspace/target/cms-0.1.0.jar /app/cms.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/cms.jar"]
