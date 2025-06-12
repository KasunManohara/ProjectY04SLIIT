
from SenddatatoMDB import SenddatatoMDB
def Threshold_value(percentage,data):

    if percentage > 5.0:
        SenddatatoMDB("Affected",data)
    else:
        SenddatatoMDB("Not Affected",data)    

    