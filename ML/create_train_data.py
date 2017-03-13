import glob,os,html2text,sys,re,json,csv
reload(sys)
sys.setdefaultencoding('utf-8')

rootdir = "../croped_images"
csv_file = csv.writer(open("train_data.csv", "wb"))

for path, dirs, files in os.walk(rootdir):
    for name in files:
        image = path.replace(rootdir+'/','')
        if(image.startswith('..') == False):
            csv_file.writerow([name,image])
