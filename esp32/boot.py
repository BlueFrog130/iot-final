# This file is executed on every boot (including wake-boot from deepsleep)
#import esp
#esp.osdebug(None)
#import webrepl
#webrepl.start()

import network
from umqtt.simple import MQTTClient
from time import sleep
from machine import Pin
from dht import DHT11

# Enable WiFi
ssid = '<SSID>'
password = '********'

def STA_Setup(ssidRouter,passwordRouter):
    print("Setup start")
    sta_if = network.WLAN(network.STA_IF)
    if not sta_if.isconnected():
        print('connecting to',ssidRouter)
        sta_if.active(True)
        sta_if.connect(ssidRouter,passwordRouter)
        while not sta_if.isconnected():
            pass
    print('Connected, IP address:', sta_if.ifconfig())
    print("Setup End")
    
try:
    STA_Setup(ssid, password)
except:
    sta_if.disconnect()
    

# Connect MQTT client

SERVER = '192.168.0.103' # Raspberry Pi
CLIENT_ID = 'ESP32_DHT22_Sensor'
TOPIC = b'temp/home' # b'<str>' converts to bytes

client = MQTTClient(CLIENT_ID, SERVER)
client.connect()

sensor = DHT11(Pin(15, Pin.IN, Pin.PULL_UP))

# Collect weather info

while True:
    try:
        sensor.measure()
        t = sensor.temperature()
        h = sensor.humidity()
        if isinstance(t, int) and isinstance(h, int):
            msg = ('{ "temp": '+ str(t) +', "humidity": '+ str(h) +' }')
            client.publish(TOPIC, msg)
            print(msg)
        else:
            print('Invalid sensor reading')
    except OSError:
        print('Failed to read sensor')
    sleep(120)