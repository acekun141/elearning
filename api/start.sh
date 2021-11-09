#!/bin/sh

flask db upgrade && gunicorn -w 4 --timeout 300 -b :8000 main:app
