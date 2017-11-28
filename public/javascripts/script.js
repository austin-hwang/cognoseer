var happinessTotal = 0;
var sadnessTotal = 0;
var angerTotal = 0;
var neutralTotal = 0; 
var fearTotal = 0; 
var disgustTotal = 0;
var contemptTotal = 0;
var surpriseTotal = 0;
var ageTotal = 0;
var maleTotal = 0;
var femaleTotal = 0;
var peopleTotal = 0;
var hapSlideTotal = 0;
var madSlideTotal = 0;
var numPhotos = 0;
var allImages;

function value(value, slide) {
  $("#" + slide).val(value);
}

function getEmotionScore(var1, var2) {
    return .5 + (var1/2) - (var2/2);
}

function getData(){        
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/image', true);
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log(xhr.responseText);
                allImages = JSON.parse(xhr.responseText);
            }
        }
        processImage(allImages);
        processImage2(allImages);
    };
    xhr.send();

}

function processImage(data) {
    console.log("Value: " + parseInt(document.getElementById("inputImage").value));
    console.log("Image links: " + data[1]);

    var subscriptionKey = "2445910071604e4dbb2ff57680673887";

    var uriBase = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";

    // Request parameters.
    var params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false",
        "returnFaceAttributes": "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise",
    };
    //var images = [];

    var sourceImageUrl = data.images[parseInt(document.getElementById("inputImage").value) - 1]; 

    console.log("Source Image Url: " + sourceImageUrl);

    // Display the image.
    //var sourceImageUrl = document.getElementById("inputImage").value;
    document.querySelector("#sourceImage").src = sourceImageUrl;

    // Perform the REST API call.
    $.ajax({
        url: uriBase + "?" + $.param(params),

        // Request headers.
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
        },

        type: "POST",

        // Request body.
        data: '{"url": ' + '"' + sourceImageUrl + '"}',
    })

    .done(function(data) {
        // Show formatted JSON on webpage.
        $("#responseTextArea").val(JSON.stringify(data, null, 2));
        
        for (var i = 0; i < data.length; i++)
        {
            peopleTotal++;
            happinessTotal += parseFloat(data[i].faceAttributes.emotion.happiness)/peopleTotal;
            sadnessTotal += parseFloat(data[i].faceAttributes.emotion.sadness)/peopleTotal;
            angerTotal += parseFloat(data[i].faceAttributes.emotion.anger)/peopleTotal;
            neutralTotal += parseFloat(data[i].faceAttributes.emotion.neutral)/peopleTotal;
            fearTotal += parseFloat(data[i].faceAttributes.emotion.fear)/peopleTotal;
            disgustTotal += parseFloat(data[i].faceAttributes.emotion.disgust)/peopleTotal;
            contemptTotal += parseFloat(data[i].faceAttributes.emotion.contempt)/peopleTotal;
            surpriseTotal += parseFloat(data[i].faceAttributes.emotion.surprise)/peopleTotal;
            ageTotal += parseFloat(data[i].faceAttributes.age);
            if (data[i].faceAttributes.gender === "male") {
                maleTotal++;
            }
            else if (data[i].faceAttributes.gender === "female") {
                femaleTotal++;
            }
        }
        numPhotos++;
        hapSlideTotal = getEmotionScore(happinessTotal, sadnessTotal);
        madSlideTotal = getEmotionScore(angerTotal, neutralTotal);

        value(hapSlideTotal, "happinessTotal");
        value(madSlideTotal, "angerTotal");
        value(contemptTotal, "contemptTotal");
        value(fearTotal, "fearTotal");
        value(surpriseTotal, "surpriseTotal");

        var happiness = 0;
        var sadness = 0;
        var anger = 0;
        var neutral = 0;
        var fear = 0;
        var disgust = 0;
        var contempt = 0;
        var surprise = 0;
        var age = 0;
        var gender = 0;
        var male = 0;
        var female = 0;
        var hapSlide = 0;
        var madSlide = 0;
        var numPeople = 0;

        for (var i = 0; i < data.length; i++)
        {
            happiness += parseFloat(data[i].faceAttributes.emotion.happiness);
            sadness += parseFloat(data[i].faceAttributes.emotion.sadness);
            anger += parseFloat(data[i].faceAttributes.emotion.anger);
            neutral += parseFloat(data[i].faceAttributes.emotion.neutral);
            fear += parseFloat(data[i].faceAttributes.emotion.fear);
            disgust += parseFloat(data[i].faceAttributes.emotion.disgust);
            contempt += parseFloat(data[i].faceAttributes.emotion.contempt);
            surprise += parseFloat(data[i].faceAttributes.emotion.surprise);
            age += parseFloat(data[i].faceAttributes.age);
            numPeople++;

            if (data[i].faceAttributes.gender === "male") {
              male++;
          }
          else if (data[i].faceAttributes.gender === "female") {
              female++;
          }
      }
      if (male > 0) {
          document.getElementById("gender").innerHTML = ("Gender: " + '&#x1F466;');
      }
      if (female > 0) {
        document.getElementById("gender").innerHTML = ("Gender: " + '&#x1F467;');
    }
    if (male > 0 && female > 0)
    {
        document.getElementById("gender").innerHTML = ("Gender: " + '&#x1F466;' + '&#x1F467;');
    }

    happiness /= numPeople;
    sadness /= numPeople;
    anger /= numPeople;
    neutral /= numPeople;
    fear /= numPeople;
    disgust /= numPeople;
    contempt /= numPeople;
    surprise /= numPeople;
    age /= numPeople;

    document.getElementById("age").innerHTML = "Age: " + Math.round(age);

    hapSlide = getEmotionScore(happiness, sadness);
    madSlide = getEmotionScore(anger, neutral);
    console.log(data);

    value(hapSlide, "happiness");
    value(madSlide, "anger");
    value(contempt, "contempt");
    value(fear, "fear");
    value(surprise, "surprise");
    document.getElementById("maleTotal").innerHTML = "Male Participants: " + maleTotal;
    document.getElementById("femaleTotal").innerHTML = "Female Participants: " + femaleTotal;
    document.getElementById("avgAge").innerHTML = "Average Age: " + Math.round(ageTotal/peopleTotal);
    document.getElementById("numPhoto").innerHTML = "Photos Taken: " + numPhotos;
})

.fail(function(jqXHR, textStatus, errorThrown) {
        // Display error message.
        var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
        errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ? 
        jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
        alert(errorString);
    });
};

function processImage2(data) {

    var subscriptionKey = "69cfa0f941224f0aa1041e6970f12af0";

    var uriBase = "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/models/celebrities/analyze";

    // Request parameters.
    var params = {
        "model": "celebrities", // Use "model": "celebrities" to use the Celebrities model.
    };

    // Display the image.
    var sourceImageUrl = data.images[parseInt(document.getElementById("inputImage").value) - 1]; 
    //var sourceImageUrl = document.getElementById("inputImage").value;
    document.querySelector("#sourceImage").src = sourceImageUrl;

    // Perform the REST API call.
    $.ajax({
        url: uriBase + "?" + $.param(params),

        // Request headers.
        beforeSend: function(xhrObj) {
            xhrObj.setRequestHeader("Content-Type", "application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
        },

        type: "POST",

        // Request body.
        data: '{"url": ' + '"' + sourceImageUrl + '"}',
    })

    .done(function(data) {
        // Show formatted JSON on webpage.
        $("#responseTextArea2").val(JSON.stringify(data, null, 2));
        for (var i = 0; i < data.result.celebrities.length; i++)
        {
            if (data.result.celebrities[i].name)
            {
                document.getElementById("numCeleb").innerHTML += data.result.celebrities[i].name + "; ";
            }
        }
    })

    .fail(function(jqXHR, textStatus, errorThrown) {
        // Display error message.
        var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
        errorString += (jqXHR.responseText === "") ? "" : jQuery.parseJSON(jqXHR.responseText).message;
        alert(errorString);
    });
};