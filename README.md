# FaceMask_Validator
## Description
This project is built, trained for a real-time purpose to detect whether a person wears a Face Mask which is very important during Covid-19 times. This is built with an intension to make it easier to make security check at the entrance of crowded places to check whether a person wore face mask or not. The technologies and techniques used for developing this is python, Tensorflow 2.3.0 and tensorflowjs with bounding box and classification. 

## How to run:
 * 1. The trained model is present in tensorflowJSmodels folder. This should be stored in cloud and the model.json file must be set to public and use replace the URL in tf.loadGraphModel("<model.json URL>") in the app.js file.
 * 2. Configure the CORS policy for the cloud storage bucket to send and recieve API requests.
 * 3. Run `sudo npm install` to install all the required packages for the project.
 * 4. Run `sudo npm start` to run the app.
The app will be launched and it will now be able to detect if a person is with or without a facemask. If a person is with mask, a green box around face will be displayed with accuracy score and if a person is without mask, a red box around face will be displayed with accuracy score and a message will be displayed on the screen that says "Person without mask is detected". The recent 100 accuracy scores will be plotted in the visualization board.

## Model Training 
The facemask detection is done using ssd_mobilenet model from the tensorflow object detection API and is then converted to tensorflowJS model to integrate in ReactJS web application.

## Tensorboard training results 
![alt text](https://github.com/alekhyaved/FaceMask_Validator/blob/master/FolderStructure%26TensorBoard.png)
![alt text](https://github.com/alekhyaved/FaceMask_Validator/blob/master/tensorflowboard.png)
## Coco Evaluation
![alt text](https://github.com/alekhyaved/FaceMask_Validator/blob/master/Coco%20evaluation.png?raw=true)



