ARG BASE_DEBIAN=buster

FROM debian:${BASE_DEBIAN}

# https://downloadsapachefriends.global.ssl.fastly.net/7.4.29/xampp-linux-x64-7.4.29-1-installer.run?from_af=true
ARG XAMPP_URL=https://sourceforge.net/projects/xampp/files/XAMPP%20Linux/7.4.30/xampp-linux-x64-7.4.30-1-installer.run?from_af=true

LABEL maintainer="Francisco Verdugo<fcoverdugoa (at) underpost (dot) net>"

ENV DEBIAN_FRONTEND noninteractive

# Set root password to root, format is 'user:password'.
RUN echo 'root:root' | chpasswd

RUN apt-get update --fix-missing && \
    apt-get upgrade -y && \
    # install sudo
    apt-get -y install sudo && \
    # net-tools provides netstat commands
    apt-get -y install curl net-tools && \
    apt-get -yq install openssh-server supervisor && \
    # Few handy utilities which are nice to have
    apt-get -y install nano vim less --no-install-recommends && \
    apt-get clean


# install xampp and ssh
RUN curl -Lo xampp-linux-installer.run $XAMPP_URL && \
    chmod +x xampp-linux-installer.run && \
    bash -c './xampp-linux-installer.run' && \
    ln -sf /opt/lampp/lampp /usr/bin/lampp && \
    # Enable XAMPP web interface(remove security checks)
    sed -i.bak s'/Require local/Require all granted/g' /opt/lampp/etc/extra/httpd-xampp.conf && \
    # Enable error display in php
    sed -i.bak s'/display_errors=Off/display_errors=On/g' /opt/lampp/etc/php.ini && \
    # Enable includes of several configuration files
    mkdir /opt/lampp/apache2/conf.d && \
    echo "IncludeOptional /opt/lampp/apache2/conf.d/*.conf" >> /opt/lampp/etc/httpd.conf && \
    # Create a /www folder and a symbolic link to it in /opt/lampp/htdocs. It'll be accessible via http://localhost:[port]/www/
    # This is convenient because it doesn't interfere with xampp, phpmyadmin or other tools in /opt/lampp/htdocs
    mkdir /www && \
    ln -s /www /opt/lampp/htdocs && \
    # /opt/lampp/etc/httpd.conf
    # SSH server
    mkdir -p /var/run/sshd && \
    # Allow root login via password
    sed -ri 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/g' /etc/ssh/sshd_config

# copy supervisor config file to start openssh-server
COPY supervisord-openssh-server.conf /etc/supervisor/conf.d/supervisord-openssh-server.conf

# install open ssl git and others tools
RUN apt-get install -yq --no-install-recommends \
    libssl-dev \
    curl \ 
    wget \
    git \
    gnupg

# install nodejs 14 https://github.com/nodesource/distributions/blob/master/README.md#deb
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs \
    build-essential && \
    node --version && \ 
    npm --version




# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

RUN npm install

RUN mkdir -p /underpost_modules

WORKDIR /underpost_modules

RUN git clone https://github.com/underpostnet/underpost-library && \
    git clone https://github.com/underpostnet/underpost.net && \
    git clone https://github.com/underpostnet/underpost-data-template

WORKDIR /

# RUN service ssh start

VOLUME [ "/var/log/mysql/", "/var/log/apache2/", "/www", "/opt/lampp/apache2/conf.d/", "/data" ]

EXPOSE 5500
EXPOSE 5501
EXPOSE 22
EXPOSE 3306
EXPOSE 80

CMD ["node", "startup.js"]