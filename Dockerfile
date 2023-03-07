FROM nginx:stable-alpine
 
COPY . /app
WORKDIR /app

COPY /app/build /usr/share/nginx/html

EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
