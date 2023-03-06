FROM node:18.10.0 as build
 
SHELL ["/bin/bash", "-c"]

RUN apt update && apt install -y \
    && apt clean && rm -rf /var/lib/apt/lists/*

COPY . /app
WORKDIR /app

RUN yarn install 
RUN yarn build

FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
