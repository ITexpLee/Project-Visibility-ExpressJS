import requests
from bs4 import BeautifulSoup
import re
from urllib.request import urlopen
from gtts import gTTS 
from playsound import playsound 
import speech_recognition as sr
import pyttsx3
import glob
import os


url = 'https://visiblity.herokuapp.com'


def speech_to_text():
    ''' Converts audio file to text '''
    # Initialize the recognizer 
    r = sr.Recognizer()
    for name in glob.glob('Downloads/*'):
        audio_file_path = name
    audio_file=sr.AudioFile(audio_file_path)
    with audio_file as source:
        audio = r.record(source)
    text = r.recognize_google(audio)
    os.remove(audio_file_path)
    return text



engine = pyttsx3.init()
def text_to_speech(text):
    ''' Text to Speech function, also saves audio file '''
    engine.runAndWait()
    language = 'en'
    myobj = gTTS(text=text, lang=language, slow=True)
    myobj.save("C://Users//91981//Desktop//ProjectVisibility//sample.mp3")






def scrape(urls):
    ''' Scrapes links '''
    grab = requests.get(urls)
    soup = BeautifulSoup(grab.text, 'html.parser')


    websites = set()# traverse paragraphs from soup
    for link in soup.find_all('a'):
        data = link.get('href')
        websites.add(data)

    links = dict()
    links['main'] = urls

    for site in websites:
        if len(site) > 1:
            if site[0] != '/':
                site = '/' + site
            links[site.split('/')[-1].lower()] = urls + site
    return links




def find_link(links):
    ''' Finds link to open from input sentence '''
    s = speech_to_text()
    s = re.sub('[^a-zA-Z]','',s)
    s = s.lower()
    for key in links:
        # 'find' function returns index. If for any key, we find a non negative index, it means the key is present in our string
        if s.find(key) != -1:
            return links[key]
    return 'exit'




def program(urls):
    ''' Main Program '''
    links = scrape(urls)
    flag = True
    while flag:
        input_speech = find_link(links)
        path_key = "/audio/sample.mp3"
        str = "str"
        src = "src"
        print('{"' + str + '" : "' + input_speech + '","' + src + '" : "' + path_key + '"}')
        if input_speech != 'exit':
            urls = input_speech
            page = urlopen(urls)
            html = page.read().decode("utf-8")
            soup = BeautifulSoup(html, "html.parser")
            text = soup.get_text()
            text = text.replace('\n',' ').split('system')[-1]
            text_to_speech(text)
        else:
            flag = False

# import threading
# thread_one= threading.Thread(name='searcher', target=program, args=())                
# thread_one.start()

program(url)
