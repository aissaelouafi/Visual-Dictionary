#Create folder for each image topic
import glob,os,html2text,sys,re,json
from shutil import copyfile
import shutil

reload(sys)
sys.setdefaultencoding('utf-8')

rootdir = 'images'
json_output_file = open("global_summary.json","r")
topic_summary_json = open("topic_summary.json","r")
json_write_file = open("image_topics.json","w")
image_detailed_topic_write = open("images_detailed_topics.json","w")


topic_object = json.load(json_output_file)
topic_summary = json.load(topic_summary_json)

print(topic_object)
for i in xrange(len(topic_object)):
    folder_name = topic_object[i]["topic"]
    if not os.path.exists('images/'+folder_name):
        os.makedirs('images/'+folder_name)
        print("folder : images/"+folder_name+" created successfuly ! ")
    else if not os.path.exists('corped_images/'+folder_name):
        os.makedirs('corped_images/'+folder_name)
        print("folder : images/"+folder_name+" created successfuly ! ")
    else :
        print("folder : images/"+folder_name+" already exist ! ")

summary_json = []
detailed_summary_json = []

#Copy image to the correct folder created before

for file in os.listdir(rootdir):
    extension = os.path.splitext(file)[1]
    if(extension == ".png"):
        image_nb = file.replace(".png","")
        for i in xrange(len(topic_object)-1):
            image_nb = int(image_nb);
            if(topic_object[i]["page"] <= image_nb < topic_object[i+1]["page"]):
                item = {"img": str(image_nb)+".png","topic":topic_object[i]["topic"]}
                summary_json.append(item)
                src = "./images/"+str(image_nb)+".png"
                dst = "./images/"+topic_object[i]["topic"]+"/"+str(image_nb)+".png"
                copyfile(src,dst)
                print("File copied from : "+src+" to : "+dst)

for file in os.listdir(rootdir):
    extension = os.path.splitext(file)[1]
    if(extension == ".png"):
        image_nb = file.replace(".png","")
        for i in xrange(len(topic_summary)-1):
            if(topic_summary[i]["page"] <= image_nb < topic_summary[i+1]["page"]):
                item = {"img":str(image_nb)+".png","sub-topic":topic_summary[i]["topic"]}
                detailed_summary_json.append(item)

with json_write_file as file:
    file.write(json.dumps(summary_json))
    print("file : images_topics.json created successfuly ...")

with image_detailed_topic_write as file:
    file.write(json.dumps(detailed_summary_json))
    print("file : images_detailed_topics.json created successfuly ...")
