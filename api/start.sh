#!/bin/sh

flask db init && flask db migrate && flask db upgrade && gunicorn -w 4 -b :8000 main:app
