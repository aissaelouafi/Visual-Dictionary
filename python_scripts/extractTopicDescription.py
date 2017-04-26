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
final_topics_description = []

for i in xrange(len(json_text_cordinates)):
    try:
        topics_description[json_text_cordinates[i]["page"]].append(json_text_cordinates[i]["text"])
    except KeyError:
        topics_description[json_text_cordinates[i]["page"]] = [json_text_cordinates[i]["text"]]

print (topics_description)


for i in xrange(len(json_topics_summary)):
    page = int(json_topics_summary[i]["page"])
    if(page<614 and page > 10):
        try:
            lis = topics_description[page]
            ml = max(len(s) for s in lis)
            result = list(set(s for s in lis if len(s) == ml))
            print("page {} : topic:{} subtopic: {} description : {}".format(page,topics_description[page][0],topics_description[page][1],result)) #The max string length and should start by capital letter all the title
            item = {"page":page,"topic":topics_description[page][0].lower().replace("_rl_",""),"subtopic":topics_description[page][1].lower().replace("_rl_",""),"description":result}
            final_topics_description.append(item)

        except KeyError:
            continue

with json_topics_description as file:
    file.write(json.dumps(final_topics_description))
    print("file : final_topics_description.json created successfuly ...")