from __main__ import app
from flask import request
import json
from utils.api_utils.api_utils import endpoint_handler
from src.settings import settings as ST
from src.core.olympics import olympics
from src.core.co2 import co2
from src.core.sheep import sheep
from src.core.virus import virus
from src.core.piles import piles


@app.route("/health")
@endpoint_handler
def health():
    return {ST.HTTP_STATUS: 200, ST.PAYLOAD: {ST.MSG: 'Aloha', ST.SUCCESS: True}}


@app.route("/olympics")
@endpoint_handler
def olympics_get():
    res = olympics.get_df()
    return {ST.HTTP_STATUS: 200, ST.PAYLOAD: res}


@app.route("/co2")
@endpoint_handler
def co2_get():
    res = co2.get_df()
    return {ST.HTTP_STATUS: 200, ST.PAYLOAD: res}


@app.route("/co2-spec")
@endpoint_handler
def co2_get_spec():
    res = co2.get_df_spec(request.args.get('spec'))
    return {ST.HTTP_STATUS: 200, ST.PAYLOAD: res}


@app.route("/sheep")
@endpoint_handler
def sheep_get():
    res = sheep.get_df()
    return {ST.HTTP_STATUS: 200, ST.PAYLOAD: res}


@app.route("/virus")
@endpoint_handler
def virus_get():
    res = virus.get_df()
    return {ST.HTTP_STATUS: 200, ST.PAYLOAD: res}


@app.route("/piles")
@endpoint_handler
def piles_get():
    res = piles.get_df(request.args)
    return {ST.HTTP_STATUS: 200, ST.PAYLOAD: res}


@app.route("/piles-area")
@endpoint_handler
def piles_work_get():
    res = piles.get_work_df(request.args)
    return {ST.HTTP_STATUS: 200, ST.PAYLOAD: res}