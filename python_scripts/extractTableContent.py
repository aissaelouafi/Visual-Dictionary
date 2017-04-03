#Extract global table content to json format
import glob,os,html2text,sys,re,json
reload(sys)
sys.setdefaultencoding('utf-8')

#Open the global summary html page (page-7.html)
rootdir = 'out'
global_summary_page = "page-7.html"
json_output_file = open("global_summary.json","w")
content = open(rootdir+'/'+global_summary_page)

#Convert the html page to textual daya
html_converter = html2text.HTML2Text()
html_converter.ignore_links = True
text_data = html_converter.handle(content.read())

#Separate summary and other text data
sep = 'INDEX 624'
summary = text_data.split(sep, 1)[0]
summary = summary.replace("![](bg7.png)","").replace("\n"," ")
summary = re.split('(\d+)',summary)
del summary[-1]
summary_json = []
topic_array = []
page_array = []
for i in xrange(0,len(summary),2):
    topic_array.append(summary[i][2:][:-1])
for i in xrange(1,len(summary),2):
    page_array.append(summary[i])

for i in xrange(len(topic_array)):
    item = {"topic": topic_array[i],"page":int(page_array[i])+2}
    summary_json.append(item)

jsonData=json.dumps(summary_json)

with json_output_file as json_output_file:
    json_output_file.write(jsonData)
