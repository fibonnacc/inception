FROM alpine:3.19

RUN apk update && apk upgrade && \
    apk add --no-cache nginx

COPY ./conf/nginx.conf /etc/nginx/http.d/default.conf
COPY ./website /var/www/html

EXPOSE 8081

CMD ["nginx", "-g", "daemon off;"]
