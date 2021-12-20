# base image
FROM nginx:latest

EXPOSE 80

# delete the default welcome to nginx page.
RUN rm /usr/share/nginx/html/*

# copy over the custom default configs.
COPY configs/default.conf /etc/nginx/conf.d/default.conf

# start nginx in the foreground to play nicely with Docker.
CMD ["nginx", "-g", "daemon off;"]