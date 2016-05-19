import os
import glob
import time
from datetime import datetime
from flask import Flask
from flask import jsonify
from flask.ext.cors import CORS
from gpiozero import LED
from time import sleep
from apscheduler.scheduler import Scheduler

fanIO = LED(17)
heatIO = LED(18)
coolIO = LED(22)

currentState = "off"
tempOverride = False
shortCycleDelay = False

app = Flask(__name__)
app.debug = True
CORS(app)

os.system('modprobe w1-gpio')
os.system('modprobe w1-therm')

base_dir = '/sys/bus/w1/devices/'
device_folder = glob.glob(base_dir + '28*')[0]
device_file = device_folder + '/w1_slave'


def read_temp_raw():
    f = open(device_file, 'r')
    lines = f.readlines()
    f.close()
    return lines


def read_temp():
    lines = read_temp_raw()
    while lines[0].strip()[-3:] != 'YES':
        time.sleep(0.2)
        lines = read_temp_raw()
    equals_pos = lines[1].find('t=')
    if equals_pos != -1:
        temp_string = lines[1][equals_pos+2:]
        temp_c = float(temp_string) / 1000.0
        temp_f = temp_c * 9.0 / 5.0 + 32.0
        return temp_f


def preventShortCycle():
    global shortCycleDelay
    shortCycleDelay = True
    sleep(300)
    shortCycleDelay = False


def fan():
    # function for turning on the fan
    fanIO.on()


def heat():
    # function for turning on heat
    if not shortCycleDelay:
        if currentState != "heat":
            coolIO.off()
            fanIO.on()
            heatIO.on()
            global currentState
            currentState = "heat"
            preventShortCycle()


def cool():
    # function for turning on air conditioner
    if not shortCycleDelay:
        if currentState != "cool":
            heatIO.off()
            fanIO.on()
            coolIO.on()
            global currentState
            currentState = "cool"
            preventShortCycle()


def allOff():
    # function for turning everything off
    if not shortCycleDelay:
        if currentState != "off":
            fanIO.off()
            heatIO.off()
            coolIO.off()
            global currentState
            currentState = "off"
            preventShortCycle()


def getTempThreshold():
    now = datetime.now()

    weekdays = [0,1,2,3,4]

    if now.weekday() in weekdays:
        print "it\'s during the week"
        print now.hour
        if now.hour >= 22 or now.hour < 7:
            print "it\'s sleepy time"
            global targetTemp
            targetTemp = 69
            return 69
        elif now.hour >= 8 and now.hour < 17:
            print "we are at work"
            global targetTemp
            targetTemp = 69
            return 69
        else:
            print "we are at home"
            global targetTemp
            targetTemp = 71
            return 71
    else:
        print "it\'s the weekend!"
        if now.hour >= 22 or now.hour < 7:
            print "it\'s sleepy time"
            global targetTemp
            targetTemp = 69
            return 69
        else:
            print "it\'s daytime"
            global targetTemp
            targetTemp = 71
            return 71


def runThermostat():
    currentTemp = round(read_temp())
    if not tempOverride:
        tempThreshold = getTempThreshold()
    else:
        tempThreshold = targetTemp
    print currentTemp
    if currentTemp > tempThreshold:
        cool()
    elif currentTemp < tempThreshold:
        heat()
    else:
        allOff()

@app.before_first_request
def initialize():
    apsched = Scheduler()
    apsched.start()

    apsched.add_interval_job(runThermostat, seconds=1)


@app.route("/")
def getTemp():
    tempReading = str(read_temp())
    return jsonify(shortCycleDelay = shortCycleDelay, temperature = tempReading, tempOverride = tempOverride, targetTemp = targetTemp, currentState = currentState)


@app.route("/increaseTemp")
def increaseTemp():
    global tempOverride
    tempOverride = True
    global targetTemp
    targetTemp = targetTemp + 1
    return jsonify(tempOverride = tempOverride, targetTemp = targetTemp)


@app.route("/decreaseTemp")
def decreaseTemp():
    global tempOverride
    tempOverride = True
    global targetTemp
    targetTemp = targetTemp - 1
    return jsonify(tempOverride = tempOverride, targetTemp = targetTemp)


@app.route("/resumeProgram")
def resumeProgram():
    global tempOverride
    tempOverride = False
    return jsonify(tempOverride = tempOverride)


if __name__ == "__main__":
    app.run(host='0.0.0.0')
