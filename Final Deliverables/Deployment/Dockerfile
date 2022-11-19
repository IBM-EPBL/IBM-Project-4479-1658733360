FROM python:3.6
WORKDIR /app
ADD . /app
COPY app.py ./
RUN python3 -m pip install -r requirements.txt
RUN python3 -m pip install ibm_db
EXPOSE 5000
CMD ["python","./app.py"]
