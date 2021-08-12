import requests
from bs4 import BeautifulSoup
import re
from urllib.request import urlopen
from gtts import gTTS 
from playsound import playsound 
import speech_recognition as sr
import pyttsx3
from nltk.stem.porter import PorterStemmer


engine = pyttsx3.init()
def speak(audio):
    engine.say(audio)
    print(audio)
    engine.runAndWait()
    language = 'en'
    myobj = gTTS(text=audio, lang=language, slow=False)
    myobj.save("C://Users//91981//Desktop//Visibility-Master//sample.mp3")
speak('Hello')

def speechtotext():
    # Initialize the recognizer 
    r = sr.Recognizer()   

    # use the microphone as source for input.
    with sr.Microphone() as source:
        # wait for a second to let the recognizer
        # adjust the energy threshold based on
        # the surrounding noise level 
        r.adjust_for_ambient_noise(source, duration=0.05)

        #listens for the user's input 
        audio = r.listen(source)

        # Using google to recognize audio
        MyText = r.recognize_google(audio)
        MyText = MyText.lower()

        print("Did you say:- "+MyText)
        return MyText

url = 'https://visiblity.herokuapp.com'
def scrape(urls):
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
    return links

# print(links)

def string_processing(s):
    crpus=[]
    ps=PorterStemmer()
    corpus=[]
    review=re.sub('[^a-zA-Z]',' ',s)
    review=review.lower()
    review=review.split()
    review=' '.join(review)
    #description preprocessing
    review=re.sub('[^a-zA-Z]',' ',s)

    review=review.lower()
    review=review.split()
    review=''.join(review)
    return review


def find_link(dic):
    s = input()
    s=string_processing(s)
    # print(s)
    for key in dic:
        if s.find(string_processing(key),0,len(s)) != -1:
            print(dic[key])
            return dic[key]
    return 'exit'


def program(urls,links):
    speak('Do you want to stay on this page or go to another?')
    # input_stay = speechtotext()
    input_stay = input()
    if 'stay' in input_stay:
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
        # input_speech = speechtotext()
        input_speech = find_link(links)

        if input_speech != 'exit':
            urls = input_speech
            page = urlopen(urls)
            html = page.read().decode("utf-8")
            soup = BeautifulSoup(html, "html.parser")
            text = soup.get_text()
            text = text.replace('\n',' ').split('system')[-1]
            speak(text)
        else:
            speak('Closing program.')
            flag = False

# import threading
# thread_one= threading.Thread(name='searcher', target=program, args=())                
# thread_one.start()

links = scrape(url)
program(url,links)
