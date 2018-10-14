Flow of website (user's view/interface)
index.html (Name, PID) -> instruction.html -> experiment.html

Hosted at templaksh.github.io (using github pages)

IMPORTANT NOTE: In the experiment, I changed the name of "Trials" to "Conditions" since it is what we learnt in the lecture. The number of attempts per condition is called "Trials" instead so that it ties closely with lecture materials.

The next button is only enabled after user has completed 3 trials per condition. This is to ensure that all users complete the necessary trials and conditions.

We also display the number of trials needed and number of trials completed in each condition so that the user can track his/her progress.

We also display a help text between the table of trials and the yellow box. This is because the user might not understand what to do when he/she uses the interface so the help text will prompt the user to do actions like clicking the next button, finding selected items and remind user to take breaks.

We store the ids and name in localStorage and download it at the end of the experiment

For distance measuring, we use the onmousemove function to read the values once the user has clicked in the yellow box and stop upon selection of the option.

I also added an additional column that shows the time difference between the start and end. This is to allow us to easily see the difference instead of calculating manually each time.

Everything below from original README.MD
# cs4249 Assignment 1
This repository contains a basic interface and instrumentation to perform an empirical evaluation of Marking Menus and Radial Menus. You are expected to modify the code to perform the following tasks
1. Implement a new Independent Variable
2. Implement a new Dependent Variable
3. Modify tracking to record participant id, consent, pre-survey and post-survey questionnaires.

 You may fork this repository to your own Github account and clone your forked version for development. This will also help you use Github pages for hosting if you plan to conduct experiments online.
 
 ## Project Structure
 The interface is a static web project. However because of cross origin restrictions you will need a web server to run the experiment. Either turn on Github Pages(https://pages.github.com/) for your forked repository or setup a local server of your choice.
 
    ├── css                     # Style Sheets
         ├── external           
         ├── experiment.css    
    ├── js                      # Javascript
         ├── external          
         ├── experiment.js    
         ├── experiment-tracker.js
    ├── data           
         ├── experiment.csv     # Contains arrangement of trials
         ├── menu_depth_1.csv   # Menu with depth 1
         ├── menu_depth_2.csv   # Menu with depth 2
         ├── manu_depth_3.csv   # Menu with depth 3
    ├── experiment.html    

Ideally, you shouldn't need to edit any of the files under "/external" unless your experimental design requires modifications to the menu implementation. Please avoid tweaking parameters of the menu such as color, size etc. To maintain consistency across the class we will use the default parameters as provided in this repository.

### Marking Menu 
- Popup: Left Mouse Down
- Select: Stroke to leaf node
- Reset: Release Mouse Down
- Note:* Expert user's can make a fast stroke instead of waiting for the manu to pop up.
### Radial Menu:
- Popup: Right Click
- Select: Left Click
- Reset: Right Click
   
### Recommended Browsers
This repository has been tested on the browsers listed below. It is suggested you use Chrome.
1. Chrome 68.0.3440.106
2. Firfox 61.0.2
3. Safari V10

 ## Credits
This repository contains modified implementations of menus from the original contributors listed below.
1. Marking Menu : Forked from https://github.com/QuentinRoy/Marking-Menu
2. Radial Menu : Forked from https://github.com/lgrkvst/d3-sunburst-menu
