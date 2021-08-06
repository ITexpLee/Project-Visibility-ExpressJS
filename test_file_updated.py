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

def speechtotext():
    # Initialize the recognizer 
    r = sr.Recognizer()   

    # use the microphone as source for input.
    with sr.Microphone() as source:
        # wait for a second to let the recognizer
        # adjust the energy threshold based on
        # the surrounding noise level 
        r.adjust_for_ambient_noise(source, duration=0.2)

        #listens for the user's input 
        audio = r.listen(source)

        # Using google to recognize audio
        MyText = r.recognize_google(audio)
        MyText = MyText.lower()

        print("Did you say:- "+MyText)
        return MyText

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
stay = speechtotext()

if stay.strip() == 'stay':
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
    option = speechtotext().replace(' ','')
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
