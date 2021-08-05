import requests
from bs4 import BeautifulSoup
import re
from urllib.request import urlopen
from gtts import gTTS 
from playsound import playsound 
import speech_recognition as sr
import pyttsx3 

engine = pyttsx3.init()

def speak(audio):
    engine.say(audio)
    print(audio)
    engine.runAndWait()

urls = 'https://visiblity.herokuapp.com'
grab = requests.get(urls)
soup = BeautifulSoup(grab.text, 'html.parser')

speak('Opening our website.')

websites = set()# traverse paragraphs from soup
for link in soup.find_all('a'):
    # print(link)
    data = link.get('href')
    websites.add(data)

links = dict()
links['main'] = urls

for site in websites:
    if len(site) > 1:
        # speak(site)
        if site[0] != '/':
            site = '/' + site
        links[site.split('/')[-1].lower()] = urls + site

speak('Do you want to stay on this page or go to another?')
stay = input()

if stay.strip().lower() == 'stay':
    page = urlopen(urls)
    html = page.read().decode("utf-8")
    soup = BeautifulSoup(html, "html.parser")
    text = soup.get_text()
    text = text.replace('\n',' ').split('system')[-1]
    speak(text)


flag = True
while flag:
    speak('Choose your option from :')
    for k in links.keys():
        speak(k)
    option = input()
    if option in links:
        urls = links[option]
        page = urlopen(urls)
        html = page.read().decode("utf-8")
        soup = BeautifulSoup(html, "html.parser")
        text = soup.get_text()
        text = text.replace('\n',' ').split('system')[-1]
        speak(text)
    else:
        speak('Closing program.')
        flag = False
