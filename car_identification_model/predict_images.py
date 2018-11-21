import argparse
import time
import cv2
import numpy as np
import tensorflow as tf
import sys 
sys.path.append("F:\\models-master\\research\\")
sys.path.append("F:\\models-master\\research\\object_detection\\")
from imutils import paths
from object_detection.utils import label_map_util
from base2designs.plates.plateFinder import PlateFinder
from base2designs.plates.predicter import Predicter
from base2designs.plates.plateDisplay import PlateDisplay


def str2bool(v):
  if v.lower() in ('yes', 'true', 't', 'y', '1'):
    return True
  elif v.lower() in ('no', 'false', 'f', 'n', '0'):
    return False
  else:
    raise argparse.ArgumentTypeError('Boolean value expected.')

# construct the argument parse and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-m", "--model", required=True,
  help="base path for frozen checkpoint detection graph")
ap.add_argument("-l", "--labels", required=True,
  help="labels file")
ap.add_argument("-i", "--imagePath", required=True,
  help="path to input image path")
ap.add_argument("-n", "--num-classes", type=int, required=True,
  help="# of class labels")
ap.add_argument("-c", "--min-confidence", type=float, default=0.5,
  help="minimum probability used to filter weak detections")
ap.add_argument("-d", "--image_display", type=str2bool, default=False,
  help="Enable display of annotated images")
ap.add_argument("-p", "--pred_stages", type=int, required=True,
  help="number of prediction stages")

args = vars(ap.parse_args())

# initialize the model
model = tf.Graph()

# create a context manager that makes this model the default one for
# execution
with model.as_default():
  # initialize the graph definition
  graphDef = tf.GraphDef()

  # load the graph from disk
  with tf.gfile.GFile(args["model"], "rb") as f:
    serializedGraph = f.read()
    graphDef.ParseFromString(serializedGraph)
    tf.import_graph_def(graphDef, name="")

# load the class labels from disk
labelMap = label_map_util.load_labelmap(args["labels"])
categories = label_map_util.convert_label_map_to_categories(
  labelMap, max_num_classes=args["num_classes"],
  use_display_name=True)
categoryIdx = label_map_util.create_category_index(categories)

# create a plateFinder
plateFinder = PlateFinder(args["min_confidence"], categoryIdx,
                          rejectPlates=False, charIOUMax=0.3)

# create plate displayer
plateDisplay = PlateDisplay()

# create a session to perform inference
with model.as_default():
  with tf.Session(graph=model) as sess:
    # create a predicter, used to predict plates and chars
    predicter = Predicter(model, sess, categoryIdx)

    imagePaths = paths.list_images(args["imagePath"])
    frameCnt = 0
    start_time = time.time()
    # Loop over all the images
    for imagePath in imagePaths:
      frameCnt += 1

      # load the image from disk
      print("[INFO] Loading image \"{}\"".format(imagePath))
      image = cv2.imread(imagePath)
      (H, W) = image.shape[:2]

      # If prediction stages == 2, then perform prediction on full image, find the plates, crop the plates from the image,
      # and then perform prediction on the plate images
      if args["pred_stages"] == 2:
        # Perform inference on the full image, and then select only the plate boxes
        boxes, scores, labels = predicter.predictPlates(image, preprocess=True)
        print(labels)
        licensePlateFound_pred, plateBoxes_pred, plateScores_pred = plateFinder.findPlatesOnly(boxes, scores, labels)
        # loop over the plate boxes, find the chars inside the plate boxes,
        # and then scrub the chars with 'processPlates', resulting in a list of final plateBoxes, char texts, char boxes, char scores and complete plate scores
        plates = []
        for plateBox in plateBoxes_pred:
          boxes, scores, labels = predicter.predictChars(image, plateBox)
          chars = plateFinder.findCharsOnly(boxes, scores, labels, plateBox, image.shape[0], image.shape[1])
          if len(chars) > 0:
            plates.append(chars)
          else:
            plates.append(None)
        plateBoxes_pred, charTexts_pred, charBoxes_pred, charScores_pred, plateAverageScores_pred = plateFinder.processPlates(plates, plateBoxes_pred, plateScores_pred)

      # If prediction stages == 1, then predict the plates and characters in one pass
      elif args["pred_stages"] == 1:
        # Perform inference on the full image, and then find the plate text associated with each plate
        boxes, scores, labels = predicter.predictPlates(image, preprocess=False)
        licensePlateFound_pred, plateBoxes_pred, charTexts_pred, charBoxes_pred, charScores_pred, plateScores_pred = plateFinder.findPlates(
          boxes, scores, labels)
      else:
        print("[ERROR] --pred_stages {}. The number of prediction stages must be either 1 or 2".format(args["pred_stages"]))
        quit()

      # Print plate text
      for charText in charTexts_pred:
        print("    Found: ", charText)

      # Display the full image with predicted plates and chars
      if args["image_display"] == True:
        print(plateBoxes_pred)
        imageLabelled = plateDisplay.labelImage(image, plateBoxes_pred, charBoxes_pred, charTexts_pred)
        cv2.imshow("Labelled Image", imageLabelled)
        cv2.waitKey(0)

    # print some performance statistics
    curTime = time.time()
    processingTime = curTime - start_time
    fps = frameCnt / processingTime
    print("[INFO] Processed {} frames in {:.2f} seconds. Frame rate: {:.2f} Hz".format(frameCnt, processingTime, fps))