import requests
from bs4 import BeautifulSoup
import re
from urllib.request import urlopen
from gtts import gTTS 
from playsound import playsound 
import os
import sys
import json
import urllib

url = 'http://localhost:3000'

def text_extractor():
    ''' Extracts text from JS '''
    text = str(sys.argv[1])
    res = json.loads(text)
    return (res['text'])


def text_to_speech(text):
    ''' Text to Speech function, also saves audio file '''
    language = 'en'
    myobj = gTTS(text=text, lang=language, slow=True)
    myobj.save("public/audio/sample.mp3")


def scrape(urls):
    ''' Scrapes links '''
    grab = requests.get(urls)
    soup = BeautifulSoup(grab.text, 'html.parser')


    websites = set()# traverse paragraphs from soup
    for link in soup.find_all('a'):
        data = link.get('href')
        websites.add(data)

    links = dict()
    links['home'] = urls

    for site in websites:
        if len(site) > 1:
            if site[0] != '/':
                site = '/' + site
            links[site.split('/')[-1].lower()] = urls + site
    return links


def find_link(links):
    ''' Finds link to open from input sentence '''
    s = text_extractor()
    s = re.sub('[^a-zA-Z]','',s)
    s = s.lower()
    for key in links:
        # 'find' function returns index. If for any key, we find a non negative index, it means the key is present in our string
        if s.find(key) != -1:
            return links[key] if key != 'home' else '/'
    return 'stop'


def program(urls):
    links = scrape(urls)
    input_speech = find_link(links) 
    temp_input = input_speech.split('3000')[-1]
    path_key = "/audio/sample.mp3"
    str = "str"
    src = "src"
    if temp_input == 'stop':
        input_speech = 'stop'
        print('{"' + str + '":"' + input_speech + '","' + src + '":"' + input_speech + '"}')
        exit()
    print('{"' + str + '":"' + temp_input + '","' + src + '":"' + path_key + '"}')
    if temp_input != '/':
        urls = input_speech
    page = urllib.request.urlopen(urls)
    html = page.read().decode("utf-8")
    soup = BeautifulSoup(html, "html.parser")
    text = soup.get_text()
    text = text.replace('\n',' ').split('Technologies')[-1]
    text_to_speech(text)


program(url)