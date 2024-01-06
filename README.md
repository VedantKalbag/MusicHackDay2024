# Inspira
Inspira is a tool for songwriters that helps get past their writer's block. It listens to their track and suggests similar chart topping numbers and generated music. Hopefully this INSPIRES them!


## How to use
1. Upload your roughly **produced** track on to GUI
2. You will be shown a few tracks that have already been released, that are similar to your sound, as well as a few AI generated samples for your inspiration
3. Get inspired!

## What's under the hood

Input  - Audio file (.mp3) <br>
Input  - Prompt describing the user's music. Ex: "Funk, pop music with groovy beats and no strings" <br>
Output - A list of UI embedded audio streams <br>

<img src="https://raw.githubusercontent.com/VedantKalbag/MusicHackDay2024/main/systemFlow.png">

### Process Flow
1. User inputs a multi-instrumental mp3 file with vocal lead (w/o vocals is ok too)
2. They also enter a text prompt describing their track
3. The prompt and audio file is fed to Facebook's MusicGen to generate two 15sec multi-instument songs
4. The audio file is also fed to Cyanite AI to populate similarity matches. Top 3 matches are sent back to the UI
5. UI populates the 5 tracks as embedded audio streams that they can listen to. 


