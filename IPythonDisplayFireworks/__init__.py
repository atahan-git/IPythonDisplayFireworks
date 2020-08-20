from IPython.display import HTML
from IPython.display import display
import os.path
import random

# This is used to import the required js files
def ReadFile (filename):
    with open(os.path.join(os.path.dirname(__file__), 'jspart' , filename), 'r') as myfile:
    #with open(filename, 'r') as myfile:
        data = myfile.read()
        return data


def Fireworks ():
    """Shoot up some fireworks!"""
    # this is so that each Firework gets their own canvas. Without this they all try to draw to the first created canvas
    randHash = random.getrandbits(128)

    # Put everything together and send it in one go
    htmlString = "";
    ## Canvas creation
    htmlString += ('<script>%s</script>'%(ReadFile('paper-full.min.js'))) + "\n"
    htmlString += ('<script>%s</script>'% (ReadFile('TweenMax.min.js'))) + "\n"
    htmlString += ('<canvas id="canv' + str(randHash)+ '" position=absolute style="position: fixed; top: 0; left: 0; width:100%; height:100%; pointer-events: none;"></canvas>') + "\n"
    ##^^ make a canvas that occupies the whole screen and is click-through
    
    ## Drawing the fireworks
    htmlString += ('<script type="text/paperscript" canvas="canv%s">%s</script>'% (randHash, ReadFile('Fireworks.js')))
    display(HTML(htmlString))