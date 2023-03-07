FROM nginx:stable-alpine
 
SHELL ["/bin/bash", "-c"]

RUN apt update && apt install -y \
    && apt clean && rm -rf /var/lib/apt/lists/*

COPY . /app
WORKDIR /app

COPY /app/build /usr/share/nginx/html

EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
