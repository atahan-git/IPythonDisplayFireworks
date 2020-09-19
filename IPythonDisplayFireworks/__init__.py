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


def Fireworks (time=4,multiplier=1,party=False):
    """Shoot up some fireworks!
    
    Keyword arguments:
    time -- the time fireworks will last in seconds
    multiplier -- By default the fireworks will shoot every (10 + (30 * Math.random()))/multiplier frames (60fps). Increase this to get more fireworks
    party -- will make fireworks shoot up infinitely. Clear the cell output to stop.
    """
    # this is so that each Firework gets their own canvas. Without this they all try to draw to the first created canvas
    randHash = random.getrandbits(128)

    # Put everything together and send it in one go
    htmlString = "";
    ## Canvas creation
    htmlString += ('<script id="helpers1'+str(randHash)+'" class="fireworkscanvas">%s</script>'%(ReadFile('paper-full.min.js'))) + "\n"
    htmlString += ('<script id="helpers2'+str(randHash)+'" class="fireworkscanvas">%s</script>'% (ReadFile('TweenMax.min.js'))) + "\n"
    htmlString += ('<canvas id="fireworkscanvas'+str(randHash)+'" class="fireworkscanvas" position=absolute style="position: fixed; top: 0; left: 0; width:100%; height:100%; pointer-events: none;"></canvas>') + "\n"
    ##^^ make a canvas that occupies the whole screen and is click-through
    
    if(party):
        partyMode = "true";
    else:
        partyMode = "false";
    ## Drawing the fireworks
    htmlString += ('<script type="text/paperscript" canvas="fireworkscanvas%s" id="fireworkscanvascode%s" class="fireworkscanvas">'%(randHash, randHash)+\
                        'canvashash="%s";time=%s;multiplier=%s;partyMode=%s; %s</script>'% \
                        (randHash, time, multiplier, partyMode, ReadFile('Fireworks.js')))
    display(HTML(htmlString))