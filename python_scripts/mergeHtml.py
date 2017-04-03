#Script to get only textual data from the html page and merge them
import glob,os,html2text,sys

reload(sys)
sys.setdefaultencoding('utf-8')

rootdir = 'out'
text_file = open("textualData.txt","w")
page_text_content = ""
for file in os.listdir(rootdir):
    extension = os.path.splitext(file)[1]
    if(extension == ".html"):
        if(file.startswith("page-")):
            nb_page = file.replace("page-","").replace(".html","")
            page_text_content = page_text_content + "### nb_page : "+nb_page +" ###" + "\n"
            #Convert html content to text data (delete balises ... )
            html_converter = html2text.HTML2Text()
            #html_converter.ignore_links = True
            content = open('out/'+file)

            text_data = html_converter.handle(content.read().decode('utf-8').strip())
            page_text_content = page_text_content + text_data

with text_file as text_file:
    text_file.write(page_text_content)
