FROM nginx

# File Author / Maintainer
LABEL Maintainer="Vladislav Sereda"
LABEL Author="trudygajs@gmail.com"

COPY docker-entrypoint.sh /
RUN chmod +x ./docker-entrypoint.sh
ENTRYPOINT [ "./docker-entrypoint.sh" ]

# Copy custom configuration file from the current directory
COPY nginx.conf /etc/nginx/nginx.conf

# Add ssl keys volume
VOLUME ["/ssl"]

# Expose ports
EXPOSE 443
EXPOSE 80

# Define default command
CMD nginx -g 'daemon off;'