The predict_image.py is using the trained model to detect the Car Plates in the given images as well as detect the Characters inside the found Car Plates.

The found Plate No. will be updated via POST request to the Heruko API.



Usage : 

python predict_images.py --model exported_model/frozen_inference_graph.pb \
 --pred_stages 1 \
 --labels classes.pbtxt \
 --imagePath  \
 --num-classes 37 \
 --image_display True 
 
 
The Basic Model Files can be downloaded from this link : https://drive.google.com/file/d/1fAafi6V6vtiqAirYNOQJmc6G7FLb4eC6/view
