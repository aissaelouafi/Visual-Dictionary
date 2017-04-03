#Extract topic table content to json format
import glob,os,html2text,sys,re,json
reload(sys)
sys.setdefaultencoding('utf-8')

#Open the global summary html page (page-X.html)
rootdir = 'out'
json_output_file = open("global_summary.json","r")
json_write_file = open("topic_summary.json","w")
topic_object = json.load(json_output_file)
json_output = ""
for i in xrange(len(topic_object)):
    if(topic_object[i]["topic"] != "INTRODUCTION" and topic_object[i]["topic"] != "APPENDIX"):
        subject = topic_object[i]["topic"]+"\n"
        html_page = "page-"+str(topic_object[i]["page"]+1)+".html"
        content = open(rootdir+'/'+html_page)
        html_converter = html2text.HTML2Text()
        html_converter.ignore_links = True
        text_data = html_converter.handle(content.read())
        text_data = text_data.split("\n",3)[3]
        text_data = text_data.replace(".","").replace("\n","")
        summary = re.split('(\d+)',text_data)

        summary_json = []
        topic_array = []
        page_array = []

        for i in xrange(0,len(summary),2):
            topic_array.append(summary[i])
        for i in xrange(1,len(summary),2):
            page_array.append(summary[i])

        del topic_array[-1]
        for i in xrange(len(topic_array)):
            topic = re.sub(' +',' ',topic_array[i])
            item = {"topic": topic,"page":page_array[i]}
            summary_json.append(item)

        json_output = json_output+str(summary_json)
        json_output= json_output.replace("][",",").replace("u","").replace("\\2019"," ").replace("\\201"," ").replace("\\e002"," ")
        json_output = json_output.replace("'","\"")
        #json_output = json.loads(json_output)

with json_write_file as json_write_file:
    json_write_file.write(json_output)
    print("json file created successfuly ...")
