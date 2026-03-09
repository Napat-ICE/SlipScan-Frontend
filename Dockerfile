FROM nginx:alpine

# Copy the static html/css/js files to the nginx default public folder
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
