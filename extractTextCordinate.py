#Extract topic table content to json format
import glob,os,html2text,sys,re,json
from pdfminer.pdfparser import PDFParser
from pdfminer.pdfdocument import PDFDocument
from pdfminer.pdfpage import PDFPage
from pdfminer.pdfpage import PDFTextExtractionNotAllowed
from pdfminer.pdfinterp import PDFResourceManager
from pdfminer.pdfinterp import PDFPageInterpreter
from pdfminer.pdfdevice import PDFDevice
from pdfminer.layout import LAParams
from pdfminer.converter import PDFPageAggregator
import pdfminer
reload(sys)
sys.setdefaultencoding('utf-8')

json_write_file = open("text_cordinates.json","w")

#Open the global summary html page (page-7.html)
fp = open('./UVD.pdf')
parser = PDFParser(fp)

document = PDFDocument(parser)

if not document.is_extractable:
    raise PDFTextExtractionNotAllowed

# Create a PDF resource manager object that stores shared resources.
rsrcmgr = PDFResourceManager()

# Create a PDF device object.
device = PDFDevice(rsrcmgr)

# Set parameters for analysis.
laparams = LAParams()

# Create a PDF page aggregator object
text_cordinates = []

device = PDFPageAggregator(rsrcmgr, laparams=laparams)

# Create a PDF interpreter object.
interpreter = PDFPageInterpreter(rsrcmgr, device)

# Create json object to store result

def parse_obj(lt_objs,nb_page):

    # loop over the object list
    for obj in lt_objs:

        # if it's a textbox, print text and location
        if isinstance(obj, pdfminer.layout.LTTextBoxHorizontal):
            print "%6d, %6d, %s" % (obj.bbox[0], obj.bbox[1], obj.get_text().replace('\n', ' '))

            #print(obj.get_font())


            item = {"page":nb_page,"x1":obj.bbox[0],"y1":obj.bbox[1],"x2":obj.bbox[2],"y2":obj.bbox[3],"text":obj.get_text().replace('\n',' _RL_ ')}
            text_cordinates.append(item)

        # if it's a container, recurse
        elif isinstance(obj, pdfminer.layout.LTFigure):
            parse_obj(obj._objs,0)

# loop over all pages in the document
nb_page = 0;
for page in PDFPage.create_pages(document):
    nb_page = nb_page+1
    print("nb_page  = "+str(nb_page))
    # read the page into a layout object
    interpreter.process_page(page)
    layout = device.get_result()

    # extract text from this object
    parse_obj(layout._objs,nb_page)


jsonData=json.dumps(text_cordinates)

with json_write_file as json_write_file:
    json_write_file.write(jsonData)
    print("file text_cordinates.json created successfuly ... ");
