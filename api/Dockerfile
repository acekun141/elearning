FROM python:3.9
WORKDIR /code

ADD main.py config.py requirement.txt wait.sh start.sh /code/
ADD api /code/api/
ADD migrations /code/migrations

RUN mkdir videos
RUN mkdir images

RUN pip install -r requirement.txt

RUN apt-get update && apt-get -y install default-mysql-client

RUN apt install -y ffmpeg

ENV FLASK_APP=api

RUN ls -lh

CMD bash -c "chmod -R 777 ./wait.sh && ./wait.sh && chmod -R 777 ./start.sh && ./start.sh"
