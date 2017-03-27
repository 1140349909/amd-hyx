import os,glob,PythonMagick

srcfiles = glob.iglob('*.jpg')

for src in srcfiles:
    fl = PythonMagick.Image(src)
    
    filename = os.path.basename(src)
    basename,extname = os.path.splitext(filename)

    fl.write(basename+'.png')
