from gradio_client import Client
from fastapi import FastAPI
import os
path = os.getcwd()

# client = Client("https://facebook-musicgen.hf.space/")
# input_track_path = os.path.join(path,'..','resources',"rithesh track 1 kadhal kanavil.wav")

# prompt = "Energetic funk pop song with only beats and lead instrument"

# result = client.predict(
# 			prompt,	# str  in 'Describe your music' Textbox component
# 			input_track_path,	# str (filepath or URL to file) in 'File' Audio component
# 			fn_index=0
# )

app = FastAPI()
client = Client("https://facebook-musicgen.hf.space/")

@app.get("/generate")
def generate(input_path='../resources/rithesh.wav', prompt="Energetic funk pop song with only beats and lead instrument"):
    result = client.predict(
                    prompt,	# str  in 'Describe your music' Textbox component
                    input_path,	# str (filepath or URL to file) in 'File' Audio component
                    fn_index=0
        )
    return result[1]

@app.get("/pwd")
def pwd():
    return os.getcwd()
