FROM python:3

WORKDIR /usr/src/app

COPY server.py .

RUN pip install tensorflow==2.0.0-alpha0 

CMD [ "python", "./server.py" ]

EXPOSE 3000