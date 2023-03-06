FROM node:14.17.1 as build
 
SHELL ["/bin/bash", "-c"]

RUN apt update && apt install -y \
    && apt clean && rm -rf /var/lib/apt/lists/*

COPY . /app
WORKDIR /app

RUN yarn install 
RUN export NODE_OPTIONS=--max-old-space-size=5120
RUN yarn build

FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
