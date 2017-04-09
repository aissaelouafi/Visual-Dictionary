import glob,os,json,re,sys
import numpy as np
reload(sys)
sys.setdefaultencoding('utf-8')

json_topics_summary = open("../json_files/topic_summary.json","r")
json_text_cordinates = open("../json_files/text_cordinates.json","r")
json_topics_description = open("../json_files/topics_description.json",'w')


json_topics_summary = json.load(json_topics_summary)
json_text_cordinates = json.load(json_text_cordinates)


topics_description = {}
final_topics_description = {}

for i in xrange(len(json_text_cordinates)):
    try:
        topics_description[json_text_cordinates[i]["page"]].append(json_text_cordinates[i]["text"])
    except KeyError:
        topics_description[json_text_cordinates[i]["page"]] = [json_text_cordinates[i]["text"]]

for i in xrange(len(json_topics_summary)):
    page = int(json_topics_summary[i]["page"])
    if(page<614 and page > 0):
        try:
            print("page {} : {}".format(page-2,max(topics_description[page]))) #The max string length and should start by capital letter all the title
        except KeyError:
            continue
        #final_topics_description[page] = max(topics_description[page])




print(max(topics_description[18]))